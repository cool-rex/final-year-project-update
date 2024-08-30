import React, { useEffect, useState, useCallback} from 'react'
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View, Modal, Linking, Alert, TextInput, RefreshControl, FlatList, Pressable } from 'react-native'
import { color, font } from '../../global/styles';
import { Avatar, Input } from '@rneui/themed';
import { MaterialCommunityIcons, MaterialIcons, FontAwesome, Ionicons } from '@expo/vector-icons';
import { collection, getDoc, doc, getDocs } from "firebase/firestore";
import { db } from '../../firebase';


import timeImg from '../../assets/time.png'
import complainImg from '../../assets/complain.png'
import scheduleImg from '../../assets/schedule.png'
import weeklyImg from '../../assets/weekly.png'
import { SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';

import { useNavigation } from '@react-navigation/native';


const Home = ({userId}) => {
    
    const navigation = useNavigation();


    const [news, setNews] = useState([])
    const [counsellingDays, setCounsellingDays] = useState([])
    const [open, setOpen] = useState(false)
    const [open1, setOpen1] = useState(false)
    
    const [email, setEmail] = useState('')

    const [open2, setOpen2] = useState(false)

    const [newsHeader, setNewsHeader] = useState('')
    const [newsBody, setNewsBody] = useState([])


    const [counEmail, setCounEmail] = useState('')
    const [counMessage, setCounMessage] = useState('')

    
    const [userData, setUserData] = useState([])

    const[loading, setLoading] = useState();

    
    
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



    const getNews = async ()  =>{
        const getNewsData = [];

        const querySnapshot = await getDocs(collection(db, "news"));
        
        querySnapshot.forEach((doc) => {
        getNewsData.push({
            ...doc.data(),
            key: doc.id,
        });
    })
    setNews(getNewsData)
    setLoading(false)
    }

    
    useEffect(()=>{
        getUserData();
        getNews();
    }, [])
    
    const forOnRefresh = () => {
        getUserData();
        getNews();
    }

    let today = new Date()
    let currentHour = today.getHours()
    let greetings;
    if (currentHour < 12){
        greetings = "Good Morning,"
    }else if(currentHour < 16){
        greetings = "Good Afternoon,"
    }else{
        greetings = "Good Evening,"
    }

    const someData = [
        {id: 1, text: "Daily", text1: "Homework", img: timeImg, color: '#FC6238'},
        {id: 2, text: "Submit", text1: "a complaint", img: complainImg, color: "#273D52"},
        {id: 3, text: "Weekly", text1: "Update", img: weeklyImg, color: "#1B75FF"},
        {id: 4, text: "Weekly", text1: "Schedule", img: scheduleImg, color: "#858EF8"},
    ]

    const academicFeesLink = 'https://sts.ug.edu.gh/services/pay/academic';
    const residentialFeesLink = 'https://sts.ug.edu.gh/services/pay/residential';
    const internshipFeesLink = 'https://sts.ug.edu.gh/services/pay/internship';
    const sakaiLink = 'https://sakai.ug.edu.gh/portal'
    const stsTimetableLink = 'https://sts.ug.edu.gh/timetable/'


    const OpenURLButton = ({url, children}) => {
        const handlePress = useCallback(async () => {
          const supported = await Linking.canOpenURL(url);
      
          if (supported) {
            await Linking.openURL(url);
          } 
        }, [url]);
      
        return (
            <TouchableOpacity activeOpacity={0.7} onPress={handlePress}>
                <View style={styles.feesContainer}>
                    <Text style={{fontSize: 18, color: color.primary, textAlign: 'center', fontFamily: font.semiBold}}>{children}</Text>
                </View>
            </TouchableOpacity>
        )
      };
      const OpenURLButton1 = ({url, coloR, img, children1, children}) => {
        const handlePress = useCallback(async () => {
          const supported = await Linking.canOpenURL(url);
      
          if (supported) {
            await Linking.openURL(url);
          } 
        }, [url]);
      
        return (
            <TouchableOpacity onPress={handlePress} style={{width: "45%", height: 120, backgroundColor: coloR, borderRadius: 20,}} activeOpacity={0.7}>
                <Image source={img} style={{width: "100.5%", height: '100.5%', borderRadius: 20 }}/>
                <View style={{marginHorizontal: 16, marginVertical:12, position:'absolute'}}>
                    <Text style={{fontFamily: font.medium, fontSize: 16, color: '#fff',}}>{children}</Text>
                    {children1 && <Text style={{fontFamily: font.regular, fontSize: 16, color: '#fff'}}>{children1}</Text>}
                </View>
            </TouchableOpacity>
        )
      };
    const PayFees = () => {
        return(
            <SafeAreaView>
                <View>
                    <OpenURLButton url={academicFeesLink}>Make Payment for Academic Fees</OpenURLButton>
                    <OpenURLButton url={residentialFeesLink}>Make Payment for Residential Fees</OpenURLButton>
                    <OpenURLButton url={internshipFeesLink}>Make Payment for Internship Fees</OpenURLButton>
                </View>
            </SafeAreaView>
        )
    }

    const SakaiTimetable = () => {
        return(
            // <SafeAreaView>
                <>
                    <OpenURLButton1 url={sakaiLink} coloR='#1B75FF' img={weeklyImg} children1="">Sakai</OpenURLButton1>
                    <OpenURLButton1 url={stsTimetableLink} coloR="#858EF8" img={scheduleImg} children1="Timetable">Daily</OpenURLButton1>
                </>
        )
    }


    const newsModal = (newsHeader, newsBody) =>{
        setOpen2(true);
        setNewsHeader(newsHeader);
        setNewsBody(newsBody);
    }
    
    return (
    <View style={styles.Container}>
    <SafeAreaView>
    <ScrollView showsVerticalScrollIndicator={false}
        refreshControl={
            <RefreshControl refreshing={loading} onRefresh={()=>forOnRefresh()}/>
        }
    >
    <View style={styles.container}>
    <Modal visible={open} animationType="slide">
            <SafeAreaView style={{flex: 1, }}>
            <View style={{flex: 1, backgroundColor: color.background,}}>
            <View style={{flex: 1, marginHorizontal: 20, marginTop: 16 }}>
                <MaterialIcons
                    name="close"
                    size={24}
                    onPress={()=>setOpen(false)}
                    style={{marginBottom: 10,
                        // borderWidth: 1,
                        // borderRadius: 10,
                        padding: 6,
                        borderColor: '#ddd',
                        alignSelf: "flex-end",
                        color: color.primary,
                        // fontWeight: 'bold'
                    }}
                    />
                    <PayFees/>
                    </View>
                    </View>
            </SafeAreaView>
        <StatusBar style="auto" translucent={false} />
    </Modal>

    
    {/* search Courses */}
    {/* <Modal visible={searchOpen} animationType="slide">
            
    </Modal> */}

    <Modal visible={open2} animationType="slide">
            <SafeAreaView style={{flex: 1, }}>
            <View style={{flex: 1, backgroundColor: color.background,}}>
            <ScrollView showsVerticalScrollIndicator={false}>
            <View style={{flex: 1, marginHorizontal: 20, marginTop: 16 }}>
                <View style={{display: 'flex', flexDirection: 'row'}}>
                <MaterialIcons
                    name="arrow-back-ios"
                    size={24}
                    onPress={()=>setOpen2(false)}
                    style={{marginBottom: 10,
                        // borderWidth: 1,
                        // borderRadius: 10,
                        paddingVertical: 6,
                        paddingRight: 6,
                        borderColor: '#ddd',
                        alignSelf: "flex-start",}}
                    />
                    <Text style={{color: color.primary, fontSize: 20, fontFamily: font.semiBold, }}>{newsHeader}</Text>
                </View>
                {newsBody.map((data)=>{
                    return(
                        <View key={data}>
                            <View style={styles.newsBodyContainer}>
                                <Text style={{fontSize: 16, color: '#000000', textAlign: 'left', fontFamily: font.regular}}>{data}</Text>
                            </View>
                        </View>
                    )
                })}
            </View>
            </ScrollView>
            </View>
            </SafeAreaView>
        <StatusBar style="auto" translucent={false} />
    </Modal>

        <View style={{marginHorizontal: 26,}}>
        <View style={styles.topContainer}>
            <Pressable style={styles.userContainer} onPress={()=>navigation.navigate('Profile')}>
                    <Avatar
                    rounded
                    title= {userData.name && userData.name[0]}
                    titleStyle={{fontFamily: font.medium, fontSize: 44, color: color.light}}
                    size={72}
                    // activeOpacity = {0.7}
                    overlayContainerStyle={{backgroundColor: color.primaryAlt,}}
                    containerStyle={{marginRight: 8}}
                    />
                <View style={{alignSelf: 'center',}}>
                    <Text style={{fontFamily: font.regular, fontSize: 16, color: "#757575", textAlignVertical: 'center' }}>{greetings}</Text>
                    <Text style={{fontFamily: font.medium, fontSize: 20, color: color.primary, textAlignVertical:'center', maxWidth: 200}}>{userData.name}</Text>
                </View>
            </Pressable>

            <View>
            <MaterialCommunityIcons
                name='bell'
                color= {color.primary}
                size={32}
                style={{paddingTop: 9}}
            />
            </View>
        </View>
        <View>
            <Input
                placeholder="Search for a course" 
                placeholderTextColor={color.primaryAlt}
                rightIcon={<Ionicons
                    name={"search"}
                    size={24}
                color= {color.primaryAlt}
                />}
                type="search"
                style={styles.input}
                inputContainerStyle={styles.inputContainer}
                inputStyle={styles.inputstyle}
                    // onSubmitEditing={signUp}
                containerStyle={styles.search}
                onPress={()=>navigation.navigate('SearchCourse')}
            />
        </View>
        <View style={{flexDirection: 'row', marginTop: 16,}}>
            <TouchableOpacity activeOpacity={0.7} style={{alignItems: 'center'}} onPress={()=>setOpen(true)}>
                <Image
                    source={require('../../assets/Cash.png')}
                    style={{width: 48, height: 48}}
                />
                <Text style={styles.supportText}>Pay Fees</Text>
            </TouchableOpacity>
        </View>
        </View>
        <View style={styles.secondaryContainer}>
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            <View style={styles.newsContainer}>
                {news.map((data)=> {
                    const newsHead = data.Topic
                    const newsBody = data.Body
                    return(
                        <View key={data.key} style={styles.newscontainer}>
                        <Image
                            source={require('../../assets/friends.png')}
                            style={{width: "60%", height: '100%', }}
                        />
                        <View style={{width: "40%", alignSelf: 'center',}} >
                            <Text style={{fontFamily: font.regular, fontSize: 16, textAlign: 'center', alignSelf: 'flex-end'}}>{newsHead}</Text>
                            <TouchableOpacity activeOpacity={0.7} style={{ backgroundColor: color.secondary, marginTop: 8, width:120, alignSelf: 'flex-end', borderRadius: 50, paddingVertical: 4}} onPress={()=>newsModal(newsHead, newsBody)}>
                                <Text style={{fontFamily: font.medium, fontSize: 14, color: "#fff", textAlign: 'center', }}>Read More</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    )
                })}
            </View>
            </ScrollView>

            <View style={{width: '100%', flexDirection: 'row', flexWrap: 'wrap', columnGap: 16, rowGap:16, justifyContent: 'center'}}>
                <TouchableOpacity style={{width: "45%", height: 120, backgroundColor: '#FC6238', borderRadius: 20,}} activeOpacity={0.7} onPress={()=>navigation.navigate('SearchCourse')}>
                    <Image source={timeImg} style={{width: "100.5%", height: '100.5%', borderRadius: 20 }}/>
                    <View style={{marginHorizontal: 16, marginVertical:12, position:'absolute'}}>
                        <Text style={{fontFamily: font.medium, fontSize: 16, color: '#fff',}}>Past</Text>
                        <Text style={{fontFamily: font.regular, fontSize: 16, color: '#fff'}}>Questions</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={{width: "45%", height: 120, backgroundColor: "#273D52", borderRadius: 20,}} activeOpacity={0.7}>
                    <Image source={complainImg} style={{width: "100.5%", height: '100.5%', borderRadius: 20 }}/>
                    <View style={{marginHorizontal: 16, marginVertical:12, position:'absolute'}}>
                        <Text style={{fontFamily: font.medium, fontSize: 16, color: '#fff',}}>Submit</Text>
                        <Text style={{fontFamily: font.regular, fontSize: 16, color: '#fff'}}>a complaint</Text>
                    </View>
                </TouchableOpacity>
                <SakaiTimetable/>
            </View>
        </View>
    </View>
    </ScrollView>
    <StatusBar style="auto" translucent={false} />
    </SafeAreaView>
    </View>
  )
}

export default Home

const styles = StyleSheet.create({
    Container :{
        flex: 1,
        backgroundColor: color.background,
        // padding: 0,
    },
    container: {
        flex: 1,
        // backgroundColor: color.background,
        // padding: 12,
        marginTop: 16,
        marginBottom: 50,
    },
    topContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    userContainer:{
        flexDirection: 'row',
    },
    input:{
        fontSize: 16,
        fontFamily: font.medium,
        color: color.primaryAlt,
    },
    inputstyle:{
        color: color.primaryAlt,
    },
    search:{
        // width: "100%",
        borderColor: color.primaryAlt,
        borderWidth: 1.5,
        alignContent: 'center',
        height: 0,
        paddingVertical: 20,
        borderRadius: 8,
        marginTop: 16,
    },
    inputSearch:{
        borderColor: color.primaryAlt,
        paddingHorizontal: 10,
        paddingVertical: 10,
        borderWidth: 1.5,
        borderRadius: 8,
        fontSize: 16,
        fontFamily: font.medium,
        color: color.primaryAlt,
    },
    inputContainer:{
        borderWidth: 0,
        borderColor: color.background,
        borderRadius: 10,
    },
    supportText:{
        fontFamily: font.regular,
        fontSize: 14,
        textAlign: 'center'
    },
    secondaryContainer:{
        backgroundColor: '#ffffff',
        color: "#fff",
        marginTop: 16,
        paddingHorizontal: 16,
        paddingVertical: 16,
        // borderColor: '#000',
        // borderWidth: 1,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        marginBottom: 20,
    },
    newsContainer:{
        flexDirection: 'row',
        // columnGap: 12,
        columnGap: 16,
        rowGap:16,
        marginLeft: 12,
        marginRight: 12,
        marginTop: 16,
        marginBottom: 30,
        // justifyContent: 'center',
    },
    newscontainer: {
        width: 338,
        height: 132,
        borderWidth: 2,
        borderColor: color.grey,
        flexDirection: 'row',
        // paddingHorizontal: 10,
        // paddingBottom: 10,
        
        paddingTop: 4,
        paddingHorizontal: 10,
        borderRadius: 20,
    },
    feesContainer: {
        borderRadius: 10,
        backgroundColor: "#FFF",
        shadowRadius: 8,
        padding: 18,
        shadowOpacity: 0.2,
        shadowColor: "#ccc",
        shadowOffset: {width: 1, height: 1},
        elevation: 4,
        marginTop: 18,    
    },
    counselContainer: {
        borderRadius: 10,
        backgroundColor: "#F2D7FF",
        shadowRadius: 8,
        paddingVertical: 12,
        shadowOpacity: 0.2,
        shadowColor: "#ccc",
        shadowOffset: {width: 1, height: 1},
        elevation: 4,
        marginTop: 18,
        paddingHorizontal: 4   
    },
    newsBodyContainer: {
        borderRadius: 10,
        backgroundColor: "#D7E9FF",
        paddingVertical: 16,
        marginBottom: 18,
        paddingHorizontal: 14   
    }

})