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



export default function SingleStudent({ navigation, route }) {
  let { student } = route?.params;
  console.log(student,'student');
  let { setCount,count,allhod } = useContext(MyContext);
  const[studentsHod,setStudentsHod] = useState("")
  console.log(allhod,'allhod');

  
  useEffect(() => {
    if (allhod && student) {
      const filteredHod = allhod.filter(hod => hod.department === student.department);
      console.log(filteredHod,'filteredHod');
      setStudentsHod(filteredHod[0]?.name)
      
    }
  }, [allhod, student]);




  let GlobalStyle = globalStyles()


  const HandleDeleteStudent = async () => {
    let id = student?._id;
    Alert.alert(
        "Confirm Deletion",
        "Are you sure you want to delete this Student?",
        [
            {
                text: "Cancel",
                style: "cancel"
            },
            {
                text: "Delete",
                onPress: async () => {
                    const apiURL = `http://${IpAddress}:5000/api/student/delete/${id}`;
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

let DefaultResume = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT2rvidvKsfcDTCZDuVfuv_yElCiVfEq9w9Kf0jTQqgiw&s"


  return (
    <>
      <Block style={{ backgroundColor: 'white', flex: 1 }}>
        <Appbar.Header elevated style={{ backgroundColor: 'white' }}>
          <Appbar.BackAction onPress={() => navigation.goBack()} />

          <Appbar.Content title="Student" titleStyle={{ fontSize: 18, fontFamily: 'PoppinsBold' }} />
        </Appbar.Header>

        <ScrollView style={[GlobalStyle.container, styles.scrollView]}
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
        >
          <View style={{ backgroundColor:'white',elevation:1, margin: 20, borderRadius: 15 }}>
            <Block flex style={styles.profileCard}>
              <Block middle style={styles.avatarContainer}>
                <Image
                  source={{ uri: student?.avtar||student?.studentId?.avtar }}
                  style={styles.avatar}
                />
              </Block>
            </Block>

            <Block >
              <Block middle style={styles.nameInfo}>
                <Text size={28} color="#32325D" style={styles?.hodName}>
                  {student?.name}
                </Text>
                <Text size={16} color="#32325D" style={styles?.hodDepartment}>
                  {student?.department || "None"}
                </Text>
                <Text size={16} color="#32325D" style={styles?.hodAddress}>
                  Address: {student?.address || "Not added"}
                </Text>
                <Text size={16} color="#32325D" style={styles?.hodAddress}>
                  Phone: {student?.phone || "Not added"}
                </Text>
                <Text size={16} color="#32325D" style={styles?.hodAddress}>
                  Email: {student?.email || "Not added"}
                </Text>
              </Block>

              <Block middle style={{ marginTop: 15, marginBottom: 5, padding: 2, marginHorizontal: 15,borderWidth:0.5,borderRadius:15,padding:8 }}>
             <View style={{flexDirection:'row',justifyContent:'space-around',width:'100%',}}>
             <View>
                <Text style={{fontFamily:'PoppinsBold',textAlign:'center'}}>Hod</Text>
                <Text style={{fontFamily:'PoppinsMedium',textAlign:'center',color:'grey'}}>{studentsHod?studentsHod:"Not Added"}</Text>
                </View>
                
                <View>
                <Text style={{fontFamily:'PoppinsBold',textAlign:'center'}}>Added on</Text>
                <Text style={{fontFamily:'PoppinsMedium',textAlign:'center',color:'grey'}}>
                  {new Date(student?.date).toLocaleDateString()}
                  </Text>
                </View>
             </View>
              </Block>
              <View>
                <Block middle style={{ marginVertical: 15 }}>
                  <Text style={{ fontFamily: 'PoppinsBold', textAlign: 'center', fontSize: 19 }}>Resume</Text>
                  <Image
                    source={{ uri: student?.resume || DefaultResume }}
                    style={styles.avatar2}
                  />
                </Block>
              </View>

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
                onPress={()=>navigation.navigate('EditStudent', {student:student})}
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
    marginTop: 16
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
    fontSize: 26,marginTop:10
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
  avatar2: {
    width: 220,
    height: 220,
    borderRadius: 10,
    borderWidth: 1,
  },
})