import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  View
} from 'react-native';
import { Router, Scene } from 'react-native-router-flux';
import { Drawer, Container, Header, Title, Content, Footer, FooterTab, Button, Left, Right, Body, Icon, Text } from 'native-base';
import Player from './src/components/Player';
import Shows from './src/components/Shows';
import Songs from './src/components/Songs';
import Nav from './src/components/Nav';
console.disableYellowBox = true;

export default class App extends Component {
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
          <Scene key="root">
            <Drawer
              ref={(ref) => { this.drawer = ref }}
              content={<Nav/>}
              onClose={() => this.closeDrawer()} 
            >

                <Header>
                  <Left>
                    <Button
                      transparent
                      onPress={() => {this.openDrawer()}}>
                      <Icon name="menu" />
                    </Button>
                  </Left>
                  <Body>
                    <Title>Header</Title>
                  </Body>
                  <Right />
                </Header>
                <Content>
                  <Scene key="Shows" component={Shows} title="Shows" initial={true} />
                  <Scene key="Songs" component={Songs} title="Songs" />
                </Content>
                <Footer>
                  
                </Footer>
            </Drawer>
          </Scene>
        </Router>
        <Player />
      </Container>
    );
  }
}

const styles = {
  drawer: {
    width: 100,
    backgroundColor: 'blue'
  }
}