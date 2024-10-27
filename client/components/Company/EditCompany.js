import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, Image, StatusBar } from 'react-native';
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

export default function EditCompany({ route }) {
  let { company } = route.params;

  console.log(company, 'company');

  const { count, setCount, defaultCompany } = useContext(MyContext)
  const [visible, setVisible] = React.useState(false);

  const [imageUri, setImageUri] = useState(company?.avtar);
  const [spinner, setSpinner] = useState(false);
  const [successImage, setSuccessImage] = useState(null);

  const [formData, setFormData] = useState({
    name: company?.name,
    companyId: company?.companyId,
    newpassword: "",
    imageUri: company?.avtar,
    address: company?.address,
    phone: company?.phone,
    email: company?.email,
    location: company?.location,
    desc: company?.desc,
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

  const handleAddHod = async () => {

    const { name, companyId, email, phone, address,location,desc } = formData;

    // Check if all required fields are filled
    if (!name || !companyId || !imageUri || !email || !phone || !address||!location || !desc) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }else{
    setSpinner(true)
    }
    // Upload image to Cloudinary
    try {

      let newFile = {
        uri: imageUri,
        type: `test/${imageUri.split('.')[1]}`,
        name: `test.${imageUri.split('.')[1]}`,
      };

      let newAvtar,newPublicId;
      if(imageUri){
        const data = new FormData();
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
      
      // Add image URL and public ID to form data
      const formDataWithImage = { ...formData, imageUri: newAvtar, newPublicId,id:company?._id };

      // Add HOD with image to the backend
      const apiURL = `http://${IpAddress}:5000/api/company/edit/${company?._id}`;
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
          companyId: '',
          password: '',
          imageUri: null,
          address: "",
          phone: "",
          location: "",
          desc: "",
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
      // setShowImage(false)
    }
  };

  return (
    <>
      <Block style={{ backgroundColor: 'white', flex: 1 }}>
        <Appbar.Header elevated style={{ backgroundColor: 'white' }}>
          <Appbar.BackAction onPress={() => navigation.goBack()} />
          <Appbar.Content title="Edit Company" titleStyle={{ fontSize: 18, fontFamily: 'PoppinsBold' }} />
        </Appbar.Header>
        <ScrollView
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          style={[GlobalStyle.container, styles.scrollView]}>
          <View style={styles.container}>
            <Text style={styles.title}>Edit your Company</Text>
            <TextInput
              style={styles.input}
              placeholder="Name"
              value={formData.name}
              onChangeText={value => handleChange('name', value)}
            />
            <TextInput
              style={styles.input}
              placeholder="Company ID"
              keyboardType='numeric'
              value={formData.companyId}
              onChangeText={value => handleChange('companyId', value)}
            />
            <TextInput
              style={styles.input}
              placeholder="New Password"
              secureTextEntry={true}
              value={formData.password}
              onChangeText={value => handleChange('newpassword', value)}
            />

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
            <TextInput
              style={styles.input}
              placeholder="Location "
              value={formData.location}
              onChangeText={value => handleChange('location', value)}
            />
            <TextInput
              placeholder="About Company "
              value={formData.desc}
              numberOfLines={3}
              multiline
              style={[styles.input, { height: Math.max(40, formData?.desc?.length > 0 ? 60 : '') }]}
              onChangeText={value => handleChange('desc', value)}
            />
            <View>
              <Image style={{ height: 90, width: 90, borderRadius: 15 }} source={{ uri: imageUri || defaultCompany }} />
            </View>

            <TouchableOpacity style={styles.imageButton} onPress={handleImageUpload}>
              <Text style={{ fontFamily: 'PoppinsBold' }}>Upload Image</Text>
            </TouchableOpacity>

            {/* {formData.imageUri && <Image source={{ uri: formData.imageUri }} style={styles.image} />} */}
            <ArButton style={{ width: '100%', marginTop: 20 }} onPress={handleAddHod}>
              {spinner ? (
                <ActivityIndicator color='white' />
              ) : (
                <Text style={{ fontSize: 16, color: 'white', fontFamily: 'PoppinsBold' }}>Submit</Text>
              )}

            </ArButton>
          </View>
        </ScrollView>

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
