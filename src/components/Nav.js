import React, { Component } from 'react';
import {
  View,
  Image,
  Linking,
} from 'react-native';

import {Actions} from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/Ionicons';

import { Content, List, ListItem, Text, Left, Body, Right} from 'native-base';
import { CachedImage } from 'react-native-img-cache';

export default class Sidebar extends Component {
  render() {
    return (
      <Content contentContainerStyle={styles.container}>
        <Image
          source={{uri: 'https://s3.amazonaws.com/hose/images/hose.png'}}
          style={styles.image}
        />
        <List>
          <ListItem style={styles.background} icon onPress={() => {
              Actions.shows({id: 'today'});
            }}>
            <Left>
              <Icon color="#D77186" size={35} name="ios-calendar" />
            </Left>
            <Body >
              <Text style={styles.text}>On This Day</Text>
            </Body>
          </ListItem>
          <ListItem style={styles.background} icon onPress={() => {
              Actions.show({id: 'random'})
            }}>
            <Left>
              <Icon color="#D77186" size={35} name="ios-shuffle" />
            </Left>
            <Body>
              <Text style={styles.text}>Random Show</Text>
            </Body>
          </ListItem>
          <ListItem style={styles.background} icon onPress={() => {
              Actions.songs({type: 'reset'})
            }}>
            <Left>
              <Icon color="#D77186" size={40} name="ios-musical-notes" />
            </Left>
            <Body>
              <Text style={styles.text}>Songs</Text>
            </Body>
          </ListItem>
          <ListItem style={styles.background} icon onPress={() => {
              Actions.shows({type: 'reset'});
            }}>
            <Left>
              <Icon color="#D77186" size={35} name="ios-albums" />
            </Left>
            <Body>
              <Text style={styles.text}>Shows</Text>
            </Body>
          </ListItem>
          <ListItem style={styles.background} icon onPress={() => {
              Linking.openURL('https://www.paypal.me/chrissbendel');
            }}>
            <Left>
              <Icon color="#D77186" size={35} name="ios-cash" />
            </Left>
            <Body>
              <Text style={styles.text}>Donations</Text>
            </Body>
          </ListItem>
        </List>
      </Content>
    );
  }
}

const styles = {
  container: {
    paddingTop: 50,
    display: 'flex',
    backgroundColor: "#FFF",
    justifyContent: 'center'
  },
  background: {
    backgroundColor: '#FFF',
    marginTop: 20,
    borderColor: "#D77186"
  },
  text: {
    color: '#4080B0',
    fontSize: 25
  },
  image: {
    display: 'flex',
    alignSelf: 'center',
    resizeMode: 'contain',
    height: 75,
    width: 75,
  }
}