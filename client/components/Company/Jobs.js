import { Alert, Image, StyleSheet, Text, View } from 'react-native'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import Header from '../Header'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Block } from 'galio-framework'
import { useFocusEffect } from '@react-navigation/native'
import { IpAddress } from '../../GlobalAddress'
import axios from 'axios'
import { MyContext } from '../../MyContext'
import { ScrollView } from 'react-native-gesture-handler'
import globalStyles from '../../assets/GlobaStyles'
import Ionicon from 'react-native-vector-icons/Ionicons';
import { TouchableRipple } from 'react-native-paper'
import AsyncStorage from '@react-native-async-storage/async-storage'


export default function Job({ navigation }) {
    const { userDetail, defaultCompany } = useContext(MyContext)
 
    console.log(userDetail, 'userDetail');
    let GlobalStyle = globalStyles()
    console.log(userDetail, 'userDetail');
    const [companyJob, setCompanyJob] = useState([]);
    console.log(companyJob, 'companyJob');

    useFocusEffect(
        useCallback(() => {
            const GetCompanyJob = async () => {
                const apiURL = `http://${IpAddress}:5000/api/company/companyJob/${userDetail[0]?._id}`;
                console.log(apiURL, 'apiURL');
                try {
                    const res = await axios.post(apiURL);
                    if (res.data.success) {
                        setCompanyJob(res.data.job);
                    } else {
                        Alert.alert('Error', res.data.error);
                    }

                } catch (error) {
                    console.error(error);
                }
            }
            if (userDetail) {
                GetCompanyJob()
            }
        }, [userDetail])
    )

    const handleSingleJob = (jobDetail) => {
        console.log(jobDetail,555555555555);
        navigation?.navigate('SingleJob', { id: jobDetail?._id })
    }

    return (
        <>
            <SafeAreaView style={{ flex: 1,backgroundColor:'white' }}>
                <Header
                    title={"Job"}
                />

                <ScrollView style={GlobalStyle?.container}>

                    {companyJob?.length == 0 && (
                        <Block>
                            <Image style={{ width: 150, height: 150, alignSelf: 'center', marginTop: 40 }} source={{ uri: "https://img.freepik.com/free-vector/hand-drawn-no-data-concept_52683-127818.jpg?t=st=1713515779~exp=1713519379~hmac=7bcd9e0e4a76aa2cad898254898af3d4447a2228585e14bd49938b0e68fa26cc&w=900" }} />
                            <Text style={{ fontSize: 16, fontFamily: 'PoppinsMedium', color: 'grey', textAlign: 'center' }}>No jobs added yet</Text>
                        </Block>
                    )}

                    {companyJob?.map((job, index) => (
                        <TouchableRipple onPress={() => handleSingleJob(job)} style={{ elevation: 1, backgroundColor: 'white', padding: 6, borderRadius: 10, alignSelf: 'center', justifyContent: 'center', width: '99%', marginVertical: 5 }}>
                            <>
                                <View style={{ flexDirection: 'row', gap: 10 }}>
                                    <Image style={{ width: 50, height: 50, borderRadius: 50 }} source={{ uri: job?.logo || defaultCompany}} />

                                    <View>
                                        <Text style={{ color: 'grey', fontFamily: 'PoppinsBold' }}>Google</Text>
                                        <Text style={{ fontSize: 14, fontFamily: 'PoppinsMedium' }}>{job?.jobTitle}</Text>
                                    </View>
                                </View>
                                <View style={{ flexDirection: 'row', gap: 5, alignItems: 'center', marginBottom: 10, marginTop: 10 }}>
                                    <Ionicon name='location' size={22} color={"grey"} />
                                    <Text style={{ color: 'grey', fontFamily: 'PoppinsMedium' }}>{job?.location}</Text>
                                </View>
                                <View style={{ flexDirection: 'row', gap: 5, alignItems: 'center', marginBottom: 5 }}>
                                    <Text style={{ fontSize: 14, fontFamily: 'PoppinsMedium' }}>{job?.jobType}</Text>
                                </View>
                                <View style={{ flexDirection: 'row', gap: 5, alignItems: 'center', marginBottom: 10 }}>
                                    <Text style={{ fontSize: 18, fontFamily: 'PoppinsBold' }}>₹{job?.salary}
                                        <Text style={{ fontSize: 15, fontFamily: 'PoppinsBold' }}> p.a </Text>
                                    </Text>
                                </View>
                            </>
                        </TouchableRipple>
                    ))}


                </ScrollView>
            </SafeAreaView>

        </>
    )
}

const styles = StyleSheet.create({})