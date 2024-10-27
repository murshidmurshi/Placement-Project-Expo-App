import { Image, StyleSheet, View } from 'react-native'
import { Block, Button as GaButton, Text, theme } from "galio-framework";
import { Button, Header, Icon, Input, Select, Switch } from "../components/";
import Ionicon from 'react-native-vector-icons/Ionicons';



import React, { useCallback, useContext, useEffect, useState } from 'react'
import { ScrollView } from 'react-native-gesture-handler';
import globalStyles from '../assets/GlobaStyles';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TouchableRipple } from 'react-native-paper';
import { IpAddress } from '../GlobalAddress';
import axios from 'axios';
import { MyContext } from '../MyContext';
import { useFocusEffect } from '@react-navigation/native';

export default function Company({ navigation }) {
  let GlobaStyles = globalStyles()
  const { setCount,defaultCompany,allCompany,getAllCompany } = useContext(MyContext)
  // console.log(allCompany, 'allCompany');

  const handleCompanyPress = (companyDetail) => {
    console.log("Hello wrong");
    navigation?.navigate('SingleCompany', { Company: companyDetail })
  }
 useFocusEffect(
  useCallback(()=>{
    getAllCompany()
  },[])
 )
  return (
    <>
      <SafeAreaView style={{ backgroundColor: 'white', flex: 1 }}>
        <Block>
          <Block style={{ marginBottom: theme.SIZES.BASE }}>
            <Header
              //   tabs={tabs.categories}
              isIcon={true}
              search
              title="Company"
              navigation={navigation}
            />
          </Block>

          <ScrollView style={GlobaStyles?.container}
          
          showsVerticalScrollIndicator={false}
          >
            {/* <TouchableRipple style={{ borderWidth: 1, padding: 10, borderRadius: 5, alignSelf: 'center', justifyContent: 'center', width: '100%', marginBottom: 10 }}>
              <>
                <View style={{ flexDirection: 'row', gap: 10 }}>
                  <Image style={{ width: 50, height: 50, borderRadius: 50 }} source={{ uri: "https://media.istockphoto.com/id/1369199360/photo/portrait-of-a-handsome-young-businessman-working-in-office.webp?b=1&s=170667a&w=0&k=20&c=9cS9Dj2jKbJGqfI0X0U-jZNURFc-foLzDm1Ls-Q_fgo=" }} />

                  <View>
                    <Text style={{ color: 'grey' }}>Google</Text>
                    <Text style={{ fontSize: 14, fontWeight: 'bold' }}>Product Designer</Text>
                  </View>
                </View>
                <View style={{ flexDirection: 'row', gap: 5, alignItems: 'center', marginBottom: 10, marginTop: 10 }}>
                  <Ionicon name='location' size={22} color={"grey"} />
                  <Text style={{ color: 'grey' }}>Delhi/NCR</Text>
                </View>
                <View style={{ flexDirection: 'row', gap: 5, alignItems: 'center', marginBottom: 5 }}>
                  <Text style={{}}>Full Time * Work from Office</Text>
                </View>
                <View style={{ flexDirection: 'row', gap: 5, alignItems: 'center', marginBottom: 10 }}>
                  <Text style={{ fontSize: 18, fontWeight: 'bold' }}>$12 /hr</Text>
                </View>
              </>
            </TouchableRipple> */}
            {allCompany?.length == 0 && (
              <Block style={{ padding: 10, alignSelf: 'center' }}>
                <Image style={{ width: 150, height: 150 }} source={{ uri: 
                  "https://img.freepik.com/free-vector/hand-drawn-no-data-concept_52683-127818.jpg?t=st=1713515779~exp=1713519379~hmac=7bcd9e0e4a76aa2cad898254898af3d4447a2228585e14bd49938b0e68fa26cc&w=900"
                   }} />
                <Text style={{ textAlign: 'center', fontSize: 16, fontFamily: 'PoppinsMedium', }}>No company availabel </Text>
              </Block>
            )}

            {allCompany?.map((Company, index) => (
              <React.Fragment key={index}>
                <TouchableRipple onPress={() => handleCompanyPress(Company)} style={{ elevation: 1, padding: 10, borderRadius: 5, alignItems: 'center', justifyContent: 'center', marginBottom: 10, flexDirection: 'row', gap: 18, backgroundColor: 'white', margin: 2 }}>
                  <>
                    <Image source={{ uri:Company?.avtar||defaultCompany
                   }} style={{ width: "55%", height: 120, padding: 10, borderRadius: 10 }} />
                    <View style={{}}>
                      <Text style={{ fontSize: 20, marginTop: 10, marginBottom: 5, fontFamily: 'PoppinsBold', }}>{Company?.name}</Text>
                      <Text style={{ fontSize: 14, color: 'gray', textAlign: 'center', fontFamily: 'PoppinsMedium' }}>Added on {new Date(Company?.date).toLocaleDateString()}</Text>
                      <View style={{ flexDirection: 'row', gap: 5, alignItems: 'center', marginTop: 5 }}>
                        <Ionicon name='location' size={22} />
                        <Text style={{ fontFamily: 'PoppinsMedium', alignSelf: 'center' }}>{Company?.location || "Not added"}</Text>
                      </View>
                    </View>
                    {/* <Button onPress={() => handleCompanyPress(Company)} style={{ backgroundColor: 'white', borderWidth: 0.5 }}>
                      <Text style={{ fontSize: 18, textAlign: 'center' }}>View</Text>
                    </Button> */}
                  </>
                </TouchableRipple>
              </React.Fragment>
            ))}
          </ScrollView>
        </Block>
      </SafeAreaView>
    </>
  )
}

const styles = StyleSheet.create({})