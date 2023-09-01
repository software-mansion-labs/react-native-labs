import { LinkPreviewView } from "link-preview";
import {
  useRef,
  useState,
} from "../../../expo-lock-screen/node_modules/@types/react";
import {
  StyleSheet,
  Button,
  TextInput,
  View,
  Text,
  ActivityIndicator,
} from "react-native";

const URLS = [
  "https://twitter.com/elonmusk/status/1519495982723084290",
  "https://apple.com",
  "https://google.com",
  "https://www.onet.pl/informacje/onetwiadomosci/nadciaga-rozlegly-antycyklon-zawladnie-pogoda-w-polsce-mapy/sn433rn,79cfc278",
  "https://twitter.com/elonmusk/status/1685096284275802112",
];

export default function LinkPreview() {
  const [text, setText] = useState<string>("");
  const [url, setUrl] = useState<string>(URLS[0]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const ref = useRef<TextInput>(null);
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>LinkPreview</Text>
        <Text style={styles.subtitle}>Demo</Text>
      </View>
      <TextInput
        style={styles.textInput}
        placeholder="Type url..."
        onChangeText={setText}
        value={text}
        autoComplete="url"
        autoCapitalize="none"
        ref={ref}
      />
      <Button
        title="Set url"
        onPress={() => {
          setUrl(text);
          ref.current?.blur();
        }}
      />
      <Button
        title="Set random url"
        onPress={() => setUrl(URLS[Math.floor(Math.random() * URLS.length)])}
      />
      <ActivityIndicator
        animating={isLoading}
        size="large"
        style={{ padding: 10 }}
      />
      <LinkPreviewView
        url={url}
        onLoad={() => setIsLoading(false)}
        onStartLoading={() => setIsLoading(true)}
        style={{ flex: 1 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  textInput: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    width: "100%",
    padding: 5,
  },
  container: {
    flex: 1,
    paddingVertical: 100,
    paddingHorizontal: 20,
  },
  header: {
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "gray",
    marginBottom: 20,
  },
});
