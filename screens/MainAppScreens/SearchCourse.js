import React, { useEffect, useState} from 'react'

import { SafeAreaView, StyleSheet, View, Text, ActivityIndicator, TextInput, RefreshControl, FlatList, Pressable, TouchableOpacity, ScrollView } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { color, font } from '../../global/styles';
import { MaterialCommunityIcons, MaterialIcons, FontAwesome, Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

import axios from 'axios';
import filter from 'lodash.filter';

   const url = 'https://ugpartner.pythonanywhere.com/'

const SearchCourse = () => {
    const navigation = useNavigation();

    const [searchQueryCode, setSearchQueryCode] = useState("")
    const [searchQueryName, setSearchQueryName] = useState("")
    const [courseData, setCourseData] = useState([])
    const [courseData1, setCourseData1] = useState([])
    const [courseLoading, setCourseLoading] = useState();
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)

    const handleSearchCode = (query) => {
        setSearchQueryCode(query);
        const formattedQuery = query.toLowerCase();
        const filteredData = filter(courseData1, (data) => {
            // data = data.toLowerCase
            return containsCode(data, formattedQuery)
        })
        setCourseData(filteredData)
    }

    const handleSearchTitle = (query) => {
        setSearchQueryName(query);
        const formattedQuery = query.toLowerCase();
        const filteredData = filter(courseData1, (data) => {
            // data = data.toLowerCase
            return containsTitle(data, formattedQuery)
        })
        setCourseData(filteredData)
    }

    const containsCode = ({course_id}, query) =>{
        course_id = course_id.toLowerCase()
        if(course_id.includes(query)){
            return true
        }
        return false
    }
    const containsTitle = ({course_title}, query) =>{
        course_title = course_title.toLowerCase()
        if(course_title.includes(query)){
            return true
        }
        return false
    }
    
    const getCourseData = () => {
        try{
            axios.get(url+'course/')
            .then((response)=>{
                setCourseData(response.data)
                setCourseData1(response.data)
                setCourseLoading(false)
                setIsLoading(false)
                setError(null)
            })
            .catch((error)=>{
                setIsLoading(false)
                setCourseLoading(false)
                setError(error)
            })
        }
        catch(error){
            setError(error)
        }
    }

    useEffect(()=>{
        setIsLoading(true)
        getCourseData();
    }, [])

    return(
        <SafeAreaView style={{flex: 1}}>
            <SafeAreaView style={{flex: 1, }}>
            <View style={{flex: 1, backgroundColor: color.background,}}>
            <View style={{flex: 1, marginHorizontal: 20, marginTop: 16 }}>
                <View style={{display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'space-between' }}>
                <MaterialIcons
                    name="arrow-back-ios"
                    size={24}
                    onPress={()=>navigation.goBack()}
                    style={{marginBottom: 10,
                        // borderWidth: 1,
                        // borderRadius: 10,
                        paddingVertical: 6,
                        paddingRight: 6,
                        borderColor: '#ddd',
                        // alignSelf: "flex-start",
                        flex: 1,
                    }}
                    />
                    <View style={{width: '92%', marginBottom: 15}}>
                        <TextInput 
                            placeholder='Search for a course code'
                            clearButtonMode='always'
                            autoFocus={true}
                            style={styles.inputSearch}
                            autoCapitalize='none'
                            autoCorrect={false}
                            value={searchQueryCode}
                            onChangeText={(query)=>handleSearchCode(query)}
                        />
                    </View>
                </View>
                
                <View >
                    <TextInput 
                        placeholder='Search for a course title' 
                        clearButtonMode='always'
                        style={styles.inputSearch}
                        autoCapitalize='none'
                        autoCorrect={false}
                        value={searchQueryName}
                        onChangeText={(query)=>handleSearchTitle(query)}
                        />
                </View>
                {isLoading && 
                    <View style={{flex:1, justifyContent: 'center', alignItems: 'center'}}>
                        <ActivityIndicator size={'small'} color={color.primary} />
                    </View>
                }
                {error && 
                    <ScrollView contentContainerStyle={{flex:1, justifyContent: 'center', alignItems: 'center',}}
                        refreshControl={
                            <RefreshControl refreshing={courseLoading} onRefresh={()=>getCourseData()}/>
                        }
                        showsVerticalScrollIndicator={false}
                    >
                        <Text style={{color: color.primary, fontSize: 20, fontFamily: font.medium}}>Error in fetching data... Please check your internet connection</Text>
                    </ScrollView>
                }
                <FlatList
                    data={courseData}
                    keyExtractor={(item)=> item.course_title}
                    renderItem={({item})=> (
                        <Deets courseName={item.course_title} courseCode={item.course_id}/>
                    )}
                    refreshControl={
                        <RefreshControl refreshing={courseLoading} onRefresh={()=>getCourseData()}/>
                    }
                    contentContainerStyle={{}}
                    columnWrapperStyle={{justifyContent: 'space-between', }}
                    numColumns={2}
                    style={{marginVertical: 30, }}
                    showsVerticalScrollIndicator={false}
                    removeClippedSubviews={true}
                />

                
            </View>
            </View>
            {/* </ScrollView> */}
            </SafeAreaView>
        <StatusBar style="auto" translucent={false} />
        </SafeAreaView>
    )
}

export default SearchCourse


const Deets = ({courseCode, courseName}) => {
    const navigation = useNavigation()
    const courseNavigation = (code, name) =>{
        navigation.navigate('Course', {
            course_code: code,
            course_name: name,
        })
    }
    return(
        <TouchableOpacity key={courseName} activeOpacity={0.7} style={{width: "47%", height: 120, backgroundColor: color.primaryAlt, borderRadius: 20, justifyContent: 'center', alignItems: 'center', paddingHorizontal:8, marginBottom: 20,}}
        onPress={()=> courseNavigation(courseCode, courseName)}
        >
            <Text style={{color: color.light, fontSize: 16, fontFamily: font.medium}}>{courseCode}</Text>
            <Text style={{color: color.light, fontSize: 16, fontFamily: font.medium, textAlign: 'center'}}>{courseName}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: color.light,
        paddingHorizontal: 16,
        // marginVertical: 16,
        
    },
    container1: {
        flexDirection: "row",
        columnGap: 10,
        marginBottom: 24,
        marginTop: 20,
        // width: "100%"
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

})