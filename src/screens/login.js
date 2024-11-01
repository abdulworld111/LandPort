import React, { useState, useEffect } from 'react'
import { View, StyleSheet, Alert } from 'react-native'
import { MMKV } from 'react-native-mmkv' 
import { TextInput, Text, Button } from 'react-native-paper'
import { StatusBar } from 'expo-status-bar'
// import { useNavigation } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import configs from './../../config';
import NativeNotify from 'native-notify'

export default function LoginScreen({ navigation }) {

    // NativeNotify.registerIndieID(22999, 'YgZlzpD20yIbAlsoL7PUeD')

    const [ name, setName ] = useState('')
    const [ password, setPassword ] = useState('')
    const [ nameError, setNameError ] = useState(null)
    const [ passwordError, setPasswordError ] = useState(null)
    // const navigation = useNavigation()

    const handleLogin = async () => {
        // Alert.alert("Login", `username: ${name}, password: ${password}`, [
        //     {text: "proceed"},
        //     {text: "cancel"}
        // ])
        if ((name.length === 0) || (password.length === 0)){
            // alert("username field and password field are required")
            if(name.length === 0) setNameError("name is required to login")
            if(password.length === 0) setPasswordError("password is required to login")
        }
        else{
            await fetch(configs.backendUrl + "/users/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({name: name, password: password})
            })
            .then(resp => resp.json())
            .then(async (data) => {
                // const storage = new MMKV()
                console.log(data.error)
                if (data.token){
                    console.log(data.user.token)
                    await AsyncStorage.setItem("userToken", data.token)

                    if (data.user.role === "customer"){
                        navigation.replace("CustomerDashboard", {user: data.user})
                    }
                    else if (data.user.role === "lmis"){
                        navigation.replace("LmisDashboard", {user: data.user})
                    }
                    else if (data.user.role === "rider"){
                        navigation.replace("RidersDashboard", {user: data.user})
                    }
                    else{
                        // navigation.replace("LmisDashboard", {user: data.user})
                        alert("Dont know which category you are in")
                    }
                }
                else{
                    alert("You dont have an account. Register to use the app")
                }
            })
            .catch(error => {
                alert(`something went wrong: ${error}`)
            })
        }
    }

    const goToRegister = () => {
        navigation.replace("Register")
    }

    return(
        <View style={styles.container}>
            <Text variant="titleLarge" style={styles.header}>Login to Your LandPort Account</Text>
            <View style={styles.formContainer}>
                <TextInput
                    style={styles.inputStyle}
                    label="Name"
                    mode="outlined"
                    value={name}
                    onChangeText={setName}
                    onFocus={() => setNameError(null)}
                />
                {nameError && <Text variant="bodySmall" style={{color: "red"}}>*{nameError}</Text>}
                <TextInput  
                    style={styles.inputStyle}
                    label="password"
                    mode="outlined"
                    value={password}
                    secureTextEntry={true}
                    onChangeText={setPassword}
                    onFocus={() => setPasswordError(null)}
                />
                {passwordError && <Text variant="bodySmall" style={{color: "red"}}>*{passwordError}</Text>}
                <View style={styles.forgotV}>
                    <Text style={styles.forgotPass}>Forgot Password?</Text>
                </View>
                <View style={styles.buttons}>
                    <Button
                        style={styles.loginBtn}
                        icon="login"
                        rippleColor="#4caf50"
                        mode="contained"
                        buttonColor="white"
                        textColor="black"
                        onPress={handleLogin}
                    >
                        Login
                    </Button>
                </View>
                <View style={styles.signupV}>
                    <Text style={styles.signupText}>Dont have an Account? <Text style={{color: "blue"}} onPress={goToRegister}>Sign Up</Text></Text>
                </View>
            </View>
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        // justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'teal'
    },
    header: {
        color: 'white',
        fontWeight: 'bold',
        marginTop: 18
    },
    formContainer: {
        position: 'absolute',
        flex: 1,
        justifyContent: 'center',
        top: "28%",
        width: '70%', 
    },
    inputStyle: {
        // borderWidth: 1,
        // borderColor: 'black'
        fontSize: 16,
        width: "100%",
        height: 30,
        padding: 10,
        backgroundColor: 'white',
        marginBottom: 5
    },
    buttons: {
        marginTop: 17
    },
    loginBtn: {
        borderRadius: 3
    },
    forgotV: {
        marginTop: 10,
    },
    forgotPass: {
        textAlign: "right",
        color: "white",
    },
    signupText: {
        textAlign: "center",
    },
    signupV: {
        marginTop: 17,
    }
})