import React, { useState, useEffect } from 'react'
import { View, StyleSheet, FlatList, TouchableOpacity, Dimensions, Modal } from 'react-native'
import { Portal, PaperProvider, ActivityIndicator, Text, Button, TextInput, IconButton, MD3Colors } from 'react-native-paper'
import moment from 'moment'
import MapView, {Marker, Callout} from 'react-native-maps'
import AsyncStorage from '@react-native-async-storage/async-storage'
import jwtDecode from 'jwt-decode'
import { Entypo } from '@expo/vector-icons'
import * as Location from 'expo-location'
import { useNavigation } from '@react-navigation/native'
import { Card } from 'react-native-shadow-cards'
import configs from '../../../config'

export default function DashboardHomeRoute(){
    // console.log(customer)

    // const pinCoords = {
    //     latitude: 37.78825,
    //     longitude: -122.4324,
    // }
    const navigation = useNavigation()
    const [ usr, setUsr] = useState(null)
    const [ pin, setPin ] = useState({})
    const [ userLocation , setUserLocation ] = useState(null)
    const [ finalUserLocation , setFinalUserLocation ] = useState(null)
    const [ finalReceiverLocation , setFinalReceiverLocation ] = useState(null)
    const [ mapRegion, setMapRegion ] = useState({})
    const [ user, setUser ] = useState(null)
    const [ loading, setLoading ] = useState(true)
    const [ buttonLoading, setButtonLoading ] = useState(false)
    const [ visible, setVisible ] = useState(false)
    const [ selectedForm, setSelectedForm ] = useState(0)
    const [ senderName, setSenderName ] = useState("")
    const [ senderLocation, setSenderLocation ] = useState("")
    const [ senderPhoneNumber, setSenderPhoneNumber ] = useState("")
    const [ recieverName, setRecieverName ] = useState("")
    const [ recieverLocation, setRecieverLocation ] = useState("")
    const [ recieverPhoneNumber, setRecieverPhoneNumber ] = useState("")
    const [ productName, setProductName ] = useState("")
    const [ productQuantity, setProductQuantity ] = useState("")
    const [ productImage, setProductImage ] = useState("")
    const [ request, setRequest ] = useState({})
    const [ showTransDetail, setShowTransDetail ] = useState(false)
    const [ selectedTrans, setSelectedTrans ] = useState({})
    const [ modalVisible, setModalVisible ] = useState(false)
    const [ isMapReady, setIsMapReady ] = useState(false)
    const [ locationAccess, setLocationAccess ] = useState(false)
    const [ showRecvMapModal, setShowRecvMapModal ] = useState(false)
    const [ showSendMapModal, setShowSendMapModal ] = useState(false)

    const [ showRCM, setShowRCM] = useState(false)
    const [ showSCM, setShowSCM] = useState(false)

    const [ mfvisible, setMfvisible ] = useState(false)
    const [ userLocChosen, setUserLocChosen ] = useState(false)
    const [ showStart, setShowStart ] = useState(true)

    const initialRegion = {
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421
    }

    useEffect(() => {
        const fetchData = async () => {
            // await AsyncStorage.removeItem("userToken")
            // navigation.navigate("Home")
            const { status } = await Location.requestForegroundPermissionsAsync()
            if ( status !== "granted"){
                setLocationAccess(false)
                console.log("location not granted. Please enable your location in your settings")
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
                setUserLocation({latitude: currLocation.coords.latitude, longitude: currLocation.coords.longitude})
                setPin({latitude: currLocation.coords.latitude, longitude: currLocation.coords.longitude})
                // console.log(currLocation)
                // setLoading(false)
            // }
    //         const data = await AsyncStorage.getItem("userToken")
    //         try{
    //             const decData = jwtDecode(data)
    //             await fetch("http://192.168.43.75:3000/users/" + decData.id)
    //             .then(resp => resp.json())
    //             .then(data => {
    //                 setUser(data.user)
    //                 setLoading(false)
    //             })
    //             .catch(error => {
    //                 console.log(error)
    //             })
    //         }
    //         catch(error){
    //             console.log("something went wrong")
            }

            const data = await AsyncStorage.getItem("userToken")
            // console.log(data)
            try{
                const decData = jwtDecode(data)
                await fetch(configs.backendUrl + "/users/" + decData.id)
                .then(resp => resp.json())
                .then(data => {
                    setUsr(data.user)
                    console.log("i am supposed to get the user")
                    // console.log(data.user)
                    setLoading(false)
                })
                .catch(error => {
                    console.log(error)
                })
            }
            catch(error){
                console.log("something went wrong")
            }

        }
        fetchData()

    }, [])


    const calculateDistance = (userCoords, recvCoords) => {
        const toRadian = n => (n * Math.PI) / 180
        const R = 6371
        const lat2 = recvCoords.latitude
        const lon2 = recvCoords.longitude
        const lat1 = userCoords.latitude
        const lon1 = userCoords.longitude
        const x1 = lat2 - lat1
        const dLat = toRadian(x1)
        const x2 = lon2 - lon1
        const dLon = toRadian(x2)
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(toRadian(lat1)) * Math.cos(toRadian(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
        const d = R * c
        return d
    }

    const handleAnotherRequest = async () => {
        console.log("we are here")
        // console.log(userLocation)
        // console.log(pin)
        let distance = null
        if (!finalUserLocation){
            distance = calculateDistance(userLocation, finalReceiverLocation)
        }
        else{
            distance = calculateDistance(finalUserLocation, finalReceiverLocation)
        }
        setPin(userLocation)

        const price = distance * 500
        console.log(`The distance is ${distance.toFixed(2)} km`)
        console.log(`The Price is #${price.toFixed()}`)

        setVisible(false)
        setSelectedForm(0)
    }

    const handleMakeRequest = async () => {
        console.log("this is the make request function")
        let distance = null
        let senderLocation = null
        let recieverLocation = null
        if (!finalUserLocation){
            distance = calculateDistance(userLocation, finalReceiverLocation)
            senderLocation = userLocation
            recieverLocation = finalReceiverLocation
        }
        else{
            distance = calculateDistance(finalUserLocation, finalReceiverLocation)
            senderLocation = finalUserLocation
            recieverLocation = finalReceiverLocation
        }

        const price = distance * 500

        await fetch(configs.backendUrl + "/transactions/" + usr._id + "/make-request", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                senderName: usr.name,
                senderLocation: senderLocation,
                senderPhoneNumber: usr.phoneNumber,
                receiverName: recieverName,
                receiverLocation: recieverLocation,
                receiverPhoneNumber: recieverPhoneNumber,
                productName: productName,
                productQuantity: productQuantity,
                productImage: productImage
            })
        })
        .then(resp => resp.json())
        .then(data => {
            // console.log(data.request)
            alert(data.message)
            setUsr(data.usr)
            // setVisible(false)
            setMfvisible(false)
            setPin(userLocation)
            setSelectedForm(0)
            
        })
        .catch(error => alert(error))
    }
    const goForward = () => {
        if(selectedForm > 1)
        {
            setSelectedForm(0)
        }
        else{
            const newPart = selectedForm + 1
            setSelectedForm(newPart)
        }
    }
    const goBackward = () => {
        if(selectedForm < 1)
        {
            setSelectedForm(2)
        }
        else{
            const newPart = selectedForm - 1
            setSelectedForm(newPart)
        }
    }
    const handleDismiss = () => {
        setSelectedForm(0)
        setVisible(false)
    }
    const handleTransDetails = (trans) => {
        setSelectedTrans(trans)
        setShowTransDetail(true)
    }
    const handleTransDetailClose = () => {
        setSelectedTrans({})
        setShowTransDetail(false)
    }
    const onMapLayout = () => {
        setIsMapReady(true)
    }
    const handleModalClose = () => {
        // setVisible(false)
        setMfvisible(false)
        setSelectedForm(0)
    }

    const timehours = 1000 * 60 * 60 * 2

    const handleConfirmButton = async (selTrans) => {
        // alert("Transaction completed successfully")
        await fetch(configs.backendUrl + "/transactions/" + usr._id + "/cust-confirm/" + selTrans._id, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
        })
        .then(resp => resp.json())
        .then(data => {
            // console.log(data.transaction)
            alert("Transaction completed successfully")
            // console.log(data)
            setUsr(data.user)
            setShowTransDetail(false)
            setTimeout(() => {
                const delRequest = async () => {
                    await fetch(configs.backendUrl + "/transactions/" + usr._id + "/delete-transaction/" + selTrans._id, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    })
                    .then(resp => resp.json())
                    .then(data => {
                        // console.log(data.transaction)
                        alert("deleted successfully")
                        setUsr(data.user)
                    })
                }

                delRequest()
            }, 1000 * 10)
        })
        .catch(error => alert(error))
    }
    return(
        <PaperProvider>
            {showTransDetail && (
                <View style={styles.transModal}>
                    <IconButton 
                        icon="close"
                        rippleColor="#4caf50"
                        size={30}
                        iconColor="red"
                        // containerColor="red"
                        style={{alignSelf:"center", marginTop: 15, fontWeight: "bold", borderColor: "red", borderWidth: 4}}
                        onPress={handleTransDetailClose}
                    />
                    <View>
                        <Text variant="headlineLarge" style={{textAlign: "center", marginVertical: 10, borderColor: "teal", borderWidth: 2, color: "teal"}}>{selectedTrans.refNumber}</Text>
                        <Text variant="bodyLarge" style={{fontWeight: "bold", textAlign: "center", marginBottom: 10, color: "teal"}}>Date: {moment(selectedTrans.dateCreated).calendar()} ({moment(selectedTrans.dateCreated).fromNow()})</Text>
                        <Text variant="bodyLarge" style={{fontWeight: "bold", textAlign: "center", marginBottom: 10, color: "teal"}}>Completed: {selectedTrans.completed ? "True" : "False"} </Text>
                        <Text variant="bodyLarge" style={{fontWeight: "bold", textAlign: "center", marginBottom: 10, color: "teal"}}>Distance: {selectedTrans.distance.toFixed(2)}KM</Text>
                        <Text variant="bodyLarge" style={{fontWeight: "bold", textAlign: "center", marginBottom: 10, color: "teal"}}>Transaction Cost: #{selectedTrans.transactionCost}</Text>
                        <Text variant="bodyLarge" style={{fontWeight: "bold", textAlign: "center", marginBottom: 10, color: "teal"}}>Sender: {selectedTrans.customer.name} (0{selectedTrans.customer.phoneNumber})</Text>
                        <Text variant="bodyLarge" style={{fontWeight: "bold", textAlign: "center", marginBottom: 10, color: "teal"}}>Reciever: {selectedTrans.request.recipient.name} (0{selectedTrans.request.recipient.phoneNumber})</Text>
                        <Text variant="bodyLarge" style={{fontWeight: "bold", textAlign: "center", marginBottom: 10, color: "teal"}}>Rider's Company: {selectedTrans.riderCompany.name}</Text>
                        
                    </View>
                    <View style={{marginTop: 30}}>
                        <Button 
                            style={styles.confirmButton}
                            mode="contained"
                            rippleColor="#4caf50"
                            icon="check"
                            buttonColor="teal"
                            textColor="white"
                            onPress={() => handleConfirmButton(selectedTrans)}
                            // disabled={selectedTrans ? true : false}
                        >
                            Confirm
                        </Button>
                    </View>
                </View>
            )}
            <Modal 
                visible={showRCM}
                style={{flex: 1}}
            >
                {!loading && (
                    <View style={{flex: 1}}>
                        <IconButton 
                            icon="close"
                            rippleColor="#4caf50"
                            size={25}
                            iconColor="white"
                            containerColor="red"
                            style={{alignSelf:"center", top: 5, right: 7, position: "absolute", zIndex: 70}}
                            onPress={() => {
                                // setShowSendMapModal(false)
                                // setVisible(true)
                                // setSelectedForm(0)
                                setShowRCM(false)
                            }}
                        />
                        <IconButton 
                            icon="check-bold"
                            rippleColor="#4caf50"
                            size={25}
                            iconColor="white"
                            containerColor="#3f51b5"
                            style={{alignSelf:"center", bottom: 15, right: 7, position: "absolute", zIndex: 70}}
                            onPress={() => {
                                setFinalReceiverLocation(pin)
                                // setShowSendMapModal(false)
                                // setVisible(true)
                                setShowRCM(false)
                                setSelectedForm(2)
                            }}
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
            </Modal> 
            <Modal 
                visible={showSCM}
                style={{flex: 1}}
            >
                {!loading && (
                    <View style={{flex: 1}}>
                        <IconButton 
                            icon="close"
                            rippleColor="#4caf50"
                            size={25}
                            iconColor="white"
                            containerColor="red"
                            style={{alignSelf:"center", top: 5, right: 7, position: "absolute", zIndex: 70}}
                            onPress={() => {
                                // setShowSendMapModal(false)
                                // setVisible(true)
                                // setSelectedForm(0)
                                setShowSCM(false)
                            }}
                        />
                        <IconButton 
                            icon="check-bold"
                            rippleColor="#4caf50"
                            size={25}
                            iconColor="white"
                            containerColor="#3f51b5"
                            style={{alignSelf:"center", bottom: 15, right: 7, position: "absolute", zIndex: 70}}
                            onPress={() => {
                                setFinalUserLocation(pin)
                                // setShowSendMapModal(false)
                                // setVisible(true)
                                setShowSCM(false)
                                setSelectedForm(1)
                            }}
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
            </Modal> 
            {/* <View style={[styles.container, {justifyContent: loading ? "center" : "flex-start"}]}>
                    {loading ? (
                        <View>
                            <ActivityIndicator size="large" color="white" />
                        </View>
                    ): ( */}
                        <View style={styles.showCont}>
                            <Portal>
                                {/* {visible && ( */}
                                    <Modal 
                                        visible={mfvisible} 
                                        // onDismiss={handleDismiss}
                                        // dismissableBackButton={true}
                                        // style={styles.modalStyles}
                                        // style={styles.transFormModal}
                                    >
                                        <View style={{justifyContent: "center", alignItems: "center", flex: 1}}>
                                            <IconButton 
                                                icon="close"
                                                rippleColor="#4caf50"
                                                size={30}
                                                iconColor="white"
                                                containerColor="red"
                                                style={{alignSelf:"center", top: 5, right: 7, position: "absolute", zIndex: 70}}
                                                onPress={handleModalClose}
                                            />
                                            <View style={{display: selectedForm === 0 ? "flex" : "none", width: "100%"}}>
                                            {/* <Text variant="bodyLarge" style={{textAlign: "center", marginTop: 10}}>Select Receiver's Location</Text> */}
                                            <Text variant="headlineSmall" style={{textAlign: "center", color: "teal", fontWeight: "bold", marginBottom: 10, position: "absolute", width: "100%", top: -135}}>Enter your(sender) Details</Text>
                                                <TextInput
                                                    style={styles.inputStyle} 
                                                    mode="outlined"
                                                    label="Sender Name"
                                                    value={senderName}
                                                    onChangeText={setSenderName}
                                                />
                                                <TextInput
                                                    style={styles.inputStyle} 
                                                    mode="outlined"
                                                    label="Sender Location"
                                                    value={senderLocation}
                                                    onChangeText={setSenderLocation}
                                                />
                                                <TextInput
                                                    style={styles.inputStyle} 
                                                    mode="outlined"
                                                    label="Sender Phone Number"
                                                    value={senderPhoneNumber}
                                                    keyboardType="numeric"
                                                    onChangeText={setSenderPhoneNumber}
                                                />
                                                <Button
                                                    style={styles.recvLocation}
                                                    rippleColor="#4caf50"
                                                    mode="contained"
                                                    buttonColor="black"
                                                    textColor="white"
                                                    onPress={() => {
                                                        // setShowSendMapModal(true) 
                                                        // setVisible(false)
                                                        setShowSCM(true)
                                                    }}
                                                >
                                                    Choose a New Location
                                                </Button>
                                                <Button
                                                    style={styles.recvLocation}
                                                    rippleColor="#4caf50"
                                                    mode="contained"
                                                    buttonColor="black"
                                                    textColor="white"
                                                    onPress={() => {
                                                        setFinalUserLocation(pin)
                                                        setSelectedForm(1)
                                                    }}
                                                >
                                                    Use Current Location
                                                </Button>
                                            </View>
                                            <View style={{display: selectedForm === 1 ? "flex" : "none", width: "100%"}}>
                                                <Text variant="headlineSmall" style={{textAlign: "center", color: "teal", fontWeight: "bold", marginBottom: 10, position: "absolute", width: "100%", top: -135}}>Enter receiver Details</Text>
                                                <TextInput
                                                    style={styles.inputStyle} 
                                                    mode="outlined"
                                                    label="Reciever Name"
                                                    value={recieverName}
                                                    onChangeText={setRecieverName}
                                                />
                                                <TextInput
                                                    style={styles.inputStyle} 
                                                    mode="outlined"
                                                    label="Reciever Location"
                                                    value={recieverLocation}
                                                    onChangeText={setRecieverLocation}
                                                />
                                                <TextInput
                                                    style={styles.inputStyle} 
                                                    mode="outlined"
                                                    label="Reciever Phone Number"
                                                    value={recieverPhoneNumber}
                                                    keyboardType="numeric"
                                                    onChangeText={setRecieverPhoneNumber}
                                                />
                                                <Button
                                                    style={styles.recvLocation}
                                                    rippleColor="#4caf50"
                                                    mode="contained"
                                                    buttonColor="black"
                                                    textColor="white"
                                                    onPress={() => {
                                                        // setShowRecvMapModal(true); setVisible(false)
                                                        setShowRCM(true)
                                                    }}
                                                >
                                                    Choose Receiver Location
                                                </Button>

                                            </View>
                                            <View style={{display: selectedForm === 2 ? "flex" : "none", paddingTop: 20, width: "100%"}}>
                                                <Text variant="headlineSmall" style={{textAlign: "center", color: "teal", fontWeight: "bold", marginBottom: 10, position: "absolute", top: -135, width: "100%"}}>Enter Product Details</Text>
                                                <TextInput
                                                    style={styles.inputStyle} 
                                                    mode="outlined"
                                                    label="Product Name"
                                                    value={productName}
                                                    onChangeText={setProductName}
                                                />
                                                <TextInput
                                                    style={styles.inputStyle} 
                                                    mode="outlined"
                                                    label="Product Quantity"
                                                    value={productQuantity}
                                                    onChangeText={setProductQuantity}
                                                />
                                                <TextInput
                                                    style={styles.inputStyle} 
                                                    mode="outlined"
                                                    label="Product Image"
                                                    value={productImage}
                                                    onChangeText={setProductImage}
                                                />
                                                <Button
                                                    style={styles.mfinal}
                                                    rippleColor="#4caf50"
                                                    mode="contained"
                                                    buttonColor="black"
                                                    textColor="white"
                                                    loading={loading}
                                                    onPress={handleMakeRequest}
                                                >
                                                    make request
                                                </Button>
                                            </View>
                                            <View style={styles.navButtons}>
                                                <IconButton
                                                    rippleColor="#4caf50"
                                                    icon="arrow-left-bold"
                                                    size={50}
                                                    iconColor="teal"
                                                    containerColor="white"
                                                    onPress={goBackward}                                      
                                                />
                                                <IconButton
                                                    rippleColor="#4caf50"
                                                    icon="arrow-right-bold"
                                                    size={50}
                                                    iconColor="teal"
                                                    containerColor="white"
                                                    onPress={goForward}                                      
                                                />
                                            </View>
                                        </View>
                                    </Modal>
                            </Portal>
                            {/* <Modal visible={true}> */}
                                {loading ? (
                                    <View style={{flex: 1, alignItems: "center", justifyContent: "center"}}>
                                        <ActivityIndicator size="large" color="teal" animating={true} />
                                    </View>
                                ): (
                                <View style={styles.showCont}>
                                    <View style={styles.linkView}>
                                        <Text variant="headlineMedium" style={styles.header}>Welcome {usr && usr.name}</Text>
                                    </View>
                                    <Button
                                        textColor="white"
                                        buttonColor="teal"
                                        mode="contained"
                                        rippleColor="#4caf50"
                                        style={styles.mrButton}
                                        onPress={() => setMfvisible(true)}
                                    >
                                        make request
                                    </Button>
                                    <View style={{flex: 1}}>
                                        <Text variant="headlineMedium" style={{textAlign: "center", color: "teal"}}>Recent Links</Text>
                                        <FlatList 
                                            keyExtractor={(item) => item._id}
                                            data={usr.transactions}
                                            renderItem={({item}) => (
                                            
                                                <Card style={styles.cardStyle}>
                                                    <TouchableOpacity onPress={() => handleTransDetails(item)}>
                                                            <Text variant="bodyLarge" style={styles.linkListText}>{item.refNumber} {item.customerConfirm ? <Entypo name="check" size={23}/> : <Entypo name="cog" size={19}/>}</Text>
                                                    </TouchableOpacity>
                                                </Card>

                                            )}
                                        />
                                    </View>
                                </View>
                                )} 
                            {/* </Modal> */}
                            

                        {/* </View>   */}
                    {/* )} */}
                </View>
            
            </PaperProvider>

    )
}

// style={{position: "absolute", top: 200, width: "100%"}}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
        alignItems: "center",
        paddingTop: 30
    },
    showCont: {
        flex: 1,
        alignItems: "center"
    },
    header: {
        // textAlign: "center",
        fontWeight: "bold",
        color: "teal",
    },
    modalStyles: {
        backgroundColor: "white", 
        height: 400, 
        width: "70%", 
        marginLeft: "15%", 
        justifyContent: "flex-start"
    },
    mrButton: {
        // width: 150,
        // paddingVertical: 0,
        // paddingHorizontal: 0,
        // position: "absolute",
        // top: 140,
        marginVertical: 40
    },
    inputStyle: {
        marginBottom: 5,
        width: "80%",
        marginLeft: "auto",
        marginRight: "auto"
    },
    navButtons: {
        flexDirection: "row",
        justifyContent: "space-around",
        position: "absolute",
        bottom: 19,
        // borderWidth: 3,
        // borderColor: "teal",
        width: "100%",
    },
    mfinal: {
        borderRadius: 3,
        marginTop: 13,
        width: "70%",
        marginRight: "auto",
        marginLeft: "auto",
    },
    recvLocation: {
        borderRadius: 3,
        marginTop: 13,
        width: "70%",
        marginRight: "auto",
        marginLeft: "auto",
    },
    requestStyle: {
        // flexDirection: "row"
    },
    transModal: {
        position: "absolute",
        top: "0%",
        width: "100%",
        height: "100%",
        backgroundColor: "white",
        zIndex: 30,
    },
    transFormModal: {
        position: "absolute",
        top: "0%",
        width: "100%",
        height: "100%",
        backgroundColor: "white",
        zIndex: 30,
        paddingTop: "10%"
    },
    mapModal: {
        position: "absolute",
        // flex: 1,
        top: "0%",
        width: "100%",
        height: "100%",
        backgroundColor: "white",
        zIndex: 130,
    },
    map: {
        width: Dimensions.get("window").width,
        height: Dimensions.get("window").height
    },
    confirmButton: {
        width: "40%",
        borderRadus: 90,
        marginRight: "auto",
        marginLeft: "auto"
    },
    linkStyle: {
        textAlign: "center", 
        borderColor: "white", 
        borderWidth: 1, 
        marginBottom:3, 
        borderRadius: 15,
        paddingVertical: 6,
        backgroundColor: "white",
        // shadowColor: "black",
        // shadowOffset: {width: 5, height: 15},
        // elevation: 3,
        // shadowOpacity: 3,
        // shadowRadius: 4
    },
    linkView: {
        marginHorizontal: 30,
        // borderColor: "black",
        // borderWidth: 1,
        borderRadius: 5,
        backgroundColor: "white",
        shadowColor: "black",
        shadowOffset: {width: 5, height: 3},
        shadowOpacity: 1,
        shadowRadius: 5,
        paddingHorizontal: 8,
        paddingVertical: 5,
    },
    linkListStyle: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center", 
        fontSize: 19, 
        width: "70%", 
        marginLeft: "auto", 
        marginRight: "auto", 
        borderColor: "teal", 
        borderWidth: 4,
        borderColor: "teal",
        borderRadius: 15,
        backgroundColor: "black",
        paddingVertical: 3
    },
    cardStyle: {
        padding: 10, 
        margin: 10, 
        elevation: 7, 
        // backgroundColor: "teal", 
        cornerRadius: 30,
        // width: "90%",
        marginLeft: "auto",
        marginRight: "auto",
    },
    linkListText: {
        color: "black",
        textAlign: "center"
    }
})