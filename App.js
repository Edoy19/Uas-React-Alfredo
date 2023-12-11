
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, Image, TextInput } from 'react-native';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Logo } from './assets';
import { AccountScreen, EditListAcc, EditListTask, HomeScreen, ListAccount, ListTask, LoginScreen, SelectEditAcc, SelectScreen, SelectTask, SelectTaskEdit, Task } from './Pages';
import store from './store';
import { Provider } from 'react-redux';
const Stack = createNativeStackNavigator();
function App() {
  function SplashScreen({ navigation }) {
    setTimeout(() => {
      navigation.replace('Login')
    }, 5000)
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' ,backgroundColor: '#fca503',}}>
        <Image source={Logo} style={{ width: 250, height: 120, resizeMode: 'contain' }} />
      </View>
    );
  }
  return (
    <Provider store={store}>
      <NavigationContainer >
        <Stack.Navigator>
        <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={LoginScreen} options={{headerShown:false}} />
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerBackVisible: false }}  />
        <Stack.Screen name="Account" component={AccountScreen} />
        <Stack.Screen name="Select_acc" component={SelectScreen} />
        <Stack.Screen name="List_Acc" component={ListAccount} />
        <Stack.Screen name="Edit_Account" component={EditListAcc} />
        <Stack.Screen name="Edit_Select_acc" component={SelectEditAcc} />
        <Stack.Screen name="Task" component={Task} />
        <Stack.Screen name="Select_Task" component={SelectTask} />
        <Stack.Screen name="List_task" component={ListTask} />
        <Stack.Screen name="Edit_Task" component={EditListTask} />
        <Stack.Screen name="Edit_Select_Task" component={SelectTaskEdit} />

        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}
export default App;
