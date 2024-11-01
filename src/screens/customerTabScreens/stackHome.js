import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createDrawerNavigator } from '@react-navigation/drawer'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import { View, Text, StyleSheet, ImageBackground, Alert } from 'react-native'
import { createStackNavigator } from '@react-navigation/stack'
import HomeScreen from './../homeScreen';
import InitHome from './topTabs/initHome'
import SenderDetail from './topTabs/senderDetail'
import RecieverDetail from './topTabs/recieverDetail'
import ProductDetail from './topTabs/productDetail'

const Stack = createStackNavigator()
const Drawer = createDrawerNavigator()
const Tab = createMaterialTopTabNavigator()

export function TopTab(){
    return(
        <Tab.Navigator screenOptions={{ headerShown: false }}>
            <Tab.Screen name="Home" component={InitHome} />
            <Tab.Screen name="Sender" component={SenderDetail} />
            <Tab.Screen name="Reciever" component={RecieverDetail} />
            <Tab.Screen name="Product" component={ProductDetail} />
        </Tab.Navigator>
    )
}

function StackNavigator(){
    return(
        <Stack.Navigator
            screenOptions={{
                headerStyle: {backgroundColor: "red"},
                headerTintColor: "black",
                headerTitleStyle: {fontWeight: "normal"}
            }}
            independent={true}
        >
            <Stack.Screen 
                name="Init"
                component={InitHome}
                options={{
                    title: "Init",
                    headerTitleStyle: {alignSelf: "center", fontWeight: "bold"},
                    headerTitleAlign: "center",
                    headerStyle: {backgroundColor: "#d4d4d4", height: 80}
                }}
            />

            <Stack.Screen 
                name="Home"
                component={HomeScreen}
                options={{
                    title: "Homes",
                    headerTitleStyle: {alignSelf: "center", fontWeight: "bold"},
                    headerTitleAlign: "center",
                    headerStyle: {backgroundColor: "#d4d4d4", height: 80}
                }}
            />
        // </Stack.Navigator>
    )
}

export function StackHome(){
    <NavigationContainer>
        <StackNavigator />
    </NavigationContainer>
}

function MyDrawer(){
    return(
        <Drawer.Navigator>
            <Drawer.Screen name="Feed" component={StackHome} />
            <Drawer.Screen name="Article" component={InitHome} />
        </Drawer.Navigator>
    )
}

export default MyDrawer
