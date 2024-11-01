import React, { useContext, useState } from 'react'
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, SafeAreaView, TouchableOpacity, Image } from 'react-native';
import { Text, Button, TextInput } from 'react-native-paper'
// import { useNavigation } from '@react-navigation/native'
import Ionicons from '@expo/vector-icons/Ionicons'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwtDecode from 'jwt-decode';
import { TransContext } from '../../../../transactionContext';
import configs from '../../../../config'


export default function ProductDetail({navigation}){

    const transData = useContext(TransContext)
    const [ requestOngoing, setRequestOngoing ] = useState(false)

    const handlePress = () => {
        // alert("button was pressed")
        // navigation.jumpTo("CustomerDashboard", { name: "Home"})
        navigation.navigate("Home")
    }
    const isRecieverValid = (recdets) => {
        let valid = true
        for (let i=0; i<recdets.length; i++){
            if (!recdets[i].recieverName){
                valid = false
                break
            }
            else if (!recdets[i].recieverPhoneNumber){
                valid = false
                break
            }
            else if (!recdets[i].location){
                valid = false
                break
            }

        }
        return valid
    }

    const handleMakeRequest = async () => {
        setRequestOngoing(true)
        console.log(transData.senderLocation)
        // return alert("request successfull")
        const data = await AsyncStorage.getItem("userToken")
        const decData = jwtDecode(data)

        if (!transData.senderName){
            alert("The sender name is required")
            setRequestOngoing(false)
        }
        else if (!transData.senderPhoneNumber){
            alert("The sender phone number is required")
            setRequestOngoing(false)
        }
        else if (!transData.senderLocation){
            alert("The sender Location is required")
            setRequestOngoing(false)
        }
        else if (!transData.productName){
            alert("The product name is required")
            setRequestOngoing(false)
        }
        else if (!transData.productQuantity){
            alert("The product quantity is required")
            setRequestOngoing(false)
        }
        else if (!isRecieverValid(transData.recieverDetails)){
            if (transData.recieverDetails.length === 1){
                if (!transData.recieverDetails[0].recieverName){
                    alert("The reciever name is required")
                }
                else if (!transData.recieverDetails[0].recieverPhoneNumber){
                    alert("The reciever phone number is required")
                }
                else if (!transData.recieverDetails[0].location){
                    alert("The reciever location is required")
                }
                setRequestOngoing(false)
            }
            else{
                alert("Check the recievers information and make sure they are correctly filled out")
                setRequestOngoing(false)
            }
        }
        else{
            alert("Request is being processed, please wait a moment")
            await fetch(configs.backendUrl + "/transactions/" + decData.id + "/make-request", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    senderName: transData.senderName,
                    senderLocation: transData.senderLocation,
                    senderPhoneNumber: transData.senderPhoneNumber,
                    // receiverName: transData.recieverName,
                    // receiverLocation: transData.recieverLocation,
                    // receiverPhoneNumber: transData.recieverPhoneNumber,
                    recieverDetails: transData.recieverDetails,
                    productName: transData.productName,
                    productQuantity: transData.productQuantity,
                    productImage: transData.productImage
                })
            })
            .then(resp => resp.json())
            .then(data => {
                // console.log(data.request)
                // alert(data.message)
                // setUsr(data.usr)
                alert(data.message)
                navigation.navigate("Home")
                setRequestOngoing(false)
            })
            .catch(error => alert(error))
        }
    }

    return(
        <View>
            <Text variant="headlineSmall" style={{textAlign: "center", color: "teal", fontWeight: "bold", marginBottom: 50, marginTop: 15, width: "100%"}}>Enter Product Details</Text>
            <TextInput
                style={styles.inputStyle} 
                mode="outlined"
                label="Product Name"
                value={transData.productName}
                onChangeText={transData.setProductName}
            />
            <TextInput
                style={styles.inputStyle} 
                mode="outlined"
                label="Product Quantity"
                keyboardType='numeric'
                value={transData.productQuantity}
                onChangeText={transData.setProductQuantity}
            />
            <TextInput
                style={styles.inputStyle} 
                mode="outlined"
                label="Product Image"
                value={transData.productImage}
                onChangeText={transData.setProductImage}
            />
            <Button
                style={styles.recvLocation}
                rippleColor="#4caf50"
                mode="contained"
                buttonColor="teal"
                textColor="white"
                onPress={handleMakeRequest}
                loading={requestOngoing}
                disabled={requestOngoing}
            >
                Make Request
            </Button>
            <Button
                style={styles.nextBtnStyle}
                icon="chevron-left"
                rippleColor="#4caf50"
                mode="contained"
                buttonColor="cornflowerblue"
                textColor="white"
                onPress={() => navigation.navigate("Reciever")}
            >
                Prev
            </Button>
        </View>
    )
}

const styles = StyleSheet.create({
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
        marginTop: 63,
        alignSelf: "right",
        width: "40%", 
        marginRight: "auto",
        marginLeft: "auto",
    }
})