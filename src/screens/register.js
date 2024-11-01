import React, { useState, useEffect } from 'react'
import { View, StyleSheet, FlatList, Platform } from 'react-native'
import { Text, TextInput, Button } from 'react-native-paper'
import AsyncStorage from '@react-native-async-storage/async-storage'
import configs from './../../config';

import { Notification } from 'expo-notifications'

import registerNNPushToken from 'native-notify';
import getPushDataObject from 'native-notify'

import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';

export default function RegisterScreen({navigation}){
    const [ customerDetail, setCustomerDetail ] = useState([])
    const [ name, setName ] = useState("")
    const [ email, setEmail ] = useState("")
    const [ password, setPassword ] = useState("")
    const [ phoneNumber, setPhoneNumber ] = useState("")
    const [ location, setLocation ] = useState("")
    const [ loading, setLoading ] = useState(false)

    const [expoPushToken, setExpoPushToken] = useState('')

    useEffect(() => {
        // console.log(pushDataObject)
        registerForPushNotificationsAsync().then(token => {
          console.log("from register screen token = ", token)
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

    const handleRegister = () => {
        setLoading(true)
        fetch(configs.backendUrl + "/users/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: name,
                password: password,
                email: email,
                phoneNumber: phoneNumber,
                location: location,
                pushToken: expoPushToken
            })
        })
        .then(resp => resp.json())
        .then( async (data) => {
            console.log(data)
            await AsyncStorage.setItem("userToken", data.token)
            setLoading(false)
            navigation.replace("CustomerDashboard")
        }) 
        .catch(error => alert(error))
    }

    return (
        <View style={styles.container}>
            <Text variant="bodyLarge" style={{color: "white", marginTop: 30}}>Sign Up To create An Account</Text>
            <View style={styles.formContainer}>
                <TextInput
                    style={styles.inputStyle} 
                    mode="outlined"
                    label="name"
                    value={name}
                    onChangeText={(text) => setName(text)}
                />
                <TextInput
                    style={styles.inputStyle} 
                    mode="outlined"
                    label="password"
                    value={password}
                    secureTextEntry={true}
                    onChangeText={(text) => setPassword(text)}
                />
                <TextInput 
                    style={styles.inputStyle}
                    mode="outlined"
                    label="email"
                    value={email}
                    onChangeText={(text) => setEmail(text)}
                    inputMode='email'
                />
                <TextInput 
                    style={styles.inputStyle}
                    mode="outlined"
                    label="address"
                    value={location}
                    onChangeText={(text) => setLocation(text)}
                />
                <TextInput 
                    style={styles.inputStyle}
                    mode="outlined"
                    label="Phone Number"
                    value={phoneNumber}
                    keyboardType="numeric"
                    onChangeText={setPhoneNumber}
                />
                <Button
                    style={styles.regBtn}
                    icon="account-plus"
                    rippleColor="#4caf50"
                    mode="outlined"
                    buttonColor="white"
                    textColor="black"
                    loading={loading}
                    onPress={handleRegister}
                >
                    Sign Up
                </Button>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        // justifyContent: 'center',
        backgroundColor: 'teal',
    },
    formContainer: {
        position: "absolute",
        top: "19%",
        width: "70%",
    },
    regBtn: {
        borderRadius: 3,
        marginTop: 15,
    },
    inputStyle: {
        // borderWidth: 1,
        // borderColor: 'black'
        // color: "black",
        fontSize: 16,
        width: "100%",
        height: 30,
        padding: 10,
        backgroundColor: 'white',
        marginBottom: 5
    },
})