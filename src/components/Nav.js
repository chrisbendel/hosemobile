import React, { Component } from 'react';
import {
  View,
  Image
} from 'react-native';

import {Actions} from 'react-native-router-flux';

import {
  Content,
  List,
  ListItem,
  Text,
  Icon,
  Left,
  Body,
  Right,
  Thumbnail
} from 'native-base';

export default class Sidebar extends Component {
  render() {
    return (
      <Content style={{paddingTop: 100, backgroundColor: '#FFFFFF'}}>
        <List>
          {/* <ListItem icon onPress={()=>{Actions.passbook()}}>
            <Left>
              <Icon name="paper" />
            </Left>
            <Body >
              <Text>On This Day</Text>
            </Body>
          </ListItem>
          <ListItem icon onPress={()=>{Actions.profile()}}>
            <Left>
              <Icon name="person" />
            </Left>
            <Body>
              <Text>Random Show</Text>
            </Body>
          </ListItem> */}
          <ListItem icon onPress={()=>{Actions.reset('shows')}}>
            <Left>
              <Icon name="ios-albums" />
            </Left>
            <Body>
              <Text>Shows</Text>
            </Body>
          </ListItem>
          <ListItem icon onPress={()=>{Actions.songs()}}>
            <Left>
              <Icon name="ios-musical-notes" />
            </Left>
            <Body>
              <Text>Songs</Text>
            </Body>
          </ListItem>
        </List>
      </Content>
    );
  }
}