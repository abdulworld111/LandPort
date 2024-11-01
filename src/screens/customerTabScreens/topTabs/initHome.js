import React, { useEffect, useState, useContext } from 'react'
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, SafeAreaView, TouchableOpacity, FlatList, Alert, Modal as Lmodal, Image, ImageBackground } from 'react-native';
import { Text, Button, ActivityIndicator, IconButton, Modal, Portal, PaperProvider } from 'react-native-paper'
// import { useNavigation } from '@react-navigation/native'
import Ionicons from '@expo/vector-icons/Ionicons'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwtDecode from 'jwt-decode';
import { TransContext } from '../../../../transactionContext';
import { Entypo } from '@expo/vector-icons'
import { Card } from 'react-native-shadow-cards'
import moment from 'moment'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { NavigationHelpersContext } from '@react-navigation/native';
import configs from '../../../../config'


export default function InitHome({navigation}){

    const transData = useContext(TransContext)

    const dropDownData = [
        {title: "Single", icon: "arrow-bold-up"}, 
        {title: "Mass", icon: "hair-cross"},  
        {title: "Shared", icon: "cog"}, 
        {title: "Global", icon: "heart"}
        ]

    const [ loading, setLoading ] = useState(true)
    const [ usr, setUsr ] = useState(null)
    const [ showTransDetail, setShowTransDetail ] = useState(false)
    const [ selectedTrans, setSelectedTrans ] = useState(null)
    const [ bookChoice, setBookChoice ] = useState("Single")
    const [ showBookModal, setShowBookModal ] = useState(false)

    useEffect(() => {
        const fetchData = async () => {

            const data = await AsyncStorage.getItem("userToken")
            try{
                const decData = jwtDecode(data)
                await fetch(configs.backendUrl + "/users/" + decData.id)
                .then(resp => resp.json())
                .then(data => {
                    setUsr(data.user)
                    transData.setCustomer(data.user)
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

    const sendNotification = async () => {
        const notificationMessage = {
            to: usr.pushToken,
            title: 'Notification Title',
            body: "Please respond as soon as possible",
            data: { someData: 'goes here' },
        };
    
        await fetch('https://exp.host/--/api/v2/push/send', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(notificationMessage),
        });
    }

    const handleMakeRequest = () => {
        // alert("button was pressed")
        // navigation.jumpTo("CustomerDashboard", { name: "Home"})
        Alert.alert("Request", "Select request type to make", [
            {text: "Single Rider", onPress: () => alert("single rider requested")},
            {text: "Mass Rider", onPress: () => alert("Mass rider requested")},
        ])
        // navigation.navigate("Sender")
    }

    const handleTransDetailClose = () => {
        setSelectedTrans(null)
        setShowTransDetail(false)
    }

    const handleConfirmButton = () => {
        alert("transaction confirmed")
    }

    return(
        <PaperProvider>
            
            <View style={styles.container}>
                {loading ? (
                    <View style={{flex: 1, alignItems: "center", justifyContent: "center"}}>
                        <ActivityIndicator size="large" color="teal" animating={true} />
                    </View>
                ): (
                <View style={styles.showCont}>
                    <Portal>
                        <Modal
                            visible={showBookModal}
                            onDismiss={() => setShowBookModal(false)}
                            contentContainerStyle={{borderColor: "teal", borderWidth: 3, marginLeft: "auto", marginRight: "auto", marginTop: -30, backgroundColor: "white", borderRadius: 15}}
                        >
                            <View style={{paddingVertical: 5}}>
                                <Text style={{fontSize: 20, marginBottom: 12, textAlign: "center", paddingHorizontal: 10, fontWeight: "bold"}}>Select the type of Ride</Text>
                                <FlatList 
                                    keyExtractor={(item) => item.title}
                                    data={dropDownData}
                                    renderItem={({item}) => (
                                        <TouchableOpacity
                                                onPress={() => {
                                                    transData.setRideType(item.title)
                                                    navigation.navigate("Sender")
                                                    setShowBookModal(false)
                                                }}
                                            >
                                        {/* <Card
                                            style={{
                                                flexDirection: "row", 
                                                justifyContent: "center",
                                                marginBottom: item.title === "Global" ? 0 : 7,
                                                // borderColor: "red",
                                                borderWidth: 3,
                                                backgroundColor: "white"
                                            }}
                                        > */}
                                            
                                                <View 
                                                    style={{
                                                        flexDirection: "row", 
                                                        justifyContent: "space-evenly",
                                                        marginBottom: item.title === "Global" ? 0 : 10, 
                                                        borderBottomWidth: item.title === "Global" ? 0 : 0, 
                                                        backgroundColor: "lightgrey",
                                                        marginHorizontal: 6,
                                                        borderRadius: 6,
                                                        paddingVertical: 6
                                                }}
                                                >
                                                    <View style={{backgroundColor: "teal", borderRadius: 50, justifyContent: "center", alignItems: "center", marginRight: 30}}>
                                                        <Entypo name={item.icon} size={32} style={{color: "white"}}/>
                                                    </View>
                                                    <Text
                                                        style={{
                                                            fontSize: 20,
                                                            textAlign: "center",
                                                            // borderBottomWidth: 1,
                                                            // marginBottom: 6 
                                                        }}
                                                    >
                                                        {item.title}
                                                    </Text>
                                                </View>
                                        {/* </Card> */}
                                            </TouchableOpacity>
                                    )}
                                />
                            </View>
                        </Modal>
                    </Portal>

                        <Lmodal
                            visible={showTransDetail}
                            onDismiss={() => setShowTransDetail(false)}
                            animationType='slide'
                            // transparent={true}
                            onRequestClose={() => {
                                // Alert.alert("Modal has been closed")
                                setShowTransDetail(false)
                                // setSelectedRider(null)
                            }}
                        >
                        <View style={styles.transModal}>
                            <IconButton 
                                icon="close"
                                rippleColor="#4caf50"
                                size={30}
                                iconColor="red"
                                // containerColor="red"
                                style={{
                                    // alignSelf:"right", 
                                    marginTop: 0, 
                                    borderColor: "red", 
                                    borderWidth: 4,
                                    position: "absolute",
                                    top: 10,
                                    right: 10
                                }}
                                onPress={handleTransDetailClose}
                            />
                            
                            <View style={{flex: 1}}>
                                {selectedTrans && (
                                    <View style={{flex: 1}}>
                                        <Text variant="headlineLarge" style={{textAlign: "center", marginVertical: 10, color: "white", borderWidth: 0.5, backgroundColor: "teal"}}>{selectedTrans.refNumber}</Text>
                                        <View 
                                        style={{
                                            flexDirection: "row",
                                            justifyContent: "space-between",
                                            width: "80%",
                                            marginRight: "auto",
                                            marginLeft: "auto",
                                        }}
                                        >
                                            <Text variant="bodyLarge" style={[{width: "45%", textAlign: "left"}, styles.transDetStyle]}>Date:</Text> 
                                            <Text style={[styles.transDetStyle, {textAlign: "left", width: "55%", color: "gray"}]}>{moment(selectedTrans.dateCreated).calendar()} ({moment(selectedTrans.dateCreated).fromNow()})</Text>
                                        </View>
                                        <View 
                                        style={{
                                            flexDirection: "row",
                                            justifyContent: "space-between",
                                            width: "80%",
                                            marginRight: "auto",
                                            marginLeft: "auto",
                                        }}
                                        >
                                            <Text variant="bodyLarge" style={[{width: "45%", textAlign: "left"},styles.transDetStyle]}>Completed:</Text> 
                                            <Text style={[styles.transDetStyle, {textAlign: "left", width: "55%", color: "gray"}]}>{selectedTrans.completed ? "True" : "False"}</Text>
                                        </View>
                                        <View 
                                        style={{
                                            flexDirection: "row",
                                            justifyContent: "space-between",
                                            width: "80%",
                                            marginRight: "auto",
                                            marginLeft: "auto",
                                        }}
                                        >
                                            <Text variant="bodyLarge" style={[{width: "45%", textAlign: "left"},styles.transDetStyle]}>Customer:</Text> 
                                            <Text style={[styles.transDetStyle, {textAlign: "left", width: "55%", color: "gray"}]}>{selectedTrans.customer?.name} (0{selectedTrans.customer?.phoneNumber})</Text>
                                        </View>
                                        <FlatList 
                                            keyExtractor={item => item._id}
                                            data={selectedTrans.request}
                                            renderItem={({item}) => (
                                                <Card 
                                                    style={{
                                                        // borderColor: "cornflowerblue", 
                                                        paddingVertical: 3, 
                                                        // borderWidth: 1, 
                                                        marginBottom: 25,
                                                        // marginLeft: "auto",
                                                        // marginRight: "auto",
                                                        width: "100%"
                                                        }}
                                                >
                                                    <Image 
                                                        source = {require("../../../assets/mark.jpg")}
                                                        style = {styles.brandLogo}
                                                        resizeMode = "cover" 
                                                    />

                                                    <View 
                                                    style={{
                                                        flexDirection: "row",
                                                        justifyContent: "space-between",
                                                        width: "80%",
                                                        marginRight: "auto",
                                                        marginLeft: "auto",
                                                    }}
                                                    >
                                                        <Text variant="bodyLarge" style={[{width: "45%", textAlign: "left"},styles.transDetStyle]}>Distance:</Text> 
                                                        <Text style={[styles.transDetStyle, {textAlign: "left", width: "55%", color: "gray"}]}>{item.distance?.toFixed(2)}KM</Text>
                                                    </View>
                                                    <View 
                                                    style={{
                                                        flexDirection: "row",
                                                        justifyContent: "space-between",
                                                        width: "80%",
                                                        marginRight: "auto",
                                                        marginLeft: "auto",
                                                    }}
                                                    >
                                                        <Text variant="bodyLarge" style={[{width: "45%", textAlign: "left"},styles.transDetStyle]}>Transaction Cost:</Text> 
                                                        <Text style={[styles.transDetStyle, {textAlign: "left", width: "55%", color: "gray"}]}>{item.transactionCost}</Text>
                                                    </View>
                                                    <View 
                                                    style={{
                                                        flexDirection: "row",
                                                        justifyContent: "space-between",
                                                        width: "80%",
                                                        marginRight: "auto",
                                                        marginLeft: "auto",
                                                    }}
                                                    >
                                                        <Text variant="bodyLarge" style={[{width: "45%", textAlign: "left"},styles.transDetStyle]}>Sender:</Text> 
                                                        <Text style={[styles.transDetStyle, {textAlign: "left", width: "55%", color: "gray"}]}>{item.sender.name} (0{selectedTrans.customer?.phoneNumber})</Text>
                                                    </View>
                                                    <View 
                                                    style={{
                                                        flexDirection: "row",
                                                        justifyContent: "space-between",
                                                        width: "80%",
                                                        marginRight: "auto",
                                                        marginLeft: "auto",
                                                    }}
                                                    >
                                                        <Text variant="bodyLarge" style={[{width: "45%", textAlign: "left"},styles.transDetStyle]}>Reciever:</Text> 
                                                        <Text style={[styles.transDetStyle, {textAlign: "left", width: "55%", color: "gray"}]}>{item.recipient.name} (0{item.recipient.phoneNumber})</Text>
                                                    </View>
                                                    <View 
                                                    style={{
                                                        flexDirection: "row",
                                                        justifyContent: "space-between",
                                                        width: "80%",
                                                        marginRight: "auto",
                                                        marginLeft: "auto",
                                                    }}
                                                    >
                                                        <Text variant="bodyLarge" style={[{width: "45%", textAlign: "left"},styles.transDetStyle]}>Rider's Company:</Text> 
                                                        <Text style={[styles.transDetStyle, {textAlign: "left", width: "55%", color: "gray"}]}>{item.riderCompany?.name}</Text>
                                                    </View>
                                                    <View 
                                                    style={{
                                                        flexDirection: "row",
                                                        justifyContent: "space-between",
                                                        width: "80%",
                                                        marginRight: "auto",
                                                        marginLeft: "auto",
                                                    }}
                                                    >
                                                        <Text variant="bodyLarge" style={[{width: "45%", textAlign: "left"},styles.transDetStyle]}>Product:</Text> 
                                                        <Text style={[styles.transDetStyle, {textAlign: "left", width: "55%", color: "gray"}]}>{item.product.name}({item.product.quantity})</Text>
                                                    </View>
                                                    {/* <Text variant="bodyLarge" style={styles.transDetStyle}>Distance: {item.distance?.toFixed(2)}KM</Text>

                                                    <Text variant="bodyLarge" style={styles.transDetStyle}>Transaction Cost: #{item.transactionCost}</Text>
                                                    
                                                    <Text variant="bodyLarge" style={styles.transDetStyle}>Sender: {item.sender.name} (0{selectedTrans.customer?.phoneNumber})</Text>

                                                    <Text variant="bodyLarge" style={styles.transDetStyle}>Reciever: {item.recipient.name} (0{item.recipient.phoneNumber})</Text>

                                                    <Text variant="bodyLarge" style={styles.transDetStyle}>Rider's Company: {item.riderCompany?.name}</Text>

                                                    <Text variant="bodyLarge" style={styles.transDetStyle}>Product: {item.product.name}({item.product.quantity})</Text> */}
                                                </Card>
                                            )}
                                        />

                                        {/* <Image 
                                            source = {require("../../../assets/mark.jpg")}
                                            style = {styles.brandLogo}
                                            resizeMode = "cover" 
                                        />

                                        <Text variant="headlineLarge" style={{textAlign: "center", marginVertical: 10, color: "white", borderWidth: 0.5, backgroundColor: "teal"}}>{selectedTrans.refNumber}</Text>
                                        <Text variant="bodyLarge" style={{fontWeight: "bold", textAlign: "center", marginBottom: 10, color: "teal"}}>Date: {moment(selectedTrans.dateCreated).calendar()} ({moment(selectedTrans.dateCreated).fromNow()})</Text>
                                        <Text variant="bodyLarge" style={{fontWeight: "bold", textAlign: "center", marginBottom: 10, color: "teal"}}>Completed: {selectedTrans.completed ? "True" : "False"} </Text>
                                        <Text variant="bodyLarge" style={{fontWeight: "bold", textAlign: "center", marginBottom: 10, color: "teal"}}>Distance: {selectedTrans.distance?.toFixed(2)}KM</Text>
                                        <Text variant="bodyLarge" style={{fontWeight: "bold", textAlign: "center", marginBottom: 10, color: "teal"}}>Transaction Cost: #{selectedTrans.transactionCost}</Text>
                                        <Text variant="bodyLarge" style={{fontWeight: "bold", textAlign: "center", marginBottom: 10, color: "teal"}}>Customer: {selectedTrans.customer?.name} (0{selectedTrans.customer?.phoneNumber})</Text>
                                        <Text variant="bodyLarge" style={{fontWeight: "bold", textAlign: "center", marginBottom: 10, color: "teal"}}>Sender: {selectedTrans.request[0].sender.name} (0{selectedTrans.customer?.phoneNumber})</Text>
                                        <Text variant="bodyLarge" style={{fontWeight: "bold", textAlign: "center", marginBottom: 10, color: "teal"}}>Reciever: {selectedTrans.request[0].recipient.name} (0{selectedTrans.request[0].recipient.phoneNumber})</Text>
                                        <Text variant="bodyLarge" style={{fontWeight: "bold", textAlign: "center", marginBottom: 10, color: "teal"}}>Rider's Company: {selectedTrans.riderCompany?.name}</Text>
                                        <Text variant="bodyLarge" style={{fontWeight: "bold", textAlign: "center", marginBottom: 10, color: "teal"}}>Product: {selectedTrans.request[0].product.name}({selectedTrans.request[0].product.quantity})</Text> */}
                                    </View>
                                )}
                                
                                
                            </View>
                            <View  style={{marginBottom: 20}}>
                                <Button 
                                    style={styles.confirmButton}
                                    mode="contained"
                                    rippleColor="#4caf50"
                                    icon="check"
                                    buttonColor="red"
                                    textColor="white"
                                    // onPress={() => handleConfirmButton(selectedTrans)}
                                    onPress={() => alert("confirmed!!!")}
                                    // disabled={usr.riderConfirm ? true : false}
                                    disabled={true}
                                >
                                    Confirm
                                </Button>
                            </View>
                        </View>
                    </Lmodal>

                        <ImageBackground
                            source={require("../../../assets/rider2.jpeg")}
                        >
                    <View style={{}}>
                            <Text 
                                variant="titleMedium" 
                                style={{
                                    textAlign: "left",
                                    color: "white",
                                    fontWeight: "bold",
                                    width: 350,
                                    marginLeft: 60,
                                    marginTop: 12
                                }}
                            >
                                Welcome <Text variant="titleLarge" style={{fontWeight: 500, color: "white", fontWeight: "bold"}}>{usr && usr.name}</Text>
                            </Text>
                            <Text 
                                variant="headlineSmall" 
                                style={{
                                    textAlign: "left",
                                    fontWeight: "bold",
                                    color: "white",
                                    width: 350,
                                    marginLeft: 60
                                }}
                            >
                                Book A Dispatch...
                            </Text>

                        
                    </View>
                    <Button
                        textColor="white"
                        buttonColor="teal"
                        mode="contained"
                        rippleColor="#4caf50"
                        style={styles.mrButton}
                        icon="bike"
                        contentStyle={{flexDirection: "row-reverse"}}
                        onPress={() => {
                            setShowBookModal(true)
                            sendNotification()
                        }}
                        // onPress={sendNotification}
                    >
                        Book Dispatch
                    </Button>
                    </ImageBackground>

                    {/* <Dropdown 
                        label="Book A Rider"
                        data={dropDownData}
                    /> */}

                    <View style={{flex: 1}}>
                        <Text 
                            variant="titleMedium" 
                            style={{
                                textAlign: "left", 
                                fontWeight: "bold", 
                                color: "black", 
                                marginBottom: 15,
                                marginTop: 15,
                                marginLeft: 10
                            }}
                        >
                            Recent Links
                        </Text>
                        <FlatList 
                            keyExtractor={(item) => item._id}
                            data={usr.transactions}
                            renderItem={({item}) => (
                            
                                <Card style={styles.cardStyle}>
                                    <TouchableOpacity onPress={() => {
                                        console.log(item)
                                        setSelectedTrans(item)
                                        // console.log(item.request.length)
                                        setShowTransDetail(true)
                                    }}>
                                        <View 
                                            style={{
                                                flexDirection: "row", 
                                                alignItems: "center", 
                                                justifyContent: "space-around", 
                                                // backgroundColor: "gray",
                                                // borderRadius: 40
                                                }}
                                                >
                                            <View style={{ width: "20%" }}>
                                                {/* <Entypo name={item.request.length === 1 ? "arrow-bold-up" : "hair-cross"} size={39} style={{color: "gray", backgroundColor: "white", borderRadius: 50, width: "64%"}}/> */}
                                                <Image 
                                                    source={require("../../../assets/rideicon2.jpeg")}
                                                    style={{
                                                        width: 40,
                                                        height: 40,
                                                        borderRadius: 50
                                                    }} 
                                                />
                                            </View>
                                            <View style={{ width: "80%" }}>
                                                {item.request.length === 1 ? (
                                                    <Text variant="bodyMedium" style={styles.linkListText}>From {item.request[0].sender.name} To {item.request[0].recipient.name}</Text>
                                                ) : (
                                                    <Text variant="bodyLarge" style={styles.linkListText}>Mass Dispatch from {item.request[0].sender.name}</Text>
                                                )}
                                                <Text variant="bodySmall" style={{textAlign: "left", color: "gray"}}>{moment(item.dateCreated).calendar()} ({moment(item.dateCreated).fromNow()}) </Text>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                </Card>

                            )}
                        />
                    </View>
                </View>
                )}
            </View>
        </PaperProvider>
    )
}
// {item.customerConfirm ? <Entypo name="check" size={23}/> : <Entypo name="cog" size={19}/>}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
        alignItems: "center",
        // paddingTop: 30
    },
    showCont: {
        flex: 1,
        alignItems: "center"
    },
    header: {
        textAlign: "left",
        fontWeight: "bold",
        color: "teal",
        borderColor: "blue",
        borderWidth: 3,
        width: "100%",
        marginHorizontal: 20
    },
    modalStyles: {
        backgroundColor: "white", 
        height: 400, 
        width: "70%", 
        marginLeft: "15%", 
        justifyContent: "flex-start"
    },
    brandLogo: {
        height: 100,
        width: 100,
        // marginTop: -90,
        // marginBottom: 30,
        borderRadius: 280/2,
        borderColor: "teal",
        borderWidth: 3,
        alignSelf: "center"
    },
    mrButton: {
        width: 150,
        // paddingVertical: 0,
        // paddingHorizontal: 0,
        // position: "absolute",
        // top: 140,
        borderRadius: 5,
        marginBottom: 30,
        marginTop: 25,
        marginRight: "auto",
        marginLeft: "auto",
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
    transModal: {
        position: "absolute",
        top: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "white",
        zIndex: 30,
        flex: 1,
        // borderColor: "blue",
        // borderWidth: 3
    },
    requestStyle: {
        // flexDirection: "row"
    },
    // map: {
    //     width: Dimensions.get("window").width,
    //     height: Dimensions.get("window").height
    // },
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
        padding: 7, 
        margin: 5, 
        // elevation: 7, 
        // borderColor: "teal",
        // borderWidth: 3,
        // backgroundColor: "teal", 
        // cornerRadius: 30,
        borderRadius: 30,
        // width: "100%",
        // marginLeft: "auto",
        // marginRight: "auto",
    },
    linkListText: {
        color: "black",
        textAlign: "left",
        fontWeight: "bold",
        // fontSize: 24
    },
    btnStyle: {
        
    },
    dropdownButtonStyle: {
        width: 200,
        height: 50,
        backgroundColor: "#e9ecef",
        borderRadius: 12,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 12,
    },
    dropdownButtonTxtStyle: {
        flex: 1,
        fontSize: 18,
        fontWeight: "500",
        color: "#151E26",
        
    },
    dropdownButtonIconStyle: {
        fontSize: 28,
        marginRight: 8,
    },
    dropdownButtonArrowStyle: {
        fontSize: 28,
        color: "teal",
        borderColor: "red",
        borderWidth: 2
    },
    dropdownMenuStyle: {
        backgroundColor: "#e9ecef",
        borderColor: "blue",
        borderWidth: 3,
        borderRadius: 8,
        width: "50%",
        // marginLeft: "auto",
        marginRight: 99
    },
    dropdownItemStyle: {
        width: "100%",
        flexDirection: "row",
        paddingHorizontal: 12,
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 8
    },
    dropdownItemTxtStyle: {
        flex: 1,
        fontSize: 18, 
        fontWeight: "500",
        color: "#151e26"
    },
    dropdownItemIconStyle: {
        fontSize: 28,
        marginRight: 8
    },
    transDetStyle: {
        fontWeight: "bold", 
        // textAlign: "center", 
        marginBottom: 10, 
        color: "black",
        fontWeight: "bold"
    }
})