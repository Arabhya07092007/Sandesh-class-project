import React, { useRef, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  Dimensions,
  Image,
  TextInput,
  Button,
  TouchableOpacity,
  ImageBackground,
  Pressable,
  Modal,
  Animated,
  StatusBar,
  SafeAreaView,
  Keyboard,
  InteractionManager,
  Alert,
} from "react-native";
import { Header, Overlay, Divider, Icon } from "react-native-elements";
let ScreenHeight = Dimensions.get("window").height;
let ScreenWidth = Dimensions.get("window").width;
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import firebase from "firebase";
import BlockChat from "../components/BlockChat";

const style = { fontSize: 18, textAlign: "left", justifyContent: "center" };

const TextView = (props) => {
  const fadeAnim = useRef(new Animated.Value(0)).current; // Initial value for opacity: 0

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 7,
      duration: 400,
    }).start();
  }, [fadeAnim]);

  return (
    <Animated.Text // Special animatable View
      style={{
        ...props.style,
        marginBottom: fadeAnim, // Bind opacity to animated value
      }}
    >
      {props.children}
    </Animated.Text>
  );
};

export default class ChatScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      userDt: {},
      message: "",
      membName: "",
      pressed: false,
      seen: null,
      userName: "Arabhya",
      fieldName: "Arabhya-arabhya",
      emojiVal: false,
      currentSticker: 0,
      keyboardStatus: undefined,
      secondUser: "",
      currentUserTime: null,
      secondUserTime: null,
      bgVal: true,
      profileImageUsers: null,
      profileImage: "",
    };
  }

  getData = () => {
    firebase
      .database()
      .ref("peoplesChat/" + this.props.navigation.getParam("fieldName"))
      .on("value", (data) => {
        this.setState({ userDt: data.val() });
      });
  };

  submitData = () => {
    this.setState({ message: "" });
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

    if (this.state.message !== "") {
      firebase
        .database()
        .ref(
          "peoplesChat/" +
            this.props.navigation.getParam("fieldName") +
            "/" +
            "msg/" +
            this.state.userDt.msg.length +
            "/"
        )
        .set([
          this.state.message,
          this.props.navigation.getParam("name"),
          time,
          false,
          false,
        ]);
    }
  };

  sendSticker(d1, d2, d3) {
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

    firebase
      .database()
      .ref(
        "peoplesChat/" +
          this.props.navigation.getParam("fieldName") +
          "/" +
          "msg/" +
          this.state.userDt.msg.length +
          "/"
      )
      .set([
        [d1, d2, d3],
        this.props.navigation.getParam("name"),
        time,
        false,
        true,
      ]);
  }

  componentDidMount() {
    this.getData();
    // this.setTyping();
    this.findingSecondUser();
    this.getProfileImage();

    // alert(
    //   'type of profile image ' +
    //     typeof this.state.profileImage +
    //     ' : ' +
    //     this.state.profileImage
    // );
    // this.secondUserSet();
    // this.newChats();
    this.keyboardDidShowSubscription = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        this.setState({ keyboardStatus: "Shown" });
      }
    );
    this.keyboardDidHideSubscription = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        this.setState({ keyboardStatus: "Hidden" });
      }
    );
  }
  componentWillUnmount() {
    this.keyboardDidShowSubscription.remove();
    this.keyboardDidHideSubscription.remove();
  }

  inputRef = React.createRef();

  focusInputWithKeyboard() {
    InteractionManager.runAfterInteractions(() => {
      this.inputRef.current.focus();
    });
  }

  findingSecondUser() {
    // console.log("we are in set typing!");
    let myName = this.props.navigation.getParam("name");
    let BothUsers = [];
    // console.log(this.props.navigation.getParam("fieldName"));
    // console.log(this.props.navigation.getParam("fieldName").split("-"));

    BothUsers = this.props.navigation.getParam("fieldName").split("-");

    if (BothUsers[0] === this.props.navigation.getParam("name")) {
      this.setState({ secondUser: BothUsers[1] });
      this.getUsersTime(BothUsers[1]);
    } else {
      this.setState({ secondUser: BothUsers[0] });
      this.getUsersTime(BothUsers[0]);
    }

    // console.log(this.state.secondUser);
  }

  getUsersTime(secondUser) {
    firebase
      .database()
      .ref("users/" + this.props.navigation.getParam("name") + "/time")
      .on("value", (data) => {
        this.setState({ currentUserTime: data.val() });
        console.log(data.val());
      });

    // console.clear();

    firebase
      .database()
      .ref("users/" + secondUser + "/time")
      .on("value", (data) => {
        this.setState({ secondUserTime: data.val() });
        console.log(data.val());
      });

    // console.log("the second user " + secondUser);
  }

  setTyping() {
    let myName = this.props.navigation.getParam("name");
    if (this.state.message !== "" && this.state.emojiVal != true) {
      // console.log("typing!");
      firebase
        .database()
        .ref(
          "peoplesChat/" +
            this.props.navigation.getParam("fieldName") +
            "/" +
            myName
        )
        .set("typing");
    } else if (this.state.emojiVal != true) {
      firebase
        .database()
        .ref(
          "peoplesChat/" +
            this.props.navigation.getParam("fieldName") +
            "/" +
            myName
        )
        .set("notTyping");
    }

    var date = new Date();
    var minutes = date.getMinutes();
    var hour = date.getHours();
    var meridian = "";

    if (hour <= 12) {
      meridian = "AM";
    } else {
      meridian = "PM";
    }
    // var time = hour + ":" + minutes + " " + meridian;
    let time = {
      min: minutes,
      hours: hour,
      meridian: meridian,
    };

    // console.log(time);

    // db.ref(
    //   "peoplesChat/" +
    //     this.props.navigation.getParam("fieldName") +
    //     "/" +
    //     this.props.navigation.getParam("name") +
    //     "Time"
    // ).set(time);

    firebase
      .database()
      .ref("users/" + this.props.navigation.getParam("name") + "/time")
      .set(time);
  }

  choosingStickers() {
    firebase
      .database()
      .ref(
        "peoplesChat/" +
          this.props.navigation.getParam("fieldName") +
          "/" +
          this.props.navigation.getParam("name")
      )
      .set("Choosing stickers");
  }

  getProfileImage() {
    firebase
      .database()
      .ref(
        "peoplesChat/" + this.props.navigation.getParam("fieldName") + "/users"
      )
      .on("value", (data) => {
        this.setState({ profileImageUsers: data.val() });
        // alert('its working' + data.val().user1Image);
        if (data.val().user1 === this.props.navigation.getParam("name")) {
          this.setState({ profileImage: data.val().users2Image });
          // alert('Profile image 2' + data.val().user2Image);
        } else {
          this.setState({ profileImage: data.val().users1Image });
          // alert('Profile image 1' + data.val().user1Image);
        }
      });
  }

  render() {
    // console.log(this.props.userName);
    this.setTyping();
    // this.getProfileImage();

    // console.log("the second user!");
    // console.log(
    //   this.state.secondUser +
    //     " second user data " +
    //     this.state.userDt.secondUser
    // );

    if (this.state.emojiVal) {
      this.choosingStickers();
    }
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

    // currentUserTime = this.state.currentSticker

    // let sticker = [
    //   [
    //     [
    //       require("../Stickers/1.gif"),
    //       require("../Stickers/2.gif"),
    //       require("../Stickers/3.gif"),
    //       require("../Stickers/4.gif"),
    //       require("../Stickers/5.gif"),
    //     ],
    //     [
    //       require("../Stickers/6.gif"),
    //       require("../Stickers/7.gif"),
    //       require("../Stickers/8.gif"),
    //       require("../Stickers/9.gif"),
    //       require("../Stickers/10.png"),
    //     ],
    //   ],
    //   [
    //     [
    //       require("../Stickers/11.png"),
    //       require("../Stickers/12.png"),
    //       require("../Stickers/13.png"),
    //       require("../Stickers/14.png"),
    //       require("../Stickers/15.png"),
    //     ],
    //     [
    //       require("../Stickers/16.png"),
    //       require("../Stickers/17.png"),
    //       require("../Stickers/18.png"),
    //       require("../Stickers/19.png"),
    //       require("../Stickers/20.png"),
    //     ],
    //   ],
    // ];

    return (
      <SafeAreaView
        style={{
          flex: 1,
          flexDirection: "column",
          backgroundColor: "#fff",
        
        }}
      >
        <StatusBar
          animated={true}
          backgroundColor="#655681"
          barStyle={"light-content"}
        />

        <View style={styles.header}>
          <View style={styles.backArrow}>
            <Icon
              name="arrow-left"
              type="feather"
              size={30}
              color="white"
              onPress={() => {
                this.props.navigation.navigate("HomeScreen", {
                  name: this.props.navigation.getParam("name"),
                  screen: "ChatScreen",
                });
              }}
            />
          </View>
          <View style={styles.imgCont}>
            {this.state.profileImage ? (
              <Image
                style={styles.avatarImg}
                source={this.state.profileImage}
              />
            ) : (
              <Image
                style={styles.avatarImg}
                source={{
                  uri: "https://static.dezeen.com/uploads/2021/06/elon-musk-architect_dezeen_1704_col_0.jpg",
                }}
              />
            )}
          </View>

          <View style={styles.headerTitle}>
            {this.state.userDt.users ? (
              <View style={{}}>
                <Text style={styles.txt1}>{this.state.userDt.users.user2}</Text>
                <View>
                  {this.state.currentUserTime !== null &&
                  this.state.secondUserTime !== null
                    ? console.log("we have the value")
                    : undefined}
                </View>
              </View>
            ) : (
              <Text style={styles.txt1}>Loding...</Text>
            )}
          </View>
          <View style={styles.settingsCont}>
            <TouchableOpacity
              style={styles.settingBtn}
              onPress={() => {
                this.setState({ pressed: true });
              }}
            >
              {/* <Image
                style={{ height: 50, width: 50 }}
                source={{
                  uri: "https://icon-library.com/images/3-dot-icon/3-dot-icon-0.jpg",
                }}
              /> */}
              <Icon
                name="more-vertical"
                type="feather"
                size={30}
                color="white"
              />
            </TouchableOpacity>
          </View>
        </View>

        <View
          style={{
            borderWidth: 1,
            borderColor: "#D6D6D6",
            borderBottomWidth: 0,
            shadowColor: "#000000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.9,
            elevation: 2,
            width: "100%",
            height: 0.5,
          }}
        />

        <BlockChat
          data={this.state.userDt}
          name={this.props.navigation.getParam("name")}
          fieldName={this.props.navigation.getParam("fieldName")}
          // sticker={sticker}
          bgVal={this.state.bgVal}
        />

        <View style={styles.txtInput}>
          <View style={styles.enterText}>
            <TouchableOpacity
              style={{ justifyContent: "center" }}
              onPress={() => {
                // this.setState({ emojiVal: !this.state.emojiVal });
                // // Keyboard.dismiss();
                // // this.focusInputWithKeyboard();
                // if (this.state.keyboardStatus === "Shown") {
                //   Keyboard.dismiss();
                // } else {
                //   this.focusInputWithKeyboard();
                // }

                alert("we still still working on this app!");
              }}
            >
              <Icon name="smile" type="feather" size={RFValue(27)} />
            </TouchableOpacity>
            <View style={{ flex: 1, justifyContent: "center" }}>
              <TextInput
                style={{
                  fontSize: RFValue(20),
                  // width: "60%",
                  paddingLeft: 10,
                  paddingRight: 10,
                  // marginBottom: 10,
                  height: RFValue(50),
                }}
                ref={this.inputRef}
                // multiline={true}
                onFocus={() => {
                  this.setState({ emojiVal: false });
                }}
                underLineColorAndroid="transparent"
                placeholder="Message"
                placeholderTextColor="#a3a3a3"
                value={this.state.message}
                onChangeText={(text) => this.setState({ message: text })}
              />
            </View>
          </View>
          <View style={{ flexDirection: "row", marginTop: 5 }}>
            <View style={{ justifyContent: "center" }}>
              <View style={styles.sendFile}>
                <Icon
                  name="paperclip"
                  type="feather"
                  size={30}
                  color="#000000"
                  onPress={() => {
                    // this.props.navigation.navigate("Home", {
                    //   name: this.props.navigation.getParam("name"),
                    //   screen: "ChatScreen",
                    // });
                  }}
                />
              </View>
            </View>

            <TouchableOpacity>
              <View style={styles.send}>
                <Icon
                  name="send"
                  type="ionicons"
                  size={30}
                  color="#000000"
                  onPress={() => {
                    this.submitData();
                    this.setState({ message: "" });
                  }}
                />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <Overlay
          backdropStyle={{ backgroundColor: "#dcdcdc00", borderRadius: 100 }}
          animationType="fade"
          overlayStyle={styles.modalView}
          transparent={true}
          visible={this.state.pressed}
          onBackdropPress={() => {
            this.setState({ pressed: false });
          }}
          onRequestClose={() => {
            this.setState({ pressed: false });
          }}
        >
          <View>
            <TextView style={style}>Delete chat</TextView>
            <TextView style={style}>Block</TextView>
            <TextView style={style}>Call</TextView>
            <TextView style={style}>Video Call</TextView>
            <TouchableOpacity
              onPress={() => this.setState({ bgVal: !this.state.bgVal })}
            >
              <TextView style={style}>Change theme</TextView>
            </TouchableOpacity>
          </View>
        </Overlay>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    width: "100%",
    alignSelf: "center",
    backgroundColor: "#7D6CA1",
  },
  txt1: {
    fontSize: RFValue(10),
    // marginTop: -3,
    fontWeight: "700",
    fontSize: RFValue(25),
    color: "white",
    paddingLeft: 10,
  },
  msg0: {
    textAlign: "left",
    padding: 5,
    fontSize: 16,
  },
  txtInput: {
    flexDirection: "row",
    padding: 10,
    // position: "absolute",
    // bottom: 0,
    // width: 400,
    borderTopWidth: 2,
    borderBottomWidth: 2,
    borderColor: "#F0F0F0",
  },
  backimg: {
    width: 35,
    height: 35,
    marginTop: 13,
    left: 10,
  },
  modalView: {
    position: "absolute",
    top: -4,
    right: 0,
    margin: 20,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  backArrow: {
    justifyContent: "center",
    padding: 10,
    paddingLeft: 20,
  },
  avatarImg: {
    width: 50,
    height: 50,
    borderRadius: 50,
    margin: 3,
    justifyContent: "center",
  },
  imgCont: {
    // backgroundColor:"lightgreen",
    // borderRadius:50,
    // borderColor:"black",
    // borderWidth:0.07
  },
  headerTitle: {
    // backgroundColor: "lightgreen",
    justifyContent: "center",
    flex: 1,
  },
  settingsCont: {
    // backgroundColor: "green",
    paddingHorizontal: 10,
    justifyContent: "center",
  },
  settingBtn: {
    // flex: 1,
    // right: -30,
    justifyContent: "center",
    // backgroundColor: "red",
  },
  send: {},
  sendFile: {
    marginRight: 20,
  },
  enterText: {
    flexDirection: "row",
    // backgroundColor:"lightgreen",
    flex: 1,
  },

  emojiView: {
    // padding: 10,
  },
  selectStickers: {
    // justifyContent: "center",
    flexDirection: "row",
    alignSelf: "center",
    // flex:1
  },
  online: {
    color: "white",
    fontSize: RFValue(12),
    fontWeight: "700",
    // textAlign:"center"
    paddingLeft: 10,
  },
});

