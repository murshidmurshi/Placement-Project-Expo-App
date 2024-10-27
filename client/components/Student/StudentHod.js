import { Alert, Image, StyleSheet, Text, View } from 'react-native'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Header from '../Header'
import { tabs } from '../../constants'
import ArInput from '../Input'
import { ScrollView } from 'react-native-gesture-handler'
import globalStyles from '../../assets/GlobaStyles'
import { Block, theme } from 'galio-framework'
import { TouchableRipple } from 'react-native-paper'
import { useFocusEffect } from '@react-navigation/native'
import axios from 'axios'
import { IpAddress } from '../../GlobalAddress'
import { MyContext } from '../../MyContext';
import Profile from '../../screens/Profile'

export default function StudentHod() {
    const { userDetail, hod } = useContext(MyContext);
    console.log(hod, "hodhodhod");
    let GlobaStyles = globalStyles()
    const [allhod, setAllHod] = useState([])
    console.log(allhod, 'allhod');
    const selectedDepartment = userDetail[0]?.department;
    console.log(selectedDepartment, 'selectedDepartment');
    const [searchQuery, setSearchQuery] = useState('');

    // useFocusEffect(
    //     useCallback(() => {
    //         const GetAllStudent = async () => {
    //             const apiURL = `http://${IpAddress}:5000/api/student/allStudent`;
    //             await axios.get(apiURL)
    //                 .then(async (res) => {
    //                     if (res.data.success) {
    //                         let data = res.data.student;
    //                         setAllStudent(data)
    //                     } else {
    //                         Alert.alert('Error', res.data.error)
    //                     }
    //                 })
    //                 .catch((err) => {
    //                     console.log(err);
    //                 })
    //         }
    //         GetAllStudent()
    //     }, [])
    // )

    // const handleSearch = (query) => {
    //     setSearchQuery(query);
    //     const filtered = allstudent?.filter(item =>
    //       item.toLowerCase().includes(query?.toLowerCase())
    //     );
    //     console.log(filtered,'filtered');
    //     setFilteredData(filtered);
    //   };



    useEffect(() => {
        const GetHodStudents = async () => {
            const apiURL = `http://${IpAddress}:5000/api/hod/student/hod/${userDetail ? userDetail[0]?.departmentId : ""}`;
            console.log(apiURL, 'apiURL2222222222222222222');
            await axios.get(apiURL)
                .then(async (res) => {
                    if (res.data.success) {
                        let data = res?.data?.hod;
                        setAllHod(data)
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
        <SafeAreaView style={{ backgroundColor: 'white', flex: 1 }}>
            <Header
                title={"Hod"}
                isIcon={true}
            />
            <ScrollView style={GlobaStyles.container}
             showsHorizontalScrollIndicator={false}
             showsVerticalScrollIndicator={false}
            >
                <Block style={styles.MainstudentContainer}>
                    <Profile allhod={allhod} />
                </Block>
            </ScrollView>
        </SafeAreaView>
    )

}

const styles = StyleSheet.create({
    SingleHod: {
        backgroundColor: '#e7eef4a5',
        padding: 12,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderRadius: theme.SIZES.BASE,
        marginBottom: 5,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    image: {
        width: 40,
        height: 40,
        borderRadius: 100,
        marginRight: 10,
    },
    image2: {
        width: 180,
        height: 180,
        alignSelf: 'center'
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    branchName: {
        fontSize: 14,
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
})