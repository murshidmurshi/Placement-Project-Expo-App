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



export default function CompanyProfile({ navigation, route }) {
  let { company } = route?.params;
  const{defaultCompany}=useContext(MyContext)
  
  let GlobalStyle = globalStyles()
  return (
    <>
      <Block style={{ backgroundColor: 'white', flex: 1 }}>
        <Appbar.Header elevated style={{ backgroundColor: 'white' }}>
          <Appbar.BackAction onPress={() => navigation.goBack()} />

          <Appbar.Content title="Company" titleStyle={{ fontSize: 18, fontFamily: 'PoppinsBold' }} />
        </Appbar.Header>

        <ScrollView style={[GlobalStyle.container, styles.scrollView]}>
          <View style={{ backgroundColor:'white',elevation:1, margin: 20, borderRadius: 15 }}>
            <Block flex style={styles.profileCard}>
              <Block middle style={styles.avatarContainer}>
                <Image
                  source={{ uri: company?.avtar||defaultCompany }}
                  style={styles.avatar}
                />
              </Block>
            </Block>

            <Block >
              <Block middle style={styles.nameInfo}>
                <Text size={28} color="#32325D" style={styles?.hodName}>
                  {company?.name}
                </Text>
           
                <Text size={16} color="#32325D" style={styles?.hodAddress}>
                  Address: {company?.address || "Not added"}
                </Text>
                <Text size={16} color="#32325D" style={styles?.hodAddress}>
                  Contact: {company?.phone || "Not added"}
                </Text>
                <Text size={16} color="#32325D" style={styles?.hodAddress}>
                  Email: {company?.email || "Not added"}
                </Text>
              </Block>

              <Block middle style={{ marginTop: 15, marginBottom: 5, padding: 2, marginHorizontal: 15,borderWidth:0.5,borderRadius:15,padding:8 }}>
             <View style={{flexDirection:'row',justifyContent:'space-around',width:'100%',}}>
                <View>
                <Text style={{fontFamily:'PoppinsBold',textAlign:'center'}}>Added on</Text>
                <Text style={{fontFamily:'PoppinsMedium',textAlign:'center',color:'grey'}}>
                  {new Date(company?.date).toLocaleDateString()}
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
                onPress={()=>navigation.navigate('EditCompany',{company})}
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
    fontSize: 26,
    marginTop:10
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