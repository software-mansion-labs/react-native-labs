import AVFoundation
import ExpoModulesCore

internal class RecordingSessionException: Exception {
  override var reason: String {
    "Recording session setup failed"
  }
}

internal class AudioCaptureException: Exception {
  override var reason: String {
    "Audio capture failed"
  }
}

internal class RecordingTerminationException: Exception {
  override var reason: String {
    "Stopping the recording failed"
  }
}

public class ReactNativeMicrophoneMeterModule: Module {
  private var audioRecorder: AVAudioRecorder?
  private var recordingSession: AVAudioSession?
  private var timer : Timer?
  private let audioRecordingURL = FileManager.default.temporaryDirectory.appendingPathComponent("audioMeterRecording.m4a")
  
  private func transformAudioData() throws {
    let sampleRate: Float = 200
    let fftLength = vDSP_Length(log2(ceil(Double(sampleRate))))
    var fftSetup = vDSP_DFT_zrop_CreateSetup(nil, vDSP_Length(Int(sampleRate)), vDSP_DFT_Direction.FORWARD)
    
    func analyzeAudioFile() throws {
      let file = try AVAudioFile(forReading: audioRecordingURL)
      let format = AVAudioFormat(commonFormat: .pcmFormatFloat32, sampleRate: file.fileFormat.sampleRate, channels: file.fileFormat.channelCount, interleaved: false)
      let buf = AVAudioPCMBuffer(pcmFormat: format!, frameCapacity: UInt32(file.length))
      try! file.read(into: buf!) // You have audio data in buf.floatChannelData
      
      let audioData = Array(UnsafeBufferPointer(start: buf!.floatChannelData![0], count:Int(buf!.frameLength)))
      var realParts = audioData
      var imaginaryParts = [Float](repeating: 0.0, count: realParts.count)
      
      var splitComplex = DSPSplitComplex(realp: &realParts, imagp: &imaginaryParts)
      
      if (fftSetup == nil) {
        fftSetup = vDSP_DFT_zrop_CreateSetup(nil, vDSP_Length(Int(sampleRate)), vDSP_DFT_Direction.FORWARD)
      }
      vDSP_fft_zip(fftSetup!, &splitComplex, 1, fftLength, FFTDirection(FFT_FORWARD))
      
      var magnitudes = [Float](repeating: 0.0, count: realParts.count/2)
      vDSP_zvmags(&splitComplex, 1, &magnitudes, 1, vDSP_Length(realParts.count)/2)
      
      let normalizingFactor = 2.0 / sampleRate
      let normalizedMagnitudes = magnitudes.map { $0 * normalizingFactor }
      
      // Normalized magnitudes now contains magnitudes for each frequency.
      print(normalizedMagnitudes)
      
      vDSP_destroy_fftsetup(fftSetup)
    }
    try analyzeAudioFile()
  }

  private func captureAudio(interval: Int) throws {
    let settings = [
      AVFormatIDKey: Int(kAudioFormatMPEG4AAC),
      AVSampleRateKey: 12000,
      AVNumberOfChannelsKey: 1,
      AVEncoderAudioQualityKey: AVAudioQuality.high.rawValue
    ]

    do {
      let audioRecorder = try AVAudioRecorder(url: audioRecordingURL, settings: settings)
      self.audioRecorder = audioRecorder
      audioRecorder.record()
      audioRecorder.isMeteringEnabled = true
      print(interval / 1000)
      self.timer = Timer.scheduledTimer(withTimeInterval: Double(interval) / 1000.0, repeats: true) { timer in
        audioRecorder.updateMeters()
        let db = audioRecorder.averagePower(forChannel: 0)
      
        self.sendEvent("onVolumeChange", [
          "db": db
        ])
      }
    } catch {
      throw AudioCaptureException()
    }
  }

  public func definition() -> ModuleDefinition {
    Name("ReactNativeMicrophoneMeter")

    Events("onVolumeChange")

    Function("askForPermissions"){
      // empty function for compatibility with Android, so iOS does not break when we call it
    }

    Function("startMonitoringAudio") { (interval: Int) in
      let recordingSession = AVAudioSession.sharedInstance()
      self.recordingSession = recordingSession
      do {
        try recordingSession.setCategory(.record)
        try recordingSession.setActive(true)

        recordingSession.requestRecordPermission({ result in
          guard result else { return }
        })

        try captureAudio(interval: interval)
      } catch {
        throw RecordingSessionException()
      }
    }

    Function("stopMonitoringAudio") {
      do {
        self.timer?.invalidate()
        audioRecorder?.stop()
        try self.transformAudioData()
//        audioRecorder?.deleteRecording()
//        try recordingSession?.setActive(false)
      } catch {
        print(error)
        throw RecordingTerminationException()
      }

    }
  }
}
