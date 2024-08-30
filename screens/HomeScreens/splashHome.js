import { StyleSheet, View, Image } from "react-native";
import { Button, Text} from "@rneui/themed";
import { color, font} from "../../global/styles";
import { StatusBar } from "expo-status-bar";


const Splash = ({navigation}) =>{

    return(
        <View style={styles.container} >
            <View style={styles.container1}>
                <Image 
                source={require('../../assets/projectImages/UoGG.png')}
                style={{width: 209, height: 209, position: 'absolute', bottom: -100, alignSelf: 'center'}}
                />
            </View>
            <View style={styles.conatiner2}>
                <View style={{marginBottom: 20, marginTop: 60}}>
                    <Text  style={styles.header}>Welcome to the</Text>
                    <Text  style={styles.header}>University of Ghana</Text>
                </View>
                <Button 
                    title="Let's get started" 
                    containerStyle={styles.button} 
                    buttonStyle={{backgroundColor: color.primary,borderRadius: 8,}} 
                    titleStyle={{color: color.lightGrey, fontSize: 20, fontFamily: font.medium,}}
                    onPress={()=>navigation.navigate('SignUp')}
                    />
                <Button 
                    title="Login" 
                    containerStyle={styles.button}
                    buttonStyle={{backgroundColor: color.secondary,borderRadius: 8,}} 
                    titleStyle={{color: color.dark, fontSize: 20, fontFamily: font.medium}}
                    onPress={()=>navigation.navigate('Login')}
                    />
            </View>
            <StatusBar style="auto" translucent={false} />
        </View>
    )
}

export default Splash;

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: color.background,
    },
    container1:{
        // flex: 1,
        width: '100%',
        height: '40%',
        backgroundColor: color.light,
    },
    conatiner2:{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 10,
    },
    button:{
        width: 240,
        // height: 48,
        marginBottom: 8,

    },
    header:{
        fontSize: 32,
        color: color.primary,
        textAlign: 'center',
        fontFamily: font.semiBold,
    },
})