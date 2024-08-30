import 'react-native-gesture-handler';

import React, { useEffect } from "react";
import { View, Text, StyleSheet, Image, ScrollView, Alert } from "react-native";
import { Button, Input} from "@rneui/themed";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { FontAwesome } from "@expo/vector-icons";
import { color, font } from "../../global/styles";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from '@react-navigation/native';
import { Snackbar } from "react-native-paper";
import { auth } from "../../firebase";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { storeData } from '../../global/storageHelper';



const LoginScreen =({setIsLoggedIn, setUserId}) => {
    const navigation = useNavigation();
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isValid, setIsValid] = useState(true)
    const [passwordVisible, setPasswordVisible] = useState(true)
   
    const [logInData, setLogInData] = useState()
    
    const HAS_LOGIN = 'HAS_LOGIN'

    const onSignIn = () => {
        auth.signInWithEmailAndPassword(email, password)
            .then( async (result)=>{
                // console.log(result)

                setUserId(auth.currentUser.uid)
                await storeData(HAS_LOGIN, auth.currentUser.uid)
                .then(()=>{
                    setIsLoggedIn(true)
                })
                // useEffect(()=>{
                //     const getData = () =>{
                        
                //     }
                // })
                // console.log(auth.currentUser.uid)
            })
            .catch((error)=>{
                // console.log(error)
                if(error.code === 'auth/invalid-email'){
                    setIsValid({bool : true, boolSnack: true, message: "The email address is invalid"});
                }
                else if(error.code === 'auth/missing-password'){
                    setIsValid({bool : true, boolSnack: true, message: "Password is required to login"});
                }
                else if(error.code === 'auth/invalid-login-credentials'){
                    setIsValid({bool : true, boolSnack: true, message: "Invalid Credentials. Please try again"});
                }
                else if(error.code === 'auth/invalid-credential'){
                    setIsValid({bool : true, boolSnack: true, message: "Invalid Credentials. Please try again"});
                }
                else{
                    Alert.alert(error.code)
                }
            })
    }
    
    return(
        
        <View  style={styles.container}>
            <ScrollView>
            <View style={styles.container1}>
            <Image
            source={require('../../assets/projectImages/UoG.png')}
            style={{width: 160, height: 160}}
            />
            <Text style={{textAlign:"center", color: color.primary, fontSize: 22, fontFamily: font.bold, marginTop: 28,}}>Sign in to your account</Text>
            <View style={styles.inputContainers}>
                <Input
                    placeholder="Student email" 
                    leftIcon={<FontAwesome
                        name='envelope'
                        size={16}
                        color= '#999999'
                />}
                    autoFocus 
                    type="email"
                    value={email}
                    onChangeText={(email)=>setEmail(email)}
                    style={styles.input}
                    inputContainerStyle={styles.inputContainer}
                    inputStyle={styles.inputstyle}
                    />
                <Input
                    placeholder="Password" 
                    leftIcon={<FontAwesome
                        name='lock'
                        size={24}
                        color= '#999999'
                />}
                    rightIcon={<Ionicons
                        name={passwordVisible ? "eye" : "eye-off"}
                        onPress={() => setPasswordVisible(!passwordVisible)}
                        size={24}
                        color= '#444444'
                />}
                    secureTextEntry = {passwordVisible}
                    type="password"
                    value={password}
                    onChangeText={(password)=>setPassword(password)}
                    style={styles.input}
                    inputContainerStyle={styles.inputContainer}
                    inputStyle={styles.inputstyle}
                    />
            </View>
            <Button onPress={() => onSignIn()} containerStyle={styles.button} titleStyle={{fontSize: 20,fontFamily: font.medium,}} buttonStyle={styles.buttonS} title='Log in'/>
            <Text style={{fontFamily: font.regular, fontSize: 16, color: '#1E1D1D'}}>Don't have an account? <Text style={{color: color.secondary, fontFamily: font.bold}} onPress={()=>navigation.navigate('SignUp')}>Sign up here</Text></Text>
            </View>
            <View style={styles.footer}>
                <Text style={styles.footerText}> Terms and conditions</Text>
                <Text style={styles.footerText}> Privacy Policy</Text>
            </View>
            </ScrollView>
            <StatusBar style="auto"/>
            <Snackbar 
                visible={isValid.boolSnack}
                duration={4000}
                onDismiss={()=>{setIsValid({boolSnack: false})}}
                style={{backgroundColor:"red",}}
                
            >
                {isValid.message}
            </Snackbar>
    <StatusBar style="auto" translucent={false} />
        </View>
        
        
    )
}


export default LoginScreen;

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: color.background,
        
    },
    container1:{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 10,
        marginTop: 70,
    },
    inputContainers:{
        width: '100%',
        marginTop: 40,
        marginBottom: 10,
    },
    button:{
        marginTop: 4,
        marginBottom: 28,
        width: 200,
        
    },
    buttonS:{
        backgroundColor: color.primary,
        // backgroundColor: "#1AA7EC",
        borderRadius: 10,
        padding: 6,
    },
    input:{
        fontSize: 18,
        fontFamily: font.regular,
    },
    inputstyle:{
        marginVertical: 4,
        marginHorizontal: 8,
    },
    inputContainer:{
        borderWidth: 0,
        borderColor: color.light,
        padding: 4,
        // paddingHorizontal: 12,
        paddingLeft: 14,
        paddingRight: 14,
        // fontSize: 16,
        borderRadius: 10,
        backgroundColor: color.light,
        shadowRadius: 8,
        shadowOpacity: 0.2,
        shadowColor: "#ccc",
        shadowOffset: {width: 1, height: 1},
        elevation: 4,
    },
    
    footer:{
        marginTop: 80,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        marginBottom: 16,

    },

    footerText:{
        fontSize: 13,
        fontFamily: font.regular,
        color: '#1E1D1D'
    }
})