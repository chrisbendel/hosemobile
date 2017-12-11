import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  View
} from 'react-native';
import {
  Button,
  Text,
  Container,
  Content,
  Footer,
  Left,
  Icon,
  Right
} from "native-base";
import { Actions, Router, Scene, Drawer, Stack } from 'react-native-router-flux';
import EventEmitter from "react-native-eventemitter";
import Player from './src/components/Player';
import Shows from './src/components/Shows';
import Show from './src/components/Show';
import Songs from './src/components/Songs';
import Nav from './src/components/Nav';

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
          <Drawer drawerIcon={<Icon style={{margin: -10, marginRight: 5, fontSize: 40}} name="ios-menu"/>} drawerPosition="right" key="drawer" contentComponent={Nav}>
            <Scene key="showStuff">
              <Scene key="shows" component={Shows} title="All Shows" type="reset"/>
              <Scene key="show" component={Show} title="Show"/>
            </Scene>
            <Scene key="songStuff">
              <Scene key="songs" component={Songs} title="Songs" type="reset"/>
            </Scene>
          </Drawer>
        </Router>
        <Footer style={{height: 75}}>
          <Player/>
        </Footer>
      </Container>
    );
  }
}
