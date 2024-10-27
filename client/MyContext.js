import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { IpAddress } from './GlobalAddress';
import { Alert } from 'react-native';


const MyContext = React.createContext();
const MyProvider = (props) => {
  const [userDetail, setUserDetail] = useState(null);
  const [hod, setHod] = useState([])
  const [allstudent, setAllStudent] = useState([])
  const [count, setCount] = useState(0)
  const [count2, setCount2] = useState(0)


  const [allhod, setAllHod] = useState([])
  const [allCompany, setAllCompany] = useState([])
  const [role, setRole] = useState(null)
  const [alldepartment, setAllDepartment] = useState([])

  let defaulAvtar = 'https://img.freepik.com/premium-vector/man-avatar-profile-picture-vector-illustration_268834-541.jpg?size=626&ext=jpg&ga=GA1.1.1623246564.1699356450&semt=ais'
  let defaultCompany="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRRX5IgowC856DrpsPyYCHkXtTH1xWdPvz_McmkyEuCwQ&s"


  const getAllCompany = async () => {
    const apiURL = `http://${IpAddress}:5000/api/company/allCompany`;
    try {
      const res = await axios.get(apiURL);
      if (res.data.success) {
        
        let companies=res.data.activeCompany;
        // let companies=res.data.company;
        // setAllCompany(companies?.filter(company => company.status!=="reject"));
        setAllCompany(companies);
      } else {
        Alert.alert('Error', res.data.error);
      }
    } catch (error) {
      console.error(error);
    }
  }
  useEffect(() => {
    const fetchData = async () => {

      try {
        // Retrieve token from AsyncStorage
        const token = await AsyncStorage.getItem('Token');
        const Role = await AsyncStorage.getItem('Role');

        // Send request to backend with token in headers
        const apiURL = Role == "Admin" ? `http://${IpAddress}:5000/api/admin/auth` : Role == "Company" ? `http://${IpAddress}:5000/api/company/auth` : Role == "Hod" ? `http://${IpAddress}:5000/api/hod/auth` : `http://${IpAddress}:5000/api/student/auth`;
        if (token) {
          const response = await axios.post(apiURL, null, {
            headers: {
              authorization: JSON.parse(token),
            },
          });
          // await AsyncStorage.setItem("User", JSON.stringify(response.data.user))
          await setUserDetail(response.data.user)
          let Hod = response.data.hod;
          if (Hod) {
            await setHod(Hod)
          }
        }

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();

    const GetAllStudent = async () => {
      const apiURL = `http://${IpAddress}:5000/api/student/allStudent`;
      await axios.get(apiURL)
        .then(async (res) => {
          if (res.data.success) {
            let data = res.data.student;
            setAllStudent(data)
          } else {
            Alert.alert('Error', res.data.error)
          }
        })
        .catch((err) => {
          console.log(err);
        })
    }

    const GetAllHod = async () => {
      const apiURL = `http://${IpAddress}:5000/api/hod/allHod`;
      await axios.get(apiURL)
        .then(async (res) => {
          if (res.data.success) {
            let data = res?.data?.hod;
            console.log(data, 'data');
            setAllHod(data)
          } else {
            Alert.alert('Error', res.data.error)
          }
        })
        .catch((err) => {
          console.log(err);
        })

    }

    const getAllCompany = async () => {
      const apiURL = `http://${IpAddress}:5000/api/company/allCompany`;
      try {
        const res = await axios.get(apiURL);
        if (res.data.success) {
          let companies=res.data.company;
          setAllCompany(companies?.filter(company => company.status!=="reject"));
        } else {
          Alert.alert('Error', res.data.error);
        }
      } catch (error) {
        console.error(error);
      }
    }
    const GetTheRole = async () => {
      const Role = await AsyncStorage.getItem('Role');
      setRole(Role)
    }

    const GetAllDepartments = async () => {
      const apiURL = `http://${IpAddress}:5000/api/admin/getAllDepartments`;
      try {
        const res = await axios.get(apiURL);
        if (res.data.success) {
          setAllDepartment(res.data.departments);
        } else {
          Alert.alert('Error', res.data.error);
        }
      } catch (error) {

        console.error(error);
      }
    }




    GetAllDepartments()
    GetTheRole()
    getAllCompany()
    GetAllHod()
    GetAllStudent()
  }, [count]);


  // useEffect(() => {
  //   const GetUserDetail = async () => {
  //     try {
  //       const data = await AsyncStorage.getItem("User");
  //       if (data !== null) {
  //       await  setUserDetail(JSON.parse(data));
  //       }
  //     } catch (error) {
  //       console.error('Error retrieving user details:', error);
  //     }
  //   };

  //   GetUserDetail();
  // }, []);


  return (
    <MyContext.Provider value={{
      userDetail, hod, allstudent,
      count, setCount,
      allhod, setAllHod,
      allCompany, setAllCompany,
      role, setRole,
      alldepartment, setAllDepartment,
      count2, setCount2,
      defaulAvtar,
      defaultCompany,
      getAllCompany

    }}>

      {props.children}
    </MyContext.Provider>
  );
};

export { MyProvider, MyContext };
