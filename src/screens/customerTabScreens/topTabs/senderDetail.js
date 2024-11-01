import React, { useState, useEffect, useContext } from 'react'
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, SafeAreaView, TouchableOpacity, Image, Modal, ScrollView, ImageBackground } from 'react-native';
import { Text, Button, IconButton, TextInput, Checkbox } from 'react-native-paper'
// import { useNavigation } from '@react-navigation/native'
import Ionicons from '@expo/vector-icons/Ionicons'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwtDecode from 'jwt-decode';
import * as Location from 'expo-location'
import MapView, {Marker, Callout} from 'react-native-maps'
import { TransContext } from '../../../../transactionContext';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

export default function SenderDetail({navigation}){

    const transData = useContext(TransContext)

    const [ mapRegion, setMapRegion ] = useState(null)
    const [ pin, setPin ] = useState({})
    const [ pinnedLocation, setPinnedLocation ] = useState(null)
    const [ locationAccess, setLocationAccess ] = useState(false)
    const [ userLocation, setUserLocation ] = useState(null)
    const [ loading, setLoading ] = useState(true)
    const [ showModal, setShowModal ] = useState(false)
    const [ finalUserLocation, setFinalUserLocation ] = useState({})

    useEffect(() => {
        const fetchData = async () => {
            // await AsyncStorage.removeItem("userToken")
            // navigation.navigate("Home")
            const { status } = await Location.requestForegroundPermissionsAsync()
            if ( status !== "granted"){
                // setLocationAccess(false)
                console.log("location not granted. Please enable your location in your settings")
                alert("location not granted")
            }
            else{
                // setLocationAccess(true)
                const currLocation = await Location.getCurrentPositionAsync()
                setMapRegion({
                    latitude: currLocation.coords.latitude,
                    longitude: currLocation.coords.longitude,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421
                })
                setUserLocation({latitude: currLocation.coords.latitude, longitude: currLocation.coords.longitude})
                setPin({latitude: currLocation.coords.latitude, longitude: currLocation.coords.longitude})
                setLoading(false)
            }

        }
        fetchData()

    }, [])

    const handlePress = () => {
        // alert("button was pressed")
        // navigation.jumpTo("CustomerDashboard", { name: "Home"})
        // navigation.navigate("Reciever")
        setShowModal(true)
    }

    const handlePinned = () => {
        setShowModal(false)
        // navigation.navigate("Home")
        // alert("You are trying to pin something")
    }

    const handlePrefill = () => {
        transData.setSenderName(transData.customer.name)
        transData.setSenderPhoneNumber("0"+ transData.customer.phoneNumber)
    }

    return(
        <View style={styles.container}>
            <Modal
                visible={showModal}
                style={{flex: 1}}
            >

                {!loading && (
                    <View style={{flex: 1}}>
                        <IconButton 
                            icon="check-bold"
                            rippleColor="#4caf50"
                            size={25}
                            iconColor="white"
                            containerColor="#3f51b5"
                            style={{alignSelf:"center", bottom: 55, right: 7, position: "absolute", zIndex: 70}}
                            onPress={handlePinned}
                        />
                        {/* <ScrollView> */}
                        {/* <View>
                            
                        </View> */}
                            <GooglePlacesAutocomplete 
                                placeholder="Search"
                                onPress={(data, details=null) => {
                                    // console.log(data, details)
                                    console.log(details.geometry.location.lat)
                                    console.log(details.geometry.location.lng)

                                    setMapRegion({
                                        latitude: details.geometry.location.lat,
                                        longitude: details.geometry.location.lng,
                                        latitudeDelta: 0.0922,
                                        longitudeDelta: 0.0421
                                    })
                                    setPin({latitude: details.geometry.location.lat, longitude: details.geometry.location.lng})
                                    transData.setSenderLocation({latitude: details.geometry.location.lat, longitude: details.geometry.location.lng})
                                }}
                                fetchDetails={true}
                                GooglePlacesSearchQuery={{
                                    rankby: "distance",
                                }}
                                query={{
                                    key: "AIzaSyBCk_9UhZfgEfs1mQu0Trz_CxWO6luEbDg",
                                    language: "en",
                                    types: "establishment",
                                    radius: 30000,
                                    location: `${pin.latitude}, ${pin.longitude}`
                                }}
                                styles={{
                                    container: {
                                        position: "absolute",
                                        zIndex: 1212,
                                        left: 0,
                                        width: "100%",
                                        flex: 1,
                                        height: "100%",
                                        justifyContent: "flex-end",
                                        backgroundColor: "none",
                                        // borderColor: "teal",
                                        // borderWidth: 3,
                                    },
                                    textInputContainer: {
                                        backgroundColor: "white",
                                        borderTopWidth: 0,
                                        borderBottomWidth: 0,
                                        marginBottom: 0
                                    },
                                    textInput: {
                                        // height: 48,
                                        color: "#5d5d5d",
                                        fontSize: 16,
                                        // borderWidth: 1,
                                        borderColor: "gray",
                                        borderRadius: 5, 
                                        paddingHorizontal: 10,
                                    },
                                    listView: {
                                        position: "absolute",
                                        // top: 48,
                                        bottom: "11%",
                                        left: 0,
                                        right: 0,
                                        elevation: 5,
                                        backgroundColor: "teal",
                                        zIndex: 1000
                                    }
                                }}
                                // styles={{
                                //     container: styles.autocompleteContainer,
                                //     textInputContainer: styles.textInputContainer,
                                //     listView: styles.listView,
                                //     row: styles.row,
                                //     poweredContainer: styles.poweredContainer
                                // }}
                                // listViewDisplayed={true}
                            />
                        {/* </ScrollView> */}

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
                                    transData.setSenderLocation({latitude: e.nativeEvent.coordinate.latitude, longitude: e.nativeEvent.coordinate.longitude})
                                }}
                            />
                        </MapView>
                    </View>
                )}

            </Modal>

            <Text variant="titleLarge" style={{textAlign: "center", color: "black", fontWeight: "bold", marginBottom: 50, marginTop: 15, width: "100%"}}>Enter Sender Details ({transData.rideType})</Text>
            <Button
                style={styles.prefillStyle}
                rippleColor="#4caf50"
                mode="contained"
                buttonColor="teal"
                textColor="white"
                onPress={handlePrefill}
            >
                Use My Details
            </Button>
            <TextInput
                style={styles.inputStyle} 
                mode="outlined"
                label="Sender Name"
                value={transData.senderName}
                onChangeText={transData.setSenderName}
            />
            {/* <TextInput
                style={styles.inputStyle} 
                mode="outlined"
                label="Sender Location"
                value={transData.senderLocation}
                onChangeText={transData.setSenderLocation}
            /> */}
            <TextInput
                style={styles.inputStyle} 
                mode="outlined"
                label="Sender Phone Number"
                value={transData.senderPhoneNumber}
                keyboardType="numeric"
                onChangeText={transData.setSenderPhoneNumber}
            />
            <View style={[styles.inputStyle, {flexDirection: "row", alignItems: "center"}]}>
                <Text variant="bodyLarge">Location</Text>
                <Checkbox status={transData.senderLocation ? "checked" : "unchecked"} />
            </View>
            <Button
                style={styles.recvLocation}
                rippleColor="#4caf50"
                mode="contained"
                buttonColor="teal"
                textColor="white"
                onPress={() => {
                    // setShowSendMapModal(true) 
                    // setVisible(false)
                    setShowModal(true)
                }}
            >
                Choose a New Location
            </Button>
            <Button
                style={styles.recvLocation}
                rippleColor="#4caf50"
                mode="contained"
                buttonColor="teal"
                textColor="white"
                onPress={() => {
                    setFinalUserLocation(pin)
                    transData.setSenderLocation(pin)
                }}
            >
                Use Current Location
            </Button>
            
            <Button
                style={styles.nextBtnStyle}
                icon="chevron-right"
                rippleColor="#4caf50"
                mode="contained"
                buttonColor="cornflowerblue"
                textColor="white"
                contentStyle={{flexDirection: "row-reverse"}}
                onPress={() => navigation.navigate("Reciever")}
            >
                Next
            </Button>
        </View>
    )
}

