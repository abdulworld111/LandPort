import React, { useState, useEffect } from 'react'
import { StyleSheet, View } from 'react-native'
import { Portal, PaperProvider, ActivityIndicator, Text, Button, TextInput, IconButton, MD3Colors } from 'react-native-paper'
import * as Location from 'expo-location'
import MapView, {Marker, Callout} from 'react-native-maps'
import AsyncStorage from '@react-native-async-storage/async-storage'
import jwtDecode from 'jwt-decode'
import { Entypo } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import configs from '../../../config'

export default function RidersDashTrans({props}){

    const navigation = useNavigation()

    const [ mapRegion, setMapRegion ] = useState(null)
    const [ pin, setPin ] = useState({})
    const [ pinnedLocation, setPinnedLocation ] = useState(null)
    const [ locationAccess, setLocationAccess ] = useState(false)
    const [ loading, setLoading ] = useState(true)

    useEffect(() => {
        // console.log(props)
        const initializeMap = async () => {
            
            const { status } = await Location.requestForegroundPermissionsAsync()
            if (status !== "granted"){
                setLocationAccess(false)
                console.log("Location not granted, Please enable location in your settings")
            }
            else{
                setLocationAccess(true)
                const currLocation = await Location.getCurrentPositionAsync()
                setMapRegion({
                    latitude: currLocation.coords.latitude,
                    longitude: currLocation.coords.longitude,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421
                })
                // setUserLocation({latitude: currLocation.coords.latitude, longitude: currLocation.coords.longitude})
                setPin({latitude: currLocation.coords.latitude, longitude: currLocation.coords.longitude})
                console.log(currLocation)
                setLoading(false)
            }
        }
        initializeMap()
    }, [])

    const handlePinned = async () => {
        setPinnedLocation(pin)
        const data = await AsyncStorage.getItem("userToken")
        const decData = jwtDecode(data)
        await fetch(configs.backendUrl + "/users/set-location/" + decData.id, {
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({location: pin})
        })
        .then(resp => resp.json())
        .then(data => {
            // setUsr(data.user)
            console.log("location successfully pinned")
        })
        .catch(error => {
            console.log(error)
        })
        // console.log(decData)
        // console.log(pin)
        // navigation.replace("RidersDashboard")
        // setFinalReceiverLocation(pin)
        // setShowSendMapModal(false)
        // setVisible(true)
        // setShowRCM(false)
        // setSelectedForm(2)
    }

    return (
        <View style={{flex: 1}}>
            {/* <Text style={{textAlign: "center"}}>Riders Dash Pin to Location Screen</Text> */}
            {!loading && (
                <View style={{flex: 1}}>
                    <IconButton 
                        icon="check-bold"
                        rippleColor="#4caf50"
                        size={25}
                        iconColor="white"
                        containerColor="#3f51b5"
                        style={{alignSelf:"center", bottom: 15, right: 7, position: "absolute", zIndex: 70}}
                        onPress={handlePinned}
                    />
                    <MapView 
                        style={{flex: 1}} 
                        initialRegion={mapRegion}
                        provider="google"
                    >
                        <Marker 
                            coordinate={pin}
                            draggable={true}
                            onDragStart={(e) => console.log("Drag start " + e.nativeEvent.coordinate)}
                            onDragEnd={(e) => {
                                setPin({latitude: e.nativeEvent.coordinate.latitude, longitude: e.nativeEvent.coordinate.longitude})
                            }}
                        />
                    </MapView>
                </View>
            )}
        </View>
    )
}