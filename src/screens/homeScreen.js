import React, { useEffect, useState, useContext } from 'react' 

import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, Image, Platform } from 'react-native';
// import { useNavigation } from '@react-navigation/native'
import Ionicons from '@expo/vector-icons/Ionicons'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwtDecode from 'jwt-decode';
import * as SplashScreen from "expo-splash-screen"
import { Notification } from 'expo-notifications'

import registerNNPushToken from 'native-notify';
import getPushDataObject from 'native-notify'


import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import configs from './../../config';


Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});


export default function HomeScreen({ navigation }) {
  
  // const tokenData = useContext(TokenContext)
  const [expoPushToken, setExpoPushToken] = useState('')

  useEffect(() => {
    // console.log(pushDataObject)
    registerForPushNotificationsAsync().then(token => {
      console.log("token = ", token)
      setExpoPushToken(token)
      // token && setExpoPushToken(token)
    })
    .catch(error => console.log(error));

  }, [])

  async function registerForPushNotificationsAsync() {
    let token;
  
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }
  
    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
      }
      // Learn more about projectId:
      // https://docs.expo.dev/push-notifications/push-notifications-setup/#configure-projectid
      // EAS projectId is used here.
      try {
        const projectId =
          Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
        if (!projectId) {
          throw new Error('Project ID not found');
        }
        token = (
          await Notifications.getExpoPushTokenAsync({
            projectId,
          })
        ).data;
        console.log(token);
      } catch (e) {
        token = `${e}`;
      }
    } else {
      alert('Must use physical device for Push Notifications');
    }
  
    return token;
  }

  const handlePress = async () => {
    console.log("Custom Button Pressed")
    const token = await AsyncStorage.getItem("userToken")
    await AsyncStorage.removeItem("userToken")
    navigation.navigate("Home")
    // await AsyncStorage.removeItem("userToken")
    // navigation.navigate("Home")
    // console.log(token)
    if (token){
      try{
        const decData = jwtDecode(token)
        // console.log(decData)
        if (decData.role === "customer"){
          navigation.navigate("CustomerDashboard")
        }
        else if (decData.role === "lmis"){
          navigation.navigate("LmisDashboard")
        }
        else if (decData.role === "rider"){
          navigation.navigate("RidersDashboard")
        }
        else{
          alert("Really dont know which category you are in")
        }
      }
      catch(error){
        console.log("Something went wrong")
      }
    }
    else{
      navigation.push('Login')
    }
  }
  const sendNotification = async() => {
    const message = {
      to: expoPushToken,
      sound: "default",
      title: "My First Push Notification",
      body: "This is my first push notification"
    }
    await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        host: "exp.host",
        accept: "application/json",
        "accept-encoding": "gzip, deflate",
        "content-type": "application/json"
      },
      body: JSON.stringify(message)
    })
    console.log("Notification sent")
  }
  return (
    <View style={styles.container}>
      <View style={{marginBottom: 100}}>
        <Image source={require("./finalLogo.png")} style={styles.brandLogo} resizeMode="cover" />
        <Text style={styles.subHeader}><Ionicons name="md-checkmark-circle" size={19} />For <Text style={styles.headAtrr}>Reliable</Text> and <Text style={styles.headAtrr}>Fast</Text> Delivery</Text>
      </View>
      <TouchableOpacity onPress={handlePress} >
        <Text style={styles.getStartedBtn}>Get Started</Text>
      </TouchableOpacity>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'teal',
    alignItems: 'center',
    justifyContent: 'center',
  },
  // container: {
  //   marginTop: 40,
  // },
  statBar: {
    marginTop: 40,
  },
  header: {
    textAlign: 'center',
    color: 'white',
    fontSize: 35,
    fontWeight: 'bold'
  },
  subHeader: {
    color: 'white',
    textAlign: "center",
  },
  headAtrr: {
    fontStyle: 'italic',
    fontWeight: 'bold',
  },
  brandLogo: {
    // backgroundColor: "black",
    height: 70,
    width: 300
  },
  getStartedBtn: {
    color: 'white',
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 4,
    paddingHorizontal: 4,
    paddingVertical: 3,
    fontSize: 20,
  }
});
