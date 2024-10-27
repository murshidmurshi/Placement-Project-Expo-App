import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Alert, Image, StyleSheet, Text, View, FlatList, TouchableHighlight } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../Header';
import { theme } from 'galio-framework';
import { MyContext } from '../../MyContext';
import { TouchableRipple } from 'react-native-paper';
import globalStyles from '../../assets/GlobaStyles';
import { IpAddress } from '../../GlobalAddress';
import axios from 'axios';
import ArButton from '../Button';

export default function HodStudent({ navigation }) {
    const { userDetail } = useContext(MyContext);
    const selectedDepartment = userDetail[0]?.department;
    const [allstudent, setAllStudent] = useState([])
    useEffect(() => {
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

    let GlobalStyle = globalStyles()
    const renderItem = ({ item }) => (
        <>

            <TouchableRipple
                style={styles.SingleHod}
                underlayColor={theme.COLORS.WHITE}
                onPress={() => navigation.navigate('SingleStudent', { student: item })}
            >
                <View style={styles.item}>
                    <Image style={styles.image} source={{ uri: item?.avtar || "https://media.istockphoto.com/id/1369199360/photo/portrait-of-a-handsome-young-businessman-working-in-office.webp?b=1&s=170667a&w=0&k=20&c=9cS9Dj2jKbJGqfI0X0U-jZNURFc-foLzDm1Ls-Q_fgo=" }} />
                    <View>
                        <Text style={styles.name}>{item.name}</Text>
                        <Text style={styles.Addedon}>Added on {new Date(item.date).toLocaleDateString()}</Text>
                    </View>
                    <ArButton style={{ width: 65, backgroundColor:item?.status == "inactive" ? "red" : 'green', height: 35 }}>
                        <Text style={{ textAlign: 'right', fontFamily: 'PoppinsBold', color: "white" }}>{item?.status == "inactive" ? "Inactive" : 'Active'}</Text>
                    </ArButton>
                </View>
            </TouchableRipple>
        </>
    );

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            <Header title={"Student"} />
            <View style={[{ marginTop: 15 }, GlobalStyle?.container]}>
                <FlatList
                    data={allstudent.filter(student => student?.department === selectedDepartment)}
                    renderItem={renderItem}
                    keyExtractor={(item, index) => index.toString()}
                    ListEmptyComponent={() => (
                        <>
                            <View style={styles.emptyContainer}>
                                <Image style={styles.image2} source={{ uri: "https://img.freepik.com/free-vector/hand-drawn-no-data-concept_52683-127818.jpg?t=st=1713515779~exp=1713519379~hmac=7bcd9e0e4a76aa2cad898254898af3d4447a2228585e14bd49938b0e68fa26cc&w=900" }} />
                                <Text style={{ textAlign: 'center', fontSize: 17 }}>No Student found</Text>
                            </View>
                        </>
                    )}
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    SingleHod: {
        backgroundColor: 'white',
        // backgroundColor: '#e7eef4a5',
        padding: 12,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderRadius: theme.SIZES.BASE,
        marginBottom: 5,
        elevation: 1,
        margin: 2
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        justifyContent: 'space-between',
        width: '100%'
    },
    image: {
        width: 40,
        height: 40,
        borderRadius: 10,
        marginRight: 10,
    },
    image2: {
        width: 180,
        height: 180,
        alignSelf: 'center'
    },
    name: {
        fontSize: 16,
        fontFamily: 'PoppinsBold'

    },
    Addedon: {
        fontSize: 14,
        fontFamily: 'PoppinsMedium'
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1
    }
});
