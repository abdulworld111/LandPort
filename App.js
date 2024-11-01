// import { StatusBar } from 'expo-status-bar';
// import { StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react'
import 'react-native-gesture-handler'
import { NavigationContainer } from '@react-navigation/native'
import { View, Text, StyleSheet, ImageBackground, Alert, AppState } from 'react-native'
import { createStackNavigator } from '@react-navigation/stack'
import HomeScreen from './src/screens/homeScreen'
import LoginScreen from './src/screens/login'
import RegisterScreen from './src/screens/register'
import customerDashboard from './src/screens/customerDashboardScreen'
import LmisDashboard from './src/screens/lmisDashboardScreen'
import RidersDashboard from './src/screens/ridersDashboardScreen'
import MyDrawer from './src/screens/customerTabScreens/stackHome'
import TransProvider from './transactionContext'

import messaging from '@react-native-firebase/messaging'
import CustomerDashboard from './src/screens/customerDashboardScreen'
import SplashScreen from './SplashScreen'
import registerNNPushToken from 'native-notify';
import getPushDataObject from 'native-notify'
import NativeNotify from 'native-notify'

const requestUserPermission = async () => {
  const authStatus = await messaging().requestPermission()
  const enabled = authStatus === messaging.AuthorizationStatus.AUTHORIZED || authStatus === messaging.AuthorizationStatus.PROVISIONAL
  
  if(enabled){
    console.log("Authorization status:", authStatus)
  }
}

const deleteToken = async () => {
  await AsyncStorage.removeItem("userToken")
}

// const [ isDisplaySplash, setIsDisplaySplash ] = useState(true)
  // const navigation = useNavigation()
  // useEffect(() => {
  //   async function prepare(){
  //     try {
  //       await SplashScreen.preventAutoHideAsync();
  //     } catch (e) {
  //       await SplashScreen.hideAsync();
  //     } finally{

  //     }
  //   }

  //   prepare()
  // }, [])
  
// useEffect(()=> {
//   if(requestUserPermission()){
//     messaging().getToken().then(token => {
//       console.log(token)
//     })
//   }
//   else{
//     console.log("Failed token status", authStatus)
//   }

//   messaging().getInitialNotification().then(remoteMessage => {
//     if(remoteMessage){
//       console.log("Notification caused app to open from quit state", remoteMessage.notification)
//     }
//   })
  
//   messaging().onNotificationOpenedApp(remoteMessage => {
//     if(remoteMessage){
//       console.log("Notification caused app to open from background state", remoteMessage.notification)
//     }
//   })
  
//   messaging().setBackgroundMessageHandler(remoteMessage => {
//     if(remoteMessage){
//       console.log("Message handled in the background", remoteMessage)
//     }
//   })
  
//   const unsubscribe = messaging().onMessage(async (remoteMessage) => {
//     Alert.alert("A new FCM message arrived", JSON.stringify(remoteMessage))
//   })
  
//   return unsubscribe

// }, [])

const Stack = createStackNavigator()

const Header = (props) => {
  return (
    // <ImageBackground source={require("./worldmap.jpg")} style={{width: props.name === "Home" ? 330 : 230, height: "100%"}}>
    // style={{flexDirection: "row", justifyContent: "center", alignItems: "center", height: "100%", flex: 1, borderColor: "black", borderWidth: 2, backgroundColor: "green"}}
      <View>
        <Text style={{fontSize: 25, fontWeight: "bold", color: "black"}}>{props.name}</Text>
      </View>
  )
}

function StackNavigator(){
  return (
    <Stack.Navigator
      screenOptions = {{
        headerStyle: {backgroundColor: 'red'},
        headerTintColor: 'black',
        headerTitleStyle: {fontWeight: 'normal'}
      }}
    >
      <Stack.Screen 
        name="Home" 
        component={HomeScreen}
        options={{
          // headerTitle: () => <Header name="Home" />,
          title: "Homes",
          headerTitleStyle: {alignSelf: "center", fontWeight: "bold"},
          headerTitleAlign: "center",
          headerStyle: {backgroundColor: "#d4d4d4", height: 80}
        }}  
      />
      <Stack.Screen 
        name="Login" 
        component={LoginScreen} 
        options={{
          title: "Login",
          headerTitleStyle: {alignSelf: "center", fontWeight: "bold"},
          headerTitleAlign: "center",
          headerStyle: {backgroundColor: "#d4d4d4", height: 80}
        }}
        />
      <Stack.Screen 
        name="Register" 
        component={RegisterScreen} 
        options={{
          title: "Register",
          headerTitleStyle: {alignSelf: "center", fontWeight: "bold"},
          headerTitleAlign: "center",
          headerStyle: {backgroundColor: "#d4d4d4", height: 80},
          headerShown: false
        }}
        />
      <Stack.Screen 
        name="CustomerDashboard" 
        component={CustomerDashboard} 
        options={{
          title: "Customer Dashboard",
          headerTitleStyle: {alignSelf: "center", fontWeight: "bold", color: "teal"},
          headerTitleAlign: "center",
          headerStyle: {backgroundColor: "white", height: 80}
        }}
        />
      <Stack.Screen 
        name="LmisDashboard" 
        component={LmisDashboard} 
        options={{
          title: "Lmis Dashboard",
          headerTitleStyle: {alignSelf: "center", fontWeight: "bold"},
          headerTitleAlign: "center",
          headerStyle: {backgroundColor: "#d4d4d4", height: 80}
        }}
        />
      <Stack.Screen 
        name="RidersDashboard" 
        component={RidersDashboard} 
        options={{
          title: "Rider Dashboard",
          headerTitleStyle: {alignSelf: "center", fontWeight: "bold"},
          headerTitleAlign: "center",
          headerStyle: {backgroundColor: "#d4d4d4", height: 80}
        }}
        />
    </Stack.Navigator>
  )
}
export default function App(){
  registerNNPushToken(22999, 'YgZlzpD20yIbAlsoL7PUeD');
  const [ isDisplaySplash, setIsDisplaySplash ] = useState(true)
  // let pushDataObject = getPushDataObject()
  useEffect(() => {
    // console.log(pushDataObject)
    setTimeout(()=> {
      setIsDisplaySplash(false)
    }, 3000)

    AppState.addEventListener("change", (nextAppState) => {
      if (nextAppState === "background"){
        deleteToken()
      }
    })
  }, [])

  if(isDisplaySplash){
    return(
      <SplashScreen />
    )
  }
  return (
      <TransProvider>
        <NavigationContainer>
          <StackNavigator />
        </NavigationContainer>
      </TransProvider>
  )
}




// export default function App() {
//   return (
//     <View style={styles.container}>
//       <Text>Open up App.js to start working on your app!</Text>
//       <StatusBar style="auto" />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });
