import React, { useCallback, useContext, useEffect, useState } from "react";
import {
  StyleSheet,
  ImageBackground,
  Dimensions,
  StatusBar,
  KeyboardAvoidingView,
  Image,
  TouchableOpacity,
  Alert
} from "react-native";
import { Block, Text, Checkbox, theme } from "galio-framework";

import { Images, argonTheme } from "../constants";
import { Button, Icon, Input } from "../components";
import { IpAddress } from "../GlobalAddress";
import { useFocusEffect } from "@react-navigation/native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MyContext } from "../MyContext";
import Ionicon from 'react-native-vector-icons/Ionicons'


const { width, height } = Dimensions.get("screen");

const CompanyLogin = ({ navigation }) => {
  let {setCount,count}=useContext(MyContext)
  const [inputId, setInputId] = useState(null)
  const [inputpassword, setInputpassword] = useState(null)
  const [response, setResponse] = useState(null);
  console.log(response,'response');


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
      return; // Stop further execution if input is invalid
    }
  
    const Data = { password: inputpassword, companyId: inputId };
    const apiURL = `http://${IpAddress}:5000/api/company/login`;
  
    try {
      const res = await axios.post(apiURL, Data);
      console.log(res.data);
  
      if (res.data.success) {
        setResponse(res.data.message)
          await AsyncStorage.setItem("Token", JSON.stringify(res.data.authtoken));
          await AsyncStorage.setItem("Role", ("Company"));
          await setCount(count+1)

          await navigation.navigate('Home')
        
      } else {
        setResponse(res.data.error);
      }
    } catch (err) {
      console.error(err);
    }
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
  }, [])




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
                <Text color="#000" size={22} style={{marginTop:5,fontFamily:'PoppinsBold'}}>
                  Sign In
                </Text>
                <Image source={Images.LogoOnboarding} style={styles.logo} />
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
                      placeholder="Company Id"
                      keyboardType="numeric"
                      value={inputId}

                      onChangeText={handleChangeId}
                      iconContent={
                        <Ionicon
                        size={16}
                        color={argonTheme.COLORS.ICON}
                        name="id-card"
                        style={styles.inputIcons}
                      />
                      }
                    />
                  </Block>
                  <Block width={width * 0.8}>
                    <Input
                      password
                      borderless
                      value={inputpassword}

                      placeholder="Password"
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
                  </Block>
                  <Block>
                      {response && (
                        <Text style={{ color: response == "Successfull" ? "green" : '#d97979', textAlign: 'center', top: 5 }}>{response}</Text>
                      )}
                    </Block>
                  <Block middle>
                    <Button 
                      // color="primary" 
                      style={styles.createButton}
                      onPress={ContinueBtn}
                    >
                      <Text style={{fontFamily:'PoppinsBold'}} size={14} color={argonTheme.COLORS.WHITE}>
                        CONTINUE
                      </Text>
                    </Button>
                  </Block>

                  <Block middle style={{ flexDirection: 'row',marginTop:10 }}>
                      <Text style={{ fontFamily: 'PoppinsMedium', color: 'white', fontSize: 13 }}>Don't have an account?</Text>
                      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                        <Text style={{
                          fontFamily: 'PoppinsMedium', color: 'white', fontSize: 14, textDecorationLine: 'underline',
                        }}> Register</Text>
                      </TouchableOpacity>
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
    height: height / 1.8,
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
  }
});

export default CompanyLogin;
