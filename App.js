import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View
} from 'react-native';
import Player from './src/components/Player';

export default class App extends Component {
  render() {
    return (
      <View>
        <Player />
      </View>
    );
  }
}