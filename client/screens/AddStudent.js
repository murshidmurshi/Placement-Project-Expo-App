import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, Image, StatusBar } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { ScrollView } from 'react-native-gesture-handler';
import { Block } from 'galio-framework';
import Ionicon from 'react-native-vector-icons/Ionicons';
import globalStyles from '../assets/GlobaStyles';
import { ActivityIndicator, Appbar, Button, Dialog, Portal } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import ArButton from '../components/Button';
import axios from 'axios';
import { IpAddress } from '../GlobalAddress';
import RNPickerSelect from 'react-native-picker-select';
import { MyContext } from '../MyContext';

export default function AddStudent() {
  const { count, setCount, alldepartment, setAllDepartment } = useContext(MyContext)

  const [visible, setVisible] = React.useState(false);

  const showDialog = () => setVisible(true);

  const hideDialog = () => setVisible(false);
  const [newDepartment, setNewDepartment] = useState('');
  console.log(newDepartment, 'newDepartment');

  const [imageUri, setImageUri] = useState(null);
  const [spinner, setSpinner] = useState(false);
  const [successImage, setSuccessImage] = useState(null);
  const [showImage, setShowImage] = useState(false)
  let defaulAvtar = 'https://img.freepik.com/premium-vector/man-avatar-profile-picture-vector-illustration_268834-541.jpg?size=626&ext=jpg&ga=GA1.1.1623246564.1699356450&semt=ais'

  const [formData, setFormData] = useState({
    name: '',
    studentId: '',
    department: '',
    password: '',
    imageUri: defaulAvtar

  });

  const GlobalStyle = globalStyles();
  let navigation = useNavigation();

  const handleChange = (name, value) => {
    setSpinner(false);
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };
  const handleChangeDepartment = (department) => {
    console.log(department, 'department');
    setFormData(prevState => ({
      ...prevState,
      ["department"]: department?.name,
      ["departmentId"]: department?._id,
    }));

  };

  // const handleAddStudent = async () => {
  //   const { name, studentId, department, password, } = formData;
  //   console.log(formData,'formData');
  //   if (!name || !studentId || !department || !password||!imageUri) {
  //     Alert.alert('Error', 'Please fill in all fields');
  //     return;
  //   }
  //   const apiURL = `http://${IpAddress}:5000/api/admin/addStudent`;
  //   console.log(formData,'formData');
  //   await axios.post(apiURL, formData)
  //     .then(async (res) => {
  //       if (res.data.success) {
  //         await setCount(count+1)
  //         await navigation.goBack()
  //         setFormData({
  //           name: '',
  //           studentId: '',
  //           department: '',
  //           password: '',
  //           imageUri: null
  //         });
  //       } else {
  //         Alert.alert('Error', res.data.error)
  //       }
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     })

  // };

  const handleAddStudent = async () => {
    setSpinner(true)

    const { name, studentId, department, password } = formData;

    // Check if all required fields are filled
    if (!name || !studentId || !department || !password || !imageUri) {
      Alert.alert('Error', 'Please fill in all fields');
      setSpinner(false)
      return;
    }
    // Upload image to Cloudinary
    try {
      let newFile = {
        uri: imageUri,
        type: `test/${imageUri.split('.')[1]}`,
        name: `test.${imageUri.split('.')[1]}`,
      };
      const data = new FormData();

      data.append('file', newFile);
      data.append('upload_preset', 'PlacementProject');
      // data.append('cloud_name', 'dxwxy8bvs');
      data.append('cloud_name', 'dnk7llops');      
      const response = await fetch('https://api.cloudinary.com/v1_1/dnk7llops/image/upload', {
        method: 'POST',
        body: data,
      });
      const result = await response.json();

      const publicId = result.public_id;
      const newAvtar = result.secure_url;

      // Add image URL and public ID to form data
      const formDataWithImage = { ...formData, imageUri: newAvtar, publicId };

      // Add HOD with image to the backend
      const apiURL = `http://${IpAddress}:5000/api/admin/addStudent`;
      const res = await axios.post(apiURL, formDataWithImage);

      if (res.data.success) {
        setCount(count + 1);
        await navigation.goBack();
        setSpinner(false)

        setFormData({
          name: '',
          studentId: '',
          department: '',
          password: '',
          imageUri: null,
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

  const handleDefaultImage = () => {
    setShowImage(true)
    setImageUri(defaulAvtar)
  }

  return (
    <>
      <Block style={{ backgroundColor: 'white', flex: 1 }}>
        <Appbar.Header elevated style={{ backgroundColor: 'white' }}>
          <Appbar.BackAction onPress={() => navigation.goBack()} />

          <Appbar.Content title="Add Student" titleStyle={{ fontSize: 18, fontFamily: 'PoppinsBold' }} />
        </Appbar.Header>
        <ScrollView style={[GlobalStyle.container, styles.scrollView]}
          showsVerticalScrollIndicator={false}

        >
          <View style={styles.container}>
            <Text style={styles.title}>Add Student</Text>
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
              value={formData?.studentId}
              onChangeText={value => handleChange('studentId', value)}
            />
            <View style={styles.pickerContainer}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={styles.label}>Department</Text>
                <View style={{ alignSelf: 'flex-start' }}>
                  <Ionicon name='add-circle' size={25} style={{ right: 20 }} onPress={showDialog} />
                </View>
              </View>
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
              placeholder="Password"
              secureTextEntry={true}
              value={formData.password}
              onChangeText={value => handleChange('password', value)}
            />

            <View>
              <Image style={{ height: 90, width: 90, borderRadius: 15 }} source={{ uri: imageUri || defaulAvtar }} />
            </View>
            {showImage && (
              <Text style={{ fontFamily: 'PoppinsMedium', fontSize: 13 }}>Default avtar added by admin</Text>
            )}

            <TouchableOpacity style={styles.imageButton} onPress={handleDefaultImage}>
              <Text style={{ fontFamily: 'PoppinsBold' }}>Default Image</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.imageButton} onPress={handleImageUpload}>
              <Text style={{ fontFamily: 'PoppinsBold' }}>Upload Image</Text>
            </TouchableOpacity>

            {/* {formData.imageUri && <Image source={{ uri: formData.imageUri }} style={styles.image} />} */}

            {spinner ? (
              <ArButton style={{ width: '100%', marginTop: 20 }} >
                <ActivityIndicator color='white' />
              </ArButton>
            )
              : (
                <ArButton style={{ width: '100%', marginTop: 20 }} onPress={handleAddStudent}>

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
  },
});
