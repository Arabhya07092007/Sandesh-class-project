import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Platform,
  StatusBar,
  Image,
  Dimensions,
  TextInput,
  ImageBackground,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { RFValue } from "react-native-responsive-fontsize";
import * as Google from "expo-google-app-auth";
import firebase from "firebase";
import { Icon } from "react-native-elements";
import db from "../config";

import AppLoading from "expo-app-loading";
import * as Font from "expo-font";
import AsyncStorage from "@react-native-async-storage/async-storage";

let customFonts = {
  bebas: require("../Assests/BebasNeue-Regular.ttf"),
};

export default class AuthScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fontsLoaded: false,
      name: "",
      phoneNumber: "",
    };
  }

  async _loadFontsAsync() {
    await Font.loadAsync(customFonts);
    this.setState({ fontsLoaded: true });
  }

  componentDidMount() {
    this._loadFontsAsync();
  }

  isUserEqual = (googleUser, firebaseUser) => {
    if (firebaseUser) {
      var providerData = firebaseUser.providerData;
      for (var i = 0; i < providerData.length; i++) {
        if (
          providerData[i].providerId ===
            firebase.auth.GoogleAuthProvider.PROVIDER_ID &&
          providerData[i].uid === googleUser.getBasicProfile().getId()
        ) {
          // We don't need to reauth the Firebase connection.
          return true;
        }
      }
    }
    return false;
  };

  onSignIn = (googleUser, name, phoneNumber) => {
    // We need to register an Observer on Firebase Auth to make sure auth is initialized.
    var unsubscribe = firebase.auth().onAuthStateChanged((firebaseUser) => {
      unsubscribe();
      // Check if we are already signed-in Firebase with the correct user.
      if (!this.isUserEqual(googleUser, firebaseUser)) {
        // Build Firebase credential with the Google ID token.
        var credential = firebase.auth.GoogleAuthProvider.credential(
          googleUser.idToken,
          googleUser.accessToken
        );

        var dateVal = new Date();
        var date = dateVal.getDate();
        var month = dateVal.getMonth();
        var year = dateVal.getFullYear();
        var meridian = "";

        if (date < 10) {
          date = "0" + date;
        }
        if (month < 10) {
          month = "0" + month;
        }
        var wholedate = date + "/" + month + "/" + year;
        var hour = dateVal.getHours();
        var minutes = dateVal.getMinutes();

        if (hour < 10) {
          hour = "0" + hour;
        }
        if (minutes < 10) {
          minutes = "0" + minutes;
        }

        if (hour <= 12) {
          meridian = "AM";
        } else {
          meridian = "PM";
        }

        let time = {
          min: minutes,
          hours: hour,
          meridian: meridian,
        };

        // Sign in with credential from the Google user.
        firebase
          .auth()
          .signInWithCredential(credential)
          .then(function (result) {
            if (result.additionalUserInfo.isNewUser) {
              firebase
                .database()
                .ref("/users/" + name)
                .set({
                  gmail: result.user.email,
                  profile_picture: result.additionalUserInfo.profile.picture,
                  locale: result.additionalUserInfo.profile.locale,
                  current_theme: "dark",
                  name: name,
                  phoneNumber: phoneNumber,
                  date: wholedate,
                  time: time,
                  inChat: [name + "-arabhya", name + "-sandesh"],
                })
                .then(function (snapshot) {});
            }
          })
          .catch((error) => {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // The email of the user's account used.
            var email = error.email;
            // The firebase.auth.AuthCredential type that was used.
            var credential = error.credential;
            // ...
          });
      } else {
        console.log("User already signed-in Firebase.");
      }
    });
  };

  signInWithGoogleAsync = async (name, phoneNumber) => {
    try {
      const result = await Google.logInAsync({
        behaviour: "web",
        androidClientId:
          "834765928791-da18lubqeqk6n24ko52ta5ve28lo68qd.apps.googleusercontent.com",
        iosClientId:
          "834765928791-s4r8qq19koqf9cu5urkrlt60edcf6q0k.apps.googleusercontent.com",
        scopes: ["profile", "email"],
      });

      if (result.type === "success") {
        // alert(name);
        this.onSignIn(result, name, phoneNumber);
        this.newChats();
        this.storeData(name);
        this.props.navigation.navigate("HomeScreen", {
          name: name,
          screen: "authScreen",
        });

        return result.accessToken;
      } else {
        return { cancelled: true };
      }
    } catch (e) {
      console.log(e.message);
      return { error: true };
    }
  };

  newChats = () => {
    // alert('function called !');
    let name = this.state.name;
    var inChat = [name + "-arabhya", name + "-sandesh"];
    var intialUsers = ["Arabhya", "Sandesh"];

    var date = new Date();
    var minutes = date.getMinutes();
    var hour = date.getHours();
    var meridian = "";

    if (hour < 10) {
      hour = "0" + hour;
    }
    if (minutes < 10) {
      minutes = "0" + minutes;
    }

    if (hour <= 12) {
      meridian = "AM";
    } else {
      meridian = "PM";
    }
    var time = hour + ":" + minutes + " " + meridian;

    let greeting = [
      "Hey there, I'm Arabhya the developer of this app. I would  feel apriciated if you will give your valuable feedback on this app. 😇🤭",
      "Sandesh is an India's indeginous app for chatting and messaging. Created by Arabhya ",
    ];

    let image = [
      "https://firebasestorage.googleapis.com/v0/b/sandesh-the-chatting-app.appspot.com/o/img1.jpg?alt=media&token=7ace37bc-3b41-451e-9e2e-a84acf5ccdf2",
      "https://firebasestorage.googleapis.com/v0/b/sandesh-the-chatting-app.appspot.com/o/img3.jpg?alt=media&token=ab011e6d-c168-4ed9-90f8-621d7b87ecc7",
    ];

    let st = [
      [5, 1, 1],
      [3, 0, 4],
    ];

    inChat.map((feildName, index) => {
      // db.ref('peoplesChat/' + feildName).set({
      //   blocked: { user1: false, user2: false },
      //   users: {
      //     user1: name,
      //     user2: intialUsers[index],
      //     user1Image: '',
      //     user2Image: image[index],
      //   },
      //   msg: [
      //     [greeting[index], intialUsers[index], time, false, false],
      //     [st[index], intialUsers[index], time, false, true],
      //   ],
      // });

      firebase
        .database()
        .ref("peoplesChat/" + feildName)
        .set({
          blocked: { user1: false, user2: false },
          users: {
            user1: name,
            user2: intialUsers[index],
            user1Image: image[0],
            user2Image: image[1],
          },
          msg: [
            [greeting[index], intialUsers[index], time, false, false],
            [st[index], intialUsers[index], time, false, true],
          ],
        })
        .then(function (snapshot) {});
    });

    // console.log("in new chat!");
  };

  storeData = async (name) => {
    try {
      const jsonValue = JSON.stringify({
        name: name,
      });
      await AsyncStorage.setItem("@storage_Key", jsonValue);
      console.log("stored the value !");
      // alert('stored the value !');
    } catch (e) {
      // console.log(e);
    }
  };

  render() {
    if (!this.state.fontsLoaded) {
      return <AppLoading />;
    } else {
      return (
        <View style={styles.cont}>
          <SafeAreaView style={styles.cont}>
            <ImageBackground
              source={require("../Assests/bg2_img.png")}
              style={styles.bgImg}
            >
              <View style={styles.header}>
                <View>
                  <Text style={styles.txt1}>Sandesh</Text>
                </View>
              </View>

              <View
                style={{
                  width: "90%",
                  alignSelf: "center",
                  paddingLeft: 20,
                  marginTop: 100,
                }}
              >
                <View style={{ marginBottom: 20, marginTop: -40 }}>
                  <Text style={{ fontSize: 15, marginBottom: 10 }}>Name</Text>
                  <View style={{ flexDirection: "row" }}>
                    <Icon
                      name="user"
                      type="feather"
                      color="#517fa4"
                      size={30}
                    />
                    <TextInput
                      style={styles.loginDocs}
                      placeholder=" Name"
                      placeholderTextColor="#554AA8"
                      autoFocus={true}
                      onChangeText={(name) => {
                        this.setState({ name: name });
                      }}
                    />
                  </View>
                  <View style={styles.divider}></View>
                </View>

                <Text style={{ fontSize: 15, marginBottom: 10 }}>Number</Text>
                <View style={{ flexDirection: "row" }}>
                  <Icon
                    name="call-outline"
                    type="ionicon"
                    color="#517fa4"
                    size={30}
                  />
                  <TextInput
                    style={styles.loginDocs}
                    placeholder="+911234567890"
                    autoCompleteType="tel"
                    keyboardType="phone-pad"
                    textContentType="telephoneNumber"
                    onChangeText={(phoneNumber) => {
                      this.setState({ phoneNumber: phoneNumber });
                    }}
                  />
                </View>

                <View style={styles.divider}></View>

                <TouchableOpacity
                  style={
                    this.state.name.length !== 0 &&
                    this.state.phoneNumber.length !== 0
                      ? styles.enabled
                      : styles.disabled
                  }
                  onPress={() => {
                    this.signInWithGoogleAsync(
                      this.state.name,
                      this.state.phoneNumber
                    );
                  }}
                >
                  <Text style={styles.login}>Sign in with Google</Text>
                </TouchableOpacity>
              </View>
            </ImageBackground>
          </SafeAreaView>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  cont: {
    flex: 1,
  },
  txt1: {
    // textAlign: 'center',
    fontSize: RFValue(55),
    // position: 'absolute',
    marginTop: 70,
    // backgroundColor:"lightyellow",
    // marginLeft: 27,
    fontFamily: "bebas",
    color: "white",
    alignSelf: "center",
  },
  bgImg: {
    flex: 1,
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  img: {
    marginTop: 38,
    width: 140,
    height: 60,
    resizeMode: "cover",
    position: "absolute",
  },
  header: {
    // marginLeft: 90,
  },
  loginDocs: {
    flex: 0.9,
    fontSize: 20,
  },
  divider: {
    width: "92%",
    height: 2,
    backgroundColor: "#6250bd",
    marginTop: 6,
  },
  login: {
    fontWeight: "bold",
    fontSize: 20,
    color: "#776EDB",
  },
  enabled: {
    padding: 10,
    margin: 10,
    borderColor: "green",
    borderWidth: 2,
    alignSelf: "center",
    borderRadius: 10,
  },
  disabled: {
    padding: 10,
    margin: 10,
    borderColor: "#DFDFDF",
    borderWidth: 2,
    alignSelf: "center",
    borderRadius: 10,
  },
});
