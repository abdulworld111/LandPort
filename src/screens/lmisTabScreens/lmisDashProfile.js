import React, { useState, UseEffect } from 'react'
import { StyleSheet, View } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { Text, Button } from 'react-native-paper'
import AsyncStorage from '@react-native-async-storage/async-storage'
import configs from '../../../config'


export default function LmisDashProfile(){

    const navigation = useNavigation()

    const logout = async () => {
        await AsyncStorage.removeItem("userToken")
        navigation.navigate("Home")
    }
    return (
        <View style={styles.container}>
            <Text>This is the LMIS PROFILE Dashboard</Text>
            <Button
                style={styles.logoutBtn}
                rippleColor="#4caf50"
                textColor="white"
                buttonColor="black"
                mode="outlined"
                onPress={logout}
            >
                Logout
            </Button>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        paddingTop: 30
    },
    logoutBtn: {
        width: 150,
        marginTop: 19
    }

})