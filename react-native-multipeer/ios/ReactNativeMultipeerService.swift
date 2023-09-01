import MultipeerConnectivity
import Foundation
import ExpoModulesCore

internal class PeerNotExistException : Exception {
  override var reason: String {
    "Peer with the provided id does not exist!"
  }
}

let serviceType = "multi-peer"

protocol ReactNativeMultipeerServiceDelegate {
    func emitEvent(eventName: String, body: [String: Any?]);
}

class ReactNativeMultipeerService: NSObject {
    private var peerId: MCPeerID;
    private var advertiser: MCNearbyServiceAdvertiser;
    private var browser: MCNearbyServiceBrowser;
    private var nearbyPeers: [String: MCPeerID] = [String: MCPeerID]();
    private var invitationHandlers = [String: (Bool, MCSession?) -> Void]();
    private var sessions = [String: MCSession]()
    var delegate: ReactNativeMultipeerServiceDelegate?;

    
    
    init(displayName: String) {
        self.peerId = MCPeerID(displayName: displayName);
        self.advertiser = MCNearbyServiceAdvertiser(peer: self.peerId, discoveryInfo: nil, serviceType: serviceType)
        self.browser = MCNearbyServiceBrowser(peer: self.peerId, serviceType: serviceType)
        
        super.init()
        
        self.browser.delegate = self
        self.advertiser.delegate = self
    }
    
    func startAdvertising() {
        self.advertiser.startAdvertisingPeer()
    }
    
    func stopAdvertising() {
        self.advertiser.stopAdvertisingPeer()
    }
    
    func startBrowsing() {
        self.browser.startBrowsingForPeers()
    }
    
    func stopBrowsing() {
        self.browser.stopBrowsingForPeers()
    }
    
    func invitePeer(id: String) -> Bool {
        guard  let peerID = nearbyPeers[id] else {
            return false
        }
                
        let session = MCSession(peer: self.peerId, securityIdentity: nil, encryptionPreference: MCEncryptionPreference.none)
        session.delegate = self
        self.sessions[id] = session
        self.browser.invitePeer(peerID, to: session, withContext: nil, timeout: 30)
        return true
    }
    
    func acceptInvitation(id: String) -> Bool {
        guard let invitationHandler = self.invitationHandlers[id] else {
            return false
        }
        let session = MCSession(peer: self.peerId, securityIdentity: nil, encryptionPreference: MCEncryptionPreference.none)
        self.sessions[id] = session
        session.delegate = self
        invitationHandler(true, session)
        self.stopAdvertising()
        return true
    }
    
    func cancelInvitation(id: String) -> Bool {
        guard let invitationHandler = self.invitationHandlers[id] else {
            return false
        }
        
        invitationHandler(false, nil)
        return true
    }
    
    func sendData(toPeer id: String, _ data: Data) -> Bool {
        guard let session = self.sessions[id], let peerID = self.nearbyPeers[id] else {
            return false
        }
        do {
            try session.send(data, toPeers: [peerID], with: MCSessionSendDataMode.reliable)
            return true
        } catch {
            return false
        }
    }
    
    func disconnect(withPeer id: String) {
        if let session = self.sessions[id] {
            session.disconnect()
            self.sessions.removeValue(forKey: id)
        }
    }
}

extension ReactNativeMultipeerService : MCNearbyServiceBrowserDelegate {
    func browser(_ browser: MCNearbyServiceBrowser, foundPeer peerID: MCPeerID, withDiscoveryInfo info: [String : String]?) {
        if peerID == self.peerId {
            // Found itself
            return;
        }
        let id = String(peerID.hash)
        nearbyPeers[id] = peerID
        delegate?.emitEvent(eventName: "onPeerFound", body: [
            "displayName": peerID.displayName,
            "id": id
        ])
    }
    
    func browser(_ browser: MCNearbyServiceBrowser, lostPeer peerID: MCPeerID) {
        let id = String(peerID.hash)
        nearbyPeers.removeValue(forKey: id)
        delegate?.emitEvent(eventName: "onPeerLost", body: [
            "displayName": peerID.displayName,
            "id": id
        ])
    }
}

extension ReactNativeMultipeerService : MCNearbyServiceAdvertiserDelegate {
    func advertiser(_ advertiser: MCNearbyServiceAdvertiser, didReceiveInvitationFromPeer peerID: MCPeerID, withContext context: Data?, invitationHandler: @escaping (Bool, MCSession?) -> Void) {
        let id = String(peerID.hash)
        self.invitationHandlers[id] = invitationHandler
        self.delegate?.emitEvent(eventName: "onInvite", body: [
            "displayName": peerID.displayName,
            "id": id
        ])
    }
}


extension ReactNativeMultipeerService: MCSessionDelegate {
    
    func session(_ session: MCSession, peer peerID: MCPeerID, didChange state: MCSessionState) {
        let id = String(peerID.hash)
        switch state {
        case .notConnected:
            session.disconnect()
            self.sessions.removeValue(forKey: id)
            self.delegate?.emitEvent(eventName: "onPeerDisconnected", body: [
                "displayName": peerID.displayName,
                "id": id
            ])
        case .connected:
            self.stopBrowsing()
            self.stopAdvertising()
            self.delegate?.emitEvent(eventName: "onPeerConnected", body: [
                "displayName": peerID.displayName,
                "id": id
            ])
        default:
            print(state)
        }
    }
    
    func session(_ session: MCSession, didReceive data: Data, fromPeer peerID: MCPeerID) {
        let id = String(peerID.hash)
        self.delegate?.emitEvent(eventName: "onDataReceived", body: [
            "peerId": id,
            "data": data.base64EncodedString()
        ])
    }
    
    func session(_ session: MCSession, didReceive stream: InputStream, withName streamName: String, fromPeer peerID: MCPeerID) {
    }
    
    func session(_ session: MCSession, didStartReceivingResourceWithName resourceName: String, fromPeer peerID: MCPeerID, with progress: Progress) {
    }
    
    func session(_ session: MCSession, didFinishReceivingResourceWithName resourceName: String, fromPeer peerID: MCPeerID, at localURL: URL?, withError error: Error?) {
    }
    
    
}
