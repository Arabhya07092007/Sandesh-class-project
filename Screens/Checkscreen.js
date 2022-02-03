import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import firebase from 'firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class CheckScreen extends Component {
  constructor() {
    super();
    this.setState({
      name: '',
    });
  }
  componentDidMount() {
    this.getData();
    this.checkIfLoggedIn();
  }

  checkIfLoggedIn = () => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user && this.state.name.length !== 0) {
        // alert('sign successful!!!.... ' + this.state.name);
        this.props.navigation.navigate('HomeScreen', {
          name: this.state.name,
          screen: 'checkScreen',
        });
      } else {
        // alert('Async storage does not contain data !');
        this.props.navigation.navigate('LoadingScreen');
      }
    });
  };

  getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('@storage_Key');
      return jsonValue != null
        ? (JSON.parse(jsonValue),
          // console.log(JSON.parse(jsonValue)),
          this.setState({
            name: JSON.parse(jsonValue).name,
            data: true,
          }))
        : (this.setState({ data: false }), console.log(this.state.data, false));
    } catch (e) {
      console.log(e);
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <Text>Loading..</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
