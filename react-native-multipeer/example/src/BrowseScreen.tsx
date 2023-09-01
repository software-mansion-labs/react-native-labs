import { useNavigation } from "@react-navigation/native";
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Button, Text, View } from "react-native";
import { PeerBrowserEventPayload, invitePeer, onPeerConnected, onPeerFound, onPeerLost, startAdvertising, startBrowsing, stopAdvertising, stopBrowsing } from "react-native-multipeer";


export default function BrowseScreen() {
    const [peerFound, setPeerFound] = useState<PeerBrowserEventPayload[]>([])
    const navigation = useNavigation<any>();
    const [loading, setLoading] = useState<boolean>(false)

    useEffect(() => {
        startBrowsing();
        startAdvertising();

        const peerFoundSubscription = onPeerFound((event) => {
            console.log('Peer found', event);
            setPeerFound((peers) => [...peers, event]);
        })

        const peerLostSubscription = onPeerLost((event) => {
            console.log('Peer lost', event);
            setPeerFound((peers) => peers.filter((peer) => peer.id !== event.id));
        })

        return () => {
            stopBrowsing();
            stopAdvertising();
            peerFoundSubscription.remove();
            peerLostSubscription.remove();
        }
    }, []);

    const onInvite = useCallback((id: string) => {
        invitePeer(id);
        setLoading(true);
        const listener = onPeerConnected((event) => {
            console.log('onPeerConnected', event);
            navigation.replace("Session", {id: event.id})
            setLoading(false);
            listener.remove();
        });
    }, []);

    return (
        <View style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            <Text style={{
                fontSize: 24,
                marginBottom: 24
            }}>
                Found Peers:
            </Text>
            {peerFound.map((peer) => (
                <View 
                key={peer.id}
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginBottom: 8
                }}>
                    <Text>{peer.displayName}</Text>
                    <Button title="Invite" onPress={() => onInvite(peer.id)}/>

                </View>
            ))}
            {loading && <ActivityIndicator />}
        </View>
    );
}