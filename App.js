import 'react-native-gesture-handler';

import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './screens/AuthenticationScreens/LogIn';
import SignUpScreen from './screens/AuthenticationScreens/SignUp';
import Splash from './screens//HomeScreens/splashHome';
import Home from './screens/MainAppScreens/Home';
import Profile from './screens/MainAppScreens/Profile';
import Course from './screens/MainAppScreens/Course';

import { useFonts, Poppins_300Light,Poppins_400Regular, Poppins_500Medium, Poppins_600SemiBold, Poppins_700Bold, Poppins_800ExtraBold, Poppins_400Regular_Italic} from '@expo-google-fonts/poppins';

import { Text, View } from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { getItemFor } from './global/storageHelper';

import { StatusBar } from "expo-status-bar";
import SearchCourse from './screens/MainAppScreens/SearchCourse';
import PastQuestionViewer from './screens/MainAppScreens/PastQuestionViewer';


const Stack = createStackNavigator();


// const HAS_LOGIN = 'HAS_LOGIN'

export default function App(props) {

  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userId, setUserId] = useState()
  useEffect(()=>{
    const getData = async () => {
      const hasLoggedIn = await getItemFor('HAS_LOGIN')
      if(hasLoggedIn){
        setIsLoggedIn(true);
        setUserId(hasLoggedIn)
      }
      else{
        setIsLoggedIn(false) 
      }
    };
    getData().catch((error)=>{console.log(error)})
  }, [])

  let [fontsLoaded, fontError] = useFonts({
    Poppins_300Light,
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
    Poppins_400Regular_Italic,
    Poppins_800ExtraBold,
  });

  if (!fontsLoaded && !fontError) {
    return null;
  }

  const HomePage = () => {
    return(
      <Home userId={userId} setIsLoggedIn={setIsLoggedIn}/>
    )
  }
  const ProfilePage = () => {
    return(
      <Profile userId={userId} setIsLoggedIn={setIsLoggedIn}/>
    )
  }
  const LogInPage = () => {
    return(
      <LoginScreen setIsLoggedIn={setIsLoggedIn} setUserId={setUserId}/>
    )
  }
  const AuthStack = () => {
    return(
      <Stack.Navigator>
        <Stack.Screen name="Splash" component={Splash} options={{headerShown:false}}/>
        <Stack.Screen name="Login" component={LogInPage} options={{headerShown:false}}/>
        <Stack.Screen name="SignUp" component={SignUpScreen} options={{headerShown:false}}/>
      </Stack.Navigator>
    )
  }
  const AppStack = () => {
    return(
      <Stack.Navigator>
        <Stack.Screen name="HomePage" component={HomePage} options={{headerShown:false}}/>
        <Stack.Screen name="Profile" component={ProfilePage} options={{headerShown:false}}/>
        <Stack.Screen name="SearchCourse" component={SearchCourse} options={{headerShown:false}}/>
        <Stack.Screen name="Course" component={Course} options={{headerShown:false}}/>
        <Stack.Screen name="PastQuestionViewer" component={PastQuestionViewer} options={{headerShown:false}}/>
      </Stack.Navigator>
    )
  }
      return (
        <NavigationContainer>
          {isLoggedIn ? <AppStack/> : <AuthStack/>}
        <StatusBar style="auto" translucent={false} />
        </NavigationContainer>
      );
  }