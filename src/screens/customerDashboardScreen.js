import React, { useState, useEffect } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { StyleSheet, View} from 'react-native'
import jwtDecode from 'jwt-decode'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {Provider as PaperProvider, BottomNavigation, Text} from 'react-native-paper'
import DashboardFavouritesRoute from './customerTabScreens/dashboardFavourites'
import DashboardHomeRoute from './customerTabScreens/dashboardHome'
import DashboardProfileRoute from './customerTabScreens/dashboardProfile'
import DashboardSearchRoute from './customerTabScreens/dashboardSearch'
import StackHome from './customerTabScreens/stackHome'
import InitHome from './customerTabScreens/topTabs/initHome'
import { ActivityIndicator } from 'react-native-paper'
import MyDrawer from './customerTabScreens/stackHome'
import { TopTab } from './customerTabScreens/stackHome'

const Tab = createBottomTabNavigator()

export default function CustomerDashboard({route, navigation}){
    const [index, setIndex] = useState(0)
    const [decodedData, setDecodedData ]= useState(null)
    const [ user, setUser ] = useState(null)
    const [ loading, setLoading ] = useState(false)
    // const {customer} = route.params

    // useEffect(() => {
    //     const fetchData = async () => {
    //         const data = await AsyncStorage.getItem("userToken")
    //         // console.log(data)
    //         try{
    //             const decData = jwtDecode(data)
    //             await fetch("http://192.168.43.75:3000/users/" + decData.id)
    //             .then(resp => resp.json())
    //             .then(data => {
    //                 setUser(data.user)
    //                 // console.log(data.user)
    //                 setLoading(false)
    //             })
    //             .catch(error => {
    //                 console.log(error)
    //             })
    //         }
    //         catch(error){
    //             console.log("something went wrong")
    //         }
    //     }
    //     fetchData()
    // }, [])

    const [routes, setRoutes] = useState([
        // {key: "initial", title: "InitHome", focusedIcon: "home"},
        {key: "home", title: "Home", focusedIcon: "home"},
        {key: "search", title: "Search", focusedIcon: "magnify"},
        {key: "settings", title: "Settings", focusedIcon: "cog"},
        {key: "profile", title: "Profile", focusedIcon: "account"},
    ])
    const renderScene = BottomNavigation.SceneMap({
        home: TopTab,
        // home: DashboardHomeRoute,
        search: DashboardSearchRoute,
        settings: DashboardFavouritesRoute,
        profile: DashboardProfileRoute
    })
    
    return (
        <PaperProvider>
            {loading ? (
                <View style={{flex: 1, justifyContent: "center", alignItems:"center", backgroundColor: "white"}}>
                    <ActivityIndicator size="large" color="teal" animating={true} />
                </View>
            ): (
                <BottomNavigation 
                    navigationState={{index, routes}}
                    onIndexChange={setIndex}
                    renderScene={renderScene}
                />
            ) }
        </PaperProvider>
            // <Tab.Navigator initialRouteName='Home'>
            //     <Tab.Screen 
            //         name="anHome"
            //         component={MyDrawer}
            //     />
            //     <Tab.Screen 
            //         name="iHome"
            //         component={InitHome}
            //     />
            // </Tab.Navigator>
    )
}