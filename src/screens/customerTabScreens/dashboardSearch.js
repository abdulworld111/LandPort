import React, { useState, useEffect } from 'react'
import { View, StyleSheet, FlatList } from 'react-native'
import { Text, List, Md3Colors } from 'react-native-paper'
import AsyncStorage from '@react-native-async-storage/async-storage'
import jwtDecode from 'jwt-decode'
import { ActivityIndicator } from 'react-native-paper'
import { Card } from 'react-native-shadow-cards'
import configs from '../../../config'

export default function DashboardSearchRoute(){
    const [ usr, setUsr ] = useState(null)
    const [ loading, setLoading ] = useState(true)

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

    return(
        <View style={styles.container}>
            {loading ? (
                <View style={{flex: 1, justifyContent: "center", alignItems:"center", backgroundColor: "white"}}>
                    <ActivityIndicator size="large" color="teal" animating={true} />
                </View>
            ): (
                <FlatList 
                    keyExtractor={(item) => item._id}
                    data={usr.requests}
                    renderItem={({item}) => (
                        <Card style={styles.cardStyle}>
                            <Text 
                                style={{color: "black", fontSize: 17, textAlign: "center"}}
                            >
                                {`${item.sender.name} => ${item.recipient.name} (${item.product.name})`}
                            </Text>
                        </Card>
                    )}
                />
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
        paddingTop: 30
    },
    cardStyle: {
        padding: 10, 
        margin: 10, 
        elevation: 7, 
        // backgroundColor: "teal", 
        cornerRadius: 30,
        width: "70%",
        marginLeft: "auto",
        marginRight: "auto",
    },
})