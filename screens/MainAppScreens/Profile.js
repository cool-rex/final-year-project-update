import { View, Text,StyleSheet, Pressable, ScrollView, SafeAreaView, RefreshControl } from 'react-native'
import { color, font } from '../../global/styles'
import { Avatar } from '@rneui/themed'
import { AntDesign } from '@expo/vector-icons'
import { getDoc, doc } from "firebase/firestore";
import { db } from '../../firebase';
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from 'react';
import { removeItemFor } from '../../global/storageHelper';





const Profile = ({userId, setIsLoggedIn}) => {

    const [userData, setUserData] = useState([])
    const[loading, setLoading] = useState();

    

  const signOutUser = async () => {
    await removeItemFor('HAS_LOGIN')
    setIsLoggedIn(false)
  }
  
  const getUserData = async ()  =>{

    const docRef = doc(db, "users", userId);
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
        setUserData(docSnap.data())
        setLoading(false)
    } else {
    console.log("No such document!");
    }
    }

    useEffect(()=>{
        getUserData();
    }, [])

  return (
    <View style={styles.Container}>
      <SafeAreaView style={{flex: 1}}>
      <ScrollView showsVerticalScrollIndicator={false}
        refreshControl={
            <RefreshControl refreshing={loading} onRefresh={()=>getUserData()}/>
        }
        style={{flex: 1}}
      >
        <View style={styles.container}>
          <View style={styles.firstContainer}>
            <Text style={{textAlign:'center', fontFamily: font.medium, fontSize: 24}}>Profile</Text>
            <Avatar
              rounded
              title= {userData.name && userData.name[0]}
              titleStyle={{fontFamily: font.semiBold, fontSize: 60, color: color.light}}
              size={140}
              // activeOpacity = {0.7}
              overlayContainerStyle={{backgroundColor: color.primaryAlt,}}
              containerStyle={{marginVertical: 8}}
            />
            <Text style={{textAlign:'center', fontFamily: font.semiBold, fontSize: 26, color: color.primary }}>{userData.name}</Text>
            <Text style={{textAlign:'center', fontFamily: font.medium, fontSize: 20, marginVertical: 4 }}>{userData.email}</Text>
          </View>
          <View style={styles.secondContainer}>
                  <Pressable onPress={signOutUser} style={{flexDirection: 'row', marginBottom: 18, alignItems:'center'}}>
                      <AntDesign
                        name= 'logout'
                        color= {color.primary}
                        size={24}
                        style={{paddingRight: 12}}
                      />
                      <Text style={{fontFamily: font.regular, fontSize: 20}}>Logout</Text>
                  </Pressable>
          </View>
        </View>
        <StatusBar style="auto" translucent={false} />
        </ScrollView>
        </SafeAreaView>
    </View>
  )

}

export default Profile


const styles = StyleSheet.create({
  Container:{
        flex: 1,
        backgroundColor: color.background,
        
    },
    container:{
        flex: 1,
        padding: 10,
        marginTop: 28,
        marginBottom: 36,
    },
    firstContainer:{
        marginBottom: 16,
        alignItems: "center",
        justifyContent: "center",
    },
    secondContainer: {
      width: "100%",
      padding: 16,
    }
})