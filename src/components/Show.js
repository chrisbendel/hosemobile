import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View
} from 'react-native';
import {randomShow, show} from './../api/phishin';

export default class Show extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: null
    }
  }

  componentWillMount() {
    let id = this.props.id;
    switch (id) {
      case 'random':
        randomShow().then(show => {
          this.setState({show: show});
        })
        break;
      default: 
        show(id).then(show => {
          this.setState({show: show});
        })
        break;
    }
  }

  render() {
    return (
      <View>
        <Text> Songs </Text>
      </View>
    );
  }
}