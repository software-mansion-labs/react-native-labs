import { useNavigation } from "@react-navigation/native";
import { useCallback, useEffect, useState } from "react";
import { Button, Image, View } from "react-native";
import { disconnect, onDataReceived, onPeerDisconnected, sendData } from "react-native-multipeer";
import * as ImagePicker from 'expo-image-picker';
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import {decode as atob} from 'base-64'

function convertBase64ToByteArray(base64: string) {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (var i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    return new Uint8Array(byteNumbers);
}

export default function SessionScreen({route}: NativeStackScreenProps<any, 'Session'>) {
    const sessionId = route.params?.id;
    const navigation = useNavigation<any>();
    const [image, setImage] = useState<string | null>(null);

    useEffect(() => {
        const listener = onDataReceived((event) => {
            const imageUri = `data:image/png;base64,${event.data}`
            setImage(imageUri);
        })

        const connectionListener = onPeerDisconnected(navigation.goBack);

        return () => {
            listener.remove();
            connectionListener.remove();
        }
    }, []);

    const onDisconnect = useCallback(() => {
        disconnect(sessionId);
        navigation.goBack()
    }, [navigation, sessionId])

    const onSend = useCallback(async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            allowsMultipleSelection: false,
            base64: true,
        });

        if (!result.canceled) {
            const encoded = result.assets[0].base64;
            if (encoded) {
                sendData(sessionId, convertBase64ToByteArray(encoded), 0)
            }
        }           
    }, []);


    return (
        <View style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            <View style={{
                margin: 24
            }}>
                <Button title="Send Photo" onPress={onSend}/>

            </View>
          
            <View style={{
                margin: 24
            }}>
                <Button title="Disconnect" onPress={onDisconnect}/>

            </View>

            {image && <Image source={{uri: image}} style={{
                width: 200,
                height: 200
            }}/>}
        </View>
    )

}