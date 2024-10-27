import { Alert, Image, StyleSheet, TouchableOpacity, View, } from 'react-native'
import { Block, Button as GaButton, Text, theme } from "galio-framework";
import { Header, Icon, Input, Select, Switch } from "../components/";

import React, { useCallback, useContext, useEffect, useState } from 'react'
import { ScrollView } from 'react-native-gesture-handler';
import globalStyles from '../assets/GlobaStyles';
import Tabs from '../components/Tabs';
import { useFocusEffect } from '@react-navigation/native';
import { IpAddress } from '../GlobalAddress';
import axios from 'axios';
import ArButton from '../components/Button';
import { Dialog, Portal, Button, Divider, TextInput } from 'react-native-paper';
import { MyContext } from '../MyContext';



export default function Student({ navigation }) {
    const GlobalStyle = globalStyles();
    const [allstudent, setAllStudent] = useState([])
    const { alldepartment, setAllDepartment, count, setCount } = useContext(MyContext)
    let newUpdate = [{ name: "All Department" }, ...alldepartment];
    console.log(newUpdate, 'newUpdate');
    const [selectedDepartment, setSelectedDepartment] = useState('');
    console.log(selectedDepartment, 'selectedDepartment');

    const [visible, setVisible] = React.useState(false);

    const showDialog = () => setVisible(true);

    const hideDialog = () => setVisible(false);
    const [newDepartment, setNewDepartment] = useState('');


    useFocusEffect(
        useCallback(() => {
            const GetAllStudent = async () => {
                const apiURL = `http://${IpAddress}:5000/api/student/allStudent`;
                await axios.get(apiURL)
                    .then(async (res) => {
                        if (res.data.success) {
                            let data = res.data.student;
                            setAllStudent(data)
                        } else {
                            Alert.alert('Error', res.data.error)
                        }
                    })
                    .catch((err) => {
                        console.log(err);
                    })
            }
            GetAllStudent()
        }, [])
    )


    const handleAddDepartment = async () => {
        if (!newDepartment) {
            Alert.alert('Error', 'Please enter department name');
            return;
        }
        else {
            const apiURL = `http://${IpAddress}:5000/api/admin/addDepartment`;
            try {
                const res = await axios.post(apiURL, { name: newDepartment });
                if (res.data.success) {
                    await setCount(count + 1)
                    await hideDialog()
                    setNewDepartment('');
                } else {
                    Alert.alert('Error', res.data.error);
                }
            } catch (error) {
                console.error(error);
            }
        }
    };

    const handleSingleStudent = (student) => {
        navigation.navigate('SingleStudent', { student: student })

    }


    return (
        <>
            <Block style={{ backgroundColor: 'white', flex: 1 }}>
                <Block style={{ marginBottom: theme.SIZES.BASE, }}>
                    <Header
                        title="Student"
                        navigation={navigation}
                    />
                </Block>
                <ScrollView style={GlobalStyle.container}
          showsVerticalScrollIndicator={false}
                
                >
                    <Block style={{ borderColor: 'grey', borderWidth: 0.5, borderRadius: 10, padding: 5 }}>
                        <ArButton onPress={showDialog} style={{ fontSize: 20, alignSelf: 'flex-end' }}>
                            <Text style={{ fontSize: 14, color: 'white', fontFamily: 'PoppinsBold', }}>Add Department</Text>
                        </ArButton>
                        <Tabs data={newUpdate} setSelectedDepartment={setSelectedDepartment} />
                    </Block>
                    <Block style={styles.HodContainer}>
                        {selectedDepartment ? (
                            <>
                                {allstudent.filter(student => student.department === selectedDepartment).length == 0 && selectedDepartment !== "All Department" && (
                                    <Block>
                                        <Image style={styles.image2} source={{ uri: "https://img.freepik.com/free-vector/hand-drawn-no-data-concept_52683-127818.jpg?t=st=1713515779~exp=1713519379~hmac=7bcd9e0e4a76aa2cad898254898af3d4447a2228585e14bd49938b0e68fa26cc&w=900" }} />
                                        <Text style={{ textAlign: 'center', fontSize: 17, fontFamily: 'PoppinsMedium', }}>No Student found</Text>
                                    </Block>
                                )}

                                {allstudent[0]?.name == "All Department" && allstudent?.length == 0(
                                    <Block>
                                        <Image style={styles.image2} source={{ uri: "https://img.freepik.com/free-vector/hand-drawn-no-data-concept_52683-127818.jpg?t=st=1713515779~exp=1713519379~hmac=7bcd9e0e4a76aa2cad898254898af3d4447a2228585e14bd49938b0e68fa26cc&w=900" }} />
                                        <Text style={{ textAlign: 'center', fontSize: 17, fontFamily: 'PoppinsMedium', }}>No Student found</Text>
                                    </Block>
                                )}

                                {selectedDepartment == "All Department" && allstudent?.map((student, index) => (
                                    <React.Fragment key={index}>
                                        <TouchableOpacity activeOpacity={0.5} style={styles.SingleHod} onPress={() => handleSingleStudent(student)}>
                                            <Block style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                                                <Image style={styles.image} source={{ uri: student?.avtar }} />
                                                <View>
                                                    <Text style={styles.name}>{student?.name}</Text>
                                                    <Text style={styles.Addedon}>Added on {new Date(student?.date).toLocaleDateString()}</Text>
                                                </View>
                                            </Block>
                                            <View>
                                                    <Text style={styles.branchName}>{student?.department}</Text>
                                                    <ArButton style={{ width: 62, backgroundColor: student?.status == "inactive" ? "red" : 'green', height: 20 }}>
                                                        <Text style={{ textAlign: 'right', fontFamily: 'PoppinsBold', color: "white", fontSize: 12 }}>{student?.status == "inactive" ? "Inactive" : 'Active'}</Text>
                                                    </ArButton>
                                                </View>
                                        </TouchableOpacity>
                                    </React.Fragment>
                                ))}

                                {allstudent?.filter(student => student?.department === selectedDepartment)
                                    .map((student, index) => (
                                        <React.Fragment key={index}>
                                            <TouchableOpacity activeOpacity={0.5} style={styles.SingleHod} onPress={() => handleSingleStudent(student)}>
                                                <Block style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                                                    <Image style={styles.image} source={{ uri: student?.avtar }} />
                                                    <View>
                                                        <Text style={styles.name}>{student?.name}</Text>
                                                        <Text style={styles.Addedon}>Added on {new Date(student?.date).toLocaleDateString()}</Text>
                                                    </View>
                                                </Block>
                                                <View>
                                                    <Text style={styles.branchName}>{student?.department}</Text>
                                                    <ArButton style={{ width: 62, backgroundColor: student?.status == "inactive" ? "red" : 'green', height: 20 }}>
                                                        <Text style={{ textAlign: 'right', fontFamily: 'PoppinsBold', color: "white", fontSize: 12 }}>{student?.status == "inactive" ? "Inactive" : 'Active'}</Text>
                                                    </ArButton>
                                                </View>
                                            </TouchableOpacity>
                                        </React.Fragment>
                                    ))}
                            </>
                        ) : (
                            <>
                                {allstudent?.length === 0 && (
                                    <>
                                        <Block>
                                            <Image style={styles.image2} source={{ uri: "https://img.freepik.com/free-vector/hand-drawn-no-data-concept_52683-127818.jpg?t=st=1713515779~exp=1713519379~hmac=7bcd9e0e4a76aa2cad898254898af3d4447a2228585e14bd49938b0e68fa26cc&w=900" }} />
                                            <Text style={{ textAlign: 'center', fontSize: 17, fontFamily: 'PoppinsMedium', }}>No Student found</Text>
                                        </Block>
                                    </>
                                )}
                                {allstudent?.map((student, index) => (
                                    <React.Fragment key={index}>
                                        <TouchableOpacity activeOpacity={0.5} style={styles.SingleHod} onPress={() => handleSingleStudent(student)}>
                                            <Block style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                                                <Image style={styles.image} source={{ uri: student?.avtar }} />
                                                <View>
                                                    <Text style={styles.name}>{student?.name}</Text>
                                                    <Text style={styles.Addedon}>Added on {new Date(student?.date).toLocaleDateString()}</Text>
                                                </View>
                                            </Block>
                                            <Text style={styles.branchName}>{student?.department}</Text>
                                        </TouchableOpacity>
                                    </React.Fragment>
                                ))}
                            </>
                        )}
                    </Block>

                    <Portal>
                        <Dialog visible={visible} onDismiss={hideDialog}>
                            <Dialog.Title style={{ fontFamily: 'PoppinsBold' }}>Add new</Dialog.Title>
                            <Dialog.Content>
                                {/* <Text variant="bodyMedium">This is simple dialog</Text> */}
                                <TextInput
                                    mode="flat"
                                    placeholder="Enter Department name ..."
                                    onChangeText={(text) => setNewDepartment(text)}
                                />
                            </Dialog.Content>
                            <Dialog.Actions>
                                <Button onPress={hideDialog}>Cancel</Button>
                                <Button onPress={handleAddDepartment}>Done</Button>
                            </Dialog.Actions>
                        </Dialog>

                    </Portal>



                </ScrollView>
            </Block>
        </>
    )
}

const styles = StyleSheet.create({
    HodContainer: {
        // backgroundColor: 'red',
        padding: 2, marginTop: 10
    },
    Addedon: {
        // backgroundColor: 'red',
        color: 'grey',
        fontSize: 13,
        fontFamily: 'PoppinsMedium'
    },
    SingleHod: {
        backgroundColor: 'white',
        // backgroundColor: '#e7eef4a5',
        padding: 12,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderRadius: theme.SIZES.BASE,
        marginBottom: 5,
        elevation: 1
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    image: {
        width: 40,
        height: 40,
        borderRadius: 12,
        marginRight: 10,
    },
    image2: {
        width: 180,
        height: 180,
        alignSelf: 'center'
    },
    name: {
        fontSize: 16,
        fontFamily: 'PoppinsBold',
    },
    branchName: {
        fontSize: 14,
        fontFamily: 'PoppinsMedium'
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    buttonText: {
        fontSize: 15,
        color: 'white'
    },
    modalView: {
        margin: 10,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        width: '80%',
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
    },
    modalText: {
        marginBottom: 15,
        textAlign: "left"
    },
    input: {
        width: '100%',
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 10,
        paddingLeft: 10,
    },
})