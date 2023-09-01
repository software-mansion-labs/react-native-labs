import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './src/HomeScreen';
import AdvertiseScreen from './src/AdvertiseScreen';
import BrowseScreen from './src/BrowseScreen';
import SessionScreen from './src/SessionScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen 
            name="Home"
            component={HomeScreen}
        /> 
        <Stack.Screen 
            name="Advertise"
            component={AdvertiseScreen}
        />  
        <Stack.Screen 
            name="Browse"
            component={BrowseScreen}
        /> 
        <Stack.Screen 
          name="Session"
          component={SessionScreen}
        />  
      </Stack.Navigator>
    </NavigationContainer>

  );
}