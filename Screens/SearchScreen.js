import * as React from 'react';
import {
  Text,
  View,
  StyleSheet,
  StatusBar,
  TextInput,
  Image,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Icon, Divider } from 'react-native-elements';
import { RFValue } from 'react-native-responsive-fontsize';
import Field from '../components/Fields';
import firebase from 'firebase';

export default class SearchScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchText: '',
      searchResult: null,
      currentUserData: null,
      currentUserName: this.props.navigation.getParam('name'),
      info: null,
    };
  }
  searchForResult = async (searchedUser) => {
    firebase
      .database()
      .ref('users/' + searchedUser)
      .on('value', (data) => {
        this.setState({ searchResult: data.val() });
        // console.log(data.val(), "searched for user!");
      });

    firebase
      .database()
      .ref('users/' + this.state.currentUserName)
      .on('value', (data) => {
        this.setState({ currentUserData: data.val() });
        // console.log(data.val(), "data of current user!");
      });
  };
  componentDidMount() {
    this.getUserData();
  }

  getUserData() {
    firebase
      .database()
      .ref('users/' + this.state.currentUserName)
      .on('value', (data) => {
        this.setState({ info: data.val() });
      });
  }

  addNewUser() {
    firebase
      .database()
      .ref(
        'peoplesChat/' +
          this.state.currentUserName +
          '-' +
          this.state.searchResult.name
      )
      .set({
        blocked: { user1: false, user2: false },
        users: {
          user1: this.state.currentUserName,
          user2: this.state.searchResult.name,
          user1Image: this.state.info.profile_picture,
          user2Image: this.state.searchResult.profile_picture,
        },

        msg: [['', this.state.currentUserName, '', false, false]],
      });

    firebase
      .database()
      .ref(
        'users/' +
          this.state.currentUserName +
          '/inChat/' +
          this.state.currentUserData.inChat.length
      )
      .set(this.state.currentUserName + '-' + this.state.searchResult.name);

    firebase
      .database()
      .ref(
        'users/' +
          this.state.searchResult.name +
          '/inChat/' +
          this.state.searchResult.inChat.length
      )
      .set(this.state.currentUserName + '-' + this.state.searchResult.name);

    this.props.navigation.navigate('ChatScreen', {
      name: this.state.currentUserName,
      screen: 'SearchScreen',
      fieldName:
        this.state.currentUserName + '-' + this.state.searchResult.name,
    });
  }

  checkIfChatExist() {
    // console.log(this.state.peoplesChat);
    let checkIf;
    firebase
      .database()
      .ref(
        'peoplesChat/' +
          this.state.currentUserName +
          '-' +
          this.state.searchResult.name +
          '/users/user1'
      )
      .on('value', (data) => {
        // this.setState({ peoplesChat: data.val() });
        checkIf = data.val();
        // console.log(data.val());
      });
    if (checkIf === null || checkIf === undefined) {
      this.addNewUser();
    } else {
      alert('That user already exist in your contact');
      console.log(checkIf);
    }
    // console.log(this.state.currentUserName, this.state.searchText, checkIf);
    // console.log(this.state.peoplesChat);
  }
  render() {
    const searchResult = this.state.searchResult;
    const currentUserData = this.currentUserData;

    return (
      <SafeAreaView style={{ flex: 1,  }}>
        <View style={styles.container}>
          <StatusBar
            animated={true}
            backgroundColor="#655681"
            barStyle={'light-content'}
          />
          <View style={styles.header}>
            <View style={styles.backArrow}>
              <Icon
                name="arrow-left"
                type="feather"
                size={30}
                color="white"
                onPress={() => {
                  this.props.navigation.navigate('HomeScreen', {
                    name: this.props.navigation.getParam('name'),
                    screen: 'SearchScreen',
                  });
                }}
              />
            </View>
            <View
              style={{
                paddingLeft: 20,
                flex: 1,
                justifyContent: 'center',
                paddingRight: 20,
              }}>
              <TextInput
                style={{ fontSize: 22, color: 'white' }}
                autoFocus={true}
                placeholder={'Search people'}
                placeholderTextColor="white"
                value={this.state.searchText}
                onChangeText={(text) => {
                  this.setState({ searchText: text });
                }}
                onSubmitEditing={() => {
                  if (
                    this.state.searchText.length !== 0 &&
                    this.state.searchText !== this.state.currentUserName
                  ) {
                    this.searchForResult(this.state.searchText);
                    // alert(this.state.searchText);
                  } else {
                    alert('Pls fill out the empty field!');
                    this.setState({ searchText: '' });
                  }
                }}
              />
            </View>
            <View style={{ justifyContent: 'center', right: 10 }}>
              <Icon
                name="x"
                type="feather"
                color={this.state.searchText.length == 0 ? '#7D6CA1' : 'white'}
                onPress={() => {
                  this.setState({ searchText: '', searchResult: null });
                }}
                size={30}
              />
            </View>
          </View>

          <View style={{ padding: 10 }}>
            {searchResult !== null ? (
              <View>
                <TouchableOpacity
                  onPress={() => {
                    this.checkIfChatExist();
                  }}>
                  <Divider />
                  <View style={{ flexDirection: 'row' }}>
                    <Image
                      style={{
                        width: 50,
                        height: 50,
                        borderRadius: 50,
                        margin: 5,
                      }}
                      source={{
                        uri: 'https://static.dezeen.com/uploads/2021/06/elon-musk-architect_dezeen_1704_col_0.jpg',
                      }}
                    />
                    <View style={{ justifyContent: 'center' }}>
                      <Text
                        style={{ fontWeight: '700', fontSize: RFValue(20) }}>
                        {searchResult.name}
                      </Text>
                      <Text style={{ fontSize: RFValue(15), color: 'grey' }}>
                        last seen at resently.
                      </Text>
                    </View>
                    <Divider />
                  </View>
                  <Divider />
                </TouchableOpacity>
              </View>
            ) : (
              <View>
                <Text style={{ paddingLeft: 70 }}>
                  Search people over here !
                </Text>
              </View>
            )}
          </View>
          <View style={styles.recentCont}>
            <View style={{ backgroundColor: '#e6e6e6', padding: 4 }}>
              <Text
                style={{ color: 'grey', fontWeight: '700', paddingLeft: 10 }}>
                Recent
              </Text>
            </View>
          </View>
          <View style={{ flex: 1 }}>
            <View style={{ padding: 7 }}>
              {this.state.info ? (
                <View>
                  <View>
                    {this.state.info.inChat.map((data) => {
                      return (
                        <View>
                          <TouchableOpacity
                            onPress={() => {
                              this.props.navigation.navigate('Chat', {
                                name: this.state.currentUserName,
                                screen: 'SearchScreen',
                                fieldName: data,
                              });
                            }}>
                            <Field
                              chatField={data}
                              profileImage={this.state.info.profile_picture}
                            />
                            <Divider />
                          </TouchableOpacity>
                        </View>
                      );
                    })}
                  </View>
                </View>
              ) : (
                <Text>WAiting for value</Text>
              )}
            </View>
          </View>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    // justifyContent:"center",
    flex: 1,
  },
  txt: {
    textAlign: 'center',
  },
  header: {
    flexDirection: 'row',
    backgroundColor: '#7D6CA1',
    padding: 6,
  },
  backArrow: {
    justifyContent: 'center',
    padding: 5,
    paddingLeft: 20,
  },
});
