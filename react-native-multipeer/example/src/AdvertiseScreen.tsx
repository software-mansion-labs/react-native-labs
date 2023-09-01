import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { Alert, Button, Text, View } from "react-native";
import { PeerBrowserEventPayload, acceptInvitation, cancelInvitation, onInvite, onPeerFound, onPeerLost, startAdvertising, startBrowsing, stopAdvertising, stopBrowsing } from "react-native-multipeer";
import { navigate } from '../node_modules/@react-navigation/routers/src/CommonActions';


export default function AdvertiseScreen() {
    const [invitation, setInvitation] = useState<PeerBrowserEventPayload>()
    const [isAdvertising, setIsAdvertising] = useState<boolean>(false)
    const navigation = useNavigation<any>();

    useEffect(() => {
        if (isAdvertising) {
            startAdvertising();
            const inviteSubscription = onInvite((event) => {
                console.log("on invite", event);
                setInvitation(event);
            })

            return () => {
                stopAdvertising();
                inviteSubscription.remove();
            }
        }
    }, [isAdvertising]);

    useEffect(() => {
        if (invitation) {
            Alert.alert(`${invitation.displayName} wants to connect`, '', [
                {
                    text: 'Accept',
                    onPress: () => {
                        acceptInvitation(invitation.id);
                        navigation.navigate("Session", {id: invitation.id});
                    }
                },
                {
                    text: 'Decline',
                    onPress: () => {
                        cancelInvitation(invitation.id);
                    }
                }
            ])
        }
    }, [invitation]);

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
                Advertising: {isAdvertising ? 'true' : 'false'}
            </Text>
            <Button title="Toggle" onPress={() => setIsAdvertising(!isAdvertising)}/>
            <Button title="Find peers" onPress={() => navigation.navigate("Browse")}/>
        </View>
    );
}