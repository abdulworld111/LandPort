import React, { useState, useEffect, useContext, useRef } from 'react'
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, SafeAreaView, TouchableOpacity, Image, Modal, ScrollView } from 'react-native';
import { Text, Button, IconButton, TextInput, FAB, Checkbox } from 'react-native-paper'
// import { useNavigation } from '@react-navigation/native'
import Ionicons from '@expo/vector-icons/Ionicons'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwtDecode from 'jwt-decode';
import * as Location from 'expo-location'
import MapView, {Marker, Callout} from 'react-native-maps'
import { TransContext } from '../../../../transactionContext'
import { Card } from 'react-native-shadow-cards'


export default function RecieverDetail({navigation}){

    const transData = useContext(TransContext)
    const scrollViewRef = useRef()

    const [ mapRegion, setMapRegion ] = useState(null)
    const [ pin, setPin ] = useState({})
    const [ pinnedLocation, setPinnedLocation ] = useState(null)
    const [ locationAccess, setLocationAccess ] = useState(false)
    const [ userLocation, setUserLocation ] = useState(null)
    const [ loading, setLoading ] = useState(true)
    const [ showModal, setShowModal ] = useState(false)
    const [ finalRecieverLocation, setFinalRecieverLocation ] = useState(null)
    const [ addCount, setAddCount ] = useState(1)
    const [ inpName, setInpName ] = useState("")
    const [ inpPhone, setInpPhone ] = useState("")
    const [ inpDats, setInpDats ] = useState([{recieverName: "", recieverPhoneNumber: "", location: null}])
    const [ currCount, setCurrCount ] = useState(0)

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

    const handlePrefill = (index) => {
        // transData.setRecieverName(transData.customer.name)
        // transData.setRecieverPhoneNumber("0"+ transData.customer.phoneNumber)
        const partList = transData.recieverDetails
        const part = partList[index]
        part["recieverName"] = transData.customer.name
        part["recieverPhoneNumber"] = "0" + transData.customer.phoneNumber
        partList[index] = part
        console.log(partList)
        transData.setRecieverDetails(partList)
        setInpName(transData.customer.name)
    }

    const handleAddNew = () => {
        setAddCount(prev => prev + 1)
        const newVal = [...transData.recieverDetails, {recieverName: "", recieverPhoneNumber: "", location: null}]
        transData.setRecieverDetails(newVal)
        console.log("add button clicked ")
        console.log(newVal)
        setInpName("")
        setInpPhone("")
    }

    const handleTextChange = (text, index, name) => {
        // setInpName(text)
        // alert(text + addCount)
        const partList = transData.recieverDetails
        const part = partList[index]
        part[name] = text
        partList[index] = part
        console.log(partList)
        transData.setRecieverDetails(partList)
        setInpName(text)
    }

    const handleRemoveSingle = (index) => {
        const detList = [...transData.recieverDetails]
        const newList = detList.slice(0, index).concat(detList.slice(index + 1))
        console.log(newList)
        transData.setRecieverDetails(newList)
        setAddCount(prev => prev - 1)
        // setInpName(index.toString())
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
                                onDragStart={(e) => {
                                    // console.log("Drag start " + e.nativeEvent.coordinate)
                                }}
                                onDragEnd={(e) => {
                                    setPin({latitude: e.nativeEvent.coordinate.latitude, longitude: e.nativeEvent.coordinate.longitude})
                                    const partList = transData.recieverDetails
                                    const part = partList[currCount]
                                    console.log(currCount)
                                    part["location"] = {latitude: e.nativeEvent.coordinate.latitude, longitude: e.nativeEvent.coordinate.longitude}
                                    partList[currCount] = part
                                    console.log(partList)
                                    transData.setRecieverDetails(partList)
                                    setInpName(e.nativeEvent.coordinate.latitude.toString())
                                    // transData.setRecieverLocation({latitude: e.nativeEvent.coordinate.latitude, longitude: e.nativeEvent.coordinate.longitude})
                                }}
                            />
                        </MapView>
                    </View>
                )}

            </Modal>
        
            <View style={{flex: 1}}>
                <Text variant="headlineSmall" style={{textAlign: "center", color: "teal", fontWeight: "bold", marginBottom: 30, marginTop: 15, width: "100%"}}>Enter Reciever Details({transData.rideType})</Text>

                {transData.rideType === "Single" && (
                    <View>
                        <Button
                            style={styles.prefillStyle}
                            rippleColor="#4caf50"
                            mode="contained"
                            buttonColor="teal"
                            textColor="white"
                            onPress={ () => handlePrefill(0)}
                        >
                            Use My Details
                        </Button>
                        <TextInput
                            style={styles.inputStyle} 
                            mode="outlined"
                            label="Reciever Name"
                            value={transData.recieverDetails[0]["recieverName"]}
                            onChangeText={(text) => handleTextChange(text, 0, "recieverName")}
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
                            label="Reciever Phone Number"
                            keyboardType="numeric"
                            value={transData.recieverDetails[0]["recieverPhoneNumber"]}
                            onChangeText={(text) => handleTextChange(text, 0, "recieverPhoneNumber")}
                        />
                        <View style={[styles.inputStyle, {flexDirection: "row", alignItems: "center"}]}>
                            <Text variant="bodyLarge">Location:</Text>
                            <Checkbox status={transData.recieverDetails[0]["location"] ? "checked" : "unchecked"} />
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
                                setCurrCount(0)
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
                                setFinalRecieverLocation(pin)
                                const partList = transData.recieverDetails
                                const part = partList[0]
                                part["location"] = pin
                                partList[0] = part
                                console.log(partList)
                                transData.setRecieverDetails(partList)
                                setInpName(pin.latitude.toString())
                            }}
                        >
                            Use Current Location
                        </Button>
                    </View>
                )}

                {transData.rideType === "Mass" && (
                    <ScrollView 
                        style={{flex: 1}}
                        ref={scrollViewRef}
                        onContentSizeChange={(cw, ch) => {
                        // console.log(ch)
                        // console.log(ch -500)
                        scrollViewRef.current.scrollTo({animated: true, y: ch})
                        }}
                    >
                    {
                        [...Array(addCount)].map((elm, index) => (
                            <Card 
                                key={index} 
                                style={{
                                    borderColor: "cornflowerblue", 
                                    paddingVertical: 12, 
                                    borderWidth: 1, 
                                    marginBottom: 25,
                                    marginLeft: "auto",
                                    marginRight: "auto",
                                    width: "85%"
                                    }}
                            >
                            {index !== 0 && (
                                <IconButton 
                                icon="close"
                                rippleColor="#4caf50"
                                size={15}
                                iconColor="red"
                                // containerColor="red"
                                style={{
                                    // alignSelf:"right", 
                                    marginTop: 0, 
                                    borderColor: "red", 
                                    borderWidth: 2,
                                    position: "absolute",
                                    padding: 0,
                                    top: 0,
                                    right: -7,
                                    fontWeight: "bold"
                                }}
                                onPress={() => handleRemoveSingle(index)}
                            />
                            )}
                                <Button
                                    style={styles.prefillStyle}
                                    rippleColor="#4caf50"
                                    mode="outlined"
                                    buttonColor="teal"
                                    textColor="white"
                                    onPress={() => handlePrefill(index)}
                                >
                                    Use My Details
                                </Button>
                                <TextInput
                                    style={styles.inputStyle} 
                                    mode="outlined"
                                    label="Reciever Name"
                                    value={transData.recieverDetails[index]["recieverName"]}
                                    // value={inpName}
                                    onChangeText={(text) => handleTextChange(text, index, "recieverName")}
                                />
                                
                                    
                                {/* <TextInput
                                    style={styles.inputStyle} 
                                    mode="outlined"
                                    label="Reciever Location"
                                    value={transData.recieverLocation}
                                    onChangeText={transData.setRecieverLocation}
                                /> */}
                                <TextInput
                                    style={styles.inputStyle} 
                                    mode="outlined"
                                    label="Reciever Phone Number"
                                    value={transData.recieverDetails[index]["recieverPhoneNumber"]}
                                    keyboardType="numeric"
                                    onChangeText={(text) => handleTextChange(text, index, "recieverPhoneNumber")}
                                />
                                <View style={[styles.inputStyle, {flexDirection: "row", alignItems: "center"}]}>
                                    <Text variant="bodyLarge">Location</Text>
                                    <Checkbox status={transData.recieverDetails[index]["location"] ? "checked" : "unchecked"} />
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
                                        setCurrCount(index)
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
                                        setFinalRecieverLocation(pin)
                                        const partList = transData.recieverDetails
                                        const part = partList[index]
                                        part["location"] = pin
                                        partList[index] = part
                                        console.log(partList)
                                        transData.setRecieverDetails(partList)
                                        setInpName(pin.latitude.toString())
                                    }}
                                >
                                    Use Current Location
                                </Button>
                            </Card>
                        ))
                    }
                    </ScrollView>
                )}
                
                {/* <IconButton 
                    icon="plus"
                    rippleColor="#4caf50"
                    size={25}
                    iconColor="white"
                    // containerColor="#3f51b5"
                    containerColor="red"
                    style={styles.addBtnStyle}
                    onPress={() => alert("add new button clicked")}
                /> */}
                {transData.rideType === "Mass" && (
                    <FAB 
                        icon="plus"
                        style={styles.fab}
                        color="white"
                        // label="Add Another Reciever"
                        onPress={handleAddNew}
                    />
                )}
                <View style={{marginTop: 15, flexDirection: "row", justifyContent: "space-evenly"}}>
                    <Button
                        style={styles.nextBtnStyle}
                        icon="chevron-left"
                        rippleColor="#4caf50"
                        mode="contained"
                        buttonColor="cornflowerblue"
                        textColor="white"
                        onPress={() => navigation.navigate("Sender")}
                    >
                        Prev
                    </Button>
                    <Button
                        style={styles.nextBtnStyle}
                        icon="chevron-right"
                        rippleColor="#4caf50"
                        mode="contained"
                        buttonColor="cornflowerblue"
                        textColor="white"
                        contentStyle={{flexDirection: "row-reverse"}}
                        onPress={() => navigation.navigate("Product")}
                    >
                        Next
                    </Button>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
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
    inputStyle: {
        marginBottom: 5,
        width: "80%",
        marginLeft: "auto",
        marginRight: "auto"
    },
    nextBtnStyle: {
        borderRadius: 7,
        alignSelf: "right",
        width: "40%", 
        marginRight: "auto",
        marginLeft: "auto",
    },
    prefillStyle: {
        borderRadius: 7,
        marginBottom: 13,
        alignSelf: "right",
        width: "70%", 
        marginRight: 40,
        marginLeft: "auto",
        padding: 0,
    },
    addBtnStyle: {
        alignSelf:"center", 
        bottom: 15, 
        right: 7, 
        position: "absolute", 
        zIndex: 70,
        marginLeft: "auto",
        fontSize: 40,
        borderWidth: 4,
        borderColor: "red",
        fontWeight: "bold"
    },
    fab: {
        position: "absolute",
        // margin: 15,
        right: 20,
        bottom: 70,
        width: 60,
        height: 60,
        backgroundColor: "green",
        justifyContent: "center",
        alignItems: "center",
        // borderRadius: 35,
        zIndex: 40
    }
})