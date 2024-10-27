import { StyleSheet, Text, View, Image, Alert, TouchableOpacity } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import Header from './Header';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Block, Button, Card } from 'galio-framework';
import { TouchableRipple } from 'react-native-paper';
import { MyContext } from '../MyContext';
import { ScrollView } from 'react-native-gesture-handler';
import globalStyles from '../assets/GlobaStyles';
import Ionicon from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';
import { IpAddress } from '../GlobalAddress';



// Dummy data for avatar and total students
const dummyData = {
    totalStudents: 150, // Replace 150 with the actual number of total students
};

export default function HodHome({ navigation }) {
    const { userDetail, defaultCompany } = useContext(MyContext)
    console.log(userDetail, 'userDetail');

    const [allstudent, setAllStudent] = useState([])
    console.log(allstudent.length, 66666666);

    const [allCompany, setAllCompany] = useState([])
    const [showEdit, setshowEdit] = useState(false)

    console.log(allstudent, "allstudent");
    let GlobaStyles = globalStyles()
    const handleCompanyPress = (companyDetail) => {

        console.log("Hello wrong");
        navigation?.navigate('SingleCompany', { Company: companyDetail })
    }
    useEffect(() => {
        const getAllCompany = async () => {
            const apiURL = `http://${IpAddress}:5000/api/company/allCompany`;
            try {
                const res = await axios.get(apiURL);

                if (res.data.success) {
                    setAllCompany(res.data.company);
                } else {
                    Alert.alert('Error', res.data.error);
                }
            } catch (error) {
                console.error(error);
            }
        }
        getAllCompany()

        const GetHodStudents = async () => {

            const apiURL = `http://${IpAddress}:5000/api/student/hod/student/${userDetail ? userDetail[0]?.departmentId : ""}`;
            console.log(apiURL, 'apiURL2222222222222222222');
            await axios.get(apiURL)
                .then(async (res) => {
                    if (res.data.success) {
                        let data = res?.data?.student;
                        setAllStudent(data)
                    } else {
                        Alert.alert('Error', res.data.error)
                    }
                })
                .catch((err) => {
                    console.log(err);
                })
        }
        GetHodStudents()
    }, [userDetail])

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            <Header title={"Home"} 
            //  isIcon={true}
             />
            <ScrollView
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                style={GlobaStyles.container}>
                {/* Greeting message for the HOD */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <View style={{ marginBottom: 10 }}>
                        <Text style={styles.greeting}>Hello, </Text>
                        <Text style={styles.greetingName}>{userDetail ? userDetail[0]?.name : ''} </Text>
                    </View>
                    <TouchableOpacity style={{ marginBottom: 10, borderWidth: showEdit ? 1 : 0, right: 20, borderRadius: 50 }} onPress={() => navigation.navigate('HodProfile', { id: userDetail[0]._id, TotalStudent: allstudent.length })}>
                        <Image source={{ uri: userDetail ? userDetail[0]?.avtar : '' }} style={{ width: 48, height: 48, borderRadius: 50 }} />
                    </TouchableOpacity>
                    {/* {showEdit &&(
                    <TouchableOpacity style={{ position: 'absolute', right: 13, bottom: 20 }} onPress={()=>navigation.navigate('HodProfile',{hod:userDetail})}>
                        <MaterialIcons name="edit" size={24} color="black" />
                    </TouchableOpacity>
                    )} */}

                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ fontSize: 17, fontFamily: 'PoppinsBold' }}>Students</Text>
                    {/* {allCompany?.length == 0 && (
          <Ionicon name='add-circle' size={25} style={{ right: 20 }} onPress={()=>navigation?.navigate('AddCompany')} />
        )} */}
                </View>

                {allstudent?.length != 0 ? (
                    <>
                        {/* Display total number of students */}
                        <TouchableRipple style={styles.card} onPress={() => navigation.navigate('Student')}>
                            <>

                                <View style={styles.avatarContainer}>
                                    {allstudent?.slice(0, 4).map((Student, index) => (
                                        <Image key={index} source={{ uri: Student?.avtar }} style={styles.studentAvatar} />
                                    ))}

                                    {allstudent?.length > 4 && (
                                        <View style={styles.remainingStudents}>
                                            <Text style={styles.remainingStudentsText}>
                                                +{allstudent.length - 4}
                                            </Text>
                                        </View>
                                    )}
                                </View>
                                <Block style={styles.StudentCountView}>
                                    <Text style={{
                                        fontFamily: 'PoppinsMedium',

                                    }}>Total Student </Text>
                                    <View style={{ borderRadius: 20, width: 32, height: 32, borderWidth: 0.5, justifyContent: 'center' }}>
                                        <Text style={{ alignSelf: 'center' }}>{allstudent?.length}</Text>
                                    </View>
                                </Block>
                            </>
                        </TouchableRipple>
                    </>
                ) : (
                    <Block style={{ marginVertical: 10, left: 20, width: 400 }}>
                        <Image style={{ height: 100, width: 100 }} source={{ uri: "https://img.freepik.com/free-vector/hand-drawn-no-data-concept_52683-127818.jpg?t=st=1713515779~exp=1713519379~hmac=7bcd9e0e4a76aa2cad898254898af3d4447a2228585e14bd49938b0e68fa26cc&w=900" }} />
                        <Text style={{ fontSize: 14, fontFamily: 'PoppinsMedium' }}>No Student found</Text>
                    </Block>
                )}

                <Block>
                    <Text style={{ fontSize: 16, fontFamily: 'PoppinsBold' }}>All Company</Text>
                </Block>

                {allCompany?.length == 0 && (
                    <Block style={{ marginVertical: 10, left: 20, width: 400 }}>
                        <Image style={{ height: 120, width: 120 }} source={{ uri: "https://img.freepik.com/free-vector/hand-drawn-no-data-concept_52683-127818.jpg?t=st=1713515779~exp=1713519379~hmac=7bcd9e0e4a76aa2cad898254898af3d4447a2228585e14bd49938b0e68fa26cc&w=900" }} />
                        <Text style={{ fontSize: 14, fontFamily: 'PoppinsMedium' }}>No Company found</Text>
                    </Block>
                )}
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginVertical: 10, }}>
                    <View style={{ gap: 15, flexDirection: 'row' }}>
                        {allCompany?.map((Company, index) => (
                            <React.Fragment key={index}>
                                {/* <TouchableRipple style={{ borderWidth: 0.5, padding: 10, borderRadius: 5, alignItems: 'center', justifyContent: 'center', width: 190, marginBottom: 10 }}> */}
                                <TouchableRipple style={{ elevation: 1, margin: 2, padding: 10, borderRadius: 5, alignItems: 'center', justifyContent: 'center', width: 190, marginBottom: 10, backgroundColor: 'white' }}>

                                    <>
                                        <Image source={{ uri: Company?.avtar || defaultCompany }} style={{ width: 80, height: 80, padding: 10, borderRadius: 10 }} />
                                        <View style={{}}>
                                            <Text style={{ fontSize: 19, fontFamily: 'PoppinsBold', marginTop: 10, marginBottom: 5, textAlign: 'center' }}>{Company?.name}</Text>
                                            <Text style={{ fontSize: 14, color: 'gray', textAlign: 'center', fontFamily: 'PoppinsMedium' }}>Added on {new Date(Company?.date).toLocaleDateString()}</Text>
                                        </View>
                                        <Button onPress={() => handleCompanyPress(Company)} style={{ backgroundColor: '#f3f2f2', }}>
                                            <Text style={{ fontSize: 18, textAlign: 'center', fontFamily: 'PoppinsBold' }}>View</Text>
                                        </Button>


                                    </>
                                </TouchableRipple>
                            </React.Fragment>
                        ))}
                    </View>
                </ScrollView>


            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    greeting: {
        fontSize: 21,
        // fontWeight: 'bold',
        fontFamily: 'PoppinsMedium',
        color: 'grey'
    },
    greetingName: {
        fontSize: 23,
        // fontWeight: 'bold',
        fontFamily: 'PoppinsBold',
        bottom: 5
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 20,
    },
    card: {
        padding: 10,
        // borderWidth: 0.5,
        borderRadius: 8,
        borderColor: 'brown',
        // flexDirection: 'row',
        margin: 2,
        marginBottom: 13,
        backgroundColor: 'white',
        elevation: 2,
    },
    totalStudents: {
        fontSize: 24,
        fontFamily: 'PoppinsBold',
        marginTop: 10,
    },
    avatarContainer: {
        // flexDirection: 'row',
    },
    studentAvatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginHorizontal: 5,
        marginVertical: 5,
    },
    avatarContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingLeft: 10
    },
    studentAvatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginLeft: -10
    },
    remainingStudents: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: 'black',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: -10

    },
    remainingStudentsText: {
        color: 'white',
        fontSize: 20,
        fontFamily: 'PoppinsBold',

    },
    StudentCountView: {
        flexDirection: 'row',
        justifyContent: "space-between",
        alignItems: 'center',
        marginTop: 5
    }
});
