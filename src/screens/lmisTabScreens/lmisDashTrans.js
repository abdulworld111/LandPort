import React, { useState, useEffect } from 'react'
import { StyleSheet, View, FlatList, TouchableOpacity } from 'react-native'
import { Text, IconButton } from 'react-native-paper'
import moment from 'moment'
import configs from '../../../config'

export default function LmisDashTrans({user}){

    const [ trans, setTrans ] = useState([])
    const [ loading, setLoading ] = useState(false)
    const [ selectedTrans, setSelectedTrans ] = useState({})
    const [ showTransDetail, setShowTransDetail ] = useState(false)

    useEffect(() => {
        const fetchData = async () => {
            await fetch(configs.backendUrl + "/transactions/completed-transactions")
            .then(resp => resp.json())
            .then(data => {
                // console.log(data.message)
                // console.log(data)
                setTrans(data.transactions)
                setLoading(false)
            })
            .catch(error => console.log(error))
        }
        fetchData()
    }, [])

    const handleTransDetails = (trans) => {
        setSelectedTrans(trans)
        setShowTransDetail(true)
    }
    const handleTransDetailClose = () => {
        setSelectedTrans({})
        setShowTransDetail(false)
    }
    
    return (
        <View style={[styles.container, {justifyContent: loading ? "center" : "flex-start"}]}>
            {loading ? (
                <View>
                    <Text variant="headlineMedium" style={{textAlign: "center", color: "teal"}}>Loading...</Text>
                </View>
            )
             : (
                <View style={{flex: 1, textAlign: "center"}}>
                    {showTransDetail && (
                        <View style={styles.transModal}>
                            <IconButton 
                                icon="close"
                                rippleColor="#4caf50"
                                size={30}
                                iconColor="white"
                                containerColor="red"
                                style={{alignSelf:"center", marginTop: 15}}
                                onPress={handleTransDetailClose}
                            />
                            <View>
                                <Text variant="headlineLarge" style={{textAlign: "center", marginBottom: 10}}>{selectedTrans.refNumber}</Text>
                                <Text variant="bodyLarge" style={{textAlign: "center", marginBottom: 10}}>Date: {moment(selectedTrans.dateCreated).calendar()} ({moment(selectedTrans.dateCreated).fromNow()})</Text>
                                <Text variant="bodyLarge" style={{textAlign: "center", marginBottom: 10}}>Completed: {selectedTrans.completed ? "True" : "False"} </Text>
                                <Text variant="bodyLarge" style={{textAlign: "center", marginBottom: 10}}>Distance: {selectedTrans.distance.toFixed(2)}KM</Text>
                                <Text variant="bodyLarge" style={{textAlign: "center", marginBottom: 10}}>Transaction Cost: #{selectedTrans.transactionCost}</Text>
                                <Text variant="bodyLarge" style={{textAlign: "center", marginBottom: 10}}>Sender: {selectedTrans.customer.name} (0{selectedTrans.customer.phoneNumber})</Text>
                                <Text variant="bodyLarge" style={{textAlign: "center", marginBottom: 10}}>Reciever: {selectedTrans.request.recipient.name} (0{selectedTrans.request.recipient.phoneNumber})</Text>
                                <Text variant="bodyLarge" style={{textAlign: "center", marginBottom: 10}}>Rider's Company: {selectedTrans.riderCompany.name}</Text>
                                
                            </View>
                        </View>
                    )}
                    <Text variant="headlineMedium" style={{textAlign: "center", marginBottom: 19, marginTop: 13, color: "teal", fontWeight: "bold"}}>History of Transactions</Text>
                    <FlatList 
                        keyExtractor={(item) => item._id}
                        data={trans}
                        renderItem={({ item }) => (
                            <View style={styles.indTrans}>
                                <TouchableOpacity onPress={() => handleTransDetails(item)}>
                                    <Text variant="bodyLarge" style={{textAlign: "center", color: "white", fontSize: 17}}>{moment(item.dateCreated).calendar()}</Text>
                                    <Text variant="bodyLarge" style={{textAlign: "center", color: "white", fontSize: 17}}>{item.refNumber}</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    />
                </View>
             )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
    },
    indTrans: {
        width: "80%",
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
    transModal: {
        position: "absolute",
        top: "0%",
        width: "100%",
        height: "100%",
        backgroundColor: "white",
        zIndex: 30,
    }
})