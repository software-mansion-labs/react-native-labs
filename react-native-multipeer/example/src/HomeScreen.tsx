import { useNavigation } from "@react-navigation/native";
import { useCallback, useState } from "react";
import { Button, Text, TextInput, View } from "react-native";
import { init } from "react-native-multipeer";

export default function HomeScreen() {
    const [displayName, setDisplayName] = useState('');
    const navigation = useNavigation<any>();

    const onStart = useCallback(() => {
        init(displayName);
        navigation.navigate('Advertise');
    }, [displayName]);

    return (
        <View style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'white'
        }}>
            <TextInput style={{
                marginBottom: 24,
            }}value={displayName} onChangeText={setDisplayName} placeholder="Enter display name"/>

            <Button title="Start" disabled={displayName.length < 3} onPress={onStart}/>
        </View>
    );
}