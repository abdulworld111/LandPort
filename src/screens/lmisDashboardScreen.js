import React, { useState, useEffect } from 'react'
import { StyleSheet, View } from 'react-native'
import { PaperProvider, BottomNavigation, Text } from 'react-native-paper'
import jwtDecode from 'jwt-decode'
import AsyncStorage from '@react-native-async-storage/async-storage'
import LmisDashHome from './lmisTabScreens/lmisDashHome'
import LmisDashTrans from './lmisTabScreens/lmisDashTrans'
import LmisDashProfile from './lmisTabScreens/lmisDashProfile'
import LmisDashSettings from './lmisTabScreens/lmisDashSettings'
import configs from '../../config'

export default function LmisDashboard(){
    const [ index, setIndex ] = useState(0)
    const [ user, setUser ] = useState(null)
    const [ loading, setLoading ] = useState(true)
    const [ routes, setRoutes ] = useState([
        {key: "home", title: "Home", focusedIcon: "home"},
        {key: "transaction", title: "Transactions", focusedIcon: "history"},
        {key: "settings", title: "Settings", focusedIcon: "cog"},
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
                    // console.log(data.user)
                    setUser(data.user)
                    setLoading(false)
                })
                .catch(error => console.log(error))
            }
            catch(error){
                console.log(error)
            }
        }
        fetchData()
    }, [])

    const renderScene = BottomNavigation.SceneMap({
        home: (props) => <LmisDashHome {...props} user={user} />,
        transaction: (props) => <LmisDashTrans {...props} user={user} />,
        profile: (props) => <LmisDashProfile {...props} user={user} />,
        settings: (props) => <LmisDashSettings {...props} user={user} />
    })

    return (
        <PaperProvider>
            {loading ? (
                <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
                    <Text variant="displayMedium">Loading...</Text>
                </View>
            ) : (
                <BottomNavigation 
                    navigationState={{index, routes}}
                    onIndexChange={setIndex}
                    renderScene={renderScene}
                />
            )}
        </PaperProvider>
    )

}
