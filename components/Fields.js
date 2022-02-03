import * as React from 'react';
import { Text, View, TouchableOpacity, Image, StyleSheet } from 'react-native';
import firebase from 'firebase';
import { RFPercentage, RFValue } from 'react-native-responsive-fontsize';

export default class Field extends React.Component {
  constructor() {
    super();
    this.state = {
      data: null,
    };
  }

  getData = () => {
    firebase
      .database()
      .ref('peoplesChat/' + this.props.chatField)
      .on('value', (data) => {
        this.setState({ data: data.val() });
        // console.log(data.val().msg);
      });
  };

  componentDidMount() {
    this.getData();
  }
  render() {
    // let data = this.state.data;
    return (
      <View style={{ justifyContent: 'center', flexDirection: 'row' }}>
        <Image
          style={{ width: 50, height: 50, borderRadius: 50, margin: 5 }}
          source={{
            uri: this.props.profileImage,
          }}
        />
        <View style={{ margin: 5, flex: 1 }}>
          <View style={{ flexDirection: 'row' }}>
            {this.state.data !== null ? (
              <View
                style={{
                  flex: 1,
                  // backgroundColor: "lightgreen",
                  flexDirection: 'column',
                }}>
                {/* <Text>gjebg ber</Text>
              <Text>gjebg ber</Text> */}
                <View
                  style={{
                    // flex: 1,
                    // backgroundColor: "red",
                    flexDirection: 'row',
                  }}>
                  <Text
                    style={{
                      flex: 1,
                      fontWeight: 'bold',
                      fontSize: RFValue(20),
                    }}>
                    {this.state.data.users.user2}
                  </Text>
                  <Text style={{ color: '#A5A5A7' }}>
                    {this.state.data.msg[this.state.data.msg.length - 1][2]}
                  </Text>
                </View>
                <Text>
                  {typeof this.state.data.msg[
                    this.state.data.msg.length - 1
                  ][0] === 'string' ? (
                    this.state.data.msg[this.state.data.msg.length - 1][1] +
                    ' : ' +
                    this.state.data.msg[
                      this.state.data.msg.length - 1
                    ][0].slice(0, 70)
                  ) : (
                    <Text>
                      {this.state.data.msg[this.state.data.msg.length - 1][1]}:
                      gif
                    </Text>
                  )}
                </Text>
              </View>
            ) : (
              <Text>undefined</Text>
            )}
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  // name: {
  //   flex: 1,
  //   fontWeight: "bold",
  //   fontSize: 20,
  // },
  name: {
    fontWeight: '600',
    fontSize: RFValue(19),
    flex: 1,
  },
});
