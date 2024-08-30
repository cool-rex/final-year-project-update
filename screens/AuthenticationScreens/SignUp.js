import 'react-native-gesture-handler';

import React from "react";
import { View, Text, StyleSheet, Image, ScrollView } from "react-native";
import { Button, Input} from "@rneui/themed";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { FontAwesome } from "@expo/vector-icons";
import { color, font } from "../../global/styles";
import { Ionicons } from "@expo/vector-icons";

import { Snackbar } from "react-native-paper";

import { auth, db } from "../../firebase";

const SignUpScreen =({navigation}) => {

    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [password1, setPassword1] = useState('');
    const [isValid, setIsValid] = useState(true);
    const [passwordVisible, setPasswordVisible] = useState(true)
    const [passwordVisible1, setPasswordVisible1] = useState(true)


    const onSignUp = () => {
        let regex = /^[a-zA-Z\s]+$/;

        if(name.length == 0){
            setIsValid({bool : true, boolSnack: true, message: "Username field cannot be empty"})
            return;
        }
        if(name.charAt(0) == " "){
            setIsValid({bool : true, boolSnack: true, message: "Your first character cannot be empty, please clear the white space at begining of name"})
            return;
        }
        if(name.length < 3){
            setIsValid({bool : true, boolSnack: true, message: "Username must have at least 3 characters"})
            return;
        }
        if(regex.test(name) == false){
            setIsValid({bool : true, boolSnack: true, message: "Invalid input type for name. Only accepts string characters"})
            return;
        }
        if(email.length == 0){
            setIsValid({bool : true, boolSnack: true, message: "Cannot have an empty field for email"})
            return;
        }
        if(password.length == 0){
            setIsValid({bool : true, boolSnack: true, message: "Cannot have an empty field for password"})
            return;
        }
        if(password.length < 6){
            setIsValid({bool : true, boolSnack: true, message: "password must be at least 6 characters"})
            return;
        }
        if(password === password1){
            auth.createUserWithEmailAndPassword(email, password)
            .then((result)=>{
                db.collection("users")
                .doc(auth.currentUser.uid)
                .set({
                    name,
                    email,
                })
                .then(()=>{
                    navigation.navigate('Login')
                })
                // console.log(result)
            })
            .catch((error)=>{
                console.log(error)
                if(error.code === 'auth/email-already-in-use'){
                    setIsValid({bool : true, boolSnack: true, message: "Email already exists"})
                }
                else if(error.code === 'auth/invalid-email'){
                    setIsValid({bool : true, boolSnack: true, message: "The email address is invalid"});
                }
                else{
                    Alert.alert(error.code)
                }
            })
        }
        else{
            setIsValid({bool : true, boolSnack: true, message: "passwords do not match"})
            return;
        }
    }
    
    return(
        
        <View  style={styles.container}>
            <ScrollView>
            <View style={styles.container1}>
            <Image
            source={require('../../assets/projectImages/UoG.png')}
            style={{width: 160, height: 160}}
            />
            <Text style={{textAlign:"center", color: color.primary, fontSize: 22, fontFamily: font.bold, marginTop: 28,}}>New here? Join us now</Text>
            <View style={styles.inputContainers}>
                <Input
                    placeholder="Username" 
                    leftIcon={<FontAwesome
                        name='user'
                        size={24}
                        color= '#999999'
                />}
                    type="text"
                    value={name}
                    onChangeText={(name)=>setName(name)}
                    style={styles.input}
                    inputContainerStyle={styles.inputContainer}
                    inputStyle={styles.inputstyle}
                    />

                <Input
                    placeholder="Student email" 
                    leftIcon={<FontAwesome
                        name='envelope'
                        size={16}
                        color= '#999999'
                />}
                    // autoFocus 
                    type="email"
                    value={email}
                    onChangeText={(email)=>setEmail(email)}
                    style={styles.input}
                    inputContainerStyle={styles.inputContainer}
                    inputStyle={styles.inputstyle}
                    />

                <Input
                    placeholder="Create a password" 
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
                <Input
                    placeholder="Confirm your password" 
                    leftIcon={<FontAwesome
                        name='lock'
                        size={24}
                        color= '#999999'
                />}
                    rightIcon={<Ionicons
                        name={passwordVisible1 ? "eye" : "eye-off"}
                        onPress={() => setPasswordVisible1(!passwordVisible1)}
                        size={24}
                        color= '#444444'
                />}
                    secureTextEntry = {passwordVisible1}
                    type="password1"
                    value={password1}
                    onChangeText={(password1)=>setPassword1(password1)}
                    style={styles.input}
                    inputContainerStyle={styles.inputContainer}
                    inputStyle={styles.inputstyle}
                    />
            </View>
            <Button onPress={()=>onSignUp()} containerStyle={styles.button} titleStyle={{fontSize: 20,fontFamily: font.medium,}} buttonStyle={styles.buttonS} title='Sign up'/>
            <Text style={{fontFamily: font.regular, fontSize: 16, color: '#1E1D1D'}}>Already have an account? <Text style={{color:color.secondary, fontFamily: font.bold}} onPress={()=>navigation.navigate('Login')}>Log in here</Text></Text>
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


export default SignUpScreen;

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
        marginBottom: 24,
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
        marginBottom: 40,

    },

    footerText:{
        fontSize: 13,
        fontFamily: font.regular,
        color: '#1E1D1D'
    }
})