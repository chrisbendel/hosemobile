import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Button
} from 'react-native';
import {
  Player as audio,
  MediaStates
} from 'react-native-audio-toolkit';
import Collapsible from 'react-native-collapsible';
import Icon from 'react-native-vector-icons/Ionicons';
import Dimensions from 'Dimensions';

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

export default class Player extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collapsed: false,
    }
  }

  componentWillMount() {

  }

  onPress = () => {
    new audio('https://phish.in/audio/000/018/545/18545.mp3').play();
  }

  render() {
    console.log(height);
    console.log(this.state.collapsed);
    return (
      <View>
        <Icon name="ios-list" 
          size={75} 
          color="#4F8EF7" 
          onPress={() => {
            
          }}/>
      </View>
    )
  }
}

const styles = {
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
}

