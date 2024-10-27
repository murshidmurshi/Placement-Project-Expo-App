import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { Block, } from 'galio-framework'
import { Appbar, Dialog, Portal, Button, ActivityIndicator, TouchableRipple } from 'react-native-paper'
import { ScrollView } from 'react-native-gesture-handler'
import globalStyles from '../../assets/GlobaStyles'
import Ionicon from 'react-native-vector-icons/Ionicons';
import { MyContext } from '../../MyContext'
import { IpAddress } from '../../GlobalAddress'
import axios from 'axios'
import * as ImagePicker from 'expo-image-picker';

export default function SingleJob({ navigation, route }) {
    let { id, companyId, studentId,CompanyParentId } = route?.params;
    console.log(CompanyParentId,'CompanyParentId');
    let { count2, userDetail, defaultCompany } = useContext(MyContext);
    // const [alreadyApplied, setAlreadyApplied] = useState(false)
    const [applied, setApplied] = useState(false)
    const [accepted, setAccepted] = useState(false)
    // const [pending, setPending] = useState(false)
    const [reject, setReject] = useState(false)
    const [Job, setJob] = useState({})
    const [company, setCompany] = useState({})
    console.log(company,'company');
    useEffect(() => {
        const GetSingleJob = async () => {
            const apiURL = `http://${IpAddress}:5000/api/company/job/${id}`;
            console.log(apiURL, 'apiURL');
            try {
                const res = await axios.post(apiURL, { studentId: studentId,CompanyParentId });
                if (res.data.success) {
                    setJob(res?.data?.job);
                    setCompany(res.data?.company);

                    if (res.data?.active) {
                        console.log(res.data?.active, 'res.data?.applied');
                        setAccepted(true)
                    }
                    else if (res.data?.applied) {
                        setApplied(true)
                    }
                    // else if (res.data?.pending) {
                    //     console.log(res.data?.active, 'res.data?.applied');
                    //     setPending(true)
                    // }
                    else if (res.data?.reject) {
                        setReject(true)
                    }
                } else {
                    Alert.alert('Error', res.data.error);
                }
            } catch (error) {
                console.error(error);
            }
        }
        GetSingleJob()
    }, [count2, id])

    let { role } = useContext(MyContext);
    console.log(role, 'Job');
    const handleEditJob = () => {
        console.log(Job, 555555555);
        navigation.navigate('SingleJobEdit', { Job: Job })
    }
    const handleUpdateJob = async (id, status) => {
        const apiURL = `http://${IpAddress}:5000/api/company/job/edit/${id}`;

        console.log(apiURL, 'apiURL');
        try {
            const res = await axios.post(apiURL, { status: status });
            if (res.data.success) {
                await navigation.goBack();
            } else {
                Alert.alert('Error', res.data.error);
            }
        } catch (error) {
            console.error(error);
        }
    }


    // const handleDeleteJob = async (id) => {
    //     const apiURL = `http://${IpAddress}:5000/api/company/delete/${id}`;
    //     console.log(apiURL, 'apiURL');
    //     try {
    //         const res = await axios.delete(apiURL);
    //         if (res.data.success) {
    //             await navigation.goBack();
    //         } else {
    //             Alert.alert('Error', res.data.error);
    //         }
    //     } catch (error) {
    //         console.error(error);
    //     }

    // }

    let GlobalStyle = globalStyles()
    const [visible, setVisible] = React.useState(false);
    const [spinner, setSpinner] = React.useState(false);
    const [count, setCount] = useState(0);

    const showDialog = () => setVisible(true);

    let DefaultResume = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT2rvidvKsfcDTCZDuVfuv_yElCiVfEq9w9Kf0jTQqgiw&s"
    const hideDialog = () => {
        setVisible(false)
        setSpinner(false)
    };

    const [imageUri, setImageUri] = useState(userDetail && userDetail[0]?.resume || DefaultResume);
    const ApplyBtn = () => {
        console.log("ApplyBtn");
        showDialog()
    }

    const handleSubmit = async () => {
        try {
            setSpinner(true)
            if (imageUri) {

                let newFile = {
                    uri: imageUri,
                    type: `test/${imageUri.split('.')[1]}`,
                    name: `test.${imageUri.split('.')[1]}`,
                };
                const data = new FormData();
                data.append('file', newFile);
                data.append('upload_preset', 'PlacementProject');
                data.append('cloud_name', 'dxwxy8bvs');
                const response = await fetch('https://api.cloudinary.com/v1_1/dxwxy8bvs/image/upload', {
                  method: 'POST',
                  body: data,  
                });
                const result = await response.json();
                const publicId = result.public_id;
                const newAvtar = result.secure_url;

                // Add HOD with image to the backend
                const apiURL = `http://${IpAddress}:5000/api/student/edit/${userDetail[0]?._id}`;
                console.log(apiURL, 'apiURL');
                const res = await axios.post(apiURL, { resume: newAvtar, resumeId: publicId, jobId: id, companyId: companyId, });
                if (res.data.success) {
                    //   setCount(count + 1);
                    await navigation.goBack();
                    setSpinner(false)
                    hideDialog()
                } else {
                    setSpinner(false)
                    await Alert.alert('Uploaded successfully');
                    hideDialog()
                    // Alert.alert('Error', res.data.error);
                }
            }
        } catch (error) {
            Alert.alert('Something went wrong uploading');
            hideDialog()
        }
    }

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
            setImageUri(pickerResult.assets[0].uri);
            //   setShowImage(false)
        }
    };

    const Pending = () => {
        const handleAprrove = async (id, studentId) => {
            console.log(id);
            const apiURL = `http://${IpAddress}:5000/api/student/request/${id}`
            try {
                const res = await axios.post(apiURL, { status: 'active', studentId: studentId });
                if (res.data.success) {
                    await setCount(count + 1)
                    // setAllCompany(res.data.company);
                } else {
                    Alert.alert('Error', res.data.error);
                }
            } catch (error) {
                console.error(error);
            }
        }
        const handleCancel = async (id) => {
            console.log(id);
            const apiURL = `http://${IpAddress}:5000/api/student/request/${id}`;
            try {
                const res = await axios.post(apiURL, { status: 'reject' });
                if (res.data.success) {
                    // console.log(res.data.success,'res.data.success');
                    // await setCount(count+1)
                    // setAllCompany(res.data.company);
                } else {
                    Alert.alert('Error', res.data.error);
                }
            } catch (error) {
                console.error(error);
            }
        }
        const [applied, setApplied] = useState([])
        // console.log(applied, 'applied');
        useEffect(() => {
            const GetAllApplied = async () => {
                const apiURL = `http://${IpAddress}:5000/api/student/request/filter`;
                try {
                    const res = await axios.get(apiURL, { jobId: id });
                    if (res.data.success) {
                        setApplied(res.data.PendingRequest)
                    } else {
                        Alert.alert('Error', res.data.error);
                    }
                } catch (error) {
                    console.error(error);
                }
            }
            GetAllApplied()
        }, [])
        return (
            <>
                <View style={{ padding: 2 }}>
                    <Text style={[styles.CompanyName, { fontFamily: 'PoppinsBold', color: 'grey' }]}>Total  Student</Text>
                    <Text style={[styles.CompanyName, { fontFamily: 'PoppinsBold', color: 'grey', fontSize: 22, paddingHorizontal: 10 }]}>{applied?.length}</Text>
                </View>
                {applied?.length == 0 && (
                    <Block>
                        <Image style={styles.image2} source={{ uri: "https://img.freepik.com/free-vector/hand-drawn-no-data-concept_52683-127818.jpg?t=st=1713515779~exp=1713519379~hmac=7bcd9e0e4a76aa2cad898254898af3d4447a2228585e14bd49938b0e68fa26cc&w=900" }} />
                        <Text style={{ textAlign: 'center', fontSize: 17, fontFamily: 'PoppinsMedium', }}>No Pending Student </Text>
                    </Block>
                )}

                {applied?.map((student, index) => (
                    <React.Fragment key={index}>
                        <TouchableRipple onPress={() => navigation.navigate('SingleStudent', { student: student?.studentId })} style={styles.singleCompany2}>
                            <>
                                <View style={{ flexDirection: 'row', gap: 13, alignItems: 'center' }}>
                                    <Image style={styles.image} source={{ uri: student?.companyId?.avtar || defaultCompany }} />
                                    <View>
                                        <Text style={styles.CompanyName}>{student?.companyId?.name}</Text>
                                        <Text style={[styles.CompanyName, { color: 'grey' }]}>{student?.jobId?.jobTitle}</Text>
                                    </View>
                                </View>
                                <View>
                                    <Text style={[styles.CompanyName]}>Applied :</Text>
                                    <View style={{ paddingHorizontal: 10 }}>
                                        <Text style={[styles.CompanyName, { fontFamily: 'PoppinsMedium' }]}>{student?.studentId?.name}</Text>
                                        <Text style={[styles.CompanyName, { fontFamily: 'PoppinsMedium' }]}>{student?.studentId?.email?student?.studentId?.email:"email not added"}</Text>
                                    </View>

                                    {role == "Company" && (
                                        <View style={styles.Action2}>
                                            <Text onPress={() => handleAprrove(student?.jobId?._id, student?.studentId?._id)} style={[styles.ActionText, { color: 'green', borderColor: 'green' }]}>Approve</Text>
                                            <Text onPress={() => handleCancel(student?.jobId?._id)} style={styles.ActionText}>Cancel</Text>
                                        </View>
                                    )}
                                </View>
                            </>

                        </TouchableRipple>

                    </React.Fragment>
                ))}

            </>
        )
    }

    const JobApprove = () => {
        const handleCancel = async (id, studentId) => {
            console.log(id);
            const apiURL = `http://${IpAddress}:5000/api/student/request/${id}`;
            try {
                const res = await axios.post(apiURL, { status: 'reject', studentId });
                if (res.data.success) {
                    // console.log(res.data.success,'res.data.success');
                    // await setCount(count+1)
                    // setAllCompany(res.data.company);
                } else {
                    Alert.alert('Error', res.data.error);
                }
            } catch (error) {
                console.error(error);
            }
        }
        const [applied, setApplied] = useState([])
        // console.log(applied, 'applied');
        useEffect(() => {
            const GetAllApplied = async () => {
                const apiURL = `http://${IpAddress}:5000/api/student/request/filter`;
                try {
                    const res = await axios.get(apiURL, { jobId: id });
                    if (res.data.success) {
                        setApplied(res.data.activeRequests)
                    } else {
                        Alert.alert('Error', res.data.error);
                    }
                } catch (error) {
                    console.error(error);
                }
            }
            GetAllApplied()
        }, [])
        return (
            <>
                <View style={{ padding: 2 }}>
                    <Text style={[styles.CompanyName, { fontFamily: 'PoppinsBold', color: 'grey' }]}>Total  Student</Text>
                    <Text style={[styles.CompanyName, { fontFamily: 'PoppinsBold', color: 'grey', fontSize: 22, paddingHorizontal: 10 }]}>{applied?.length}</Text>
                </View>

                {applied?.length == 0 && (
                    <Block>
                        <Image style={styles.image2} source={{ uri: "https://img.freepik.com/free-vector/hand-drawn-no-data-concept_52683-127818.jpg?t=st=1713515779~exp=1713519379~hmac=7bcd9e0e4a76aa2cad898254898af3d4447a2228585e14bd49938b0e68fa26cc&w=900" }} />
                        <Text style={{ textAlign: 'center', fontSize: 17, fontFamily: 'PoppinsMedium', }}>No Student Approved  Recently</Text>
                    </Block>
                )}

                {applied?.map((student, index) => (
                    <React.Fragment key={index}>
                        <TouchableRipple onPress={() => navigation.navigate('SingleStudent', { student: student?.studentId })} style={styles.singleCompany2}>
                            <>
                                <View style={{ flexDirection: 'row', gap: 13, alignItems: 'center' }}>
                                    <Image style={styles.image} source={{ uri: student?.companyId?.avtar || defaultCompany }} />
                                    <View>
                                        <Text style={styles.CompanyName}>{student?.companyId?.name}</Text>
                                        <Text style={[styles.CompanyName, { color: 'grey' }]}>{student?.jobId?.jobTitle}</Text>
                                    </View>
                                </View>
                                <View>
                                    <Text style={[styles.CompanyName]}>Applied :</Text>
                                    <View style={{ paddingHorizontal: 10 }}>
                                        <Text style={[styles.CompanyName, { fontFamily: 'PoppinsMedium' }]}>{student?.studentId?.name?student?.studentId?.name:"not added"}</Text>
                                        <Text style={[styles.CompanyName, { fontFamily: 'PoppinsMedium' }]}>{student?.studentId?.email?student?.studentId?.email:"email not added"}</Text>
                                    </View>
                                    {role == "Company" && (
                                        <View style={styles.Action2}>
                                            {/* <Text onPress={() => handleAprrove(student?.jobId?._id,student?.studentId?._id)} style={[styles.ActionText, { color: 'green', borderColor: 'green' }]}>Approve</Text> */}
                                            <Text onPress={() => handleCancel(student?.jobId?._id, student?.studentId?._id)} style={styles.ActionText}>Reject</Text>
                                        </View>
                                    )}
                                </View>
                            </>
                        </TouchableRipple>
                    </React.Fragment>
                ))}

            </>
        )
    }

    const RejectedJob = () => {
        const handleAprrove = async (id, studentId) => {
            console.log(id);
            const apiURL = `http://${IpAddress}:5000/api/student/request/${id}`
            try {
                const res = await axios.post(apiURL, { status: 'active', studentId: studentId });
                if (res.data.success) {
                    await setCount(count + 1)
                    // setAllCompany(res.data.company);
                } else {
                    Alert.alert('Error', res.data.error);
                }
            } catch (error) {
                console.error(error);
            }
        }

        const [applied, setApplied] = useState([])
        // console.log(applied, 'applied');
        useEffect(() => {
            const GetAllApplied = async () => {
                const apiURL = `http://${IpAddress}:5000/api/student/request/filter`;
                try {
                    const res = await axios.get(apiURL, { jobId: id });
                    if (res.data.success) {
                        setApplied(res.data.rejectRequests)
                    } else {
                        Alert.alert('Error', res.data.error);
                    }
                } catch (error) {
                    console.error(error);
                }
            }
            GetAllApplied()
        }, [])
        return (
            <>
                <View style={{ padding: 2 }}>
                    <Text style={[styles.CompanyName, { fontFamily: 'PoppinsBold', color: 'grey' }]}>Total  Student</Text>
                    <Text style={[styles.CompanyName, { fontFamily: 'PoppinsBold', color: 'grey', fontSize: 22, paddingHorizontal: 10 }]}>{applied?.length}</Text>
                </View>
                {applied?.length == 0 && (
                    <Block>
                        <Image style={styles.image2} source={{ uri: "https://img.freepik.com/free-vector/hand-drawn-no-data-concept_52683-127818.jpg?t=st=1713515779~exp=1713519379~hmac=7bcd9e0e4a76aa2cad898254898af3d4447a2228585e14bd49938b0e68fa26cc&w=900" }} />
                        <Text style={{ textAlign: 'center', fontSize: 17, fontFamily: 'PoppinsMedium', }}>No Job Rejected</Text>
                    </Block>
                )}

                {applied?.map((student, index) => (
                    <React.Fragment key={index}>
                        <TouchableRipple onPress={() => navigation.navigate('SingleStudent', { student: student?.studentId })} style={styles.singleCompany2}>
                            <>
                                <View style={{ flexDirection: 'row', gap: 13, alignItems: 'center' }}>
                                    <Image style={styles.image} source={{ uri: student?.companyId?.avtar || defaultCompany }} />
                                    <View>
                                        <Text style={styles.CompanyName}>{student?.companyId?.name}</Text>
                                        <Text style={[styles.CompanyName, { color: 'grey' }]}>{student?.jobId?.jobTitle}</Text>
                                    </View>
                                </View>
                                <View>
                                    <Text style={[styles.CompanyName]}>Applied :</Text>
                                    <View style={{ paddingHorizontal: 10 }}>
                                        <Text style={[styles.CompanyName, { fontFamily: 'PoppinsMedium' }]}>{student?.studentId?.name}</Text>
                                        <Text style={[styles.CompanyName, { fontFamily: 'PoppinsMedium' }]}>{student?.studentId?.email?student?.studentId?.email:"email not added"}</Text>
                                    </View>
                                    {role == "Company" && (
                                        <View style={styles.Action2}>
                                            <Text onPress={() => handleAprrove(student?.jobId?._id, student?.studentId?._id)} style={[styles.ActionText, { color: 'green', borderColor: 'green' }]}>Approve</Text>
                                        </View>
                                    )}

                                </View>
                            </>

                        </TouchableRipple>

                    </React.Fragment>
                ))}
            </>
        )
    }


    const [activeCategory, setActiveCategory] = useState('Pending');
    const handleCategoryPress = (category) => {
        setActiveCategory(category);
    };

    return (
        <Block style={{ backgroundColor: 'white', flex: 1 }}>
            <Appbar.Header elevated style={{ backgroundColor: 'white' }}>
                <Appbar.BackAction onPress={() => navigation.goBack()} />
                <Appbar.Content title={Job?.jobTitle} titleStyle={{ fontSize: 18, fontFamily: 'PoppinsBold', }} />
            </Appbar.Header>
            <ScrollView
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                style={[GlobalStyle.container, styles.scrollView]}>
                <View style={{ backgroundColor: 'white', padding: 5, paddingLeft: 0, borderRadius: 5, elevation: 1, margin: 1, marginTop: 10, minHeight: 130, flexDirection: 'row', gap: 8 }}>
                    <View style={{ width: 100, height: 70, alignSelf: 'center', justifyContent: 'center', borderBottomRightRadius: 30, left: 10 }}>
                        <Image style={{ width: 100, height: 100, borderRadius: 15, }} source={{ uri: company?.avtar }} />
                    </View>
                    <View style={{ paddingLeft: 15, marginTop: 5 }}>
                        <View>
                            <Text style={{ fontSize: 19, fontFamily: 'PoppinsBold' }}>{Job?.jobTitle}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', gap: 5, alignItems: 'center', marginTop: 5 }}>
                            <Ionicon name='location' size={22} />
                            <Text style={{ fontSize: 14, fontFamily: 'PoppinsMedium' }}>{Job?.location}</Text>
                        </View>
                        <View style={{ alignItems: "center", flexDirection: 'column', marginVertical: 10 }}>
                            <Text style={{ fontSize: 15, fontFamily: 'PoppinsBold' }}>Company</Text>
                            <Text style={{ fontSize: 14, fontFamily: 'PoppinsMedium', marginTop: -3, }}>{Job?.companyName}</Text>
                        </View>
                    </View>
                </View>
                <View style={{ marginVertical: 5 }}>
                    <Text style={{ fontSize: 17, fontFamily: 'PoppinsBold' }}>Know About Job</Text>
                    {!Job?.desc ? (
                        <Text style={{ fontSize: 14, fontFamily: 'PoppinsMedium', padding: 4, color: 'grey' }}>
                            No description provided
                        </Text>
                    ) : (
                        <Text style={{ fontSize: 14, fontFamily: 'PoppinsMedium', padding: 4 }}>{Job?.desc}</Text>
                    )}
                </View>
                <View style={{ marginVertical: 4 }}>
                    <Text style={{ fontSize: 17, fontFamily: 'PoppinsBold' }}>Qualification</Text>
                </View>

                <View style={{ marginVertical: 2, padding: 8, paddingTop: 0 }}>

                    {Job?.qualification?.map((qualification, index) => (
                        <React.Fragment key={index}>
                            <Text style={{ fontFamily: 'PoppinsMedium', fontSize: 15, padding: 2 }}>
                                {index + 1}. {qualification}
                            </Text>
                        </React.Fragment>
                    ))}

                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 10 }}>
                    <View style={{ alignItems: 'center' }}>
                        <Text style={{ fontSize: 14, fontFamily: 'PoppinsMedium' }}>Experience</Text>
                        <Text style={{ fontFamily: 'PoppinsBold', fontSize: 16 }}>{Job?.experience}</Text>
                    </View>
                    <View style={{ alignItems: 'center' }}>

                        <Text style={{ fontSize: 14, fontFamily: 'PoppinsMedium' }}>Job Type</Text>
                        <Text style={{ fontFamily: 'PoppinsBold', fontSize: 16 }}>{Job?.jobType}</Text>
                    </View>
                    <View style={{ alignItems: 'center' }}>

                        <Text style={{ fontSize: 14, fontFamily: 'PoppinsMedium' }}>Salary</Text>
                        <Text style={{ fontFamily: 'PoppinsBold', fontSize: 16 }}>₹ {Job?.salary} /pa</Text>
                    </View>
                </View>

                {role !== "Student" && (
                    <>
                        <View>
                            <Text style={{ fontSize: 17, fontFamily: 'PoppinsBold', marginTop: 20 }}>About Applied Student</Text>

                            <View style={{ flexDirection: 'row', gap: 10 }}>
                                <TouchableOpacity onPress={() => handleCategoryPress('Pending')} style={[styles.category, activeCategory === 'Direct' && styles.activeCategory]}>
                                    <Text style={[styles.title, activeCategory === 'Pending' && styles.activeTitle, { width: 70, textAlign: 'center' }]}>Pending</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => handleCategoryPress('Approved')} style={[styles.category, activeCategory === 'Watched' && styles.activeCategory]}>
                                    <Text style={[styles.title, activeCategory === 'Approved' && styles.activeTitle]}>Approved</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => handleCategoryPress('Reject')} style={[styles.category, activeCategory === 'Reject' && styles.activeCategory]}>
                                    <Text style={[styles.title, activeCategory === 'Reject' && styles.activeTitle]}>Reject</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View>
                            {activeCategory == "Pending" ? (
                                <Pending />
                            ) : (
                                activeCategory == "Reject" ? (
                                    <RejectedJob />
                                ) :
                                    <JobApprove />
                            )}
                        </View>
                    </>
                )}
                {role == "Student" ? (
                    <>
                        {applied ? (
                            <>
                                <Button style={{ width: '90%', borderRadius: 50, backgroundColor: 'green', alignSelf: 'center', marginTop: 20 }}>
                                    <Text style={{ fontFamily: 'PoppinsBold', color: 'white', fontSize: 16 }}>
                                        Already Applied
                                    </Text>
                                </Button>
                            </>
                        ) : reject ? (
                            <Button style={{ width: '90%', borderRadius: 50, backgroundColor: 'red', alignSelf: 'center', marginTop: 20 }}>
                                <Text style={{ fontFamily: 'PoppinsBold', color: 'white', fontSize: 16 }}>
                                    Job Rejected
                                </Text>
                            </Button>
                        ) : (
                            accepted ? (
                                <Button style={{ width: '90%', borderRadius: 50, backgroundColor: 'green', alignSelf: 'center', marginTop: 20 }}>
                                    <Text style={{ fontFamily: 'PoppinsBold', color: 'white', fontSize: 16 }}>
                                        Job accepted
                                    </Text>
                                </Button>
                            ) :
                                <>
                                    <Button onPress={ApplyBtn} style={{ width: '90%', borderRadius: 50, backgroundColor: 'black', alignSelf: 'center', marginTop: 20 }}>
                                        <Text style={{ fontFamily: 'PoppinsBold', color: 'white', fontSize: 16 }}>
                                            Apply Now
                                        </Text>
                                    </Button>
                                </>
                        )}
                    </>

                ) : role == "Admin" ? (
                    <Text></Text>
                ) : role=="Company"?(
                    <>
                        <View style={{ flexDirection: 'row', marginVertical: 10, gap: 10 }}>
                            <Button onPress={handleEditJob} style={{ borderRadius: 50, borderColor: 'green', alignSelf: 'center', marginTop: 20, borderWidth: 1, backgroundColor: 'white' }}>
                                <Text style={{ fontFamily: 'PoppinsBold', fontSize: 16 }}>
                                    Edit Job
                                </Text>
                            </Button>
                            {Job?.status == "expire" ? (
                                <Button onPress={() => handleUpdateJob(Job?._id, "active")} style={{ borderRadius: 50, borderColor: 'green', alignSelf: 'center', marginTop: 20, borderWidth: 1, backgroundColor: 'white' }}>
                                    <Text style={{ fontFamily: 'PoppinsBold', fontSize: 16 }}>
                                        Reactive Job
                                    </Text>
                                </Button>
                            ) : (
                                <Button onPress={() => handleUpdateJob(Job?._id, "expire")} style={{ borderRadius: 50, borderColor: 'red', alignSelf: 'center', marginTop: 20, borderWidth: 1, backgroundColor: 'white' }}>
                                    <Text style={{ fontFamily: 'PoppinsBold', fontSize: 16 }}>
                                        Expire Job
                                    </Text>
                                </Button>
                            )}
                        </View>
                    </>
                ):""}
            </ScrollView>
            <Portal>
                <Dialog visible={visible} onDismiss={hideDialog}>
                    <Dialog.Title style={{ fontFamily: 'PoppinsBold' }}>Upload Resume</Dialog.Title>
                    <Dialog.Content>
                        {imageUri && (
                            <View style={{ marginVertical: 10, marginBottom: 20 }}>
                                <Image style={{ height: 90, width: 90, borderRadius: 15 }} source={{ uri: imageUri }} />
                            </View>
                        )}
                        <Button onPress={handleResumeUpload} mode="contained-tonal">
                            <Text style={{ fontFamily: 'PoppinsMedium', fontSize: 18 }}>Upload</Text>
                        </Button>


                    </Dialog.Content>
                    <Dialog.Actions>
                        {spinner ? (
                            <>
                                {/* <Text>Submitting ...</Text> */}
                                <ActivityIndicator size="small" color="green" />
                            </>
                        ) : (
                            <>
                                <Button onPress={hideDialog}>Cancel</Button>
                                <Button onPress={handleSubmit}>
                                    Submit
                                </Button>
                            </>
                        )}
                    </Dialog.Actions>
                </Dialog>

            </Portal>
        </Block>

    )
}

