import React, { useState, useEffect } from 'react'
import { StyleSheet, View } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwtDecode from 'jwt-decode'
import { PaperProvider, BottomNavigation, Text } from 'react-native-paper'
import RidersDashHome from './ridersTabScreens/ridersDashHome'
import RidersDashTrans from './ridersTabScreens/ridersDashTrans'
import RidersDashProfile from './ridersTabScreens/ridersDashProfile'
import RidersDashRider from './ridersTabScreens/ridersDashRider'
import configs from '../../config'


export default function RidersDashboard (){
    const [ user, setUser ] = useState(null)
    const [ loading, setLoading ] = useState(true)
    const [ index, setIndex ] = useState(0)
    const [ routes, setRoutes ] = useState([
        {key: "home", title: "Home", focusedIcon: "home"},
        {key: "riders", title: "Riders", focusedIcon: "heart"},
        {key: "location", title: "Location", focusedIcon: "history"},
        {key: "profile", title: "Profile", focusedIcon: "account"},
    ])

    useEffect(() => {
        const fetchData = async () => {
            const token = await AsyncStorage.getItem("userToken")
            try{
                const decData = jwtDecode(token)
                await fetch(configs.backendUrl + "/users/" + decData.id)
                .then(resp => resp.json())
                .then(data => {
                    setUser(data.user)
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

    // const renderScene = BottomNavigation.SceneMap({
    //     home: (props) => <RidersDashHome {...props} user={user} />,
    //     profile: (props) => <RidersDashProfile {...props} user={user} />,
    //     transaction: (props) => <RidersDashTrans {...props} user={user} />,
    // })
    const renderScene = BottomNavigation.SceneMap({
        home: RidersDashHome,
        riders: RidersDashRider,
        profile: RidersDashProfile,
        location: (props) => <RidersDashTrans {...props} />,
    })

    return (
        <PaperProvider>
            
            <BottomNavigation 
                navigationState={{index, routes}}
                onIndexChange={setIndex}
                renderScene={renderScene}
            />
            
        </PaperProvider>
    )
}