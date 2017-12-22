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
      <Content style={{paddingTop: 100, backgroundColor: '#DCDDD8'}}>
        <List>
          <ListItem style={styles.background} icon onPress={() => {
              // Actions.showStuff();
              Actions.shows({id: 'today'});
            }}>
            <Left>
              <Icon style={styles.text} name="calendar" />
            </Left>
            <Body >
              <Text style={styles.text}>On This Day</Text>
            </Body>
          </ListItem>
          <ListItem style={styles.background} icon onPress={() => {
              Actions.show({id: 'random'})
            }}>
            <Left>
              <Icon style={styles.text} name="person" />
            </Left>
            <Body>
              <Text style={styles.text}>Random Show</Text>
            </Body>
          </ListItem>
          <ListItem style={styles.background} icon onPress={() => {
              Actions.shows({type: 'reset'});
            }}>
            <Left>
              <Icon style={styles.text} name="ios-albums" />
            </Left>
            <Body>
              <Text style={styles.text}>Shows</Text>
            </Body>
          </ListItem>
          <ListItem style={styles.background} icon onPress={() => {
              // Actions.songStuff();
              Actions.songs({type: 'reset'})
            }}>
            <Left>
              <Icon style={styles.text} name="ios-musical-notes" />
            </Left>
            <Body>
              <Text style={styles.text}>Songs</Text>
            </Body>
          </ListItem>
        </List>
      </Content>
    );
  }
}

const styles = {
  background: {
    backgroundColor: '#DCDDD8',
    marginTop: 20
  },
  text: {
    color: '#61A2DA',
    fontSize: 25
  }
}