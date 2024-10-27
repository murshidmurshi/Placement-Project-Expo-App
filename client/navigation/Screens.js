import { Animated, Dimensions, Easing } from "react-native";
// header for screens
import { Header, Icon } from "../components";
import { argonTheme, tabs } from "../constants";

import Articles from "../screens/Articles";
import { Block } from "galio-framework";
// drawer
import CustomDrawerContent from "./Menu";
import Elements from "../screens/Elements";
// screens
import Home from "../screens/Home";
import Login from "../screens/Login";
import Onboarding from "../screens/Onboarding";
import Pro from "../screens/Pro";
import Profile from "../screens/Profile";
import React, { useCallback, useEffect, useState } from "react";
import Register from "../screens/Register";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createStackNavigator } from "@react-navigation/stack";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Hod from "../screens/Hod";
import Student from "../screens/Student";
import Company from "../screens/Company";
import AddHod from "../screens/AddHod";
import AddStudent from "../screens/AddStudent";
import HodHome from "../components/HodHome";
import StudentHome from "../components/StudentHome";
import HodStudent from "../components/Hod/HodStudent";
import StudentHod from "../components/Student/StudentHod";
import Loader from "../components/Loader";
import SingleCompany from "../components/Company/SingleCompany";
import AddCompany from "../screens/AddCompany";
import SingleJob from "../components/Company/SingleJob";
import EditJob from "../components/Company/EditJob";
import AddJob from "../components/AddJob";
import AdminHome from "../components/Admin/AdminHome";
import SingleHod from "../components/Hod/SingleHod";
import SingleStudent from "../components/Student/SingleStudent";
import CompanyLogin from "../screens/CompanyLogin";
import Jobs from "../components/Company/Jobs";
import CompanyHome from "../components/Company/CompanyHome";
import HodProfile from "../components/Hod/HodProfile";
import EditHod from "../components/Hod/EditHod";
import StudentProfile from "../components/Student/StudentProfile";
import EditStudent from "../components/Student/EditStudent";
import CompanyProfile from "../components/Company/CompanyProfile";
import EditCompany from "../components/Company/EditCompany";
import Notification from "../components/Notification";
import AdminNotification from "../components/Admin/AdminNotification";

const { width } = Dimensions.get("screen");

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();

