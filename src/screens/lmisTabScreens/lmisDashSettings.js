import React, { useEffect, useState } from 'react'
import { View, StyleSheet, Dimensions, ImageBackground } from 'react-native'
import { TextInput, Text, Button } from 'react-native-paper'
import MapView, {Marker, Callout} from 'react-native-maps'
import { useNavigation } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import jwtDecode from 'jwt-decode'
import { ActivityIndicator } from 'react-native-paper'
import configs from '../../../config'

export default function LmisDashSettings(){

    const [ usr, setUsr ] = useState(null)
    const [ name, setName ] = useState("")
    const [ email, setEmail ] = useState("")
    const [ location, setLocation ] = useState("")
    const [ phoneNumber, setPhoneNumber ] = useState("")
    const [ loading, setLoading ] = useState(true)
    const [ updateLoading, setUpdateLoading ] = useState(false)
    // const [ refresh, setRefresh ] = useState(false)

    useEffect(() => {
        const fetchData = async () => {
            const data = await AsyncStorage.getItem("userToken")
            // console.log(data)
            try{
                const decData = jwtDecode(data)
                await fetch(configs.backendUrl + "/users/" + decData.id)
                .then(resp => resp.json())
                .then(data => {
                    setUsr(data.user)
                    // console.log(data.user)
                    setName(data.user.name)
                    setEmail(data.user.email)
                    setLocation(data.user.location)
                    setPhoneNumber("0" + String(data.user.phoneNumber))
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

    const navigation = useNavigation()
    const handleUpdate = async () => {
        setUpdateLoading(true)
        await fetch(configs.backendUrl + "/users/update/" + usr._id, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: name,
                email: email,
                location: location,
                phoneNumber: phoneNumber
            })
        })
        .then(resp => resp.json())
        .then( async (data) => {
            console.log(data.user.name)
            setName(data.user.name)
            setEmail(data.user.email)
            setLocation(data.user.location)
            setPhoneNumber("0" + String(data.user.phoneNumber))
            alert("successfully updated your profile")
            // const data = await AsyncStorage.getItem("userToken")
            // console.log("This is the update func")
            // console.log(data)
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
        })
        .catch(error => {
            alert(error)
        })
        
        setUpdateLoading(false)
    }
    return(
        <View style={styles.container}>
            <ImageBackground source={require("../../assets/istockphoto2.jpg")} resizeMode="cover" style={styles.backImage}>
            {loading ? (
                <View style={{flex: 1, justifyContent: "center", alignItems:"center"}}>
                    <ActivityIndicator size="large" color="teal" animating={true} />
                </View>
            ): (
                <View style={{width: "100%"}}> 
                    <Text variant="headlineSmall" style={styles.headText}>Edit Settings</Text>
                    <View style={styles.inputBoxStyle}>
                        <Text variant="titleLarge">Name</Text>
                        <TextInput
                            style={styles.inputStyle}
                            // label="Name"
                            mode="outlined"
                            value={name}
                            onChangeText={setName}
                            // onFocus={() => setNameError(null)}
                        />
                        <Text variant="titleLarge">Email</Text>
                        <TextInput
                            style={styles.inputStyle}
                            // label="Email"
                            mode="outlined"
                            value={email}
                            onChangeText={setEmail}
                            // onFocus={() => setNameError(null)}
                        />
                        <Text variant="titleLarge">Location</Text>
                        <TextInput
                            style={styles.inputStyle}
                            // label="Location"
                            mode="outlined"
                            value={location}
                            onChangeText={setLocation}
                            // onFocus={() => setNameError(null)}
                        />
                        <Text variant="titleLarge">Phone Number</Text>
                        <TextInput
                            style={styles.inputStyle}
                            // label="Phone Number"
                            mode="outlined"
                            value={phoneNumber}
                            onChangeText={setPhoneNumber}
                            // onFocus={() => setNameError(null)}
                        />
                    </View>
                    <Button
                        style={styles.updateBtn}
                        rippleColor="#4caf50"
                        buttonColor='teal'
                        mode="elevated"
                        textColor='white'
                        loading={updateLoading}
                        onPress={handleUpdate}
                    >
                        Update
                    </Button>
                </View>
            )}
            </ImageBackground>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    backImage: {
        flex: 1,
        justifyContent: "center",
        // backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
    headText: {
        textAlign: "center", 
        marginBottom: 10,
        color: "teal",
        fontWeight: "bold"
    },
    map: {
        width: Dimensions.get("window").width,
        height: Dimensions.get("window").height
    },
    inputBoxStyle: {
        marginLeft: "auto",
        marginRight: "auto", 
        width: "80%"
    },
    inputStyle: {
        // borderWidth: 1,
        // borderColor: 'black'
        fontSize: 16,
        width: "100%",
        height: 30,
        padding: 10,
        backgroundColor: 'white',
        marginBottom: 5,
        marginLeft: "auto",
        marginRight: "auto"
    },
    updateBtn: {
        marginTop: 12,
        width: "30%",
        marginLeft: "auto",
        marginRight: "auto",
    }
})