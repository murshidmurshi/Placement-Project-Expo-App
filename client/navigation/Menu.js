import { Block, Text, theme } from "galio-framework";
import { Image, ScrollView, StyleSheet } from "react-native";

import { DrawerItem as DrawerCustomItem } from "../components";
// import Images from "../constants/Images";
const Logo = require("../assets/imgs/argon-logo.png");

import React, { useCallback, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";

function CustomDrawerContent({
  drawerPosition,
  navigation,
  profile,
  focused,
  state,
  ...rest
}) {


  const [screens, setScreens] = useState([]);

  useFocusEffect(
    useCallback(() => {
      const getUserRole = async () => {
        try {
          const role = await (AsyncStorage.getItem("Role"));
          console.log(role, "role");
  
          if (role == "Student") {
            const screens = ["Home", "Hod",];
            setScreens(screens)
          } 
         else if (role == "Hod") {
            const screens = ["Home", "Student","Company"];
            setScreens(screens)
          } 
         else if (role == "Company") {
            const screens = ["Home","Jobs"];
            setScreens(screens)
          } 
          else {
            const screens = ["Home", "Hod","Student", "Company",];
            setScreens(screens)
          }
        } catch (error) {
          console.error("Error retrieving user role:", error);
        }
  
      };
      getUserRole();
    }, [])
  )


  return (
    <Block
      style={styles.container}
      forceInset={{ top: "always", horizontal: "never" }}
    >
      <Block flex={0.06} style={styles.header}>
        <Image style={{width:220,height:50}} source={Logo} />
      </Block>
      <Block flex style={{ paddingLeft: 8, paddingRight: 14 }}>
        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
          {screens.map((item, index) => {
            return (
              <DrawerCustomItem
                title={item}
                key={index}
                navigation={navigation}
                focused={state.index === index ? true : false}
              />
            );
          })}
          <Block
            flex
            style={{ marginTop: 24, marginVertical: 8, paddingHorizontal: 8 }}
          >
            <Block
              style={{
                borderColor: "rgba(0,0,0,0.2)",
                width: "100%",
                borderWidth: StyleSheet.hairlineWidth,
              }}
            />
          </Block>
          <DrawerCustomItem title="Logout" navigation={navigation} />
        </ScrollView>
      </Block>
    </Block>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 28,
    paddingBottom: theme.SIZES.BASE,
    paddingTop: theme.SIZES.BASE * 3,
    justifyContent: "center",
  },
});

export default CustomDrawerContent;
