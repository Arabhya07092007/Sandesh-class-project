import * as React from "react";
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Pressable,
  StatusBar,
  SafeAreaView,
} from "react-native";
import { Icon, Divider } from "react-native-elements";
import firebase from "firebase";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import Field from "../components/Fields";

export default class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      info: null,
      name: this.props.navigation.getParam("name"),
      users: null,
      pressable: true,
      profileImageUsers: null,
      profileImage: "",
    };
  }
  receive = async () => {
    await firebase
      .database()
      .ref("users/" + this.state.name)
      .on("value", (data) => {
        this.setState({ info: data.val() });
        // console.log(data.val());
      });

    var ourUsers = null;

    await firebase
      .database()
      .ref("users/")
      .on("value", (data) => {
        // console.log(data.val());
        // this.setState({ users: data.val() });
        ourUsers = data.val();
        // console.log(ourUsers["@arabhya"]);
        this.setState({ users: ourUsers });
        // console.log(data.val());
      });
  };

  componentDidMount() {
    this.receive();
    // console.log(this.state.info, this.state.users);
    // alert(this.state.info, this.state.users);
  }

  setInSecondUser = () => {
    var name = this.state.name;
    if (this.state.users !== null) {
      this.setState({ pressable: false });

      firebase
        .database()
        .ref(
          "users/arabhya/inChat/" + this.state.users["arabhya"]["inChat"].length
        )
        .set(name + "-arabhya");

      firebase
        .database()
        .ref(
          "users/sandesh/inChat/" + this.state.users["sandesh"]["inChat"].length
        )
        .set(name + "-sandesh");
    }
  };

  render() {
    // alert(this.state.info);
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.cont}>
          <Pressable
            style={{ flex: 1 }}
            onPress={() => {
              if (
                this.state.pressable &&
                this.props.navigation.getParam("screen") === "authScreen"
              ) {
                alert("Coming from auth screen ! check in database");
                this.setInSecondUser();
              }
            }}
          >
            <View>
              <StatusBar
                animated={true}
                backgroundColor="#655681"
                barStyle={"light-content"}
              />
              <View
                style={{
                  flexDirection: "row",
                  // paddingTop: 30,
                  backgroundColor: "#7D6CA1",
                }}
              >
                <TouchableOpacity
                  style={{}}
                  onPress={() => {
                    alert("We are still working on this app 🙂😇!");
                  }}
                >
                  <Icon
                    name="menu"
                    type="ionicon"
                    color="white"
                    size={45}
                    iconStyle={{ marginHorizontal: 10 }}
                  />
                </TouchableOpacity>
                <Text
                  style={{
                    fontWeight: "bold",
                    fontSize: RFValue(30),
                    flex: 1,
                    color: "white",
                    paddingLeft: 20,
                    marginTop:2
                  }}
                >
                  Sandesh
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    this.props.navigation.navigate("SearchScreen", {
                      name: this.state.name,
                    });
                  }}
                >
                  <Icon
                    name="search"
                    type="ionicon"
                    color="white"
                    size={35}
                    iconStyle={{ marginHorizontal: 10, marginTop: 7 }}
                  />
                </TouchableOpacity>
              </View>
            </View>
            <View style={{ justifyContent: "center" }}>
              {this.state.info ? (
                <View style={{ justifyContent: "center" }}>
                  {this.state.info.inChat.map((data, index) => {
                    return (
                      <TouchableOpacity
                        onPress={() => {
                          this.props.navigation.navigate("ChatScreen", {
                            name: this.state.name,
                            screen: "HomeScreen",
                            fieldName: data,
                          });
                        }}
                        key={index.toString()}
                        style={{
                          padding: 10,
                          height: RFValue(75),
                          // backgroundColor:"red",
                          marginVertical: 2,
                        }}
                      >
                        <Field
                          chatField={data}
                          profileImage={this.state.info.profile_picture}
                        />
                        <Divider orientation="horizontal" />
                      </TouchableOpacity>
                    );
                  })}
                </View>
              ) : undefined}
            </View>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  cont: {
    flex: 1,
    // justifyContent: 'center',
  },
});
