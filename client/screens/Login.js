import React, { useCallback, useContext, useEffect, useState } from "react";
import {
  StyleSheet,
  ImageBackground,
  Dimensions,
  StatusBar,
  KeyboardAvoidingView,
  Image,
  TouchableOpacity,
} from "react-native";
import { Block, Text, Checkbox, theme, Button } from "galio-framework";
import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';

import Ionicon from 'react-native-vector-icons/Ionicons'



import { Images, argonTheme } from "../constants";
import { Icon, Input } from "../components";
import { IpAddress } from "../GlobalAddress";
import { useFocusEffect } from "@react-navigation/native";
import { MyContext } from "../MyContext";
const { width, height } = Dimensions.get("screen");

const Login = ({ navigation }) => {
  const [selectedRole, setSelectedRole] = useState('Admin'); // Initial selected role
  let {setCount,count}=useContext(MyContext)
  const [inputId, setInputId] = useState(null)
  const [inputpassword, setInputpassword] = useState(null)
  const [response, setResponse] = useState(null);

  useFocusEffect(
    useCallback(() => {
      const CheckToken = async () => {
        try {
          const value = await AsyncStorage.getItem("Token");
          if (value !== null) {
            await navigation.navigate('Home')
          } else {
            console.log('No data found with key:',);
          }
        } catch (error) {
          console.error('Error retrieving data:', error);
          return null;
        }
      };

      CheckToken()

    }, [])
  )



  const ContinueBtn = async () => {
    if (!inputId || !inputpassword || inputId === "" || inputpassword === "") {
      setResponse("Incorrect Id or Password");
    }
    console.log("ContinueBtn");
    console.log(inputId, inputpassword, 'inputId');
    let Data = { password: inputpassword }
    if (selectedRole == "Admin") {
      Data = { ...Data, AdminId: inputId };
    }
    else if (selectedRole == "Hod") {
      Data = { ...Data, hodId: inputId };
    } else {
      Data = { ...Data, studentId: inputId };
    }

    const apiURL = selectedRole == "Admin" ? `http://${IpAddress}:5000/api/admin/login` : selectedRole == "Hod" ? `http://${IpAddress}:5000/api/hod/login` : `http://${IpAddress}:5000/api/student/login`;
    await axios.post(apiURL, Data)

      .then(async (res) => {
        console.log(res.data, 1564);
        if (res.data.success) {
          setResponse(res.data.message)
          await AsyncStorage.setItem("Token", JSON.stringify(res.data.authtoken));
          await AsyncStorage.setItem("Role", (selectedRole));
          await setCount(count+1)
          await navigation.navigate('Home')
        } else {
          setResponse(res.data.error)
        }
      })
      .catch((err) => {
        console.log(err);
      })
  }

  const handleChangeId = (id) => {
    setResponse(null)
    setInputId(id)
  }

  
  const handleChangePassword = (password) => {
    setResponse(null)
    setInputpassword(password)
  }

  useEffect(() => {
    setInputId(null)
    setInputpassword(null)
    setResponse(null)
  }, [selectedRole])




  return (
    <Block flex middle>
      <StatusBar hidden />
      <ImageBackground
        source={Images.RegisterBackground}
        style={{ width, height, zIndex: 1 }}
      >
        <Block safe flex middle>
          <Block style={styles.registerContainer}>
            <Block flex>
              <Block flex={0.5} middle>
                <Text color="#000" size={22} style={{ marginBottom: 5,fontFamily:'PoppinsBold' }}>
                  Sign in
                </Text>
                <Image source={Images.LogoOnboarding} style={styles.logo} />
              </Block>
              <Block style={styles.roleButtonsContainer}>
                <Button
                  style={[styles.roleButton, { backgroundColor: selectedRole == "Admin" ? '#3a4c70' : '#2e3a52' }]}
                  onPress={() => setSelectedRole('Admin')}
                >
                  <Text  size={14} style={styles.roleButtonText}>
                    Admin
                  </Text>
                </Button>
                <Button
                  style={[styles.roleButton, { backgroundColor: selectedRole == "Hod" ? '#3a4c70' : '#2e3a52' }]}
                  onPress={() => setSelectedRole('Hod')}
                >
                  <Text  size={14} style={[styles.roleButtonText,]}>
                    HOD
                  </Text>
                </Button>
                <Button
                  onPress={() => setSelectedRole('Student')}
                  style={[styles.roleButton, { backgroundColor: selectedRole == "Student" ? '#3a4c70' : '#2e3a52' }]}
                >
                  <Text size={14} style={styles.roleButtonText}>
                    Student
                  </Text>
                </Button>
              </Block>
              <Block flex center>
                <KeyboardAvoidingView
                  style={{ flex: 1 }}
                  behavior="padding"
                  enabled
                >
                  <Block width={width * 0.8} style={{ marginBottom: 15 }}>
                    <Input
                      borderless
                       style={styles.input}
                      placeholder={selectedRole == "Admin" ? "Admin_Id" : selectedRole == "Hod" ? "Hod_Id" : "Student_Id"}
                      onChangeText={handleChangeId}
                      keyboardType="numeric"
                      iconContent={
                          <Ionicon
                          size={16}
                          color={argonTheme.COLORS.ICON}
                          name="id-card"
                          style={styles.inputIcons}
                        />
                          // <Icon
                          //   size={16}
                          //   color={argonTheme.COLORS.ICON}
                          //   name="hat-3"
                          //   family="ArgonExtra"
                          //   style={styles.inputIcons}
                          // />
                      }
                    />
                  </Block>
                  <Block width={width * 0.8}>
                    <Input
                       style={styles.input}

                      password
                      borderless
                      placeholder="Password"
                      value={inputpassword}
                      onChangeText={handleChangePassword}
                      iconContent={
                        <Icon
                          size={16}
                          color={argonTheme.COLORS.ICON}
                          name="padlock-unlocked"
                          family="ArgonExtra"
                          style={styles.inputIcons}
                        />
                      }
                    />
                    <Block>
                      {response && (
                        <Text style={{ color: response == "Successfull" ? "green" : '#d97979', textAlign: 'center', top: 5 }}>{response}</Text>
                      )}
                    </Block>
                  </Block>
                  <Block middle>
                    <Button
                      //   color="primary" 
                      style={styles.createButton}
                      onPress={ContinueBtn}
                    >
                      <Text style={{fontFamily:'PoppinsBold'}} size={14} color={argonTheme.COLORS.WHITE}>
                        CONTINUE
                      </Text>
                    </Button>

                    <Block style={{ flexDirection: 'row' }}>
                      <Text style={{ fontFamily: 'PoppinsMedium', color: 'white', fontSize: 13 }}>Are you representing a company?</Text>
                      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                        <Text style={{
                          fontFamily: 'PoppinsMedium', color: 'white', fontSize: 14, textDecorationLine: 'underline',
                        }}> Register</Text>
                      </TouchableOpacity>
                    </Block>
                  </Block>
                </KeyboardAvoidingView>
              </Block>
            </Block>
          </Block>
        </Block>
      </ImageBackground>
    </Block>
  );
};

const styles = StyleSheet.create({
  registerContainer: {
    width: width * 0.9,
    height: height / 1.6,
    backgroundColor: "#b2bccc62",
    borderRadius: 18,
    shadowColor: argonTheme.COLORS.BLACK,
    shadowOffset: {
      width: 0,
      height: 4
    },
    shadowRadius: 8,
    shadowOpacity: 0.1,
    // elevation: 1,
    // overflow: "hidden"
  },
  logo: {
    width: 200,
    height:50,
    zIndex: 2,
    marginTop: 10,
  },
  inputIcons: {
    marginRight: 12
  },
  createButton: {
    width: width * 0.5,
    marginTop: 25,
    backgroundColor: "#2e3a52",
  },
  roleButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Adjust this property for spacing between buttons
    marginBottom: 15, // Optional: Adjust this for margin bottom
  },
  roleButton: {
    backgroundColor: "#2e3a52", // Example color, change as needed
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    width: width / 4, // Adjust the percentage as needed
  },
  roleButtonText: {
    color: "white", // Example color, change as needed
    fontSize: 14, // Example size, change as needed
    fontFamily:'PoppinsBold'

  },input:{
    fontFamily:'PoppinsMedium',
    
  }
});

export default Login;
