import React, { useState, useEffect } from 'react'
import { StyleSheet, View, FlatList, TouchableOpacity, Image } from 'react-native'
import { Text, IconButton, Button } from 'react-native-paper'
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwtDecode from 'jwt-decode'
import moment from 'moment'
import { Card } from 'react-native-shadow-cards'
import { Entypo } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import configs from '../../../config';


export default function RidersDashHome(){

    const [ loading, setLoading ] = useState(true)
    const [ recTrans, setRecTrans ] = useState([])
    const [ showTransDetail, setShowTransDetail ] = useState(false)
    const [ selectedTrans, setSelectedTrans ] = useState({})
    const [ user, setUser ] = useState(null)

    useEffect(() => {
        const fetchData = async () => {
            const token = await AsyncStorage.getItem("userToken")
            try{
                const decData = jwtDecode(token)
                await fetch(configs.backendUrl + "/users/" + decData.id)
                .then(resp => resp.json())
                .then(data => {
                    setUser(data.user)
                    console.log("The current user is ..")
                    console.log(data.user)
                    setLoading(false)
                })
                .catch(error => {
                    console.log(error)
                })
            }
            catch(error){
                console.log("Something Went Wrong")
            }
            
        }
        fetchData()
    }, [])

    const handleConfirmButton = async (selTrans) => {
        await fetch(configs.backendUrl + "/transactions/" + user._id + "/rider-confirm/" + selTrans._id, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
        })
        .then(resp => resp.json())
        .then(data => {
            alert("Transaction completed successfully")
            setUser(data.user)
            setShowTransDetail(false)
            setTimeout(() => {
                const delRequest = async () => {
                    await fetch(configs.backendUrl + "/transactions/" + user._id + "/delete-transaction/" + selTrans._id, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    })
                    .then(resp => resp.json())
                    .then(data => {
                        // console.log(data.transaction)
                        setUser(data.user)
                        alert("deleted successfully")
                    })
                }

                delRequest()
            }, 1000 * 10)
        })
        .catch(error => alert(error))
    }

    const handleTransDetailClose = () => {
        setSelectedTrans({})
        setShowTransDetail(false)
    }
    
    return (
        <View style={styles.container}>
            {loading ? (
            <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
                <Text variant="displayMedium">Loading...</Text>
            </View>
        ) : (
            <View style={{flex: 1}}>
                {showTransDetail && (
                    <View style={styles.transModal}>
                        <IconButton 
                            icon="close"
                            rippleColor="#4caf50"
                            size={30}
                            iconColor="red"
                            // containerColor="red"
                            style={{alignSelf:"center", marginTop: 15, marginBottom: 25, borderColor: "red", borderWidth: 4}}
                            onPress={handleTransDetailClose}
                        />
                        <View>
                        {/* <Text variant="headlineLarge" style={{textAlign: "center", marginVertical: 10, color: "teal", borderWidth: 3, borderColor: "teal"}}>{selectedTrans?.refNumber}</Text> */}
                            <Text variant="bodyLarge" style={{fontWeight: "bold", textAlign: "center", marginBottom: 10, color: "teal"}}>Date: {moment(selectedTrans.dateCreated).calendar()} ({moment(selectedTrans.dateCreated).fromNow()})</Text>
                            <Text variant="bodyLarge" style={{fontWeight: "bold", textAlign: "center", marginBottom: 10, color: "teal"}}>Completed: {selectedTrans.completed ? "True" : "False"} </Text>
                            <Text variant="bodyLarge" style={{fontWeight: "bold", textAlign: "center", marginBottom: 10, color: "teal"}}>Distance: {selectedTrans.distance.toFixed(2)}KM</Text>
                            <Text variant="bodyLarge" style={{fontWeight: "bold", textAlign: "center", marginBottom: 10, color: "teal"}}>Transaction Cost: #{selectedTrans.transactionCost}</Text>
                            <Text variant="bodyLarge" style={{fontWeight: "bold", textAlign: "center", marginBottom: 10, color: "teal"}}>Sender: {selectedTrans.sender.name} (0{selectedTrans.sender.phoneNumber})</Text>
                            <Text variant="bodyLarge" style={{fontWeight: "bold", textAlign: "center", marginBottom: 10, color: "teal"}}>Reciever: {selectedTrans.recipient.name} (0{selectedTrans.recipient.phoneNumber})</Text>
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
                                disabled={user.riderConfirm ? true : false}
                            >
                                Confirm
                            </Button>
                        </View>
                    </View>
                )}
                <Text variant="headlineMedium" style={{textAlign: "center", color: "teal", fontWeight: "bold", marginVertical: 19}}>Welcome {user.name}</Text>
                {user.transactions.length === 0 ? (
                    <View>
                        <Text style={{textAlign: "center", color: "teal"}}>There are no transactions currently</Text>
                    </View>
                ) : (
                    <View style={{flex: 1}}>
                        <FlatList 
                            keyExtractor={(item) => item._id}
                            data={user.requests}
                            renderItem={({item}) => (
                                <Card style={styles.cardStyle}>
                                    <TouchableOpacity onPress={() => {
                                        setSelectedTrans(item)
                                        setShowTransDetail(true)
                                        }}>
                                        <View style={{flexDirection: "row", alignItems: "center", justifyContent: "space-around"}}>
                                        <Entypo name="cross" size={33} style={{color: "white", backgroundColor: "teal", borderRadius: 50}}/>
                                        <View>
                                            {/* <Text variant="bodyLarge" style={styles.linkListText}>From {item.request[0].sender.name} To {item.request[0].recipient.name} {item.customerConfirm ? <Entypo name="check" size={23}/> : <Entypo name="cog" size={19}/>}</Text>
                                            <Text variant="bodySmall" style={{textAlign: "center"}}>{moment(item.dateCreated).calendar()} ({moment(item.dateCreated).fromNow()}) </Text> */}
                                            <Text variant="bodyLarge" style={styles.linkListText}>From {item.sender.name} To {item.recipient.name} {item.customerConfirm ? <Entypo name="check" size={23}/> : <Entypo name="cog" size={19}/>}</Text>
                                            <Text variant="bodySmall">{moment(item.dateCreated).calendar()} ({moment(item.dateCreated).fromNow()}) </Text>
                                        </View>
                                        </View>
                                    </TouchableOpacity>
                                </Card>
                            )}
                        />
                        {/* <Card style={styles.cardStyle}>
                            <View style={{flexDirection: "row", justifyContent: "center"}}>
                                <Image source={require("../finalLogo.png")} style={styles.brandLogo} resizeMode="contain" />
                                <Text style={{color: "teal", fontWeight: "bold", textAlign: "center"}}>This is text</Text>
                            </View>
                        </Card> */}
                    </View>
                )}

            </View>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    brandLogo: {
        height: 30,
        width: 30
      },
    transModal: {
        position: "absolute",
        top: "0%",
        width: "100%",
        height: "100%",
        backgroundColor: "white",
        zIndex: 30,
    },
    cardStyle: {
        padding: 3, 
        margin: 10, 
        elevation: 7, 
        // backgroundColor: "teal", 
        cornerRadius: 30,
        // width: "70%",
        marginLeft: "auto",
        marginRight: "auto",
    },
    confirmButton: {
        width: "40%",
        borderRadus: 90,
        marginRight: "auto",
        marginLeft: "auto"
    },
    linkListText: {
        color: "black",
        textAlign: "center",
        fontWeight: "bold"
    },
    indTrans: {
        width: "70%",
        marginLeft: "auto",
        marginRight: "auto",
        // anotherset
        flexDirection: "row", 
        justifyContent: "center", 
        alignItems: "center", 
        marginVertical: 5,
        borderRadius: 15,
        borderColor: "teal",
        borderWidth: 4,
        backgroundColor: "black",
        padding: 3
    },
})