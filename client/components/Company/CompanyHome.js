import { StyleSheet, Text, View, Image, Alert, TouchableOpacity, Dimensions } from 'react-native';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import Header from "../Header";
import { SafeAreaView } from 'react-native-safe-area-context';
import { Block, Button, Card } from 'galio-framework';
import { TouchableRipple } from 'react-native-paper';
import { MyContext } from '../../MyContext';
import { ScrollView } from 'react-native-gesture-handler';
import globalStyles from '../../assets/GlobaStyles';
import Ionicon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import { IpAddress } from '../../GlobalAddress';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;



// Dummy data for avatar and total students
const dummyData = {
  totalStudents: 150, // Replace 150 with the actual number of total students
};

export default function CompanyHome({ navigation }) {
  const { userDetail, defaultCompany } = useContext(MyContext)
  console.log(userDetail, 'userDetail');
  // const [companyDetail,setCompanyDetail]=useState(userDetail[0])
  let GlobaStyles = globalStyles()

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <Header title={"Home"} />
      <ScrollView style={GlobaStyles.container} showsVerticalScrollIndicator={false}>
        {/* Greeting message for the HOD */}
        <View style={{ marginBottom: 10 }}>
          <Text style={styles.greeting}>Hello, </Text>
          <Text style={styles.greetingName}>{userDetail && userDetail[0]?.name} </Text>
        </View>


        <View style={{ alignItems: 'center', marginHorizontal: 5, borderRadius: 10, padding: 10 }}>
          <Image style={{ width: 310, height: 200, borderRadius: 10 }}
            source={{ uri: userDetail && userDetail[0]?.avtar || defaultCompany }}
          />
        </View>


        <View style={styles.MainImageContainer}>
          <View style={styles.singleImage}>
            <Ionicon name='call-outline' size={40} />
            <View>
              <Text style={{ fontFamily: 'PoppinsBold' }}>Phone</Text>
              <Text style={{ fontFamily: 'PoppinsMedium' }}>{userDetail && userDetail[0]?.phone?userDetail[0]?.phone:'Not added'}</Text>
            </View>
          </View>
          <View style={styles.singleImage}>
            <Ionicon name='location-outline' size={40} />
            <View>
              <Text style={{ fontFamily: 'PoppinsBold' }}>Location</Text>
              <Text style={{ fontFamily: 'PoppinsMedium' }}>{userDetail && userDetail[0]?.location ? userDetail[0]?.location : 'Noadded'},
                {/* {  userDetail && userDetail[0]?.address} */}
              </Text>
            </View>
          </View>
        </View>


        <View>
          <Text style={{ fontFamily: 'PoppinsBold', fontSize: 16, left: 10 }}>About your Company</Text>
          {userDetail && userDetail[0]?.desc ? (
            <>
              <Text style={{ fontFamily: 'PoppinsMedium', left: 10, marginBottom: 10 }}>{userDetail[0]?.desc}</Text>
            </>
          ) : (
            <Text style={{ fontFamily: 'PoppinsMedium', left: 10, marginBottom: 10 }}>Not available</Text>
          )}
        </View>



        <Button onPress={() => navigation.navigate('CompanyProfile', { company: userDetail[0] })}>
          <Text style={{ fontFamily: 'PoppinsBold', color: 'white' }}>Edit your Company</Text>
        </Button>

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
    borderRadius: 5,
    borderColor: 'brown',
    // flexDirection: 'row',
    margin: 2,
    marginBottom: 13,
    backgroundColor: 'white',
    elevation: 2,
  },
  totalStudents: {
    fontSize: 24,
    fontWeight: 'bold',
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
  },
  StudentCountView: {
    flexDirection: 'row',
    justifyContent: "space-between",
    alignItems: 'center',
    marginTop: 5
  },
  SingleDepartment: {
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
    marginVertical: 10,
    elevation: 1,
    margin: 2
    // borderWidth:0.2
  },
  MainImageContainer: {
    // backgroundColor: "blue",
    justifyContent: 'center',
    borderRadius: 10,
    marginVertical: 10,
    flexDirection: 'row',
    gap: 20,
    padding: 15,
    flexWrap: "wrap"
  },
  singleImage: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    elevation: 2
  }
});
