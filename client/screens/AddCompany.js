import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, Image, Button, StatusBar } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { ScrollView } from 'react-native-gesture-handler';
import { Block } from 'galio-framework';
import Ionicon from 'react-native-vector-icons/Ionicons';
import globalStyles from '../assets/GlobaStyles';
import { Appbar } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import ArButton from '../components/Button';
import axios from 'axios';
import { IpAddress } from '../GlobalAddress';
import RNPickerSelect from 'react-native-picker-select';
import { MyContext } from '../MyContext';

export default function AddCompany() {
const{setCount,count}=useContext(MyContext)
const[spinner,setSpinner]=useState(false)

  const [formData, setFormData] = useState({
    name: '',
    companyId: '',
    password: '',
    logo: null,
    location:'',desc:''
  });

  const GlobalStyle = globalStyles();
  let navigation = useNavigation();

  const handleChange = (name, value) => {
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleAddCompany = async () => {
    setSpinner(true)
    const { name, companyId, password, logo,desc,location } = formData;
    console.log(formData);
    if (!name || !companyId || !password|| !location||!desc) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    const apiURL = `http://${IpAddress}:5000/api/company/add`;
    await axios.post(apiURL, formData)
      .then(async (res) => {
        if (res.data.success) {
          await setCount(count+1)
          await navigation.goBack()
         await setSpinner(false)
          setFormData({
            name: '',
            companyId: '',
            password: '',
            logo: null,
            location:'',desc:''
          });
        } else {
          Alert.alert('Error', res.data.error)
        }
      })
      .catch((err) => {
        console.log(err);
      })

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
      handleChange('logo', pickerResult.uri);
    }
  };

  return (
    <>
      <Block style={{ backgroundColor: 'white',flex:1 }}>
        <Appbar.Header elevated style={{ backgroundColor: 'white' }}>
          <Appbar.BackAction onPress={() => navigation.goBack()} />
          <Appbar.Content title="Add Company" titleStyle={{ fontSize: 18,fontFamily:'PoppinsBold', }} />
        </Appbar.Header>
        <ScrollView style={[GlobalStyle.container, styles.scrollView]}>
          <View style={styles.container}>
            <Text style={styles.title}>Add Company</Text>
            <TextInput
              style={styles.input}
              placeholder="Name"
              value={formData.name}
              onChangeText={value => handleChange('name', value)}
            />
            <TextInput
              style={styles.input}
              placeholder="CompanyId"
              keyboardType='numeric'
              value={formData?.companyId}
              onChangeText={value => handleChange('companyId', value)}
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              secureTextEntry={true}
              value={formData.password}
              onChangeText={value => handleChange('password', value)}
            />
            <TextInput
              style={styles.input}
              placeholder="Location"
              value={formData?.location}
              onChangeText={value => handleChange('location', value)}
            />
              <TextInput
  numberOfLines={3}
  multiline
  style={[styles.input, { height: Math.max(40, formData.desc.length > 0 ? 60:'') }]}
  placeholder="Description"
  value={formData.desc}
  onChangeText={value => handleChange('desc', value)}
/>
            {/* <TouchableOpacity style={styles.imageButton} onPress={handleImageUpload}>
            <Text style={styles.buttonText}>Upload Logo</Text>
          </TouchableOpacity> */}
          
            <TextInput
              style={styles.input}
              placeholder="Logo"
              value={formData?.logo}
              onChangeText={value => handleChange('logo', value)}
            />

            {formData.imageUri && <Image source={{ uri: formData.imageUri }} style={styles.image} />}


            {spinner ? (
              <ArButton style={{ width: '100%', marginTop: 20 }} >
                <ActivityIndicator color='white' />
              </ArButton>
            )
              : (
                <ArButton style={{ width: '100%', marginTop: 20 }} onPress={handleAddCompany}>
                  <Text style={{ fontSize: 16, color: 'white', fontFamily: 'PoppinsBold' }}>Submit</Text>
                </ArButton>
              )}
      
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
    fontSize: 17,
    marginBottom: 20,
    fontFamily:'PoppinsBold',
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingLeft: 10,
    fontFamily:'PoppinsMedium'
  },
  pickerContainer: {
    width: '100%',
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
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
