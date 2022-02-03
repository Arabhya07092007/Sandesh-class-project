import * as React from "react";
import {
  Text,
  View,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Image,
  Dimensions,
  StyleSheet,
  ImageBackground,
} from "react-native";
let ScreenHeight = Dimensions.get("window").height;
let ScreenWidth = Dimensions.get("window").width;
import firebase from "firebase";
import { Icon } from "react-native-elements";
import { BackgroundImage } from "react-native-elements/dist/config";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

export default class BlockChat extends React.Component {
  renderItem = ({ item: data, index: pindex }) => {
    if (data[1] != this.props.name && !data[3]) {
      firebase
        .database()
        .ref(
          "peoplesChat/" + this.props.fieldName + "/" + "msg/" + pindex + "/3"
        )
        .set(true);
    }

    return (
      <View>
        {data[1] === this.props.name ? (
          <View>
            {data[4] ? (
              <View style={styles.sticker}>
                <View style={styles.timeAndSeen}>
                  <Text style={styles.rightTextSticker}>{data[2]}</Text>
                  <View style={{ justifyContent: "flex-end" }}>
                    {data[3] === true ? (
                      <Icon
                        name="checkmark-done-outline"
                        type="ionicon"
                        size={20}
                        color="#775FCE"
                      />
                    ) : (
                      <Icon
                        name="checkmark-outline"
                        type="ionicon"
                        size={20}
                        color="#775FCE"
                      />
                    )}
                  </View>
                </View>
              </View>
            ) : (
              <View>
                {data[0] !== "" ? (
                  <View style={styles.rightBlock}>
                    <Text style={[styles.msg0, { color: "#000" }]}>
                      {data[0]}
                    </Text>

                    <View
                      style={{
                        flexDirection: "row",
                        alignSelf: "flex-end",
                      }}
                    >
                      <Text style={styles.rightText}>{data[2]}</Text>
                      <View
                        style={{
                          justifyContent: "flex-end",

                          alignSelf: "flex-end",
                        }}
                      >
                        {data[3] === true ? (
                          <Icon
                            name="checkmark-done-outline"
                            type="ionicon"
                            size={20}
                            color="#775FCE"
                          />
                        ) : (
                          <Icon
                            name="checkmark-outline"
                            type="ionicon"
                            size={20}
                            color="#775FCE"
                          />
                        )}
                      </View>
                    </View>
                  </View>
                ) : undefined}
              </View>
            )}
          </View>
        ) : (
          <View>
            {data[4] ? (
              <View style={styles.stickerLeft}>
                <Image
                  source={require("../Stickers/1.gif")}
                  style={styles.stickerImage}
                />
                <View style={styles.timeAndSeenLeft}>
                  <Text style={styles.leftTextSticker}>{data[2]}</Text>
                </View>
              </View>
            ) : (
              <View>
                {data[0] !== "" ? (
                  <View style={styles.leftBlock}>
                    <Text style={styles.msg0}>{data[0]}</Text>
                    <Text style={styles.leftText}>{data[2]}</Text>
                  </View>
                ) : undefined}
              </View>
            )}
          </View>
        )}
      </View>
    );
  };

  keyExtractor = (item, index) => index.toString();
  render() {
    let backgroundImages = [
      "https://i.pinimg.com/564x/85/ec/df/85ecdf1c3611ecc9b7fa85282d9526e0.jpg",
      "https://i.pinimg.com/564x/94/8b/3d/948b3de8462265d7e76117557c533ffa.jpg",
      "https://i.pinimg.com/564x/6f/99/1a/6f991a5ce8736f81967180adf1606d23.jpg",
      "https://i.pinimg.com/564x/68/25/f0/6825f03bd7e35becf3256494fe87237d.jpg",
      "https://i.pinimg.com/564x/4e/32/64/4e3264e3d41358abbe2452a60df73f3a.jpg",
      "https://firebasestorage.googleapis.com/v0/b/sandesh-the-chatting-app.appspot.com/o/photo_2021-11-23_22-44-21.jpg?alt=media&token=17627a12-3476-4676-8a66-d12862dd0976",
    ];

    return (
      <ImageBackground
        source={
          // this.props.bgVal
          //   ? require('../assets/Stickers/milkAndMocha/bg8.jpg')
          //   :
          { uri: backgroundImages[3] }
        }
        style={{ flex: 1 }}
      >
        <View style={{ flex: 1, paddingBottom: 10 }}>
          {this.props.data.msg ? (
            <FlatList
              keyExtractor={this.keyExtractor}
              data={this.props.data.msg}
              renderItem={this.renderItem}
              ref={(ref) => {
                this.flatList = ref;
              }}
              onContentSizeChange={() =>
                this.flatList.scrollToEnd({ animated: true })
              }
            />
          ) : undefined}
        </View>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  msg0: {
    textAlign: "left",
    padding: 5,
    fontSize: 16,
  },
  rightBlock: {
    alignSelf: "flex-end",
    marginTop: 10,
    backgroundColor: "#F1EDFB",
    width: "auto",
    marginLeft: 120,
    padding: 3,
    flexDirection: "row",
    borderRadius: 10,
    borderBottomRightRadius: 0,
    marginRight: 10,
    paddingRight: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.9,
    shadowRadius: 6,
    elevation: 3,
  },
  rightText: {
    alignSelf: "flex-end",
    textAlign: "left",
    marginRight: 5,
    fontSize: 10,
    paddingTop: 12,
    color: "#836DDA",
    fontWeight: "700",
  },
  leftBlock: {
    alignSelf: "flex-start",
    marginTop: 10,
    backgroundColor: "#F0F0F0",
    width: "auto",
    padding: 5,
    flexDirection: "row",
    borderRadius: 10,
    borderBottomLeftRadius: 0,
    marginLeft: 10,
    marginRight: 120,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 2,
  },
  leftText: {
    alignSelf: "flex-end",
    textAlign: "right",
    fontSize: 10,
    paddingTop: 12,
    color: "#836DDA",
    fontWeight: "700",
  },
  stickerImage: {
    width: RFValue(130),
    height: RFValue(130),
    //  backgroundColor:"red",
    marginTop: 5,
  },
  sticker: {
    alignSelf: "flex-end",
    marginRight: 10,
    // backgroundColor: "grey",
    // flexDirection: "row",
  },
  timeAndSeen: {
    backgroundColor: "#F1EDFB",
    alignSelf: "flex-end",
    flexDirection: "row",
    borderRadius: 6,
    // paddingVery: 3,
    justifyContent: "center",
    paddingHorizontal: 6,
    paddingVertical: 1,
  },
  rightTextSticker: {
    color: "#836ECC",
    fontSize: 10,
    alignSelf: "center",
    fontWeight: "bold",
  },
  timeAndSeenLeft: {
    flexDirection: "row",

    justifyContent: "flex-start",
    marginLeft: 100,
  },
  leftTextSticker: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 6,
    backgroundColor: "#F1EDFB",
    color: "#836ECC",
    fontSize: 10,
    fontWeight: "bold",
  },
  stickerLeft: {
    marginLeft: 10,
  },
});
