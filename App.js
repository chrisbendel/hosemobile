import React, { Component } from 'react';
import {Platform, View, TouchableOpacity } from 'react-native';
import {Container, Text} from "native-base";
import { Actions, Router, Scene, Drawer, Stack } from 'react-native-router-flux';
import EventEmitter from "react-native-eventemitter";
import Player from './src/components/Player';
import Shows from './src/components/Shows';
import Show from './src/components/Show';
import Songs from './src/components/Songs';
import Nav from './src/components/Nav';
import Icon from 'react-native-vector-icons/Ionicons';

console.disableYellowBox = true;

export default class App extends Component {
  constructor(props) {
    super(props);
  }

  closeDrawer = () => {
    this.drawer._root.close()
  };

  openDrawer = () => {
    this.drawer._root.open()
  };

  render() {
    return (
      <Container>
        <Router>
          <Drawer
            drawerIcon={<Icon size={40} style={styles.rightIcon} name="ios-menu"/>} 
            drawerPosition="right"
            key="drawer"
            contentComponent={Nav}
          >
            <Scene titleStyle={{alignSelf: 'center'}} navigationBarStyle={{backgroundColor: '#FFF'}} key="root">
              <Scene key="shows" component={Shows} title="Shows"
                renderLeftButton={() => {
                  return (
                    <TouchableOpacity onPress={() => {
                      Actions.songs({type: 'reset'});
                    }}>
                      <Icon style={styles.leftIcon} size={30} name="ios-musical-notes"/>
                    </TouchableOpacity>
                  );
                }} 
              />
              <Scene key="show" component={Show} title="Show"/>
              <Scene key="songs"  component={Songs} title="Songs" 
                renderLeftButton={() => {
                  return (
                    <TouchableOpacity onPress={() => {
                      Actions.shows({type: 'reset'});
                    }}>
                      <Icon style={styles.leftIcon} size={30} name="ios-albums"/>
                    </TouchableOpacity>
                  );
                }} />
            </Scene>
          </Drawer>
        </Router>
        <Player/>
      </Container>
    );
  }
}

const styles = {
  leftIcon: {
    ...Platform.select({
      ios: {
        margin: -10,
        marginLeft: 10,
      },
      android: {
        marginLeft: 10,
      }
    }),
  },
  rightIcon: {
    ...Platform.select({
      ios: {
        margin: -10,
        marginRight: 10,
      },
      android: {
        marginRight: 10
      }
    }),
  }
}