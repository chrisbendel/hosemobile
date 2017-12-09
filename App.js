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
  Card,
  CardItem,
  Body,
  Content,
  Footer,
  Header,
  Tab,
  Tabs,
  Title,
  Left,
  Icon,
  Right
} from "native-base"
import { DrawerNavigator } from 'react-navigation';
import Player from './src/components/Player';
import Shows from './src/components/Shows';
import Songs from './src/components/Songs';
import Nav from './src/components/Nav';

console.disableYellowBox = true;

export default class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Container>
        <Header hasTabs/>
        <Tabs initialPage={1}>
          <Tab heading="Shows">
            <Shows />
          </Tab>
          <Tab heading="Songs">
            <Songs />
          </Tab>
        </Tabs>
      
        <Footer>
          <Player />
        </Footer>
      </Container>
    );
  }
}
