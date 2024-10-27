import React, { useContext, useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, Image, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { IpAddress } from '../../GlobalAddress';
import ArButton from '../../components/Button';
import { useNavigation } from '@react-navigation/native';
import { Appbar } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons'
import globalStyles from '../../assets/GlobaStyles';
import { MyContext } from '../../MyContext';

export default function EditJob({ route }) {

  let { Job } = route.params;

  console.log(Job, '123456789');

  const { userDetail, count2, setCount2 } = useContext(MyContext);

  const [qualification, setQualification] = useState('');
  const [qualificationList, setQualificationList] = useState(Job?.qualification);
  let GlobalStyle = globalStyles();
  // Initialize formData state with existing job data
  const [formData, setFormData] = useState({
    jobTitle: Job.jobTitle,
    location: Job.location,
    jobType: Job.jobType,
    salary: Job.salary.toString(),
    desc: Job.desc,
    experience: Job.experience,
    // qualification: Job.qualification.join(', '), // Convert array to string
    logo: null
  });

  let navigation = useNavigation();

  const handleChange = (name, value) => {
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };


  const handleAddQualification = () => {
    if (qualification.trim() !== '') {
      setQualificationList(prevList => [...prevList, qualification]);
      setQualification(''); // Clear input field after adding qualification
    }
  };

  const handleEditJob = async () => {
    const { jobTitle, location, jobType, salary, desc, experience } = formData;
    if (!jobTitle || !location || !jobType || !salary || !experience || !desc || qualificationList.length == 0) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    let UpdateformData = { ...formData, qualification: qualificationList, companyName: userDetail[0]?.name || Job?.companyName, companyId: userDetail[0]?._id || Job?.companyId ,logo: userDetail[0].avtar}
    console.log(UpdateformData, 'formData');
    const apiURL = `http://${IpAddress}:5000/api/company/job/edit/${Job?._id}`;
    console.log(apiURL, 'apiURL');
    await axios.post(apiURL, UpdateformData)
      .then(async (res) => {
        if (res.data.success) {
          setCount2(count2 + 1)
          await navigation.goBack();
          setFormData({
            jobTitle: '',
            location: '',
            jobType: '',
            salary: '',
            desc: '',
            // qualification: '',
            experience: '',
            logo: null
          });
        } else {
          Alert.alert('Error', res.data.error)
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleDeleteQualification = (index) => {
    // Remove the qualification at the specified index
    const updatedQualifications = qualificationList.filter((qual, i) => i !== index);
    setQualificationList(updatedQualifications);
  };

  return (
    <>
      <SafeAreaView style={{ backgroundColor: 'white', flex: 1 }}>
        <Appbar.Header elevated style={{ backgroundColor: 'white' }}>
          <Appbar.BackAction onPress={() => navigation.goBack()} />
          <Appbar.Content title="Edit Job" titleStyle={{ fontSize: 18, fontFamily: 'PoppinsBold' }} />
        </Appbar.Header>
        <ScrollView
          // keyboardShouldPersistTaps="handled" // Allow taps to dismiss keyboard
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={GlobalStyle.container}
        >
          <Text style={styles.title}>Edit Changes in the Job</Text>
          <TextInput
            style={styles.input}
            placeholder="Company Name"
            editable={false} // Disable user input
            value={userDetail[0]?.name}
          // onChangeText={value => handleChange('companyName', value)}
          />
          <TextInput
            style={styles.input}
            placeholder="Job Title"
            value={formData.jobTitle}
            onChangeText={value => handleChange('jobTitle', value)}
          />

          <TextInput
            style={styles.input}
            placeholder="Location"
            value={formData.location}
            onChangeText={value => handleChange('location', value)}
          />
          <TextInput
            style={styles.input}
            placeholder="Job Type"
            value={formData.jobType}
            onChangeText={value => handleChange('jobType', value)}
          />
          <TextInput
            style={styles.input}
            placeholder="Salary Per annum"
            value={formData.salary}
            keyboardType='numeric'
            onChangeText={value => handleChange('salary', value)}
          />
          <TextInput
            numberOfLines={3}
            multiline
            style={[styles.input, { height: Math.max(40, formData.desc.length > 0 ? 60 : '') }]}
            placeholder="Description"
            value={formData.desc}
            onChangeText={value => handleChange('desc', value)}
          />
          <TextInput
            style={styles.input}
            placeholder="Required Qualification"
            value={qualification}
            onChangeText={setQualification}
          />
          <View style={{ alignSelf: 'flex-start', marginBottom: 20 }}>
            <TouchableOpacity onPress={handleAddQualification} style={styles.addButton}>
              <Ionicons name="add-circle-outline" size={24} color="blue" />
            </TouchableOpacity>
            {qualificationList?.length > 0 && (
              <Text style={{ fontFamily: 'PoppinsBold' }}>Required Qualification:</Text>
            )}
            {qualificationList.map((qual, index) => (
              <View style={{ flexDirection: 'row', alignItems: 'center' }} key={index}>
                <Text style={{ fontFamily: 'PoppinsMedium' }}>{index + 1}. {qual}</Text>
                <TouchableOpacity onPress={() => handleDeleteQualification(index)}>
                  <Ionicons name="trash-outline" size={20} color="red" style={{ marginLeft: 10 }} />
                </TouchableOpacity>
              </View>
            ))}


          </View>

          <TextInput
            style={styles.input}
            placeholder="Experience"
            value={formData.experience}
            onChangeText={value => handleChange('experience', value)}
          />

          <ArButton onPress={handleEditJob}>
            <Text style={{ fontSize: 16, color: 'white', fontFamily: 'PoppinsMedium' }}>Submit</Text>
          </ArButton>
        </ScrollView>
      </SafeAreaView>
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
    borderRadius: 20
  },
  title: {
    fontSize: 18,
    marginTop: 20,
    marginBottom: 10,
    fontFamily: 'PoppinsMedium'
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
});
