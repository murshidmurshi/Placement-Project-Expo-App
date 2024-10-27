import React from "react";
import {
  StyleSheet,
  Dimensions,
  ScrollView,
  Image,
  ImageBackground,
  Platform
} from "react-native";
import { Block, Text, theme } from "galio-framework";

import { Button } from "../components";
import { Images, argonTheme } from "../constants";
import { HeaderHeight } from "../constants/utils";

const { width, height } = Dimensions.get("screen");

const thumbMeasure = (width - 48 - 32) / 3;

const Profile = ({allhod}) => {
  return (
<>


{allhod?.length === 0 && (
                                        <>
                                            <Block  style={{marginTop:100}}>
                                                <Image style={styles.image2} source={{ uri: "https://img.freepik.com/free-vector/hand-drawn-no-data-concept_52683-127818.jpg?t=st=1713515779~exp=1713519379~hmac=7bcd9e0e4a76aa2cad898254898af3d4447a2228585e14bd49938b0e68fa26cc&w=900" }} />
                                                <Text style={{ textAlign: 'center', fontSize: 17,fontFamily:'PoppinsMedium' }}>No Hod found</Text>
                                            </Block>
                                        </>
                                    )}
    {allhod?.map((hod)=>(
      <>
         <Block flex style={styles.profile}>
      <Block flex>
          <ScrollView
           showsHorizontalScrollIndicator={false}
           showsVerticalScrollIndicator={false}
            style={{ width, marginTop: "25%" }}
          >
            <Block flex style={styles.profileCard}>
              <Block middle style={styles.avatarContainer}>
                <Image
                  source={{ uri: hod?.avtar }}
                  style={styles.avatar}
                />
              </Block>

              
       
              <Block flex>
                <Block middle style={styles.nameInfo}>
                  <Text style={{fontFamily:'PoppinsBold'}} size={28} color="#32325D">
                 {hod?.name}
                  </Text>
                  <Text size={16} color="#32325D" style={{ marginTop: 10 ,fontFamily:'PoppinsMedium'}} >
                   {hod?.department||"None"}
                  </Text>
                  <Text size={16} color="#32325D" style={{ marginTop: 10 ,fontFamily:'PoppinsMedium'}}>
                   Address: {hod?.address||"Not added"}
                  </Text>
                  <Text size={16} color="#32325D" style={{ marginTop: 10 ,fontFamily:'PoppinsMedium'}}>
                   Phone: {hod?.phone||"Not added"}
                  </Text>
                  <Text size={16} color="#32325D" style={{ marginTop: 10 ,fontFamily:'PoppinsMedium'}}>
                   Email: {hod?.email||"Not added"}
                  </Text>
                </Block>
                <Block middle style={{ marginTop: 30, marginBottom: 16 }}>
                </Block>
              
              </Block>

              {/* <Block style={styles.info}>
                <Block
                  middle
                  row
                  space="evenly"
                  style={{ marginTop: 20, paddingBottom: 24 }}
                >
                  <Button
                    small
                    style={{ backgroundColor: argonTheme.COLORS.INFO }}
                  >
                    CONNECT
                  </Button>
                  <Button
                    small
                    style={{ backgroundColor: argonTheme.COLORS.DEFAULT }}
                  >
                    MESSAGE
                  </Button>
                </Block>
              </Block> */}
            </Block>
          </ScrollView>
      </Block>
     
    </Block>
      </>
    ))}
</>

 
  );
};

const styles = StyleSheet.create({
  profile: {
    marginTop: Platform.OS === "android" ? -HeaderHeight : 0,
    // marginBottom: -HeaderHeight * 2,
    flex: 1
  },
  profileContainer: {
    width: width,
    height: height,
    padding: 0,
    zIndex: 1
  },
  profileBackground: {
    width: width,
    height: height / 2
  },
  profileCard: {
    // position: "relative",
    padding: theme.SIZES.BASE,
    marginHorizontal: theme.SIZES.BASE,
    marginTop: 65,
    // borderTopLeftRadius: 20,
    // borderTopRightRadius: 20,
    borderRadius:15,
    backgroundColor: theme.COLORS.WHITE,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 8,
    shadowOpacity: 0.2,
    zIndex: 2,
    right:10,
    borderWidth:0.5
  },
  info: {
    paddingHorizontal: 40
  },
  avatarContainer: {
    position: "relative",
    marginTop: -80
  },
  avatar: {
    width: 124,
    height: 124,
    borderRadius: 62,
    borderWidth: 0
  },
  nameInfo: {
  },
  divider: {
    width: "90%",
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "#E9ECEF"
  },
  thumb: {  
    borderRadius: 4,
    marginVertical: 4,
    alignSelf: "center",
    width: thumbMeasure,
    height: thumbMeasure
  },
  image2: {
    width: 180,
    height: 180,
    alignSelf: 'center'
},
});

export default Profile;
