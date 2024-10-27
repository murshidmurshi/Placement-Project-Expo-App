import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, Image, StatusBar, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { ScrollView } from 'react-native-gesture-handler';
import { Block } from 'galio-framework';
import Ionicon from 'react-native-vector-icons/Ionicons';
import globalStyles from '../../assets/GlobaStyles';
import { Appbar, Dialog, Portal, Button, ActivityIndicator } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import ArButton from '../Button';
import axios from 'axios';
import { IpAddress } from '../../GlobalAddress';
import RNPickerSelect from 'react-native-picker-select';
import { MyContext } from '../../MyContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as DocumentPicker from 'expo-document-picker';
// import * as MediaLibrary from 'expo-media-library';
import * as Linking from 'expo-linking';


import AddedPDF from './PDF.png'


export default function EditStudent({ route }) {
  let { student } = route.params;

  console.log(student, 'hod');

  


  const { count, setCount, alldepartment, setAllDepartment } = useContext(MyContext)
  const [visible, setVisible] = React.useState(false);

  const showDialog = () => setVisible(true);

  const hideDialog = () => setVisible(false);
  const [newDepartment, setNewDepartment] = useState('');
  let defaulAvtar = 'https://img.freepik.com/premium-vector/man-avatar-profile-picture-vector-illustration_268834-541.jpg?size=626&ext=jpg&ga=GA1.1.1623246564.1699356450&semt=ais'
  
  let DefaultResume = "https://img.freepik.com/free-vector/male-hand-holding-folder-with-documents-flat-vector-illustration-businessman-holding-red-file-important-business-real-estate-documents-stationery-application-meeting-concept_74855-24910.jpg?t=st=1714914997~exp=1714918597~hmac=7c62943019913c7c1529edc75aed5418eaa568c4940db41001039ca0c8e795ab&w=740"

  const [showImage, setShowImage] = useState(false)

  const [imageUri, setImageUri] = useState(student?.avtar);
  const [resumeUri, setResumeUri] = useState(student?.resume);
  const [spinner, setSpinner] = useState(false);
  const [successImage, setSuccessImage] = useState(null);
  console.log(resumeUri, 'resumeUri');

  const [formData, setFormData] = useState({
    name: student?.name,
    studentId: student?.studentId,
    department: student?.department,
    newpassword: "",
    imageUri: student?.avtar,
    address: student?.address,
    phone: student?.phone,
    email: student?.email,
    resumeUri: student?.resume,
  });

  const GlobalStyle = globalStyles();
  let navigation = useNavigation();

  const handleChange = (name, value) => {
    setSpinner(false)
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  // const openPdf = () => {
  //   const pdfUrl = resumeUri; // Replace with your PDF URL
  //   // Handle opening PDF based on platform
  //   if (Platform.OS === 'ios') {
  //     Linking.openURL(`pdfviewer://example.com/open?file=${encodeURIComponent(pdfUrl)}`);
  //   } else {
  //     Linking.openURL(pdfUrl);
  //   }
  // };

  const handleEditStudent = async () => {
    setSpinner(true)
    const { name, studentId, department, email, phone, address, newpassword } = formData;
    // Check if all required fields are filled
    if (!name || !studentId || !department || !imageUri || !email || !phone || !address) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    // Upload image to Cloudinary
    let newPublicId, newAvtar, resume, resumeId;
    try {
      let newFile = {
        uri: imageUri,
        type: `test/${imageUri.split('.')[1]}`,
        name: `test.${imageUri.split('.')[1]}`,
      };

      if (imageUri) {
        const data = new FormData();
        data.append('file', newFile);

        data.append('file', newFile);
        data.append('upload_preset', 'PlacementProject');
        data.append('cloud_name', 'dxwxy8bvs');
        const response = await fetch('https://api.cloudinary.com/v1_1/dxwxy8bvs/image/upload', {
          method: 'POST',
          body: data,
        });

        const result = await response.json();
        console.log(result, 'result');
        newPublicId = result.public_id;
        newAvtar = result.secure_url;
      }

      if (resumeUri) {
        // Upload for Resume
        let newResumeFile = {
          uri: resumeUri,
          type: `test/${resumeUri.split('.')[1]}`,
            //  type: `application/pdf`,
            //  name: 'test.pdf',
        name: `test.${resumeUri.split('.')[1]}`,

        };
        const data2 = new FormData(); 
        data2.append('file', newResumeFile);
        data2.append('upload_preset', 'PlacementProject');
        data2.append('cloud_name', 'dxwxy8bvs');
        const response2 = await fetch('https://api.cloudinary.com/v1_1/dxwxy8bvs/image/upload', {
          method: 'POST',
          body: data2,
        });
        const result2 = await response2.json();
        resumeId = result2.public_id;
        resume = result2.secure_url;
      }

      // console.log(formData,'formData');
      // Add image URL and public ID to form data
      const formDataWithImage = { ...formData, imageUri: newAvtar, newPublicId, resumeId: resumeId, resume };

      // Add HOD with image to the backend
      const apiURL = `http://${IpAddress}:5000/api/student/edit/${student?._id}`;
      const res = await axios.post(apiURL, formDataWithImage);

      if (res.data.success) {
        await AsyncStorage.setItem("Token", JSON.stringify(res.data.authtoken));
        await setCount(count + 1);
        await navigation.goBack();
        setSpinner(false)
        await navigation.navigate("Home");

        setSpinner(false)
        setFormData({
          name: '',
          studentId: '',
          department: '',
          password: '',
          imageUri: null,
          address: "",
          phone: "",
          email: "",
        });

      } else {
        Alert.alert('Error', res.data.error);
      }
    } catch (error) {
      console.error('Error uploading image or adding HOD:', error);
      Alert.alert('Error', 'Failed to upload image or add HOD');
    }
  };

  const handleImageUpload = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert('Permission denied', 'You need to grant permission to access the camera roll');
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!pickerResult.cancelled) {
      setImageUri(pickerResult.assets[0].uri);
      setShowImage(false)
    }
  };
  const handleResumeUpload = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert('Permission denied', 'You need to grant permission to access the camera roll');
      return;
    }
    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!pickerResult.cancelled) {
      setResumeUri(pickerResult.assets[0].uri);
      setShowImage(false)
    }
  };


  // const handleResumeUpload = async () => {
  //   try {
  //     const result = await DocumentPicker.getDocumentAsync({
  //       type: 'application/pdf', // Specify specific MIME types like 'application/pdf'
  //       copyToCacheDirectory: true, // Optional, defaults to true
  //     });
  //     console.log(result?.assets[0]?.uri,'result?.assets.uri');
  //     setResumeUri(result?.assets[0]?.uri);
  
  //   } catch (error) {
  //     console.log('Error picking document:', error);
  //     alert('Error picking document: ' + error);
  //   }
  // };
  
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

  const handleChangeDepartment = (department) => {
    console.log(department, 'department');
    setFormData(prevState => ({
      ...prevState,
      ["department"]: department?.name,
      ["departmentId"]: department?._id,
    }));

  };



  return (
    <>
      <Block style={{ backgroundColor: 'white', flex: 1 }}>
        <Appbar.Header elevated style={{ backgroundColor: 'white' }}>
          <Appbar.BackAction onPress={() => navigation.goBack()} />
          <Appbar.Content title="Edit Student" titleStyle={{ fontSize: 18, fontFamily: 'PoppinsBold' }} />
        </Appbar.Header>
        <ScrollView
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          style={[GlobalStyle.container, styles.scrollView]}>
          <View style={styles.container}>
            <Text style={styles.title}>Edit your profile</Text>
            <TextInput
              style={styles.input}
              placeholder="Name"
              value={formData.name}
              onChangeText={value => handleChange('name', value)}
            />
            <TextInput
              style={styles.input}
              placeholder="Student ID"
              keyboardType='numeric'
              value={formData.studentId}
              onChangeText={value => handleChange('studentId', value)}
            />
            <View style={styles.pickerContainer}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={styles.label}>Department</Text>
                <View style={{ alignSelf: 'flex-start' }}>
                  <Ionicon name='add-circle' size={25} style={{ right: 20 }} onPress={showDialog} />
                </View>
              </View>
              {/* <RNPickerSelect
                style={pickerSelectStyles}
                value={alldepartment?.name}
                onValueChange={()=>handleChangeDepartment(alldepartment[0])}
                // onValueChange={(value) => handleChange('department', value)}
                items={alldepartment.map(department => ({ label: department?.name, value: department?.name }))}
              /> */}

              <RNPickerSelect
                style={pickerSelectStyles}
                value={formData.department}
                onValueChange={(value) => {
                  const index = alldepartment.findIndex(item => item.name === value);
                  if (index !== -1) {
                    handleChangeDepartment(alldepartment[index]);
                  }
                }}
                items={alldepartment.map(department => ({ label: department?.name, value: department?.name }))}
              />
            </View>
            <TextInput
              style={styles.input}
              placeholder="New Password"
              secureTextEntry={true}
              value={formData.password}
              onChangeText={value => handleChange('newpassword', value)}
            />
            
            {/* <Button  onPress={openPdf} >
            title="Open PDF"
            </Button> */}
            
            <TextInput
              style={styles.input}
              placeholder="Phone Number"
              keyboardType='numeric'
              value={formData.phone}
              onChangeText={value => handleChange('phone', value)}
            />
            <TextInput
              style={styles.input}
              placeholder="Email "
              value={formData.email}
              onChangeText={value => handleChange('email', value)}
            />
            <TextInput
              style={styles.input}
              placeholder="Address "
              value={formData.address}
              onChangeText={value => handleChange('address', value)}
            />

            <View>
              <Image style={{ height: 90, width: 90, borderRadius: 15 }} source={{ uri: imageUri || defaulAvtar }} />
            </View>

            <TouchableOpacity style={styles.imageButton} onPress={handleImageUpload}>
              <Text style={{ fontFamily: 'PoppinsBold' }}>Upload Image</Text>
            </TouchableOpacity>

            <View>
              {/* {resumeUri?(
                <Image style={{ height: 90, width: 90, borderRadius: 15, marginTop: 20,padding:10 }} source={require('./PDF.png')} />
              ):(
              )} */}
              <Image style={{ height: 90, width: 90, borderRadius: 15, marginTop: 20 }} source={{ uri:resumeUri||DefaultResume }} />
            </View>
            <TouchableOpacity style={styles.imageButton} onPress={handleResumeUpload}>
              <Text style={{ fontFamily: 'PoppinsBold' }}>Upload Resume</Text>
            </TouchableOpacity>

            {/* {formData.imageUri && <Image source={{ uri: formData.imageUri }} style={styles.image} />} */}

            {spinner ? (
              <ArButton style={{ width: '100%', marginTop: 20 }} >
                <ActivityIndicator color='white' />
              </ArButton>
            )
              : (
                <ArButton style={{ width: '100%', marginTop: 20 }} onPress={handleEditStudent}>
                  <Text style={{ fontSize: 16, color: 'white', fontFamily: 'PoppinsBold' }}>Submit</Text>
                </ArButton>
              )}
          </View>
        </ScrollView>
        

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
      </Block>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginTop: 80,
    borderColor: 'black',
    elevation: 1,
    padding: 20,
    margin: 8,
    borderRadius: 15
  },
  title: {
    fontSize: 18,
    marginBottom: 20,
    fontFamily: 'PoppinsBold'

  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingLeft: 10,
    fontFamily: 'PoppinsMedium'
  },
  pickerContainer: {
    width: '100%',
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    fontFamily: 'PoppinsMedium'
  },
  picker: {
    height: 40,
    width: '100%',
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    fontFamily: 'PoppinsMedium'

  },
  imageButton: {
    borderColor: 'grey',
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginTop: 20,
  },
  scrollView: {
    flexGrow: 1,
    height: '100%',
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
    fontFamily: 'PoppinsMedium'

  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
    fontFamily: 'PoppinsMedium'

  },
});
