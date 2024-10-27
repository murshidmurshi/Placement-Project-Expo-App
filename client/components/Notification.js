import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { Appbar, Divider, Button, TouchableRipple } from 'react-native-paper';
import { ScrollView } from 'react-native-gesture-handler';
import { Block, } from 'galio-framework';
import globalStyles from '../assets/GlobaStyles';
import { MyContext } from '../MyContext';
import { IpAddress } from '../GlobalAddress';
import axios from 'axios';

export default function Notification({ navigation }) {
  let { defaultCompany, role, userDetail } = useContext(MyContext)
  const GlobalStyle = globalStyles();
  const [activeCategory, setActiveCategory] = useState(role == "Company" || role == "Student" ? 'Pending' : 'Direct');
  const [allCompany, setAllCompany] = useState([])

  const [count, setCount] = useState(0);
  // console.log(allCompany, 'allCompany');

  const handleCategoryPress = (category) => {
    setActiveCategory(category);
  };
  const [approve, setApprove] = useState([]);
  useEffect(() => {
    const filteredCompanies = allCompany?.filter(company => company.status === "active");
    setApprove(filteredCompanies)
  }, [count, activeCategory])

  useEffect(() => {
    const getAllCompany = async () => {
      const apiURL = `http://${IpAddress}:5000/api/company/allCompany`;
      try {
        const res = await axios.get(apiURL);
        if (res.data.success) {
          setAllCompany(res.data.company);
        } else {
          Alert.alert('Error', res.data.error);
        }
      } catch (error) {
        console.error(error);
      }
    }
    getAllCompany()
  }, [activeCategory, count])


  const AdminPending = () => {
    const handleAprrove = async (id) => {
      console.log(id);
      const apiURL = `http://${IpAddress}:5000/api/admin/company/${id}`;
      try {
        const res = await axios.post(apiURL, { status: 'active' });
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
      const apiURL = `http://${IpAddress}:5000/api/admin/company/${id}`;
      try {
        const res = await axios.post(apiURL, { status: 'reject' });
        if (res.data.success) {
          console.log(res.data.success, 'res.data.success');
          await setCount(count + 1)
          // setAllCompany(res.data.company);
        } else {
          Alert.alert('Error', res.data.error);
        }
      } catch (error) {
        console.error(error);
      }
    }


    const [pendingCompany, setPendingCompany] = useState([])
    useEffect(() => {
      const GetPendingCompany = async () => {
        const apiURL = `http://${IpAddress}:5000/api/company/allCompany`;
        try {
          const res = await axios.get(apiURL);
          if (res.data.success) {
            setPendingCompany(res.data.PendingCompany);
          } else {
            Alert.alert('Error', res.data.error);
          }
        } catch (error) {
          console.error(error);
        }
      }
      GetPendingCompany()
    }, [])



    return (
      <>
        {pendingCompany?.length == 0 && (
          <Block>
            <Image style={styles.image2} source={{ uri: "https://img.freepik.com/free-vector/hand-drawn-no-data-concept_52683-127818.jpg?t=st=1713515779~exp=1713519379~hmac=7bcd9e0e4a76aa2cad898254898af3d4447a2228585e14bd49938b0e68fa26cc&w=900" }} />
            <Text style={{ textAlign: 'center', fontSize: 17, fontFamily: 'PoppinsMedium', }}>No  Company Found</Text>
          </Block>
        )}
        {pendingCompany?.map((company, index) => (
          <React.Fragment key={index}>
            <TouchableRipple style={styles.singleCompany} onPress={() => navigation.navigate('SingleCompany', { Company: company })}>
              <>
                <View style={{ flexDirection: 'row', gap: 13, alignItems: 'center' }}>
                  <Image style={styles.image} source={{ uri: defaultCompany }} />
                  <Text style={styles.CompanyName}>{company?.name}</Text>
                </View>
                <View style={styles.Action}>
                  <Text onPress={() => handleAprrove(company?._id)} style={[styles.ActionText, { color: 'green', borderColor: 'green' }]}>Approve</Text>
                  <Text onPress={() => handleCancel(company?._id)} style={styles.ActionText}>Cancel</Text>
                </View>
              </>
            </TouchableRipple>
          </React.Fragment>
        ))}

      </>
    )
  }

  const AdminApproved = () => {

    const handleCancel = async (id) => {
      console.log(id);
      const apiURL = `http://${IpAddress}:5000/api/admin/company/${id}`;
      try {
        const res = await axios.post(apiURL, { status: 'reject' });
        if (res.data.success) {
          console.log(res.data.success, 'res.data.success');
          await setCount(count + 1)
          // setAllCompany(res.data.company);
        } else {
          Alert.alert('Error', res.data.error);
        }
      } catch (error) {
        console.error(error);
      }
    }


    const [activeCompany, setApprovedCompany] = useState([])
    useEffect(() => {
      const GetApprovedCompany = async () => {
        const apiURL = `http://${IpAddress}:5000/api/company/allCompany`;
        try {
          const res = await axios.get(apiURL);
          if (res.data.success) {
            setApprovedCompany(res.data.activeCompany);
          } else {
            Alert.alert('Error', res.data.error);
          }
        } catch (error) {
          console.error(error);
        }
      }
      GetApprovedCompany()
    }, [])



    return (
      <>
        {activeCompany?.length == 0 && (
          <Block>
            <Image style={styles.image2} source={{ uri: "https://img.freepik.com/free-vector/hand-drawn-no-data-concept_52683-127818.jpg?t=st=1713515779~exp=1713519379~hmac=7bcd9e0e4a76aa2cad898254898af3d4447a2228585e14bd49938b0e68fa26cc&w=900" }} />
            <Text style={{ textAlign: 'center', fontSize: 17, fontFamily: 'PoppinsMedium', }}>No  Company Found</Text>
          </Block>
        )}
        {activeCompany?.map((company, index) => (
          <React.Fragment key={index}>
            <TouchableRipple style={styles.singleCompany} onPress={() => navigation.navigate('SingleCompany', { Company: company })}>
             <>
             <View style={{ flexDirection: 'row', gap: 13, alignItems: 'center' }}>
                <Image style={styles.image} source={{ uri: defaultCompany }} />
                <Text style={styles.CompanyName}>{company?.name}</Text>
              </View>
              <View style={styles.Action}>
                <Text onPress={() => handleCancel(company?._id)} style={styles.ActionText}>Cancel</Text>
              </View>
             </>
            </TouchableRipple>
          </React.Fragment>
        ))}

      </>
    )
  }

  const RejectCompany = () => {
    const handleAprrove = async (id) => {
      console.log(id);
      const apiURL = `http://${IpAddress}:5000/api/admin/company/${id}`;
      try {
        const res = await axios.post(apiURL, { status: 'active' });
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



    const [rejectCompany, setRejectedCompany] = useState([])
    useEffect(() => {
      const GetApprovedCompany = async () => {
        const apiURL = `http://${IpAddress}:5000/api/company/allCompany`;
        try {
          const res = await axios.get(apiURL);
          if (res.data.success) {
            setRejectedCompany(res.data.rejectCompany);
          } else {
            Alert.alert('Error', res.data.error);
          }
        } catch (error) {
          console.error(error);
        }
      }
      GetApprovedCompany()
    }, [])

    return (
      <>
        {rejectCompany?.length == 0 && (
          <Block>
            <Image style={styles.image2} source={{ uri: "https://img.freepik.com/free-vector/hand-drawn-no-data-concept_52683-127818.jpg?t=st=1713515779~exp=1713519379~hmac=7bcd9e0e4a76aa2cad898254898af3d4447a2228585e14bd49938b0e68fa26cc&w=900" }} />
            <Text style={{ textAlign: 'center', fontSize: 17, fontFamily: 'PoppinsMedium', }}>No  Company Found</Text>
          </Block>
        )}
        {rejectCompany?.map((company, index) => (
          <React.Fragment key={index}>
            <TouchableRipple style={styles.singleCompany} onPress={() => navigation.navigate('SingleCompany', { Company: company })}>
             <>
             <View style={{ flexDirection: 'row', gap: 13, alignItems: 'center' }}>
                <Image style={styles.image} source={{ uri: defaultCompany }} />
                <Text style={styles.CompanyName}>{company?.name}</Text>
              </View>
              
              <View style={styles.Action}>
                <Text onPress={() => handleAprrove(company?._id)} style={[styles.ActionText, { color: 'green', borderColor: 'green' }]}>Approve</Text>
              </View>
             </>
            </TouchableRipple>
          </React.Fragment>
        ))}

      </>
    )
  }

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
        let apiURL;
        if (role == "Student") {
          apiURL = `http://${IpAddress}:5000/api/student/request/student/${userDetail && userDetail[0]?._id}`;
        } else {
          apiURL = `http://${IpAddress}:5000/api/student/request/filter`;
        }
        try {
          let res;
          if (role == "Student") {
            res = await axios.post(apiURL,);
          } else {
            res = await axios.get(apiURL,);

          }
          if (res.data.success) {
            console.log(res.data.PendingRequest,'res.data.PendingRequest');
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

    const handleNavigation = (detail) => {
      if (role == "Company") {
        navigation.navigate('SingleStudent', { student: detail?.studentId })
      } else {
        navigation.navigate('SingleJob', { id: detail?.jobId?._id, companyId: detail?.companyId?._id, studentId: detail?.studentId?._id,CompanyParentId:detail?.companyId?._id })

      }
    }


    return (
      <>
        <View style={{ padding: 2 }}>
          <Text style={[styles.CompanyName, { fontFamily: 'PoppinsBold', color: 'grey' }]}>Total  Applied</Text>
          <Text style={[styles.CompanyName, { fontFamily: 'PoppinsBold', color: 'grey', fontSize: 22, paddingHorizontal: 10 }]}>{applied?.length}</Text>
        </View>
        {applied?.length == 0 && (
          <Block>
            <Image style={styles.image2} source={{ uri: "https://img.freepik.com/free-vector/hand-drawn-no-data-concept_52683-127818.jpg?t=st=1713515779~exp=1713519379~hmac=7bcd9e0e4a76aa2cad898254898af3d4447a2228585e14bd49938b0e68fa26cc&w=900" }} />
            <Text style={{ textAlign: 'center', fontSize: 17, fontFamily: 'PoppinsMedium', }}>No Pending Jobs </Text>
          </Block>
        )}

        {applied?.map((student, index) => (
          <React.Fragment key={index}>
            <TouchableRipple onPress={() => handleNavigation(student)} style={styles.singleCompany2}>
              <>
                <View style={{ flexDirection: 'row', gap: 13, alignItems: 'center' }}>
                  <Image style={styles.image} source={{ uri: student?.companyId?.avtar || defaultCompany }} />
                  <View>
                    <Text style={styles.CompanyName}>{student?.companyId?.name}</Text>
                    <Text style={[styles.CompanyName, { color: 'grey' }]}>{student?.jobId?.jobTitle}</Text>
                  </View>
                </View>
                <View>

                  {role == "Student" ? (
                    <>
                      <Text style={[styles.CompanyName]}>About Company :</Text>
                      <View style={{ paddingHorizontal: 10 }}>
                        <Text style={[styles.CompanyName, { fontFamily: 'PoppinsMedium' }]}>{(student?.companyId?.phone) ? student?.companyId?.phone : 'contact number not added'}</Text>
                        <Text style={[styles.CompanyName, { fontFamily: 'PoppinsMedium' }]}>{student?.companyId?.email ? student?.companyId?.email : "email not added"}</Text>
                      </View>
                    </>
                  ) : (
                    <>
                      <Text style={[styles.CompanyName]}>Applied :</Text>

                      <View style={{ paddingHorizontal: 10 }}>
                        <Text style={[styles.CompanyName, { fontFamily: 'PoppinsMedium' }]}>{(student?.studentId?.name) ? student?.studentId?.name : 'not added'}</Text>
                        <Text style={[styles.CompanyName, { fontFamily: 'PoppinsMedium' }]}>{student?.studentId?.email ? student?.studentId?.email : "email not added"}</Text>
                      </View>
                    </>
                  )}




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
    useEffect(() => {
      const GetAllApplied = async () => {
        const apiURL = `http://${IpAddress}:5000/api/student/request/filter`;
        try {
          const res = await axios.get(apiURL);
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

    const handleNavigation = (detail) => {
      if (role == "Company") {
        navigation.navigate('SingleStudent', { student: detail?.studentId })
      } else {
        navigation.navigate('SingleJob', { id: detail?.jobId?._id, companyId: detail?.companyId?._id, studentId: detail?.studentId?._id,CompanyParentId:detail?.companyId?._id })

      }
    }
    return (
      <>
        {applied?.length > 0 && role == "Student" && (
          <Block>
            <Text style={{ fontSize: 23, fontFamily: 'PoppinsMedium', marginVertical: 10, color: 'green' }}>Congratulation </Text>
          </Block>
        )}
        <View style={{ padding: 2 }}>
          <Text style={[styles.CompanyName, { fontFamily: 'PoppinsBold', color: 'grey' }]}>Total  Approved</Text>
          <Text style={[styles.CompanyName, { fontFamily: 'PoppinsBold', color: 'grey', fontSize: 22, paddingHorizontal: 10 }]}>{applied?.length}</Text>
        </View>

        {applied?.length == 0 && (
          <Block>
            <Image style={styles.image2} source={{ uri: "https://img.freepik.com/free-vector/hand-drawn-no-data-concept_52683-127818.jpg?t=st=1713515779~exp=1713519379~hmac=7bcd9e0e4a76aa2cad898254898af3d4447a2228585e14bd49938b0e68fa26cc&w=900" }} />
            <Text style={{ textAlign: 'center', fontSize: 17, fontFamily: 'PoppinsMedium', }}>No Job Approved  </Text>
          </Block>
        )}

        {applied?.map((student, index) => (
          <React.Fragment key={index}>
            <TouchableRipple
              onPress={() => handleNavigation(student)}
              style={styles.singleCompany2}>
              <>
                <View style={{ flexDirection: 'row', gap: 13, alignItems: 'center' }}>
                  <Image style={styles.image} source={{ uri: student?.companyId?.avtar || defaultCompany }} />
                  <View>
                    <Text style={styles.CompanyName}>{student?.companyId?.name ? student?.companyId?.name : 'not added'}</Text>
                    <Text style={[styles.CompanyName, { color: 'grey' }]}>{student?.jobId?.jobTitle ? student?.jobId?.jobTitle : "not added title"}</Text>
                  </View>
                </View>
                <View>

                  {role == "Student" ? (
                    <>
                      <Text style={[styles.CompanyName]}>About Company :</Text>
                      <View style={{ paddingHorizontal: 10 }}>
                        <Text style={[styles.CompanyName, { fontFamily: 'PoppinsMedium' }]}>{(student?.companyId?.phone) ? student?.companyId?.phone : 'contact number not added'}</Text>
                        <Text style={[styles.CompanyName, { fontFamily: 'PoppinsMedium' }]}>{student?.companyId?.email ? student?.companyId?.email : "email not added"}</Text>
                      </View>
                    </>
                  ) : (
                    <>
                      <Text style={[styles.CompanyName]}>Applied :</Text>

                      <View style={{ paddingHorizontal: 10 }}>
                        <Text style={[styles.CompanyName, { fontFamily: 'PoppinsMedium' }]}>{(student?.studentId?.name) ? student?.studentId?.name : 'not added'}</Text>
                        <Text style={[styles.CompanyName, { fontFamily: 'PoppinsMedium' }]}>{student?.studentId?.email ? student?.studentId?.email : "email not added"}</Text>
                      </View>
                    </>
                  )}



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
          const res = await axios.get(apiURL);
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

    const handleNavigation = (detail) => {
      if (role == "Company") {
        navigation.navigate('SingleStudent', { student: detail?.studentId })
      } else {
        navigation.navigate('SingleJob', { id: detail?.jobId?._id, companyId: detail?.companyId?._id, studentId: detail?.studentId?._id,CompanyParentId:detail?.companyId?._id })
      }
    }
    return (
      <>
        <View style={{ padding: 2 }}>
          <Text style={[styles.CompanyName, { fontFamily: 'PoppinsBold', color: 'grey' }]}>Total  Rejected</Text>
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
            <TouchableRipple
              onPress={() => handleNavigation(student)}
              style={styles.singleCompany2}>
              <>
                <View style={{ flexDirection: 'row', gap: 13, alignItems: 'center' }}>
                  <Image style={styles.image} source={{ uri: student?.companyId?.avtar || defaultCompany }} />
                  <View>
                    <Text style={styles.CompanyName}>{student?.companyId?.name}</Text>
                    <Text style={[styles.CompanyName, { color: 'grey' }]}>{student?.jobId?.jobTitle}</Text>
                  </View>
                </View>
                <View>

                  {role == "Student" ? (
                    <>
                      <Text style={[styles.CompanyName]}>About Company :</Text>
                      <View style={{ paddingHorizontal: 10 }}>
                        <Text style={[styles.CompanyName, { fontFamily: 'PoppinsMedium' }]}>{(student?.companyId?.phone) ? student?.companyId?.phone : 'contact number not added'}</Text>
                        <Text style={[styles.CompanyName, { fontFamily: 'PoppinsMedium' }]}>{student?.companyId?.email ? student?.companyId?.email : "email not added"}</Text>
                      </View>
                    </>
                  ) : (
                    <>
                      <Text style={[styles.CompanyName]}>Applied :</Text>

                      <View style={{ paddingHorizontal: 10 }}>
                        <Text style={[styles.CompanyName, { fontFamily: 'PoppinsMedium' }]}>{(student?.studentId?.name) ? student?.studentId?.name : 'not added'}</Text>
                        <Text style={[styles.CompanyName, { fontFamily: 'PoppinsMedium' }]}>{student?.studentId?.email ? student?.studentId?.email : "email not added"}</Text>
                      </View>
                    </>
                  )}

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

  return (

    <>
      <Block style={{ backgroundColor: 'white', flex: 1 }}>
        <Appbar.Header elevated style={{ backgroundColor: 'white' }}>
          <Appbar.BackAction onPress={() => navigation.goBack()} />
          <Appbar.Content title="Notification" titleStyle={{ fontSize: 18, fontFamily: 'PoppinsBold' }} />
        </Appbar.Header>

        <ScrollView
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          style={[GlobalStyle.container, styles.scrollView]}
        >

          {role == "Admin" ? (

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
          ) : role == 'Company' || role == "Hod" ? (
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <TouchableOpacity onPress={() => handleCategoryPress('Pending')} style={[styles.category, activeCategory === 'Direct' && styles.activeCategory]}>
                <Text style={[styles.title, activeCategory === 'Pending' && styles.activeTitle, { width: role == "Hod" ? 87 : 70, textAlign: 'center' }]}>{role == "Hod" ? "Waiting List" : "Pending"}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleCategoryPress('Approved')} style={[styles.category, activeCategory === 'Watched' && styles.activeCategory]}>
                <Text style={[styles.title, activeCategory === 'Approved' && styles.activeTitle]}>Approved</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleCategoryPress('Reject')} style={[styles.category, activeCategory === 'Reject' && styles.activeCategory]}>
                <Text style={[styles.title, activeCategory === 'Reject' && styles.activeTitle]}>Reject</Text>
              </TouchableOpacity>
            </View>
          ) : (
            role == "Student" ? (
              <View style={{ flexDirection: 'row', gap: 10 }}>
                <TouchableOpacity onPress={() => handleCategoryPress('Pending')} style={[styles.category, activeCategory === 'Direct' && styles.activeCategory]}>
                  <Text style={[styles.title, activeCategory === 'Pending' && styles.activeTitle, { width: 87, textAlign: 'center' }]}>Waiting List</Text>

                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleCategoryPress('Approved')} style={[styles.category, activeCategory === 'Watched' && styles.activeCategory]}>
                  <Text style={[styles.title, activeCategory === 'Approved' && styles.activeTitle]}>Accepted</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleCategoryPress('Reject')} style={[styles.category, activeCategory === 'Reject' && styles.activeCategory]}>
                  <Text style={[styles.title, activeCategory === 'Reject' && styles.activeTitle]}>Rejected</Text>
                </TouchableOpacity>
              </View>
            ) : ''
          )}
          <Divider />

          {role == "Admin" && (
            activeCategory == "Pending" ? (
              <AdminPending />
            ) : (
              activeCategory == "Reject" ? (
                <RejectCompany />
              ) :
                <AdminApproved />
            )
          )}

          {role == "Company" && (
            activeCategory == "Pending" ? (
              <Pending />
            ) : (
              activeCategory == "Reject" ? (
                <RejectedJob />
              ) :
                <JobApprove />
            )
          )}

          {role == "Hod" && (
            activeCategory == "Pending" ? (
              <Pending />
            ) : (
              activeCategory == "Reject" ? (
                <RejectedJob />
              ) :
                <JobApprove />
            )
          )}

          {role == "Student" && (
            activeCategory == "Pending" ? (
              <Pending />
            ) : (
              activeCategory == "Reject" ? (
                <RejectedJob />
              ) :
                <JobApprove />
            )
          )}



        </ScrollView>
      </Block>
    </>
  );
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
});