/*
import React, { useRef, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  Dimensions,
  Image,
  TextInput,
  Button,
  TouchableOpacity,
  ImageBackground,
  Pressable,
  Modal,
  Animated,
  StatusBar,
} from "react-native";
import { Header, Overlay, Divider, Icon } from "react-native-elements";
import db from "./config";
let ScreenHeight = Dimensions.get("window").height;
let ScreenWidth = Dimensions.get("window").width;

const style = { fontSize: 18, textAlign: "left", justifyContent: "center" };

const TextView = (props) => {
  const fadeAnim = useRef(new Animated.Value(0)).current; // Initial value for opacity: 0

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 7,
      duration: 400,
    }).start();
  }, [fadeAnim]);

  return (
    <Animated.Text // Special animatable View
      style={{
        ...props.style,
        marginBottom: fadeAnim, // Bind opacity to animated value
      }}
    >
      {props.children}
    </Animated.Text>
  );
};

export default class Sandesh extends React.Component {
  constructor() {
    super();
    this.state = {
      userDt: {},
      message: "",
      membName: "",
      pressed: false,
      seen: null,
    };
  }

  getData = () => {
    db.ref("groups/" + this.props.userName).on("value", (data) => {
      this.setState({ userDt: data.val() });
    });
  };

  submitData = () => {
    var date = new Date();
    var minutes = date.getMinutes();
    var hour = date.getHours();

    if (hour < 10) {
      hour = "0" + hour;
    }
    if (minutes < 10) {
      minutes = "0" + minutes;
    }
    var time = hour + ":" + minutes;

    if (this.state.message !== "") {
      db.ref(
        "groups/" +
          this.props.userName +
          "/msg/" +
          this.state.userDt.msg.length +
          "/"
      ).set([this.state.message, "ani", time, 1]);
    }
  };

  seen = () => {
    // db.ref('groups/ara-ani/msg/').on('value', (data) => {
    //   this.setState({ seen: data.val() });
    // });

    // if (this.state.seen !== null) {
    //   for (var i = 0; i < this.state.seen.length; i++) {
    //     // if(this.state.seen.)
    //     db.ref('groups/ara-ani/msg/' + i + '/'[3]).update(1);
    //   }
    // }

    var msg = this.state.userDt;
  };


  componentDidMount() {
    this.getData();
    // this.secondUserSet();
    // this.newChats();
  }

  render() {
    console.log(this.props.userName);

    return (
      <View
        style={{ flex: 1, flexDirection: "column", backgroundColor: "#fff" }}
      >
        <StatusBar
          animated={true}
          backgroundColor="#F0F0F0"
          barStyle={"dark-content"}
        />

        <Header backgroundColor="#fff">
          <View style={styles.header}>
            <Icon
              name="arrow-back-outline"
              type="ionicon"
              size={35}
              style={{ justifyContent: "center", flex: 1 }}
              color="#000000"
            />

            <Image
              style={{
                width: 50,
                height: 50,
                borderRadius: 50,
                margin: 3,
                marginLeft: 25,
                justifyContent: "center",
                backgroundColor: "green",
              }}
              source={{
                uri: "https://github.com/Arabhya07092007/image/blob/main/Arabhaya3.jpeg?raw=true",
              }}
            />

            <View>
              {this.state.userDt.users ? (
                <Text style={styles.txt1}>{this.state.userDt.users.user1}</Text>
              ) : (
                <Text style={styles.txt1}>loding...</Text>
              )}
            </View>
            <TouchableOpacity
              style={{ flex: 1, right: -30, justifyContent: "center" }}
              onPress={() => {
                this.setState({ pressed: true });
              }}
            >
              <Image
                style={{ height: 50, width: 50 }}
                source={{
                  uri: "https://icon-library.com/images/3-dot-icon/3-dot-icon-0.jpg",
                }}
              />
            </TouchableOpacity>
          </View>
        </Header>
        <View
          style={{
            borderWidth: 1,
            borderColor: "#D6D6D6",
            borderBottomWidth: 0,
            shadowColor: "#000000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.9,
            elevation: 2,
            width: "100%",
            height: 0.5,
          }}
        />

        <View style={{ flex: 1, marginBottom: 63 }}>
          {this.state.userDt.msg ? (
            <ScrollView
              style={{
                height: ScreenHeight - 170,
              }}
              ref={(ref) => {
                this.scrollView = ref;
              }}
              onContentSizeChange={() =>
                this.scrollView.scrollToEnd({ animated: true })
              }
            >
              {this.state.userDt.msg.map((data) => {
                return (
                  <View>
                    {data[1] === "ani" ? (
                      <View
                        style={{
                          alignSelf: "flex-end",
                          marginTop: 10,
                          backgroundColor: "#6087DA",
                          width: "auto",
                          marginLeft: 100,
                          padding: 3,
                          flexDirection: "row",
                          borderRadius: 10,
                          borderBottomRightRadius: 0,
                          marginRight: 10,
                          paddingRight: 10,
                        }}
                      >
                        <Text style={[styles.msg0, { color: "#fff" }]}>
                          {data[0]}
                        </Text>
                        <Text
                          style={{
                            alignSelf: "flex-end",
                            textAlign: "left",
                            marginRight: 5,
                            fontSize: 12,
                            paddingTop: 12,
                            color: "#fff",
                          }}
                        >
                          {data[2]}
                        </Text>
                        <Image
                          style={{ width: 20, height: 20, marginTop: 15 }}
                          source={
                            data[3] === 1
                              ? {
                                  uri: "https://snack-code-uploads.s3.us-west-1.amazonaws.com/~asset/f1548e255066cf506b47109ef5cb07b4",
                                }
                              : {
                                  uri: "https://snack-code-uploads.s3.us-west-1.amazonaws.com/~asset/581b8d7f0f331d6502b287f24e6f3970",
                                }
                          }
                        />
                      </View>
                    ) : (
                      <View
                        style={{
                          alignSelf: "flex-start",
                          marginTop: 10,
                          backgroundColor: "#F0F0F0",
                          width: "auto",
                          padding: 5,
                          flexDirection: "row",
                          borderRadius: 10,
                          borderBottomLeftRadius: 0,
                          marginLeft: 10,
                        }}
                      >
                        <Text style={styles.msg0}>{data[0]}</Text>
                        <Text
                          style={{
                            alignSelf: "flex-start",
                            textAlign: "right",
                            fontSize: 14,
                            paddingTop: 12,
                          }}
                        >
                          {data[2]}
                        </Text>
                      </View>
                    )}
                  </View>
                );
              })}
            </ScrollView>
          ) : undefined}
        </View>

        <View style={styles.txtInput}>
          <Text style={{ fontSize: 26 }}>🙂</Text>
          <TextInput
            style={{
              marginLeft: 10,
              marginRight: 10,
              fontSize: 23,
              width: "60%",
              paddingLeft: 10,
              paddingRight: 10,
            }}
            underLineColorAndroid="transparent"
            placeholder="Message"
            placeholderTextColor="indigo"
            value={this.state.message}
            onChangeText={(text) => this.setState({ message: text })}
          />
          <View style={{ flexDirection: "row", marginTop: 5 }}>
            <Image
              style={{ width: 25, height: 25 }}
              source={{
                uri: "https://image.flaticon.com/icons/png/512/88/88026.png",
              }}
            />

            <TouchableOpacity
              onPress={() => {
                this.submitData();
                this.setState({ message: "" });
              }}
            >
              <Image
                style={{ width: 25, height: 25, marginLeft: 15 }}
                source={{
                  uri: "https://image.flaticon.com/icons/png/512/60/60758.png",
                }}
              />
            </TouchableOpacity>
          </View>
        </View>

        <Overlay
          backdropStyle={{ backgroundColor: "#dcdcdc00", borderRadius: 100 }}
          animationType="fade"
          overlayStyle={styles.modalView}
          transparent={true}
          visible={this.state.pressed}
          onBackdropPress={() => {
            this.setState({ pressed: false });
          }}
          onRequestClose={() => {
            this.setState({ pressed: false });
          }}
        >
          <View>
            <TextView style={style}>Delete chat</TextView>
            <TextView style={style}>Block</TextView>
            <TextView style={style}>Call</TextView>
            <TextView style={style}>Video Call</TextView>
            <TouchableOpacity onPress={() => this.seen()}>
              <TextView style={style}>Close</TextView>
            </TouchableOpacity>
          </View>
        </Overlay>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    width: "100%",
    alignSelf: "center",
  },
  txt1: {
    fontSize: 30,
    width: "100%",
    padding: 10,
    marginTop: -3,
    marginLeft: 8,
  },
  msg0: {
    textAlign: "left",
    padding: 5,
    fontSize: 16,
  },
  txtInput: {
    flexDirection: "row",
    padding: 10,
    position: "absolute",
    bottom: 0,
    width: 400,
    borderTopWidth: 2,
    borderBottomWidth: 2,
    borderColor: "#F0F0F0",
  },
  backimg: {
    width: 35,
    height: 35,
    marginTop: 13,
    left: 10,
  },
  modalView: {
    position: "absolute",
    top: -4,
    right: 0,
    margin: 20,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});

 */