// styles={{
//     container: {flex: 0, position: "absolute", width: "100%", zIndex: 20},
//     listView: {backgroundColor: "red"}
// }}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    autocompleteContainer: {
        flex: 1,
        justifyContent: "flex-end",
    },
    textInputContainer: {
        backgroundColor: "white",
        borderTopWidth: 0,
        borderBottomWidth: 0,
        borderRadius: 5,
    },
    listView: {
        position: "absolute",
        bottom: "100%",
        backgroundColor: "white",
        zIndex: 10000,
        borderRadius: 5 
    },
    row: {
        backgroundColor: "white",
        padding: 13,
        height: 44,
        flexDirection: "row"
    },
    poweredContainer: {
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "white"
    },
    btnStyle: {
        
    },
    recvLocation: {
        borderRadius: 3,
        marginTop: 13,
        width: "70%",
        marginRight: "auto",
        marginLeft: "auto",
    },
    prefillStyle: {
        borderRadius: 7,
        marginBottom: 13,
        alignSelf: "right",
        width: "40%", 
        marginRight: 40,
        marginLeft: "auto",
    },
    inputStyle: {
        marginBottom: 5,
        width: "80%",
        marginLeft: "auto",
        marginRight: "auto"
    },
    nextBtnStyle: {
        borderRadius: 7,
        marginTop: 63,
        alignSelf: "right",
        width: "40%", 
        marginRight: "auto",
        marginLeft: "auto",
    }
})