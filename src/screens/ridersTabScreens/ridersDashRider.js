import React, { useState, useEffect, useCallback } from 'react'
import { View, StyleSheet, Image, TouchableOpacity, FlatList, ScrollView, Alert, Pressable, Modal as Lmodal } from 'react-native'
import { Text, Button, Modal, PaperProvider, Portal, IconButton, TextInput } from 'react-native-paper'
import { useNavigation } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import jwtDecode from 'jwt-decode'
import { ActivityIndicator } from 'react-native-paper'
import { Entypo } from '@expo/vector-icons'
import { FontAwesome } from '@expo/vector-icons'
import { MaterialIcons } from '@expo/vector-icons'
import { MotiView, MotiText } from 'moti'
import * as ImagePicker from 'expo-image-picker'
import configs from '../../../config'
import { getStorage, ref, deleteObject } from 'firebase/storage'

export default function RidersDashRider() {
    const [usr, setUsr] = useState(null)
    const [loading, setLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [ plateNum, setplateNum ] = useState("")
    const [ riderName, setRiderName ] = useState("")
    const [ bikeColor, setBikeColor ] = useState("")
    const [ plateError, setPlateError ] = useState("")
    const [ nameError, setNameError ] = useState("")
    const [ colorError, setColorError ] = useState("")
    const [ showEnterModal, setShowEnterModal ] = useState(false)
    const [ showEditModal, setShowEditModal ] = useState(false)
    const [ editRider, setEditRider ] = useState({})
    const [ selectedRider, setSelectedRider ] = useState({})

    const [ eriderName, setEriderName ] = useState("")
    const [ eplateNum, setEplateNum ] = useState("")
    const [ ebikeColor, setEbikeColor ] = useState("")

    const [ image, setImage ] = useState(null)
    const [ uploading, setUploading ] = useState(false)
    const [ deleting, setDeleting ] = useState(false)
    const [ updating, setUpdating ] = useState(false)
    const [ imageUrl, setImageUrl ] = useState(null)

    const firebase = configs.firebase

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4,3],
            quality: 1
        })
        // console.log(result)
        if (!result.canceled){
            const imageUri = result.assets[0].uri
            // console.log(imageUri)
            const source = {uri: imageUri}
            console.log(source)
            setImage(source)
        }
    }

    const uploadImage = async () => {
        // https://firebasestorage.googleapis.com/v0/b/landport-3bc55.appspot.com/o/75bbe17e-0748-4cd1-a86d-d6eb57848d38.jpeg?alt=media&token=a13f1ad0-b16f-4da2-b20b-2e1ff882095d
        setUploading(true)
        const response = await fetch(image.uri)
        const blob = await response.blob()
        const filename = image.uri.substring(image.uri.lastIndexOf('/') + 1)
        let refe = await firebase.storage().ref().child(filename).put(blob)
        // let refe = await firebase.storage().refFromURL("https://firebasestorage.googleapis.com/v0/b/landport-3bc55.appspot.com/o/75bbe17e-0748-4cd1-a86d-d6eb57848d38.jpeg?alt=media&token=a13f1ad0-b16f-4da2-b20b-2e1ff882095d").put(blob)
        // console.log(ref)
        const urifirbase = await firebase.storage().ref(filename).getDownloadURL()
        setImageUrl(urifirbase)
        console.log(urifirbase)

        try{
            await refe
            console.log(refe)
        }
        catch(err){
            console.log(err)
        }
        setUploading(false)
        alert("Photo uploaded")
        setImage(null)
    }

    const handleFirebaseDelete = async () => {
        // https://firebasestorage.googleapis.com/v0/b/landport-3bc55.appspot.com/o/7c78f7d8-8538-4719-81b3-950b64fa18a6.jpeg?alt=media&token=1b7a4c28-4e95-4479-bbfa-df91e4871d4c
        const ref = firebase.storage().refFromURL("https://firebasestorage.googleapis.com/v0/b/landport-3bc55.appspot.com/o/7c78f7d8-8538-4719-81b3-950b64fa18a6.jpeg?alt=media&token=1b7a4c28-4e95-4479-bbfa-df91e4871d4c")
        await deleteObject(ref).then(() => {
            alert("image deleted from firebase")
        })
    }

    const navigation = useNavigation()

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

    const addRider = async () => {
        setUploading(true)
        // alert("Photo uploaded")
        
        if (plateNum.length === 0){
            // alert("The Plate Number cannot be blank")
            setPlateError("The Plate Number cannot be blank")
            if (riderName.length === 0){
                setNameError("The Rider Name cannot be blank")
            }
            if (bikeColor.length === 0){
                setColorError("The Rider Color cannot be blank")
            }
        }
        else if (plateNum.length !== 8){
            // alert("The Plate Number must 8 characters in length")
            setPlateError("The Plate Number must 8 characters in length")
            if (riderName.length === 0){
                setNameError("The Rider Name cannot be blank")
            }
            if (bikeColor.length === 0){
                setColorError("The Bike Color cannot be blank")
            }
        }
        else if (riderName.length === 0){
            setNameError("The Rider Name cannot be blank")
            if (bikeColor.length === 0){
                setColorError("The Bike Color cannot be blank")
            }
        }
        else if (bikeColor.length === 0){
            setColorError("The Bike Color cannot be blank")
        }
        else{

            let urifirbase = ""
            // console.log(image)
            // setUploading(false)

            if (image){
                const response = await fetch(image.uri)
                const blob = await response.blob()
                const filename = image.uri.substring(image.uri.lastIndexOf('/') + 1)
                let refe = await firebase.storage().ref().child(filename).put(blob)
                urifirbase = await firebase.storage().ref(filename).getDownloadURL()
                setImageUrl(urifirbase)
    
                try{
                    await refe
                    console.log(refe)
                }
                catch(err){
                    console.log(err)
                    alert("Check your network connection and try again")
                    return
                }
            }
            else{
                urifirbase = null
            }

            const data = await AsyncStorage.getItem("userToken")
            const decData = jwtDecode(data)
            await fetch(configs.backendUrl + "/users/add-rider/" + decData.id, {
                method: "PUT",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    plateNum: plateNum, 
                    riderName: riderName, 
                    bikeColor: bikeColor,
                    riderPic: urifirbase
                })
            })
            .then(resp => resp.json())
            .then(data => {
                // setUsr(data.usr)
                setplateNum("")
                setRiderName("")
                setBikeColor("")
                setUploading(false)
                setUsr(data.usr)
                setImage(null)
                setShowModal(false)
                alert(data.message)
            })
            .catch(error => {
                console.log(error)
                setplateNum("")
                setRiderName("")
                setUploading(false)
                setImage(null)
                setShowModal(false)
            })
        }

    }

    const handleEditRider = async () => {
        // alert("You tried to edit the rider")
        // alert("The rider name is " + riderName)
        setUpdating(true)
        // alert("Photo uploaded")
        
        if (plateNum.length === 0){
            // alert("The Plate Number cannot be blank")
            setPlateError("The Plate Number cannot be blank")
            if (riderName.length === 0){
                setNameError("The Rider Name cannot be blank")
            }
            if (bikeColor.length === 0){
                setColorError("The Rider Color cannot be blank")
            }
        }
        else if (plateNum.length !== 8){
            // alert("The Plate Number must 8 characters in length")
            setPlateError("The Plate Number must 8 characters in length")
            if (riderName.length === 0){
                setNameError("The Rider Name cannot be blank")
            }
            if (bikeColor.length === 0){
                setColorError("The Bike Color cannot be blank")
            }
        }
        else if (riderName.length === 0){
            setNameError("The Rider Name cannot be blank")
            if (bikeColor.length === 0){
                setColorError("The Bike Color cannot be blank")
            }
        }
        else if (bikeColor.length === 0){
            setColorError("The Bike Color cannot be blank")
        }
        else{
            // alert("the update form is valid")
            let urifirbase = editRider.imageUrl
            let refe = null
            if (image){
                const response = await fetch(image.uri)
                const blob = await response.blob()
                const filename = image.uri.substring(image.uri.lastIndexOf('/') + 1)
                refe = await firebase.storage().refFromURL(editRider.imageUrl).put(blob)
                urifirbase = await firebase.storage().refFromURL(editRider.imageUrl).getDownloadURL()
                console.log(urifirbase)
            }
            // setImageUrl(urifirbase)

            try{
                await refe
                console.log(refe)
            }
            catch(err){
                console.log(err)
                alert("Check your network connection and try again")
                return
            }

            const data = await AsyncStorage.getItem("userToken")
            const decData = jwtDecode(data)
            await fetch(configs.backendUrl + "/users/update-rider/" + decData.id + "/" + editRider._id, {
                method: "PUT",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    plateNum: plateNum, 
                    riderName: riderName, 
                    bikeColor: bikeColor,
                    riderPic: urifirbase
                })
            })
            .then(resp => resp.json())
            .then(data => {
                setUsr(data.usr)
                setUpdating(false)
                setImage(null)
                setplateNum("")
                setRiderName("")
                setShowEditModal(false)
                alert(data.message)
            })
            .catch(error => {
                console.log(error)
                setUpdating(false)
                setImage(null)
                setShowEditModal(false)
            })
        }
    }

    const toggleActive = async (riderId) => {
        const data = await AsyncStorage.getItem("userToken")
        const decData = jwtDecode(data)
        await fetch(configs.backendUrl + "/users/toggle-active/" + decData.id + "/"+ riderId, {
            method: "PUT",
            headers: {"Content-Type": "application/json"},
        })
        .then(resp => resp.json())
        .then(data => {
            setUsr(data.usr)
            // console.log(data.usr)
            // console.log("location successfully pinned")
            setSelectedRider({})
            setShowEnterModal(false)
            alert(data.message)
        })
        .catch(error => {
            console.log(error)
        })
    }

    const handleDelete = async (rider) => {
        setDeleting(true)
        const data = await AsyncStorage.getItem("userToken")
        const decData = jwtDecode(data)
        await fetch(configs.backendUrl + "/users/delete-rider/" + decData.id + "/"+ rider._id, {
            method: "DELETE",
            headers: {"Content-Type": "application/json"},
        })
        .then(resp => resp.json())
        .then(async (data) => {

            const ref = await firebase.storage().refFromURL(rider.imageUrl)
            await deleteObject(ref).then(() => {
                // alert("image deleted from firebase")
                setUsr(data.usr)
                setSelectedRider({})
                setShowEnterModal(false)
                // console.log(data.usr)
                // console.log("location successfully pinned")
                setDeleting(false)
                alert(data.message)
            })

        })
        .catch(error => {
            console.log(error)
        })
    }

    const handleRiderDelete = () => {
        Alert.alert("Delete Rider", "Are You sure you want to delete This Rider?", [
            {text: "Cancel"},
            {text: "Yes", onPress: () => handleDelete(selectedRider)}
        ])
    }

    const handleLong = (riderId) => {
        Alert.alert("What Do you want to do", "Are you sure you want to delete this", [
            {text: "Delete", onPress: () => handleDelete(riderId)},
            {text: "Cancel"},
        ])
    }

    const getAvailRiders = () => {
        let counter = 0
        for (let i=0; i<usr.riders.length; i++){
            if (usr.riders[i].available){
                counter++
            }
        }
        return counter
    }

    return ( 
        <View style = {styles.container}> 
        { loading ? ( 
            <View style = {{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "white"}} >
                <ActivityIndicator size="large" color="teal" animating={true}/> 
            </View>
                ) : ( 
                    <PaperProvider>
                        <View style={styles.contContainer} >

                            <Lmodal
                                visible={showEnterModal}
                                onDismiss={() => setShowEnterModal(false)}
                                animationType='slide'
                                // transparent={true}
                                onRequestClose={() => {
                                    // Alert.alert("Modal has been closed")
                                    setShowEnterModal(false)
                                    // setSelectedRider(null)
                                }}
                            >
                                <View
                                    style={{
                                        justifyContent: "center",
                                        alignItems: "center",
                                        flex: 1
                                    }}
                                >
                                    <IconButton 
                                        icon="close"
                                        rippleColor="#4caf50"
                                        size={30}
                                        iconColor="white"
                                        containerColor="red"
                                        style={{alignSelf:"center", marginTop: 0, position: "absolute", zIndex: 6, top: 20, right: 30, borderWidth: 2, borderColor: "teal"}}
                                        onPress={() => {
                                            setShowEnterModal(false)
                                            // setSelectedRider(null)
                                        }}
                                    />
                                    {/* <View style={{borderRadius: 50, borderColor: "red", borderWidth: 3}}> */}
                                        <Image 
                                            source = {selectedRider.imageUrl ? {uri: selectedRider.imageUrl} : require("../../assets/mark.jpg")}
                                            style = {styles.brandLogo}
                                            resizeMode = "cover" 
                                        />
                                    {/* </View> */}
                                    <View
                                        style={{
                                            flexDirection: "row",
                                            justifyContent: "space-evenly",
                                            marginLeft: 70,
                                            marginBottom: 8,
                                            // borderWidth: 2,
                                            width: "90%",
                                            borderRadius: 19
                                        }}
                                    >
                                        <Text variant='bodyLarge' style={{fontWeight: "bold", textAlign: "left", borderColor: "red", width: "50%"}}>Rider Name:</Text>
                                        <Text variant='bodyLarge' style={{fontWeight: "bold", textAlign: "left", borderColor: "red", width: "50%"}}>{selectedRider.riderName}</Text>
                                    </View>
                                    <View
                                        style={{
                                            flexDirection: "row",
                                            justifyContent: "space-evenly",
                                            marginLeft: 70,
                                            marginBottom: 8,
                                            // borderWidth: 2,
                                            width: "90%",
                                            borderRadius: 19
                                        }}
                                    >
                                        <Text variant='bodyLarge' style={{fontWeight: "bold", textAlign: "left", borderColor: "red", width: "50%"}}>Plate Number:</Text>
                                        <Text variant='bodyLarge' style={{fontWeight: "bold", textAlign: "left", borderColor: "red", width: "50%"}}>{selectedRider.plateNumber}</Text>
                                    </View>
                                    <View
                                        style={{
                                            flexDirection: "row",
                                            justifyContent: "space-evenly",
                                            marginLeft: 70,
                                            marginBottom: 8,
                                            // borderWidth: 2,
                                            width: "90%",
                                            borderRadius: 19
                                        }}
                                    >
                                        <Text variant='bodyLarge' style={{fontWeight: "bold", textAlign: "left", borderColor: "red", width: "50%"}}>Bike Color:</Text>
                                        <Text variant='bodyLarge' style={{fontWeight: "bold", textAlign: "left", borderColor: "red", width: "50%"}}>{selectedRider.bikeColor}</Text>
                                    </View>
                                    <View
                                        style={{
                                            flexDirection: "row",
                                            justifyContent: "space-evenly",
                                            marginLeft: 70,
                                            marginBottom: 8,
                                            // borderWidth: 2,
                                            width: "90%",
                                            borderRadius: 19
                                        }}
                                    >
                                        <Text variant='bodyLarge' style={{fontWeight: "bold", textAlign: "left", borderColor: "red", width: "50%"}}>Status:</Text>
                                        <Text variant='bodyLarge' style={{fontWeight: "bold", textAlign: "left", borderColor: "red", width: "50%"}}>{selectedRider.available ? "Available" : "Not Available"}</Text>
                                    </View>
                                    <View style={{
                                        flexDirection: "row",
                                        width: "100%",
                                        justifyContent: "space-evenly",
                                        marginTop: 30,
                                        }}
                                        >
                                        <Button
                                            style = {styles.addButton}
                                            rippleColor = "#4caf50"
                                            buttonColor = 'red'
                                            mode = "elevated"
                                            textColor = 'white'
                                            onPress = {handleRiderDelete}
                                            loading={deleting}
                                            disabled={deleting}
                                        >
                                            Delete
                                        </Button>
                                        <Button
                                            style = {styles.addButton}
                                            rippleColor = "#4caf50"
                                            buttonColor = 'teal'
                                            mode = "elevated"
                                            textColor = 'white'
                                            onPress = {() => toggleActive(selectedRider._id)}
                                        >
                                            {selectedRider.available ? "Make Unavailable" : "Make Available"}
                                        </Button>
                                    </View>
                                </View>
                            </Lmodal>

                            <Portal>
                                <Modal
                                    visible={showEditModal}
                                    onDismiss={() => setShowEditModal(false)}
                                    contentContainerStyle={{borderColor: "teal", borderWidth: 3, width: "90%", height: "90%", marginLeft: "auto", marginRight: "auto", backgroundColor: "white"}}
                                >
                                    <IconButton 
                                        icon="close"
                                        rippleColor="#4caf50"
                                        size={30}
                                        iconColor="white"
                                        containerColor="red"
                                        style={{alignSelf:"center", marginTop: 0, position: "absolute", top: 0, right: 0, borderWidth: 2, borderColor: "teal"}}
                                        onPress={() => {
                                            setEditRider({})
                                            setBikeColor("")
                                            setRiderName("")
                                            setplateNum("")
                                            setImage(null)
                                            setPlateError("")
                                            setNameError("")
                                            setColorError("")
                                            setShowEditModal(false)
                                        }}
                                    />
                                    <View>
                                        <Text 
                                            variant="bodyLarge" 
                                            style={{textAlign: "center", marginBottom: 30, fontWeight: "bold"}}
                                        >
                                            Edit Bike Information
                                        </Text>
                                        <TextInput
                                            style={styles.inputStyle} 
                                            mode="outlined"
                                            label="Enter Plate Number"
                                            value={plateNum}
                                            onChangeText={setplateNum}
                                            onFocus={() => setPlateError(false)}
                                        />
                                        <Text 
                                            variant="bodySmall" 
                                            style={{display: plateError ? "flex": "none",
                                            textAlign: "center", 
                                            color: "red"
                                            }}
                                            >
                                                {plateError}
                                        </Text>
                                        <TextInput
                                            style={styles.inputStyle} 
                                            mode="outlined"
                                            label="Enter Rider Name"
                                            value={riderName}
                                            onChangeText={setRiderName}
                                            onFocus={() => setNameError(false)}
                                        />
                                        <Text 
                                            variant="bodySmall" 
                                            style={{display: nameError ? "flex": "none",
                                            textAlign: "center", 
                                            color: "red"
                                            }}
                                            >
                                                {nameError}
                                        </Text>
                                        <TextInput
                                            style={styles.inputStyle} 
                                            mode="outlined"
                                            label="Enter Bike Color"
                                            value={editRider.bikeColor}
                                            onChangeText={setBikeColor}
                                            onFocus={() => setColorError(false)}
                                        />
                                        <Text 
                                            variant="bodySmall" 
                                            style={{display: colorError ? "flex": "none",
                                            textAlign: "center", 
                                            color: "red"
                                            }}
                                            >
                                                {colorError}
                                        </Text>

                                        <View style={{flexDirection: "row", justifyContent: "center", marginTop: 18}}>
                                            <Button 
                                                style = {[styles.mbstyle, {marginRight: 8, width: "50%"}]}
                                                rippleColor = "#4caf50"
                                                buttonColor = 'teal'
                                                mode = "elevated"
                                                textColor = 'white'
                                                onPress = {pickImage}
                                                icon="camera"
                                                >
                                                Pick Image
                                            </Button> 
                                            <Image 
                                                source={{uri: image ? image.uri : editRider.imageUrl ? editRider.imageUrl : null}}
                                                style={{
                                                    backgroundColor: "white", 
                                                    width: 40, 
                                                    height: 40,
                                                    borderRadius: 50
                                                }}
                                            />
                                        </View>
                                    </View>
                                    <MotiView
                                        style={{flexDirection: "row", justifyContent: "space-evenly", marginTop: 30}}
                                    >
                                        <Button 
                                            style = {styles.mbstyle}
                                            rippleColor = "#4caf50"
                                            buttonColor = 'red'
                                            mode = "elevated"
                                            textColor = 'white'
                                            disabled={uploading}
                                            onPress = {() => {
                                                setEditRider({})
                                                setBikeColor("")
                                                setRiderName("")
                                                setImage(null)
                                                setplateNum("")
                                                setPlateError("")
                                                setNameError("")
                                                setColorError("")
                                                setShowEditModal(false)
                                            }}
                                            >
                                            Cancel
                                        </Button> 
                                        <Button 
                                            style = {styles.mbstyle}
                                            rippleColor = "#4caf50"
                                            buttonColor = 'teal'
                                            mode = "elevated"
                                            textColor = 'white'
                                            onPress = {handleEditRider}
                                            disabled={uploading}
                                            loading={uploading}
                                            >
                                            Update
                                        </Button> 
                                    </MotiView>
                                </Modal>
                            </Portal>
                            <Portal>
                                <Modal
                                    visible={showModal}
                                    onDismiss={() => setShowModal(false)}
                                    contentContainerStyle={{borderColor: "teal", borderWidth: 3, width: "95%", height: "100%", marginLeft: "auto", marginRight: "auto", backgroundColor: "white"}}
                                >
                                    <IconButton 
                                        icon="close"
                                        rippleColor="#4caf50"
                                        size={30}
                                        iconColor="white"
                                        containerColor="red"
                                        style={{alignSelf:"center", marginTop: 0, position: "absolute", top: 0, right: 0, borderWidth: 2, borderColor: "teal"}}
                                        onPress={() => {
                                            setplateNum("")
                                            setRiderName("")
                                            setImage(null)
                                            setPlateError("")
                                            setNameError("")
                                            setColorError("")
                                            setShowModal(false)
                                        }}
                                    />
                                    <View>
                                        <Text 
                                            variant="bodyLarge" 
                                            style={{textAlign: "center", marginBottom: 30, fontWeight: "bold"}}
                                        >
                                            Enter Bike Information
                                        </Text>
                                        <TextInput
                                            style={styles.inputStyle} 
                                            mode="outlined"
                                            label="Enter Plate Number"
                                            value={plateNum}
                                            onChangeText={setplateNum}
                                            onFocus={() => setPlateError(false)}
                                        />
                                        <Text 
                                            variant="bodySmall" 
                                            style={{display: plateError ? "flex": "none",
                                            textAlign: "center", 
                                            color: "red"
                                            }}
                                            >
                                                {plateError}
                                        </Text>
                                        <TextInput
                                            style={styles.inputStyle} 
                                            mode="outlined"
                                            label="Enter Rider Name"
                                            value={riderName}
                                            onChangeText={setRiderName}
                                            onFocus={() => setNameError(false)}
                                        />
                                        <Text 
                                            variant="bodySmall" 
                                            style={{display: nameError ? "flex": "none",
                                            textAlign: "center", 
                                            color: "red"
                                            }}
                                            >
                                                {nameError}
                                        </Text>
                                        <TextInput
                                            style={styles.inputStyle} 
                                            mode="outlined"
                                            label="Enter Bike Color"
                                            value={bikeColor}
                                            onChangeText={setBikeColor}
                                            onFocus={() => setColorError(false)}
                                        />
                                        <Text 
                                            variant="bodySmall" 
                                            style={{display: colorError ? "flex": "none",
                                            textAlign: "center", 
                                            color: "red"
                                            }}
                                            >
                                                {colorError}
                                        </Text>

                                        {/* <TouchableOpacity onPress={pickImage}> 
                                            <Text>choose rider Image</Text>
                                        </TouchableOpacity> */}
                                        <View style={{flexDirection: "row", justifyContent: "center", marginTop: 18}}>
                                            <Button 
                                                style = {[styles.mbstyle, {marginRight: 8, width: "50%"}]}
                                                rippleColor = "#4caf50"
                                                buttonColor = 'teal'
                                                mode = "elevated"
                                                textColor = 'white'
                                                onPress = {pickImage}
                                                icon="camera"
                                                >
                                                Pick Image
                                            </Button> 
                                            {image && <Image 
                                                source={{uri: image.uri}}
                                                style={{
                                                    backgroundColor: "red", 
                                                    width: 40, 
                                                    height: 40,
                                                    borderRadius: 50
                                                }}
                                            />
                                            }
                                        </View>
                                        {/* <View>
                                            {image && <Image source={require(image.uri)}/>}
                                            <TouchableOpacity onPress={uploadImage}>
                                            <Text>Upload Image</Text>
                                            </TouchableOpacity>
                                        </View> */}

                                        {/* <Button
                                            style = {styles.addButton}
                                            rippleColor = "#4caf50"
                                            buttonColor = 'teal'
                                            mode = "elevated"
                                            textColor = 'white'
                                            onPress = {handleFirebaseDelete}
                                        >
                                            Firebase Delete
                                        </Button> */}

                                    </View>
                                    <MotiView
                                        style={{flexDirection: "row", justifyContent: "space-evenly", marginTop: 30}}
                                    >
                                        <Button 
                                            style = {styles.mbstyle}
                                            rippleColor = "#4caf50"
                                            buttonColor = 'red'
                                            mode = "elevated"
                                            textColor = 'white'
                                            disabled={uploading}
                                            onPress = {() => {
                                                setplateNum("")
                                                setRiderName("")
                                                setImage(null)
                                                setPlateError("")
                                                setNameError("")
                                                setColorError("")
                                                setShowModal(false)
                                            }}
                                            >
                                            Cancel
                                        </Button> 
                                        <Button 
                                            style = {styles.mbstyle}
                                            rippleColor = "#4caf50"
                                            buttonColor = 'teal'
                                            mode = "elevated"
                                            textColor = 'white'
                                            onPress = {addRider}
                                            loading={uploading}
                                            disabled={uploading}
                                            >
                                            Add
                                        </Button> 
                                    </MotiView>
                                </Modal>
                            </Portal>
                            <View>
                                {/* <Text variant="bodyLarge">Rider Information </Text> */}
                                {/* <MotiText
                                        from={{opacity: 0, scale: 0}}
                                        animate={{opacity: 1, scale: 1}}
                                        transition={{
                                            duration: 2000,
                                            type: "spring"
                                        }}
                                    >
                                        <Text>This is the riders modal</Text>
                                    </MotiText> */}
                                <Button 
                                style = {styles.addButton}
                                rippleColor = "#4caf50"
                                buttonColor = 'teal'
                                mode = "elevated"
                                textColor = 'white'
                                onPress = {() => setShowModal(true)}
                                >
                                Add Rider
                            </Button>
                            </View>
                            <MotiView 
                                style={{
                                    width: "100%", 
                                    marginTop: 10,
                                    marginBottom: 20, 
                                    flexDirection: "row", 
                                    justifyContent: "space-around",
                                    borderBottomWidth: 0.3,
                                    borderBottomColor: "black",
                                }}
                                from={{opacity: 0, scale: 0}}
                                animate={{opacity: 1, scale: 1}}
                                transition={{
                                    duration: 2000,
                                    type: "spring"
                                }}
                            >
                                <Text 
                                    variant="bodyLarge"
                                    style={{fontWeight: "bold"}}
                                >
                                    Total Riders: {usr.riders.length}
                                </Text>
                                <Text 
                                    variant="bodyLarge"
                                    style={{fontWeight: "bold"}}
                                >
                                    Available Riders: {getAvailRiders()} 
                                </Text>
                            </MotiView>
                            {/* <View style={styles.riderList}> */}
                                {/* <ScrollView>
                                    <View style={styles.riderList}>
                                        {usr.riders.map(rid => (
                                            <View key={rid._id} style={{width: "30%", marginBottom: 6}}>
                                                <TouchableOpacity 
                                                    // delayLongPress={3000} 
                                                    activeOpacity={0.6}
                                                    onLongPress={()=> handleLong(rid._id)} 
                                                    // onPressOut={()=> handleLong(rid._id)} 
                                                    onPress={ () => toggleActive(rid._id)}
                                                    // onPress={()=> alert("short pressed")}
                                                >
                                                    <MaterialIcons style={[styles.riderStyle, {backgroundColor: rid.available ? "white" : "red"}]} name='directions-bike' color="teal" size={55} />
                                                </TouchableOpacity>
                                            </View>
                                        ))}
                                    </View>
                                </ScrollView> */}
                                <FlatList 
                                    keyExtractor={(item) => item._id}
                                    data={usr.riders}
                                    renderItem={({item}) => (
                                        <TouchableOpacity
                                            onPress={() => {
                                                // alert("This is supposed to show the enter modal")
                                                // console.log(item.imageUrl)
                                                setSelectedRider(item)
                                                setShowEnterModal(true)
                                            }}
                                            activeOpacity={0.6}
                                            onLongPress={()=> {
                                                setShowEditModal(true)
                                                setEditRider(item)
                                                setBikeColor(item.bikeColor)
                                                setRiderName(item.riderName)
                                                setplateNum(item.plateNumber)
                                            }}
                                            // onLongPress={()=> alert("This is the long press")}
                                        >
                                            <View style={{
                                                flexDirection: "row", 
                                                justifyContent: "space-evenly", 
                                                alignItems: "center", 
                                                width: "90%",
                                                borderWidth: 0.8,
                                                borderColor: "black",
                                                borderBottomColor: "black",
                                                marginBottom: 5,
                                                borderBottomWidth: 2,
                                                paddingBottom: 5,
                                                borderRadius: 10
                                                }}
                                                >
                                                {/* <MaterialIcons name={item.available ? 'directions-bike' : "cancel"} color={item.available ? 'teal' : "red"} size={45} /> */}
                                                <Image 
                                                    source={item.imageUrl ? {uri: item.imageUrl} : require("../../assets/mark.jpg")}
                                                    style={{
                                                        backgroundColor: "white", 
                                                        width: 60, 
                                                        height: 60,
                                                        borderRadius: 50
                                                    }}
                                                />
                                                <View>
                                                    <Text variant="bodySmall"><Text style={{fontWeight: "bold"}}>Rider Name:</Text> {item.riderName}</Text>
                                                    <Text variant="bodySmall"><Text style={{fontWeight: "bold"}}>PlateNumber:</Text> {item.plateNumber}</Text>
                                                    <Text variant="bodySmall"><Text style={{fontWeight: "bold"}}>Bike Color:</Text> {item.bikeColor}</Text>
                                                    <Text variant="bodySmall"><Text style={{fontWeight: "bold"}}>Status:</Text> {item.available ? "Available" : "Not Available"}</Text>
                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                    )}
                                />
                        </View>

                    </PaperProvider>
            )
        } 
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // alignItems: "center",
        // paddingTop: 10
    },
    contContainer: {
        flex: 1,
        alignItems: "center",
        paddingTop: 10,
    },
    brandLogo: {
        height: 250,
        width: 250,
        marginTop: -90,
        marginBottom: 30,
        borderRadius: 280/2,
        borderColor: "teal",
        borderWidth: 3
    },
    riderStyle: {
        fontWeight: 'normal', 
        borderColor: "teal", 
        borderWidth: 3,
        borderRadius: 10,
        padding: 6
    },
    addButton: {
        // width: 100,
        // marginTop: 30
        padding: 0,
        borderRadius: 4
    },
    mbstyle: {
        width: 100,
        // marginTop: 30
        padding: 0,
        borderRadius: 4,
        alignSelf: "center",
    },
    riderList: {
        flex: 1,
        flexDirection: "row",
        width: "100%",
        justifyContent: "space-evenly",
        flexWrap: "wrap", 
        flex: 1, 
        // borderWidth: 4, 
        // borderColor: "red",
        paddingVertical: 4,
        paddingHorizontal: 12,
    },
    inputStyle: {
        marginBottom: 5,
        width: "80%",
        marginLeft: "auto",
        marginRight: "auto"
    },
})