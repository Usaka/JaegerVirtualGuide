/**
 * Componente que permite visualizar y controlar el Jaeger
 */

import React, { useState } from 'react'
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Text,
    ActivityIndicator
} from 'react-native'
import { useNavigation } from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import IconFontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

// Componente que renderiza los controles
const ControlPage = () => {
    const navigation = useNavigation();

    // Estados de los controles
    const [buttonAhead, setButtonAhead] = useState(false)
    const [buttonRight, setButtonRight] = useState(false)
    const [buttonLeft, setButtonLeft] = useState(false)
    const [buttonStop, setButtonStop] = useState(false)
    const [showSpinner, setShowSpinner] = useState(true)

    // Metodo para realizar el deslogueo
    const onLogOut = () => {
        navigation.navigate('Login')
        // TODO: Consumir el metodo /Logut del servidor
    }

    return (
        <View style={styles.container}>
            {/* Spinner que indica el estado de la conexión */}
            <ActivityIndicator
                animating={showSpinner}
                size="large"
                color="#3333EEAA"
            />
            {showSpinner &&
                <Text style={styles.textBlack}>
                    Esperando imagen del Jaeger
                </Text>
            }
            {/* Boton para el logout del usuario */}
            <View style={styles.containerLogout}>
                <TouchableOpacity
                    style={styles.boton}
                    onPress={onLogOut}>
                    <AntDesign name="logout" size={40} color="#8C8C8C" />
                </TouchableOpacity>
            </View>
            {/* Contenedor para los botones de Iniciar y Detenerse */}
            <View style={styles.moveControl}>
                <TouchableOpacity
                    style={styles.botonStart}
                    onPress={null}>
                    <FontAwesome5 name="running" size={25} color="#EEE" />
                    <Text style={styles.textStyle}>
                        Iniciar
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.botonStop}
                    onPress={null}>
                    <IconFontAwesome name="hand-stop-o" size={40} color="#EEE" />
                    <Text style={styles.textStyle}>
                        PARA!
                    </Text>
                </TouchableOpacity>
            </View>
            {/* Contenedor para los botones de Izq y Der */}
            <View style={styles.sideControl}>
                <TouchableOpacity
                    style={styles.button}
                    onPress={null}>
                    <AntDesign name="caretleft" size={80} color="#ACACAC" />
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.button}
                    onPress={null}>
                    <AntDesign name="caretright" size={80} color="#ACACAC" />
                </TouchableOpacity>
            </View>
        </View>
    )
}

// Variable que contiene los estilos de la vista
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F2FFFF'
    },
    containerLogout: {
        position: 'absolute',
        top: 5,
        left: 15,
    },
    button: {
        backgroundColor: '#77777733',
        width: 100,
        padding: 10,
        margin: 10,
        borderRadius: 100,
    },
    moveControl: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        left: 50,
        bottom: 25,
    },
    sideControl: {
        position: 'absolute',
        flexDirection: 'row',
        right: 70,
        bottom: 50,
    },
    botonStart: {
        backgroundColor: '#6DD93BAA',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 100,
        margin: 20,
        width: 70,
        height: 70
    },
    botonStop: {
        backgroundColor: '#CE3403AA',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 100,
        margin: 20,
        width: 100,
        height: 100
    },
    textStyle: {
        color: '#eee',
    },
    textBlack: {
        color: '#777',
    }
})

export default ControlPage