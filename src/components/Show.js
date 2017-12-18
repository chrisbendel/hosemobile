import React, { Component } from 'react';
import { Platform, StyleSheet, View, FlatList } from 'react-native';
import { Container, List, ListItem, Separator, Header, Content, Card, CardItem, Thumbnail, Text, Button, Icon, Left, Body, Right } from 'native-base';
import {randomShow, show} from './../api/phishin';
import { Actions } from 'react-native-router-flux';
import Spinner from 'react-native-loading-spinner-overlay';
import {CachedImage} from "react-native-img-cache";
import EventEmitter from "react-native-eventemitter";
import Controls from './../Controls';

const msToSec = (time) => {
  var minutes = Math.floor(time / 60000);
  var seconds = ((time % 60000) / 1000).toFixed(0);
  return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
}

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
          Actions.refresh({title: show.date});
          this.setState({show: show});
        });
        
        break;
      default: 
        show(id).then(show => {
          Actions.refresh({title: show.date});
          this.setState({show: show});
        })
        break;
    }
  }

  renderTracksForSet = (tracks, set) => {
    let show = this.state.show;
    return tracks.filter(track => {
      return track.set_name === set;
    }).map(track => {
      return (
        <ListItem key={track.id} icon style={{backgroundColor: 'transparent'}}>
          <Left>
            <Icon active name="play" onPress={() => {
              Controls.play(show, track);
            }}/>
          </Left>
          <Body>
            <Text active note>{track.title}</Text>
          </Body>
          <Right>
            <Text note> {msToSec(track.duration)} </Text>
          </Right>
          <Right>
            <Icon active name="heart">
              <Text> {track.likes_count} </Text>
            </Icon> 
          </Right>
        </ListItem>
      );
    });
  }

  renderTrackContainer = (tracks) => {
    const sets = [...new Set(tracks.map(track => track.set_name))];
    return sets.map(set => {
      return (
        <View key={set}>
          <ListItem style={{backgroundColor: 'transparent'}}>
            <Body>
              <Text>{set}</Text>
            </Body>
          </ListItem>
          {this.renderTracksForSet(tracks, set)}
        </View>
      );
    });
  }

  render() {
    let show = this.state.show;

    if (!show) {
      return (
        <Container>
          <Spinner visible={this.state.loading} textStyle={{color: '#FFF'}} />
        </Container>
      );
    }

    return (
      <Container>
        <CachedImage
          source={{uri: 'https://s3.amazonaws.com/hose/images/' + show.date + '.jpg'}}
          style={styles.showImage}
        />
        <Content>
          {this.renderTrackContainer(show.tracks)}
        </Content>
      </Container>
    );
  }
}

var styles = StyleSheet.create({
  showImage: {
    alignSelf: 'center',
    justifyContent: 'center',
    height: 150,
    width: 150,
  },
});