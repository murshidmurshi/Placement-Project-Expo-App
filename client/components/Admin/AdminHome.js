import { StyleSheet, Text, View, Image, Alert, TouchableOpacity } from 'react-native';
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



// Dummy data for avatar and total students
const dummyData = {
  totalStudents: 150, // Replace 150 with the actual number of total students
};

export default function AdminHome({ navigation }) {
  const { allstudent, allhod, allCompany, alldepartment, setCount, count ,defaulAvtar,defaultCompany} = useContext(MyContext)
  console.log(alldepartment, "allDepartment");

  console.log(allCompany, "allCompany");
  let GlobaStyles = globalStyles()

  const handleCompanyPress = (companyDetail) => {
    console.log("Hello wrong");
    navigation?.navigate('SingleCompany', { Company: companyDetail })
  }

  // Add this function to handle department deletion
  const handleDeleteDepartment = async (id) => {
    const apiURL = `http://${IpAddress}:5000/api/admin/department/delete/${id}`;
    try {
      const res = await axios.delete(apiURL);
      if (res.data.success) {
        // // Update the list of departments after deletion
        // const updatedDepartments = alldepartment.filter(department => department.name !== departmentName);
        // setAllDepartment(updatedDepartments);
        await Alert.alert('Success', 'Department deleted successfully');
        setCount(count + 1)
      } else {
        Alert.alert('Error', res.data.error);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white', }}>
      <Header title={"Home"} />
      <ScrollView style={GlobaStyles.container} showsVerticalScrollIndicator={false}>
        {/* Greeting message for the HOD */}
        <View style={{ marginBottom: 10 }}>
          <Text style={styles.greeting}>Hello, </Text>
          <Text style={styles.greetingName}>Admin </Text>
        </View>

        {/* Display total number of students */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={{ fontSize: 17, fontFamily: 'PoppinsBold' }}>Student</Text>
          {allstudent?.length == 0 && (
            <Ionicon name='add-circle' size={25} style={{ right: 20 }} onPress={() => navigation?.navigate('AddStudent')} />
          )}
        </View>


        {allstudent?.length == 0 && (
          <>
            <Block style={{ marginVertical: 10, left: 20 }}>
              <Image style={{ height: 100, width: 100 }} source={{ uri: "https://img.freepik.com/free-vector/hand-drawn-no-data-concept_52683-127818.jpg?t=st=1713515779~exp=1713519379~hmac=7bcd9e0e4a76aa2cad898254898af3d4447a2228585e14bd49938b0e68fa26cc&w=900" }} />
              <Text style={{ fontSize: 14, fontFamily: 'PoppinsMedium' }}>No Student found</Text>
            </Block>
          </>
        )}


        {allstudent?.length > 0 && (
          <TouchableRipple style={styles.card} onPress={() => navigation.navigate('Student')}>
            <>
              <View style={styles.avatarContainer}>
                {allstudent?.slice(0, 4).map((Student, index) => (
                  <Image key={index} source={{ uri:Student?.avtar}} style={styles.studentAvatar} />
                ))}

                {allstudent?.length > 4 && (
                  <View style={styles.remainingStudents}>
                    <Text style={styles.remainingStudentsText}>
                      +{allstudent.length - 4}
                    </Text>
                  </View>
                )}
              </View>
              <Block style={styles.StudentCountView}>
                <Text style={{ fontFamily: 'PoppinsBold' }}>Total Student </Text>
                <View style={{ borderRadius: 20, width: 32, height: 32, borderWidth: 0.5, justifyContent: 'center' }}>
                  <Text style={{ alignSelf: 'center' }}>{allstudent?.length}</Text>
                </View>
              </Block>
            </>
          </TouchableRipple>

        )}

        {/* Display total number of Hod */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={{ fontSize: 17, fontFamily: 'PoppinsBold' }}>Head of Department</Text>
          {allhod?.length == 0 && (
            <Ionicon name='add-circle' size={25} style={{ right: 20 }} onPress={() => navigation?.navigate('AddHod')} />
          )}
        </View>

        {allhod?.length == 0 && (
          <>
            <Block style={{ marginVertical: 10, left: 20 }}>
              <Image style={{ height: 100, width: 100 }} source={{ uri: "https://img.freepik.com/free-vector/hand-drawn-no-data-concept_52683-127818.jpg?t=st=1713515779~exp=1713519379~hmac=7bcd9e0e4a76aa2cad898254898af3d4447a2228585e14bd49938b0e68fa26cc&w=900" }} />
              <Text style={{ fontSize: 14, fontFamily: 'PoppinsMedium' }}>No Hod found</Text>
            </Block>
          </>
        )}


        {allhod?.length > 0 && (
          <TouchableRipple style={styles.card} onPress={() => navigation.navigate('Hod')}>
            <>
              <View style={styles.avatarContainer}>
                {allhod?.slice(0, 4).map((Hod, index) => (
                  <Image key={index} source={{ uri: Hod?.avtar }} style={styles.studentAvatar} />
                ))}

                {allhod?.length > 4 && (
                  <View style={styles.remainingStudents}>
                    <Text style={styles.remainingStudentsText}>
                      +{allhod.length - 4}
                    </Text>
                  </View>
                )}
              </View>
              <Block style={styles.StudentCountView}>
                <Text style={{ fontFamily: 'PoppinsBold' }}>Total Hod </Text>
                <View style={{ borderRadius: 20, width: 32, height: 32, borderWidth: 0.5, justifyContent: 'center' }}>
                  <Text style={{ alignSelf: 'center' }}>{allhod?.length || 0}</Text>
                </View>
              </Block>
            </>
          </TouchableRipple>
        )}




        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={{ fontSize: 17, fontFamily: 'PoppinsBold' }}>Company</Text>
          {/* {allCompany?.length == 0 && (
          <Ionicon name='add-circle' size={25} style={{ right: 20 }} onPress={()=>navigation?.navigate('AddCompany')} />
        )} */}
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false} style={{ marginVertical: 10, }}>
          <View style={{ gap: 15, flexDirection: 'row' }}>
            {allCompany?.length == 0 && (
              <>
                <Block style={{ marginVertical: 10, left: 20, width: 400 }}>
                  <Image style={{ height: 100, width: 100 }} source={{ uri: "https://img.freepik.com/free-vector/hand-drawn-no-data-concept_52683-127818.jpg?t=st=1713515779~exp=1713519379~hmac=7bcd9e0e4a76aa2cad898254898af3d4447a2228585e14bd49938b0e68fa26cc&w=900" }} />
                  <Text style={{ fontSize: 14, fontFamily: 'PoppinsMedium' }}>No Company found</Text>
                </Block>
              </>
            )}
            {allCompany?.map((Company, index) => (
              <React.Fragment key={index}>
                <TouchableRipple style={{ elevation: 1, margin: 2, padding: 10, borderRadius: 5, alignItems: 'center', justifyContent: 'center', width: 190, marginBottom: 10, backgroundColor: 'white' }}>
                  <>
                    <Image source={{ uri: Company?.avtar||defaultCompany }} style={{ width: 80, height: 80, padding: 10, borderRadius: 10 }} />
                    <View style={{}}>
                      <Text style={{ fontSize: 16, fontFamily: "PoppinsBold", marginTop: 10, marginBottom: 5, textAlign: 'center' }}>{Company?.name}</Text>
                      <Text style={{ fontSize: 13, color: 'gray', textAlign: 'center', fontFamily: "PoppinsMedium", }}>Added on {new Date(Company?.date).toLocaleDateString()}</Text>
                    </View>
                    <Button onPress={() => handleCompanyPress(Company)} style={{ backgroundColor: '#f3f2f2', }}>
                      <Text style={{ fontSize: 18, fontFamily: "PoppinsBold", textAlign: 'center' }}>View</Text>
                    </Button>
                  </>
                </TouchableRipple>
              </React.Fragment>
            ))}
          </View>




        </ScrollView>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={{ fontSize: 17, fontFamily: 'PoppinsBold' }}>Departments</Text>
          {/* {allCompany?.length == 0 && (
          <Ionicon name='add-circle' size={25} style={{ right: 20 }} onPress={()=>navigation?.navigate('AddCompany')} />
        )} */}
        </View>
        {alldepartment?.length == 0 && (
          <>
            <Block style={{ marginVertical: 10, left: 20 }}>
              <Image style={{ height: 100, width: 100 }} source={{ uri: "https://img.freepik.com/free-vector/hand-drawn-no-data-concept_52683-127818.jpg?t=st=1713515779~exp=1713519379~hmac=7bcd9e0e4a76aa2cad898254898af3d4447a2228585e14bd49938b0e68fa26cc&w=900" }} />
              <Text style={{ fontSize: 14, fontFamily: 'PoppinsMedium' }}>No Department found</Text>
            </Block>
          </>
        )}

        {alldepartment?.map((department, index) => (
          <>
            <View style={styles.SingleDepartment}>
              <View>
                <Text style={{ fontFamily: 'PoppinsMedium', fontSize: 15 }}>{department?.name}</Text>
                <Text style={{ fontFamily: 'PoppinsMedium', fontSize: 15 }}>Added on  {new Date(department?.date).toLocaleDateString()}</Text>
              </View>
              <TouchableOpacity onPress={() => handleDeleteDepartment(department._id)}>
                <Ionicon name='trash-outline' size={24} color='red' />
              </TouchableOpacity>
            </View>

          </>
        ))}

      </ScrollView>

      {/* <View>
        <Button onPress={() => navigation.navigate('AdminNoti')} style={{ backgroundColor: '#f3f2f2' }}>
          <Text style={{ fontSize: 18, fontFamily: "PoppinsBold", textAlign: 'center' }}>Add Department</Text>
        </Button>
      </View> */}
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
});
