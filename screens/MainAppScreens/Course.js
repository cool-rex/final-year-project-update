import React, { useState, useEffect, useCallback} from 'react'

import { SafeAreaView, View, Text, StyleSheet, ScrollView, Pressable, Linking, TouchableOpacity, RefreshControl, ActivityIndicator} from "react-native";
import { color, font } from '../../global/styles'

import { Ionicons, Feather, MaterialIcons} from "@expo/vector-icons";


import { StatusBar } from 'expo-status-bar';

import { useNavigation } from '@react-navigation/native';
import axios from 'axios';


url = 'https://ugpartnerrex.pythonanywhere.com/'


const Course = ({route}) => {


    const [data, setData] = useState([])
    const [loading, setLoading] = useState()
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)

    const navigation = useNavigation();

    const {course_code, course_name} = route.params;
    // const coursesCode = "UGRC110"
    let title = 'Past Questions for ' + course_code;

    const getCourseDeets = () => {
        try{
            axios.get(url+'course/course-to-course-past-question/'+course_code)
            .then((response)=>{
                setData(response.data)
                setLoading(false)
                setIsLoading(false)
                setError(null)
            })
            .catch((error)=>{
                setIsLoading(false)
                setLoading(false)
                setError(error)
            })
        }
        catch(error){
            setError(error)
        }
    }

    useEffect(()=>{
        setIsLoading(true)
        getCourseDeets();
    }, [])

    const OpenURLButton = ({url}) => {
        const handlePress = useCallback(async () => {
          const supported = await Linking.canOpenURL(url);
      
          if (supported) {
            await Linking.openURL(url);
          } 
        }, [url]);
      
        return (
            <Pressable style={{backgroundColor: color.light, borderRadius: 4, height: 1, padding:14, justifyContent: 'center', alignItems: 'center',width: 1, alignSelf:'flex-end' }} onPress={handlePress}>
                <Feather
                    name='arrow-down'
                    size={24}
                    style={{ position: 'absolute',}}
                />
            </Pressable>
        )
      };

        return(
        <SafeAreaView style={{flex: 1, backgroundColor: color.background}}>

            <View style={styles.Container}>
            <View style={{display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'space-between', paddingBottom: 14, paddingTop: 4 }}>
                <View style={{alignSelf: 'center'}}>
                <MaterialIcons
                    name="arrow-back-ios"
                    size={24}
                    onPress={()=>navigation.goBack()}
                    style={{
                        paddingTop: 2,
                        paddingRight: 6,
                        borderColor: '#ddd',
                        flex: 1,
                        textAlign: 'center', 
                        alignSelf: 'center'
                    }}
                    />
                    </View>
                    <View style={{width: '92%',  alignSelf: 'center' }}>
                        <Text style={{fontSize: 20, fontFamily: font.medium, color: color.primary}}>{title}</Text>
                    </View>
                </View>
                <ScrollView showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={loading} onRefresh={()=>getCourseDeets()}/>
                }
                style={{paddingTop: 2,}}
                >
                {isLoading && 
                    <View style={{flex:1, justifyContent: 'center', alignItems: 'center', }}>
                        <ActivityIndicator size={'small'} color={color.primary} />
                    </View>
                }
                {error && 
                    <View style={{flex:1, justifyContent: 'center', alignItems: 'center', }}>
                        <Text style={{color: color.primary, fontSize: 20, fontFamily: font.medium}}>Error in fetching data... Please check your internet connection</Text>
                    </View>
                }

                <View style={styles.container}>
                {data.map((data)=>{
                    const title = data.title;
                    const uriLink = data.pastQuestionFile;
                    return(
                        <TouchableOpacity key={uriLink} activeOpacity={0.7} style={styles.secondaryContainer} 
                        onPress={()=> {navigation.navigate('PastQuestionViewer', {
                            title: title,
                            uriPdf: uriLink,
                        })}}
                        >
                            <View style={{width: '15%', justifyContent: 'center'}}>
                                <View style={{ borderRadius: 4, width: 1, height: 1, padding: 18, justifyContent: 'center', alignItems: 'center',width: 1, alignSelf:'flex-start', marginRight: 6}}>
                                    <Ionicons
                                        name="documents"
                                        size={32}
                                        style={{position: 'absolute', }}
                                        color={color.primary}
                                    />
                                </View>
                            </View>
                            <View style={{width: '65%', justifyContent: 'center'}}>
                                <Text style={{ fontFamily: font.medium,fontSize: 18, color: color.dark, includeFontPadding:false, marginTop: -4}}>{title}</Text>
                            </View>
                            <View style={{width: '18%', justifyContent: 'center'}}>
                            <OpenURLButton url={uriLink} />
                            </View>

                </TouchableOpacity>
                    )
                })}
                </View>
                </ScrollView>
            </View>
            <StatusBar style="auto" translucent={false} />
            </SafeAreaView>
        )


    // return(
    //     <SafeAreaView style={{flex: 1, }}>
    //         <Stack.Navigator>
    //             <Stack.Screen name={title} component={Lesson} options={{headerTitle:title, headerShadowVisible:false,
    //                 headerTintColor: color.primary,
    //                 headerStyle: { backgroundColor: color.background },
    //                 headerTitleStyle: {fontFamily: font.semiBold}}}/>
    //             {/* <Stack.Screen name='LessonDoc' component={OnLessonDoc} options={{headerTitle : ''}}/> */}
    //         </Stack.Navigator>
    //     </SafeAreaView>   
    // )
}


export default Course;


const styles = StyleSheet.create({
    Container :{
        flex: 1,
        backgroundColor: color.background,
        marginTop: 8,
        marginBottom: 64,
        paddingHorizontal: 16,
    },
    container: {
        flex: 1,
        

    },
    secondaryContainer:{
        backgroundColor: color.lightGrey,
        flexDirection: 'row',
        padding: 14,
        borderRadius: 14,
        shadowRadius: 8,
        shadowOpacity: 0.2,
        shadowColor: "#ccc",
        shadowOffset: {width: 1, height: 1},
        elevation: 4,
        marginBottom: 16,
        justifyContent: 'space-between',
    }
})