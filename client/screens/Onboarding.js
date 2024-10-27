import React, { useCallback } from "react";
import {
  ImageBackground,
  Image,
  StyleSheet,
  StatusBar,
  Dimensions
} from "react-native";
import { Block, Button, Text, theme } from "galio-framework";


const { height, width } = Dimensions.get("screen");

import argonTheme from "../constants/Theme";
import Images from "../constants/Images";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Onboarding = ({ navigation }) => {

  useFocusEffect(
    useCallback(() => {
      const CheckToken = async () => {
        try {
          const value = await AsyncStorage.getItem("Token");
          if (value !== null) {
            await navigation.navigate('Home')
          } else {
            console.log('No data found with key:',);
          }
        } catch (error) {
          console.error('Error retrieving data:', error);
          return null;
        }
      };

      CheckToken()

    }, [])
  )
  return (
    <Block flex style={styles.container}>
      <StatusBar hidden />
      <Block flex center>
        <ImageBackground
          source={Images.Onboarding}
          style={{ height, width, zIndex: 1 }}
        />
      </Block>
      <Block center>
        <Image source={Images.LogoOnboarding} style={styles.logo} />
      </Block>
      <Block flex space="between" style={styles.padded}>
        <Block flex space="around" style={{ zIndex: 2 }}>
          <Block style={styles.title}>
            <Block>
              <Text
                style={{
                  fontFamily: 'PoppinsBold'
                }} color="white" size={55}>
                Discover,
              </Text>
              <Text
                style={{
                  fontFamily: 'PoppinsBold', marginTop: -18
                }} color="white" size={55}>
                Connect
              </Text>
            </Block>

            <Block style={styles.subTitle}>
              <Text style={{
                fontFamily: 'PoppinsMedium'

              }} color="white" size={15}>
                Discover, Connect: Your gateway to endless career opportunities.
              </Text>
            </Block>
          </Block>
          <Block center>
            <Button
              style={styles.button}
              color={argonTheme.COLORS.SECONDARY}
              // onPress={() => navigation.navigate("App")}
              onPress={() => navigation.navigate("Login")}
              textStyle={{ color: argonTheme.COLORS.BLACK }}
            >
              <Text
                style={{
                  fontFamily: 'PoppinsBold',fontSize:22,color:'grey',
                  width:200,textAlign: 'center'
                }}>
                Get Started
              </Text>
            </Button>
          </Block>
        </Block>
      </Block>
    </Block>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.COLORS.BLACK
  },
  padded: {
    paddingHorizontal: theme.SIZES.BASE * 2,
    position: "relative",
    bottom: theme.SIZES.BASE,
    zIndex: 2,
  },
  button: {
    width: width - theme.SIZES.BASE * 4,
    height: theme.SIZES.BASE * 3,
    shadowRadius: 0,
    shadowOpacity: 0,
    fontFamily: 'PoppinsBold',

  },
  logo: {
    width: 220,
    height: 60,
    zIndex: 2,
    position: 'relative',
    marginTop: '-50%'
  },
  title: {
    marginTop: '-5%',
    fontFamily: 'PoppinsBold'
  },
  subTitle: {
    marginTop: 20,

  }
});

export default Onboarding;
