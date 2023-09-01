package expo.modules.microphonemeter

import android.media.AudioFormat
import android.media.AudioRecord
import android.media.MediaRecorder
import expo.modules.interfaces.permissions.Permissions
import expo.modules.kotlin.Promise
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import kotlin.math.log10

class ReactNativeMicrophoneMeterModule : Module() {

  private val sampleRate = 8000
  private val channelConfig = AudioFormat.CHANNEL_IN_MONO
  private val audioFormat = AudioFormat.ENCODING_PCM_16BIT
  private var bufferSize: Int = AudioRecord.getMinBufferSize(sampleRate, channelConfig, audioFormat)
  private lateinit var audioRecord: AudioRecord

  private fun listenToMicrophone() {
    val audioData = ShortArray(bufferSize)
    var lastRms = 0.0
    while (audioRecord.recordingState == AudioRecord.RECORDSTATE_RECORDING) {
      val status = audioRecord.read(audioData, 0, bufferSize)

      // Here we calculate RMS.
      var sum = 0.0
      for (i in 0 until status) {
        sum += audioData[i] * audioData[i]
      }
      val maxAmplitude = 32767.0 // max 16 bit value
      val rms = Math.sqrt(sum / status)
      // Differentiate between RMS and lastRms to detect changes, but we need to convert RMS to decibels.
      val dB = 20 * log10(rms / maxAmplitude)

      // Update lastRms
      lastRms = rms

      val volumeChanged = dB >= lastRms  // this should be set according to requirement
      if (true) {
        onVolumeChanged(dB)
      }
    }
  }

  private fun onVolumeChanged(db: Double) {
    // Here you can trigger the event `onVolumeChanged` for the volume change
    // For example using eventbus library posting an event, or using any other library of your choice to send notifications
    sendEvent("onVolumeChange", mapOf("db" to db))
  }

  // Each module class must implement the definition function. The definition consists of components
  // that describes the module's functionality and behavior.
  // See https://docs.expo.dev/modules/module-api for more details about available components.
  override fun definition() = ModuleDefinition {


    Name("ReactNativeMicrophoneMeter")

    // Defines event names that the module can send to JavaScript.
    Events("onVolumeChange")

    AsyncFunction("askForPermissions") {promise: Promise ->
      var result = Permissions.askForPermissionsWithPermissionsManager(appContext.permissions, promise,
              android.Manifest.permission.WRITE_EXTERNAL_STORAGE,
              android.Manifest.permission.RECORD_AUDIO)
    }
    Function("startMonitoringAudio"){ interval: Double ->
      try {
        audioRecord = AudioRecord(MediaRecorder.AudioSource.MIC, sampleRate, channelConfig, audioFormat, bufferSize)
        audioRecord.startRecording()

        // Create a background thread to process audio data
        Thread(Runnable {
          listenToMicrophone()
        }).start()
      }catch(e: SecurityException){
        // ignore for now
      }
    }

    Function("stopMonitoringAudio"){
      // Make sure to release the audio recorder
      if (audioRecord.state == AudioRecord.STATE_INITIALIZED) {
        audioRecord.stop()
        audioRecord.release()
      }
    }

    Function("startObserving"){}

    Function("stopObserving"){}

  }
}
