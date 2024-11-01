import React, { useState, useEffect, useCallback } from 'react'
import { View, StyleSheet, Image, ScrollView } from 'react-native'
import { Text, Button } from 'react-native-paper'
import { useNavigation } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import jwtDecode from 'jwt-decode'
import { ActivityIndicator } from 'react-native-paper'
import { Entypo } from '@expo/vector-icons'
import { FontAwesome } from '@expo/vector-icons'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete'
import configs from '../../../config' 

export default function DashboardProfileRoute() {
    const [usr, setUsr] = useState(null)
    const [loading, setLoading] = useState(true)
    const [refresh, setRefresh] = useState(false)

    const navigation = useNavigation()
    const handleLogout = async () => {
        await AsyncStorage.removeItem("userToken")
        navigation.navigate("Home")
    }

    useEffect(() => {
        const fetchData = async () => {
            const data = await AsyncStorage.getItem("userToken")
            // console.log(data)
            try {
                const decData = jwtDecode(data)
                await fetch(configs.backendUrl + "/users/" + decData.id)
                    .then(resp => resp.json())
                    .then(data => {
                        setUsr(data.user)
                        // console.log(data.user)
                        setLoading(false)
                    })
                    .catch(error => {
                        console.log(error)
                    })
            } catch (error) {
                console.log("something went wrong")
            }
        }
        fetchData()
    }, [])


    return ( 
        <View style = {styles.container}> 
        { loading ? ( 
            <View style = {{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "white"}} >
                <ActivityIndicator size="large" color="teal" animating={true}/> 
                </View>
                ) : ( 
                    <View style={
                    styles.contContainer} >
                <Image 
                    source = {require("../prof1.jpeg")}
                    style = {styles.brandLogo}
                    resizeMode = "contain" />
                <Text style = {styles.profName} > {usr.name} </Text> 
                <View style={{marginTop: 15}}>
                    <View style={styles.listStyle}>
                        <FontAwesome name="phone" size={18} style={styles.iconStyle}/>
                        <Text style = {[styles.profDet, {width: "50%"}]} >0{usr.phoneNumber}</Text >
                    </View>
                    <View style={styles.listStyle}>
                        <FontAwesome name="envelope" size={18} style={styles.iconStyle}/>
                        <Text style={styles.profDet}> {usr.email}</Text>
                    </View>
                    <View style={styles.listStyle}>
                        <Entypo name="location-pin" size={20} style={styles.iconStyle}/>
                        <Text style = {styles.profDet}>{usr.location}</Text>
                    </View>
                </View>
                <Button 
                    style = {styles.logoutBtn}
                    rippleColor = "#4caf50"
                    buttonColor = '#f44336'
                    mode = "elevated"
                    textColor = 'white'
                    onPress = {
                        handleLogout
                    } >
                    Logout 
                </Button> 
                {/* <ScrollView style={{borderColor: "red", borderWidth: 5, width: "100%",}}> */}
                

                    
            {/* </ScrollView> */}
                </View>
            )
        } 
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    contContainer: {
        flex: 1,
        alignItems: "center",
        paddingTop: 10
    },
    brandLogo: {
        height: 200,
        width: 280
    },
    iconStyle: {
        marginRight: 20,
        color: "teal"
    },
    logoutBtn: {
        width: 100,
        marginTop: 30
    },
    profName: {
        textAlign: "center",
        fontWeight: "bold",
        color: "teal",
        fontSize: 35
    },
    profDet: {
        textAlign: "center",
        color: "teal",
        fontSize: 20,
        // fontWeight: "bold"
    },
    listStyle: {
        flexDirection: "row", 
        alignItems: "center",
        justifyContent: "space-between",
        borderBottomWidth: 3,
        borderBottomColor: "teal",
        paddingBottom: 4,
        marginBottom: 8,
        paddingHorizontal: 15,
        borderRadius: 10,
        // width: "100%"
    },
})