const styles = StyleSheet.create({
    category: {
        paddingHorizontal: 10,
        paddingVertical: 10,
        backgroundColor: 'white',
        borderRadius: 10,
        marginVertical: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        elevation: 1,
        margin: 2

    },
    activeCategory: {
        borderColor: 'lightblue', // Customize the color for the active category
        borderWidth: 1
    },
    title: {
        fontFamily: 'PoppinsBold',
        fontSize: 15,
    },
    activeTitle: {
        color: 'blue', // Customize the color for the active category title
    },
    singleCompany2: {
        // flexDirection: 'row',
        gap: 10,
        // justifyContent: 'space-between',
        // alignItems: 'center',
        marginVertical: 5,
        marginHorizontal: 2,
        backgroundColor: 'white',
        elevation: 2,
        padding: 10,
        borderRadius: 13,
    },
    Action: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',

        backgroundColor: 'white',
        gap: 6,
    },
    Action2: {
        flexDirection: 'row',
        // justifyContent: 'space-between',
        // alignItems: 'flex-end',
        justifyContent: 'flex-end',
        backgroundColor: 'transparent',
        gap: 6,
    },
    ActionText: {
        borderWidth: 1,
        borderColor: 'red',
        padding: 6,
        borderRadius: 10,
        fontFamily: 'PoppinsBold',
        fontSize: 11,
        color: 'red'
    },
    image2: {
        width: 180,
        height: 180,
        alignSelf: 'center'
    },
    image: { height: 50, width: 50, borderRadius: 15 },
    CompanyName: {
        fontFamily: 'PoppinsBold',
        fontSize: 15
    },
    singleCompany: {
        flexDirection: 'row',
        gap: 10,
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 5,
        marginHorizontal: 2,
        backgroundColor: 'white',
        elevation: 2,
        padding: 10,
        borderRadius: 13,
    },
})