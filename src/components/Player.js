import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Button
} from 'react-native';
import {
  Player as audio,
  MediaStates
} from 'react-native-audio-toolkit';

export default class Player extends Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }

  componentWillMount() {

  }

  onPress = () => {
    new audio('https://phish.in/audio/000/018/545/18545.mp3').play();
  }

  render() {

    return (
      <View style={styles.container}>
        <Button title="Play" onPress={() => {
          this.onPress();
        }}> 
          Play
        </Button>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  }
});
