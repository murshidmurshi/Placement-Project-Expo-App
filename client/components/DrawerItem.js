import React, { useContext } from "react";
import { StyleSheet, TouchableOpacity, Linking } from "react-native";
import { Block, Text, theme } from "galio-framework";
import Icon from "./Icon";
import argonTheme from "../constants/Theme";
import Ionicon from 'react-native-vector-icons/Ionicons';
import MaterialIcon  from "react-native-vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MyContext } from "../MyContext";

const DrawerItem = ({ focused, title, navigation }) => {
const{count,setCount,setUserDetail,}=useContext(MyContext)
  const Logout = async () => {
    console.log("Logout completed");
    await setCount((prevCount) => prevCount + 1); // Increment count in context
    // await setUserDetail(null)
    await AsyncStorage.removeItem("Token")
    await AsyncStorage.removeItem("Role")
    await navigation.navigate('Login')
  }

  const renderIcon = () => {
    switch (title) {
      case "Home":
        return (
          <Ionicon
            name="home"
            size={20}
            color={focused ? "white" : "grey"}
          />
        );
      // case "Elements":
      //   return (
      //     <Icon
      //       name="map-big"
      //       family="ArgonExtra"
      //       size={14}
      //       color={focused ?"white" : "grey"}
      //     />
      //   );
      case "Hod":
        return (
          <Ionicon
            name="person"
            size={20}
            color={focused ? "white" : "grey"}
          />
        );
      case "Student":
        return (
          <Ionicon
            name="people-circle-outline"
            size={20}
            color={focused ? "white" : "grey"}
          />
        );
      case "Company":
        return (
          <Ionicon
            name="podium-outline"
            size={20}
            color={focused ? "white" : "grey"}
          />
        );
      case "Jobs":
        return (
          <MaterialIcon
          name="work"
            size={20}
            color={focused ? "white" : "grey"}
          />
        );
      case "Logout":
        return (
          <Ionicon
            name="log-out"
            size={20}
            color={focused ? "white" : "grey"}
          />);

      default:
        return null;
    }
  };

  const containerStyles = [
    styles.defaultStyle,
    focused ? [styles.activeStyle, styles.shadow] : null
  ];

  return (
    <TouchableOpacity
      style={{ height: 60 }}
      onPress={() =>
        title == "Logout" ?
          Logout()
          : navigation.navigate(title)
      }
    >
      <Block flex row style={containerStyles}>
        <Block middle flex={0.1} style={{ marginRight: 5 }}>
          {renderIcon()}
        </Block>
        <Block row center flex={0.9}>
          <Text
            size={15}
            bold={focused ? true : false}
            color={focused ? "white" : "rgba(0,0,0,0.5)"}
            style={{fontFamily:'PoppinsMedium'}}
          >
            {title}
          </Text>
        </Block>
      </Block>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  defaultStyle: {
    paddingVertical: 16,
    paddingHorizontal: 16
  },
  activeStyle: {
    backgroundColor: argonTheme.COLORS.ACTIVE,
    borderRadius: 4
  },
  shadow: {
    shadowColor: theme.COLORS.BLACK,
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowRadius: 8,
    shadowOpacity: 0.1
  }
});

export default DrawerItem;
