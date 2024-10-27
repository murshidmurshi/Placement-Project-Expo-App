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

export default function Hod({ navigation }) {
    const GlobalStyle = globalStyles();
    const {allhod, setAllHod,alldepartment,count, setCount}=useContext(MyContext)

    console.log(allhod,'allhod');
    // const [alldepartment, setAllDepartment] = useState([])

    const [selectedDepartment, setSelectedDepartment] = useState('');
    const [visible, setVisible] = React.useState(false);

    const showDialog = () => setVisible(true);

    const hideDialog = () => setVisible(false);
    const [newDepartment, setNewDepartment] = useState('');
    // const [count, setCount] = useState(0);

    // useEffect(() => {
    //     const GetAllDepartments = async () => {
    //         const apiURL = `http://${IpAddress}:5000/api/admin/getAllDepartments`;
    //         try {
    //             const res = await axios.get(apiURL);
    //             if(res?.data?.success) {
    //                 setAllDepartment(res.data.departments);
    //             } else {
    //                 Alert.alert('Error', res.data.error);
    //             }
    //         } catch (error) {
    //             console.error(error);
    //         }
    //     }
    //     GetAllDepartments()
    // }, [count])

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
                    setCount(count + 1)
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

    const handleSingleHod=(hod)=>{
        console.log("Helloo",hod);
        navigation.navigate('SingleHod',{hod:hod})
    }

    return (
        <>
            <Block style={{ backgroundColor: 'white', flex: 1 }}>
                <Block style={{ marginBottom: theme.SIZES.BASE, }}>
                    <Header
                        title="Hod"
                        
                        navigation={navigation}
                    />
                </Block>
                <ScrollView style={GlobalStyle.container}  showsVerticalScrollIndicator={false}>
                    {/* <Block style={{ borderColor: 'grey', borderWidth: 0.5, borderRadius: 10, padding: 5 }}> */}
                        <ArButton onPress={showDialog} style={{ fontSize: 20, alignSelf: 'flex-end'}}>
                            <Text style={{ fontSize: 14, color: 'white',fontFamily:'PoppinsBold' }}>Add Department</Text>
                        </ArButton>
                        {/* <Tabs data={alldepartment} setSelectedDepartment={setSelectedDepartment} /> */}
                    {/* </Block> */}
                    <Block style={styles.HodContainer}>

                        {/* {selectedDepartment ? (
                            <>
                                {allhod?.filter(hod => hod?.department === selectedDepartment) 
                                    .length === 0 && (
                                        <>
                                            <Block>
                                                <Image style={styles.image2} source={{ uri: "https://img.freepik.com/free-vector/hand-drawn-no-data-concept_52683-127818.jpg?t=st=1713515779~exp=1713519379~hmac=7bcd9e0e4a76aa2cad898254898af3d4447a2228585e14bd49938b0e68fa26cc&w=900" }} />
                                                <Text style={{ textAlign: 'center', fontSize: 17,fontFamily:'PoppinsMedium' }}>No Hod found</Text>
                                            </Block>
                                        </>
                                    )}

                                {allhod?.filter(hod => hod?.department === selectedDepartment)?.map((hod, index) => (
                                        <React.Fragment key={index}>
                                            <TouchableOpacity activeOpacity={0.5} style={styles.SingleHod} onPress={()=>handleSingleHod(hod)}>
                                                <Block style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                                                    <Image style={styles.image} source={{ uri:hod?.avtar}} />
                                                    <View>
                                                        <Text style={styles.name}>{hod?.name}</Text>
                                                        <Text style={styles.Addedon}>Added on {new Date(hod?.date)?.toLocaleDateString()}</Text>

                                                    </View>
                                                </Block>
                                                <Text style={styles.branchName}>{hod?.department}</Text>
                                            </TouchableOpacity>
                                        </React.Fragment>
                                    ))}
                            </>
                        ) : (
                            <> */}
                             {allhod?.length === 0 && (
                                        <>
                                            <Block>
                                                <Image style={styles.image2} source={{ uri: "https://img.freepik.com/free-vector/hand-drawn-no-data-concept_52683-127818.jpg?t=st=1713515779~exp=1713519379~hmac=7bcd9e0e4a76aa2cad898254898af3d4447a2228585e14bd49938b0e68fa26cc&w=900" }} />
                                                <Text style={{ textAlign: 'center', fontSize: 17,fontFamily:'PoppinsMedium' }}>No Hod found</Text>
                                            </Block>
                                        </>
                                    )}
                                {allhod?.map((hod, index) => (
                                    <React.Fragment key={index}>
                                        <TouchableOpacity activeOpacity={0.5} style={styles.SingleHod}  onPress={()=>handleSingleHod(hod)}>
                                            <Block style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                                                <Image style={styles.image} source={{ uri:hod?.avtar }} />
                                                <View>
                                                    <Text style={styles.name}>{hod?.name}</Text>
                                                    <Text style={styles.Addedon}>Added on {new Date(hod?.date)?.toLocaleDateString()}</Text>
                                                </View>
                                                </Block>
                                            <Text style={styles.branchName}>{hod?.department}</Text>
                                        </TouchableOpacity>
                                    </React.Fragment>
                                ))}
                            {/* </>
                        )} */}


                    </Block>

                    <Portal>
                        <Dialog visible={visible} onDismiss={hideDialog}>
                            <Dialog.Title style={{fontFamily:'PoppinsBold'}}>Add new</Dialog.Title>
                            <Dialog.Content>
                                <TextInput
                                    mode="flat"
                                    // style={{fontFamily:'PoppinsBold'}}
                            
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
        padding: 2,marginTop:15
    },
    Addedon: {
        // backgroundColor: 'red',
        color: 'grey',
        fontSize: 13,
        fontFamily:'PoppinsMedium'

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
        elevation:1
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
        width: 150,
        height: 150,
        alignSelf: 'center'
    },
    name: {
        fontSize: 16,
        fontFamily:'PoppinsBold'
    },
    branchName: {
        fontSize: 14,
        fontFamily:'PoppinsMedium'

    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    buttonText: {
        fontSize: 15,
        color: 'white',
        // fontFamily:'PoppinsMedium'

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
        textAlign: "left",

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