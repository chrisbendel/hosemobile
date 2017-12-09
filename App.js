import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  View
} from 'react-native';
import { Drawer, Container, Header, Title, Content, Footer, FooterTab, Button, Left, Right, Body, Icon, Text } from 'native-base';
import Player from './src/components/Player';
import Nav from './src/components/Nav';

export default class App extends Component {
  closeDrawer = () => {
    this.drawer._root.close()
  };

  openDrawer = () => {
    this.drawer._root.open()
  };

  render() {
    return (
      <Drawer
        ref={(ref) => { this.drawer = ref; }}
        content={<Nav/>}
        onClose={() => this.closeDrawer()} 
      >
        <Container>
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
            <Text>
              This is Content Section
            </Text>
          </Content>
          <Footer>
            <Player />
          </Footer>
        </Container>
      </Drawer>
    );
  }
}