function ElementsStack(props) {
  return (
    <Stack.Navigator
      screenOptions={{
        mode: "card",
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="Elements"
        component={Elements}
        options={{
          header: ({ navigation, scene }) => (
            <Header title="Elements" navigation={navigation} scene={scene} />
          ),
          cardStyle: { backgroundColor: "#F8F9FE" },
        }}
      />
      <Stack.Screen
        name="Pro"
        component={Pro}
        options={{
          header: ({ navigation, scene }) => (
            <Header
              title=""
              back
              white
              transparent
              navigation={navigation}
              scene={scene}
            />
          ),
          headerTransparent: true,
        }}
      />
    </Stack.Navigator>
  );
}

function ArticlesStack(props) {
  return (
    <Stack.Navigator
      screenOptions={{
        mode: "card",
        headerShown: "screen",
      }}
    >
      <Stack.Screen
        name="Articles"
        component={Articles}
        options={{
          header: ({ navigation, scene }) => (
            <Header title="Articles" navigation={navigation} scene={scene} />
          ),
          cardStyle: { backgroundColor: "#F8F9FE" },
        }}
      />
      <Stack.Screen
        name="Pro"
        component={Pro}
        options={{
          header: ({ navigation, scene }) => (
            <Header
              title=""
              back
              white
              transparent
              navigation={navigation}
              scene={scene}
            />
          ),
          headerTransparent: true,
        }}
      />
    </Stack.Navigator>
  );
}

function ProfileStack(props) {
  return (
    <Stack.Navigator
      initialRouteName="Profile"
      screenOptions={{
        mode: "card",
        headerShown: "screen",
      }}
    >
      <Stack.Screen
        name="Profile"
        component={Profile}
        options={{
          header: ({ navigation, scene }) => (
            <Header
              transparent
              white
              title="Profile"
              navigation={navigation}
              scene={scene}
            />
          ),
          cardStyle: { backgroundColor: "#FFFFFF" },
          headerTransparent: true,
        }}
      />
      <Stack.Screen
        name="Pro"
        component={Pro}
        options={{
          header: ({ navigation, scene }) => (
            <Header
              title=""
              back
              white
              transparent
              navigation={navigation}
              scene={scene}
            />
          ),
          headerTransparent: true,
        }}
      />
    </Stack.Navigator>
  );
}

function HomeStack(props) {
  return (
    <Stack.Navigator
      screenOptions={{
        mode: "card",
        headerShown: "screen",
      }}
    >
      <Stack.Screen
        name="Home"
        component={Home}
        options={{
          header: ({ navigation, scene }) => (
            <Header
              title="Home"
              search
              // options
              tabs={tabs?.categories}
              navigation={navigation}
              scene={scene}
            />
          ),
          cardStyle: { backgroundColor: "#F8F9FE" },
        }}
      />

    </Stack.Navigator>
  );
}




export default function OnboardingStack(props) {
  return (
    <Stack.Navigator
      screenOptions={{
        mode: "card",
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="Onboarding"
        component={Onboarding}
        option={{
          headerTransparent: true,
        }}
      />

      <Stack.Screen name="Home" component={AppStack} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Register" component={Register} />
      <Stack.Screen name="CompanyLogin" component={CompanyLogin} />

      <Stack.Screen name="AddHod" component={AddHod} />
      <Stack.Screen name="SingleHod" component={SingleHod} />
      <Stack.Screen name="HodProfile" component={HodProfile} />
      <Stack.Screen name="EditHod" component={EditHod} />


      <Stack.Screen name="AddStudent" component={AddStudent} />
      <Stack.Screen name="SingleStudent" component={SingleStudent} />
      <Stack.Screen name="StudentProfile" component={StudentProfile} />
      <Stack.Screen name="EditStudent" component={EditStudent} />

      <Stack.Screen name="SingleCompany" component={SingleCompany} />
      <Stack.Screen name="AddCompany" component={AddCompany} />
      <Stack.Screen name="CompanyProfile" component={CompanyProfile} />
      <Stack.Screen name="EditCompany" component={EditCompany} />
      <Stack.Screen name="SingleJob" component={SingleJob} />
      <Stack.Screen name="SingleJobEdit" component={EditJob} />
      <Stack.Screen name="AddJob" component={AddJob} />
      <Stack.Screen name="Notification" component={Notification} />
      <Stack.Screen name="AdminNoti" component={AdminNotification} />
    </Stack.Navigator>
  );
}
function AppStack({ navigation }) {
  const [Role, setRole] = useState('')

  useFocusEffect(
    useCallback(() => {
      const CheckToken = async () => {
        try {
          const value = await AsyncStorage.getItem("Token");
          if (!(value)) {
            await navigation.navigate('Login')
          } else {
          }
        } catch (error) {
          console.error('Error retrieving data:', error);
          return null;
        }
      };

      const getUserRole = async () => {
        try {
          const role = await (AsyncStorage.getItem("Role"));
          console.log(role, "role");
          await setRole(role);
        } catch (error) {
          console.error("Error retrieving user role:", error);
        }
      }
      CheckToken()
      getUserRole()
    }, [])
  )

  return (
    <Drawer.Navigator
      style={{ flex: 1 }}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      drawerStyle={{
        backgroundColor: "white",
        width: width * 0.8,
      }}
      drawerContentOptions={{
        activeTintcolor: "white",
        inactiveTintColor: "#000",
        activeBackgroundColor: "transparent",
        itemStyle: {
          width: width * 0.75,
          backgroundColor: "transparent",
          paddingVertical: 16,
          paddingHorizonal: 12,
          justifyContent: "center",
          alignContent: "center",
          alignItems: "center",
          overflow: "hidden",
        },
        labelStyle: {
          fontSize: 18,
          marginLeft: 12,
          fontWeight: "normal",
        },
      }}
    >

      {Role == "Hod" && (
        <>
          <Drawer.Screen
            name="Home"
            component={HodHome}
            options={{
              headerShown: false,
            }}
          />
          <Drawer.Screen
            name="Student"
            component={HodStudent}
            options={{
              headerShown: false,
            }}
          />
          <Drawer.Screen
            name="Company"
            component={Company}
            options={{
              headerShown: false,
            }}
          />
        </>
      )}


      {Role == "Student" && (
        <>
          <Drawer.Screen
            name="Home"
            component={StudentHome}
            options={{
              headerShown: false,
            }}
          />
          <Drawer.Screen
            name="Hod"
            component={StudentHod}
            options={{
              headerShown: false,
            }}
          />
        </>
      )}


      {Role == "Admin" && (
        <>
          <Drawer.Screen
            name="Home"
            component={AdminHome}
            options={{
              headerShown: false,
            }}
          />
          <Drawer.Screen
            name="Hod"
            component={Hod}
            options={{
              headerShown: false,
            }}
          />
          <Drawer.Screen name="Student" component={Student}
            options={{
              headerShown: false,
            }}
          />

          <Drawer.Screen
            name="Company"
            component={Company}
            options={{
              headerShown: false,
            }}
          />
        </>
      )}

{Role == "Company" && (
        <>
          <Drawer.Screen
            name="Home"
            component={CompanyHome}
            options={{
              headerShown: false,
            }}
          />
          <Drawer.Screen
            name="Jobs"
            component={Jobs}
            options={{
              headerShown: false,
            }}
          />
        </>
      )}

      <Drawer.Screen
        name="Loder"
        component={Loader}
        options={{
          headerShown: false,
        }}
      />


      {/* <Drawer.Screen
        name="Profile"
        component={ProfileStack}
        options={{
          headerShown: false,
        }}
      /> */}

      {/*
      <Drawer.Screen
        name="Elements"
        component={ElementsStack}
        options={{
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="Articles"
        component={ArticlesStack}
        options={{
          headerShown: false,
        }}
      /> */}
    </Drawer.Navigator>
  );
}