// /* <View> */
// /* {this.state.userDt.msg ? ( */
//   /* <ScrollView */
//     // style={{
//       // height: ScreenHeight - 170,
//     // }}
//     // ref={(ref) => {
//       // this.scrollView = ref;
//     // }}
//     // onContentSizeChange={() =>
//       // this.scrollView.scrollToEnd({ animated: true })
//     // }
//   // >
//     /* {this.state.userDt.msg.map((data) => {})} */

//   /* </ScrollView> */
// /* ) : undefined} */
// // </View>

/**
  user1Typing 
  user2Typing 


   state.Which =""
   merausername
   mugdhakausername 


   TheUnknownGuy:false

   db pe apne naam ref karunga and typing koset karunga 

   agar message = true
   tab typing
   agar nhi udefined

   To display is mughda typing i will first check if she's typing or not 

   to check typing 
   db.ref(chatField/mugdhaStatus)
  
   And is have the value in the state then is will 
   display the text
   <Text>{this.state.mugdha typing }</Text>





    if(userDt.user1 === myName){
     this.setState({which:[user1, user2]})
    }else{
    this.setState({which:[user2, user1]})
    }

    if(this.state.message.length !== 0){
       db.ref("chatField/+which+Typing").set(true);
    }else{
      db.ref("chatField/+which+Typing").set(true);
    }


    <Text>{which == user1 ? }</Text>
    <Text>{userDt[whichUser[1]]}</Text>

    Online 


    db.ref(myusername/time).set(15:56)

    // online status mugdha 

    usersname chahiye field mugdha ka online status dekhne ke liye 

    abb username lene ke liye ham 
    userDt.users.whichUser  this is the username of second user "mugdha"

    aab check karna hai ki second user (mugdha) ka online status -time as field
    Mugdha'sUserName = userDt.users.whichUser
    db.ref(mugdha'sUserName).on((value, data)=>{
      Mugdha'sOnlineStatus:data.time
    })

    <Text>{Mugdha'sOnlineStatus}</Text>


    // this is the online offline status code 


                    <View>
                  {this.state.userDt[this.state.secondUser + "Time"] ===
                  time ? (
                    <View>
                      <View>
                        {this.state.userDt[this.state.secondUser] ===
                        "typing" ? (
                          <Text style={styles.online}>
                            {this.state.userDt[this.state.secondUser]}
                          </Text>
                        ) : undefined}
                      </View>
                      <View>
                        {this.state.userDt[this.state.secondUser] ===
                        "Choosing stickers" ? (
                          <Text style={styles.online}>
                            {this.state.userDt[this.state.secondUser]}
                          </Text>
                        ) : undefined}
                      </View>
                      <View>
                        {this.state.userDt[this.state.secondUser] ===
                        "notTyping" ? (
                          this.state.userDt[this.state.secondUser + "Time"] ===
                          time ? (
                            <Text style={styles.online}>Online</Text>
                          ) : (
                            <Text style={styles.online}>
                              {
                                this.state.userDt[
                                  this.state.secondUser + "Time"
                                ]
                              }
                            </Text>
                          )
                        ) : undefined}
                      </View>
                    </View>
                  ) : (
                    <Text style={styles.online}>
                      Last seen at{" "}
                      {this.state.userDt[this.state.secondUser + "Time"]}
                    </Text>
                  )}
                </View>

 */
