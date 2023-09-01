import ExpoModulesCore

internal class ServiceNotInitialized : Exception {
  override var reason: String {
    "Multipeer service not initialized!"
  }
}

internal class AlreadyInitializedException : Exception {
  override var reason: String {
    "Multipeer service was already initialized!"
  }
}


public class ReactNativeMultipeerModule: Module {
    var multipeerService: ReactNativeMultipeerService?;
    public func definition() -> ModuleDefinition {
        Name("ReactNativeMultipeer")
      
        Function("init") {(displayName: String) in
            if multipeerService != nil {
                throw AlreadyInitializedException()
            }
            self.multipeerService = ReactNativeMultipeerService(displayName: displayName)
            self.multipeerService?.delegate = self;
            return
        }
        
        Function("startAdvertising") {
            if let service = multipeerService {
                service.startAdvertising()
            } else {
                throw ServiceNotInitialized()
            }
        }
        
        Function("startBrowsing") {
            if let service = multipeerService {
                service.startBrowsing()
            } else {
                throw ServiceNotInitialized()
            }
        }
        
        Function("stopAdvertising") {
            if let service = multipeerService {
                service.stopAdvertising()
            } else {
                throw ServiceNotInitialized()
            }
        }
        
        Function("stopBrowsing") {
            if let service = multipeerService {
                service.stopBrowsing()
            } else {
                throw ServiceNotInitialized()
            }
        }
        
        Function("invitePeer") { (id: String) -> Bool in
            if let service = multipeerService {
                return service.invitePeer(id: id)
            } else {
                throw ServiceNotInitialized()
            }
        }
        
        Function("acceptInvitation") { (id: String) -> Bool in
            if let service = multipeerService {
                return service.acceptInvitation(id: id)
            } else {
                throw ServiceNotInitialized()
            }
        }
        
        Function("cancelInvitation") { (id: String) -> Bool in
            if let service = multipeerService {
                return service.cancelInvitation(id: id)
            } else {
                throw ServiceNotInitialized()
            }
        }
        
        Function("sendData") { (id: String, toSend: Uint8Array, type: Int) -> Bool in
            if let service = multipeerService {
                if type == 0 {
                    let data = Data(bytes: toSend.rawPointer, count: toSend.byteLength)
                    return service.sendData(toPeer: id, data)
                    
                } else {
                    print("not supported")
                }
            } else {
                throw ServiceNotInitialized()
            }
            return false
        }
        
        Function("disconnect") { (id: String) in
            if let service = multipeerService {
                service.disconnect(withPeer: id)
            } else {
                throw ServiceNotInitialized()
            }
        }

        
        Events(["onPeerFound", "onPeerLost", "onInvite", "onPeerConnected", "onPeerDisconnected", "onDataReceived"])
  }
}

extension ReactNativeMultipeerModule: ReactNativeMultipeerServiceDelegate {
    func emitEvent(eventName: String, body: [String : Any?]) {
        self.sendEvent(eventName, body)
    }
}
