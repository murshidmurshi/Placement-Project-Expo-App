import { Alert, Image, StyleSheet, Text, View } from 'react-native'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { Block, Button } from 'galio-framework'
import { Appbar, TouchableRipple } from 'react-native-paper'
import { ScrollView } from 'react-native-gesture-handler'
import globalStyles from '../../assets/GlobaStyles'
import Ionicon from 'react-native-vector-icons/Ionicons';
import { useFocusEffect } from '@react-navigation/native'
import { IpAddress } from '../../GlobalAddress'
import axios from 'axios'
import { MyContext } from '../../MyContext'

export default function SingleCompany({ navigation, route }) {
    let { Company } = route?.params;
    console.log(Company, 'Company');
    const { userDetail, defaultCompany, } = useContext(MyContext)

    let { role } = useContext(MyContext);
    console.log(role, 'role');

    const [AllJob, setAllJob] = useState([]);
    console.log(AllJob, 'AllJob');

    const handleSingleJob = (jobDetail) => {
        console.log(jobDetail, 'jobDetail');
        let studentId = role == "Student" ? userDetail && userDetail[0]?._id : null;
        navigation?.navigate('SingleJob', { id: jobDetail?._id, companyId: jobDetail?.companyId, studentId: studentId,CompanyParentId:Company?._id })
    }
    let GlobalStyle = globalStyles()
    useFocusEffect(
        useCallback(() => {
            const GetCompanyJob = async () => {
                const apiURL = `http://${IpAddress}:5000/api/company/companyJob/${Company?._id}`;
                try {
                    const res = await axios.post(apiURL);
                    if (res.data.success) {
                        setAllJob(res.data.job);
                    } else {
                        Alert.alert('Error', res.data.error);
                    }
                } catch (error) {
                    console.error(error);
                }
            }
            GetCompanyJob()
        }, [])
    )
    return (
        <Block style={{ backgroundColor: 'white', flex: 1 }}>
            <Appbar.Header elevated style={{ backgroundColor: 'white' }}>
                <Appbar.BackAction onPress={() => navigation.goBack()} />
                <Appbar.Content title={Company?.name} titleStyle={{ fontSize: 18, fontFamily: 'PoppinsBold' }} />
            </Appbar.Header>
            <ScrollView
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                style={[GlobalStyle.container, styles.scrollView]}>
                <View style={{ backgroundColor: 'white', padding: 5, paddingLeft: 0, borderRadius: 10, elevation: 3, margin: 5, marginTop: 15 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Image style={{ width: 100, height: 100, borderRadius: 50, margin: 5 }} source={{
                            uri:
                                Company?.avtar || defaultCompany
                        }} />
                        <View style={{ paddingLeft: 15, marginTop: 5 }}>
                            <View>
                                <Text style={{ fontSize: 19, fontFamily: 'PoppinsBold' }}>{Company?.name}</Text>
                            </View>

                            <View style={{ flexDirection: 'row', gap: 5, alignItems: 'center', marginTop: 5 }}>
                                <Ionicon name='location' size={22} />
                                <Text style={{ fontFamily: 'PoppinsMedium', }}>{Company?.location || "Not added"}</Text>
                            </View>
                            <Text style={styles.Addedon}>Added on {new Date(Company?.date).toLocaleDateString()}</Text>
                        </View>
                    </View>

                    <Text style={{ fontSize: 17, fontFamily: 'PoppinsBold', left: 15, marginTop: 10 }}>About Company</Text>
                    <View style={{ padding: 10, borderWidth: 0.2, margin: 10, borderRadius: 5 }}>
                        <Text style={{ fontFamily: 'PoppinsMedium' }}>{Company?.desc || "----"}</Text>
                    </View>
                </View>

                <View style={{ marginVertical: 5, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                    <Text style={{ fontSize: 18, fontFamily: 'PoppinsBold', left: 8, }}>Jobs</Text>
                    {/* <Text style={{ fontSize: 14, fontWeight: 'bold', left: 8, color: 'white' }}>Add</Text> */}
                    {/* {role=="Company" &&(
                  <Ionicon name='add-circle' size={25} style={{ right: 12 }} onPress={() => navigation?.navigate('AddJob')} />
              )} */}
                </View>

                <ScrollView style={GlobalStyle?.container}>
                    {AllJob?.length == 0 && (
                        <Block>
                            <Image style={{ width: 120, height: 120 }} source={{ uri: "https://img.freepik.com/free-vector/hand-drawn-no-data-concept_52683-127818.jpg?t=st=1713515779~exp=1713519379~hmac=7bcd9e0e4a76aa2cad898254898af3d4447a2228585e14bd49938b0e68fa26cc&w=900" }} />
                            <Text style={{ fontSize: 16, fontFamily: 'PoppinsMedium', color: 'grey' }}>No jobs added yet</Text>
                        </Block>
                    )}
                    {AllJob?.map((job, index) => (
                        <TouchableRipple onPress={() => handleSingleJob(job)} style={{ elevation: 1, backgroundColor: 'white', padding: 6, borderRadius: 10, alignSelf: 'center', justifyContent: 'center', width: '99%', marginVertical: 5 }}>
                            <>
                                <View style={{ flexDirection: 'row', gap: 10 }}>
                                    <Image style={{ width: 50, height: 50, borderRadius: 50 }} source={{ uri: Company?.avtar||defaultCompany}} />

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
            </ScrollView>
        </Block>

    )
}

const styles = StyleSheet.create({
    Addedon: {
        fontFamily: 'PoppinsMedium',
        top: 10
    }
})