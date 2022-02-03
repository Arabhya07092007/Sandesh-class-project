import * as React from 'react';
import { Text, View, TouchableOpacity, StyleSheet, Image } from 'react-native';

export default class LoadingScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <View style={styles.cont}>
        <View style={styles.imageCont}>
          <Image source={require('../Assests/Ara.png')} style={styles.img} />
        </View>
        <View>
          <Text style={styles.txt1}>Sandesh</Text>
          <Text style={styles.txt2}>The all new messaging app</Text>
          <Text
            style={{
              textAlign: 'center',
              fontSize: 20,
              fontWeight: 'bold',
              color: 'grey',
            }}>
            fast, free and secure.
          </Text>
        </View>

        <View style={styles.bottombtn}>
          <TouchableOpacity
            onPress={() => {
              this.props.navigation.navigate('AuthScreen');
            }}>
            <Text style={styles.txt3}>Start messaging</Text>
          </TouchableOpacity>
        </View>

        <Text
          style={{
            textAlign: 'center',
            fontSize: 20,
            fontWeight: 'bold',
            color: 'grey',
            marginBottom:20
          }}>
          Made in India !
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  cont: {
    flex: 1,
    marginTop: '40%',
  },

  img: {
    width: 250,
    height: 250,
  },
  imageCont: {
    justifyContent: 'center',
    alignSelf: 'center',
    // flex:2
  },

  txt1: {
    textAlign: 'center',
    fontSize: 30,
    fontWeight: 'bold',
  },
  txt2: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    color: 'grey',
  },

  txt3: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 20,
    marginTop: 50,
    padding: 10,
    backgroundColor: '#2196F3',
    width: 200,
    alignSelf: 'center',
    borderRadius: 10,
    color: 'white',
  },
  bottombtn: {
    flex: 1,
  },
});
