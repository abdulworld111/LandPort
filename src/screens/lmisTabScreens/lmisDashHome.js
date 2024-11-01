import React, { useState, useEffect } from 'react'
import { StyleSheet, View, FlatList, Modal, TouchableOpacity, Alert } from 'react-native'
import { Text, IconButton } from 'react-native-paper'
import { MaterialIcons } from '@expo/vector-icons'
import { Card } from 'react-native-shadow-cards'
import { useNavigation } from '@react-navigation/native'
import configs from '../../../config'

export default function LmisDashHome(){
    const [ requests, setRequests ] = useState([])
    const [ riders, setRiders ] = useState([])
    const [ loading, setLoading ] = useState(true)
    const [ showModal, setShowModal ] = useState(false)
    const [ selectedRequest, setSelectedRequest ] = useState({})

    const navigation = useNavigation()
    useEffect(() => {
        const fetchData = async () => {
            console.log("THIS IS THE LMIS DASHBOARD")
            await fetch(configs.backendUrl + "/transactions/unapproved-requests")
            .then(resp => resp.json())
            .then(data => {
                // console.log(data.requests)
                setRequests(data.requests)
            })
            .catch(error => console.log(error))

            await fetch(configs.backendUrl + "/users/riders-company/get-companies")
            .then(resp => resp.json())
            .then(data => {
                setRiders(data.riders)
                setLoading(false)
                // console.log("end of the the fecth call")
            })
            .catch(err => console.log(err))
        }
        // console.log("end of the the fecth call")
        fetchData()
    }, [])

    const handleModalClose = () => {
        setSelectedRequest({})
        setShowModal(false)
    }

    const handleModalOpen = (reqs) => {
        setSelectedRequest(reqs)
        console.log(reqs)
        setShowModal(true)
    }

    const handleYesPress = async (rider) => {
        // console.log(`The rider clicked is ${rider.name}`)
        await fetch(configs.backendUrl + "/transactions/create-transaction", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({senderName: selectedRequest.sender.name, request: selectedRequest, rider: rider})
        })
        .then(resp => resp.json())
        .then(data => {
            console.log(data)
            navigation.replace("LmisDashboard")
        })
        .catch(error => console.log(error))
    }

    const handleRiderPress = (rider) => {
        Alert.alert("Confirm Selection", `Are you Sure you want to select ${rider.name}`, [
            {text: "Yes", onPress:() => handleYesPress(rider)},
            {text: "No, Cancel", onPress:() => console.log("Transaction Aborted")},
        ])
    }

    return (
        <View style={[styles.container, {justifyContent: loading ? "center" : "flex-start"}]}>
            {loading ? (
                <Text variant="bodyMedium">Loading Requests</Text>
            ) : (
                // <Text variant="bodyMedium">Finished Loading Requests</Text>
                <View style={{flex: 1}}>
                    {/* {showModal && (
                        <View style={styles.modalStyle}>
                            <Text variant="bodyLarge" style={{textAlign: "center"}}>Choose a Rider's Company</Text>

                        </View>
                    )} */}
                    <Modal visible={showModal}>
                        <View style={{flex: 1, justifyContent: "center"}}>
                            <View style={{position: "absolute", top: 19, width: "100%"}}>
                                <IconButton 
                                    icon="close"
                                    rippleColor="#4caf50"
                                    size={40}
                                    iconColor="red"
                                    // containerColor="red"
                                    style={{alignSelf:"center", marginTop: 15, fontWeight: "bold", borderColor: "red", borderWidth: 3}}
                                    onPress={handleModalClose}
                                />
                                <Text variant="headlineSmall" style={{textAlign: "center", fontWeight: "bold", color: "teal"}}>Choose a Rider's Company</Text>
                            </View>
                            {riders.length === 0 ? (
                                <Text style={{marginTop: 17, textAlign: "center", color: "teal", fontWeight: "bold"}}>There is no available Rider's Company at the moment</Text>
                                ) : (
                                    <View style={{marginTop: 30}}>
                                        <FlatList 
                                            keyExtractor={item => item._id}
                                            data={riders}
                                            renderItem={({item}) => (
                                                <Card style={styles.mcardStyle}>
                                                    <TouchableOpacity onPress={() => handleRiderPress(item)}>
                                                        <Text style={{textAlign: "center", color: "teal", fontWeight: "bold", fontSize: 19}}>{item.name} (#{item.priceCharged})</Text>
                                                    </TouchableOpacity>
                                                </Card>
                                            )}
                                        />
                                    </View>
                            )}

                        </View>
                    </Modal>
                    <Text variant="headlineMedium" style={{textAlign: "center", marginVertical: 11, color: "teal", fontWeight: "bold"}}>Recent Requests</Text>
                    {requests.length === 0 ? (
                        <Text variant="bodyLarge" style={{color: "teal"}}>There are no request for now</Text>
                    ) : (
                        <View style={{flex: 1}}>
                            <FlatList 
                                keyExtractor={(item) => item._id}
                                data={requests}
                                renderItem={({item}) => (
                                    <Card style={[styles.cardStyle]}>
                                        <TouchableOpacity>
                                            <Text 
                                                style={styles.listStyle}
                                                onPress={() => handleModalOpen(item)} 
                                            >
                                                {`${item.sender.name} => ${item.recipient.name} (${item.product.name})`}
                                            </Text>
                                        </TouchableOpacity>
                                    </Card>
                                )}
                            />
                        </View>
                    )}
                </View>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    ridersList: {
        width: 20,
        height: 20,
        backgroundColor: "teal",
        borderWidth: 2,
        borderColor: "red"
    },
    container: {
        flex: 1,
        backgroundColor: "white",
        alignItems: "center"
    },
    cardStyle: {
        padding: 10, 
        margin: 10, 
        elevation: 7, 
        // backgroundColor: "teal", 
        borderColor: "teal",
        borderwidth: 3,
        // cornerRadius: 30,
        width: "96%",
        marginLeft: "auto",
        marginRight: "auto",
    },
    mcardStyle: {
        padding: 10, 
        margin: 10, 
        elevation: 7, 
        // backgroundColor: "teal", 
        borderColor: "teal",
        borderwidth: 3,
        // cornerRadius: 30,
        marginLeft: "auto",
        marginRight: "auto",
    },
    modalStyle: {
        position: "absolute",
        width: "80%",
        height: "70%",
        backgroundColor: "white",
        top: 100,
        left: 30
    },
    ridersViewStyle: {
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
    listShadow: {
        shadowColor: "black",
        elevation: 10,
        shadowOffset: {width: 5, height: 4},
        shadowOpacity: 0.6,
        shadowRadius: 5,
    },
    ridersTextStyle: { 
        marginVertical: 5,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        borderStyle: "solid", 
        borderRadius: 15, 
        width: "80%",
        borderColor: "teal",
        borderWidth: 5,
        backgroundColor: "black",
        marginLeft: "auto",
        marginRight: "auto"
    },
    listStyle: {
        color: "teal",
        fontWeight: "bold", 
        fontSize: 17, 
        textAlign: "center", 
        // width: "80%", 
        // marginLeft: "auto",
        // marginRight: "auto",
    }
})