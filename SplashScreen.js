import React from 'react'
import { View, Image, StyleSheet, ImageBackground } from 'react-native';
import { Text } from 'react-native-paper'

const SplashScreen = () => {
    return(
        <ImageBackground source={require("./src/assets/splash2.jpg")} style={styles.container}>
            {/* <Text variant="headlineLarge">This is the splash screen</Text> */}
            {/* <Image style={styles.splashImage} source={require("./src/assets/rideicon1.jpeg")}/> */}
        </ImageBackground>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#ffffff"
    },
    splashImage: {
        width: "80%",
        height: "80%",
        resizeMode: "contain"
    }
})

export default SplashScreen