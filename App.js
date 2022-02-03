import * as React from 'react';
import AuthScreen from './Screens/AuthScreen';
import ChatScreen from './Screens/ChatScreen';
import HomeScreen from './Screens/HomeScreen';
import SearchScreen from './Screens/SearchScreen';
import LoadingScreen from './Screens/LoadingScreen';
import CheckScreen from './Screens/Checkscreen';

import * as firebase from "firebase";
import { firebaseConfig } from "./config";

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
} else {
  firebase.app();
}

import { createSwitchNavigator, createAppContainer } from 'react-navigation';

export default class App extends React.Component {
  render() {
    return <AppContainer />;
  }
}

const SwitchNavigator = createSwitchNavigator({
  CheckScreen : CheckScreen,
  LoadingScreen: LoadingScreen,
  AuthScreen: AuthScreen,
  HomeScreen: HomeScreen,
  ChatScreen: ChatScreen,
  SearchScreen: SearchScreen,
});

const AppContainer = createAppContainer(SwitchNavigator);

