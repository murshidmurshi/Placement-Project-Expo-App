import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, Alert, Image, StatusBar, Dimensions } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { ScrollView } from 'react-native-gesture-handler';
import Ionicon from 'react-native-vector-icons/Ionicons';
import globalStyles from '../../assets/GlobaStyles';
import { Appbar, Divider } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import ArButton from '../../components/Button';
import axios from 'axios';
import { IpAddress } from '../../GlobalAddress';
import RNPickerSelect from 'react-native-picker-select';
import { MyContext } from '../../MyContext';
import Profile from '../../screens/Profile';
import { Images, argonTheme } from '../../constants';
import { Block, Text, theme } from "galio-framework";
const { width, height } = Dimensions.get("screen");
const thumbMeasure = (width - 48 - 32) / 3;



export default function HodProfile({ navigation, route }) {
  let { id,TotalStudent } = route?.params;
  let { allstudent,setCount,count } = useContext(MyContext);
  console.log(allstudent, 'allstudent');
  const [totalStudent, setTotalStudent] = useState(null);
  console.log(totalStudent,"totalStudent");

  const [hod,setHod]=useState({})

  useEffect(()=>{
    const GettSingleHod = async () => {
        const apiURL = `http://${IpAddress}:5000/api/hod/hod/${id}`;
        console.log(apiURL,'apiURL');
        try {
            const res = await axios.post(apiURL);
            if (res.data.success) {
                setHod(res?.data?.hod);
                
            } else {
                Alert.alert('Error', res.data.error);
            }
        } catch (error) {
            console.error(error);
        }
    }
    GettSingleHod()
},[id,count])

  // useEffect(() => {
  //   if (allstudent && hod) {
  //     const filteredStudents = allstudent.filter(student => student.department === hod.department);
  //     const totalCount = filteredStudents.reduce((total, student) => total + 1, 0);
  //     setTotalStudent(totalCount);
  //   }
  // }, [allstudent,]);
  // console.log(hod, "hod");


  let GlobalStyle = globalStyles()


  const HandleDeleteHod = async () => {
    let id = hod?._id;
    Alert.alert(
        "Confirm Deletion",
        "Are you sure you want to delete this HOD?",
        [
            {
                text: "Cancel",
                style: "cancel"
            },
            {
                text: "Delete",
                onPress: async () => {
                    const apiURL = `http://${IpAddress}:5000/api/hod/delete/${id}`;
                    try {
                        const res = await axios.delete(apiURL);
                        if (res.data.success) {
                            setCount(count + 1);
                            navigation.goBack();
                        } else {
                            Alert.alert('Error', res.data.error);
                        }
                    } catch (error) {
                        console.error(error);
                    }
                },
                style: "destructive"
            }
        ]
    );
};

  return (
    <>
      <Block style={{ backgroundColor: 'white', flex: 1 }}>
        <Appbar.Header elevated style={{ backgroundColor: 'white' }}>
          <Appbar.BackAction onPress={() => navigation.goBack()} />

          <Appbar.Content title="Hod" titleStyle={{ fontSize: 18, fontFamily: 'PoppinsBold' }} />
        </Appbar.Header>

        <ScrollView style={[GlobalStyle.container, styles.scrollView]}>
          <View style={{ backgroundColor:'white',elevation:1, margin: 20, borderRadius: 15 }}>
            <Block flex style={styles.profileCard}>
              <Block middle style={styles.avatarContainer}>
                <Image
                  source={{ uri: hod?.avtar }}
                  style={styles.avatar}
                />
              </Block>
            </Block>

            <Block >
              <Block middle style={styles.nameInfo}>
                <Text size={28} color="#32325D" style={styles?.hodName}>
                  {hod?.name}
                </Text>
                <Text size={16} color="#32325D" style={styles?.hodDepartment}>
                  {hod?.department || "None"}
                </Text>
                <Text size={16} color="#32325D" style={styles?.hodAddress}>
                  {hod?.address || "Not added"}
                </Text>
                <Text size={16} color="#32325D" style={styles?.hodAddress}>
                  {hod?.phone || "Not added"}
                </Text>
              </Block>

              <Block middle style={{ marginTop: 15, marginBottom: 5, padding: 2, marginHorizontal: 15,borderWidth:0.5,borderRadius:15,padding:8 }}>
             <View style={{flexDirection:'row',justifyContent:'space-around',width:'100%',}}>
             <View>
                <Text style={{fontFamily:'PoppinsBold',textAlign:'center'}}>Student</Text>
                <Text style={{fontFamily:'PoppinsMedium',textAlign:'center',color:'grey'}}>{TotalStudent||0}</Text>
                </View>
                
                <View>
                <Text style={{fontFamily:'PoppinsBold',textAlign:'center'}}>Hod added on</Text>
                <Text style={{fontFamily:'PoppinsMedium',textAlign:'center',color:'grey'}}>
                  {new Date(hod?.date).toLocaleDateString()}
                  </Text>
                </View>
             </View>
              </Block>

            </Block>
            <Block
              middle
              row
              space="around"
              style={{ marginTop: 20, paddingBottom: 24 }}
            >
              {/* <ArButton
                small
                style={{ backgroundColor: argonTheme.COLORS.INFO }}
              >
                CONNECT
              </ArButton> */}
              <ArButton
                style={{ borderColor: "green", backgroundColor: 'white', borderWidth: 0.5 }}
                // onPress={HandleDeleteHod}
                onPress={()=>navigation.navigate('EditHod',{hod})}
              // style={{ borderColor: argonTheme.COLORS.INFO ,backgroundColor:'white',borderWidth:0.5}}
              >
                <Text style={{ fontFamily: 'PoppinsMedium' }}>Edit</Text>
              </ArButton>
            </Block>

          </View>

        </ScrollView>
      </Block>
    </>
  )
}

const styles = StyleSheet.create({
  avatarContainer: {
    position: "relative",
    marginTop: 50
  },
  avatar: {
    width: 124,
    height: 124,
    borderRadius: 62,
    borderWidth: 1
  },
  profileContainer: {
    width: width,
    height: height,
    padding: 0,
    zIndex: 1
  },
  profileBackground: {
    width: width,
    height: height / 2
  },

  hodName: {
    fontFamily: 'PoppinsBold',
    fontSize: 26
  },
  hodAddress: {
    fontFamily: 'PoppinsMedium',
    fontSize: 16
  },

  hodDepartment: {
    fontFamily: 'PoppinsMedium',
    fontSize: 16
  },
  info: {
    paddingHorizontal: 40
  },
})