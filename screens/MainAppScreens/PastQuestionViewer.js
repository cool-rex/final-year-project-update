import { useNavigation } from '@react-navigation/native';
import { SafeAreaView, View, Text, StyleSheet} from "react-native";
import { color, font } from '../../global/styles'
import { MaterialIcons} from "@expo/vector-icons";
import { StatusBar } from 'expo-status-bar';

import Pdf from 'react-native-pdf';

const PastQuestionViewer = ({route}) =>{

    const navigation = useNavigation()

    const {title, uriPdf} = route.params;

    const pdfSource = {uri : uriPdf, cache: true}
    return(
        <SafeAreaView style={{flex: 1, }}>
        <View style={{flex: 1, backgroundColor: color.background,}}>
        <View style={{display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'space-between', marginBottom: 12, marginTop: 12,paddingHorizontal: 16,}}>
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
            <View style={{flex: 1, marginHorizontal: 4, marginTop: 4 }}>
                <Pdf
                    trustAllCerts={false}
                    source={pdfSource}
                    onLoadComplete={(numberOfPages, filePath)=>{
                        console.log(`Number of pages: ${numberOfPages}`)
                    }}
                    onError={(error)=>{
                        console.log(error)
                    }}
                    style={{flex: 1, alignSelf: 'stretch'}}
                />
            </View>
            </View>
            <StatusBar style="auto" translucent={false} />
        </SafeAreaView>
    )
}

export default PastQuestionViewer;