import React, { Component } from 'react';
import { Platform, StyleSheet, View, FlatList } from 'react-native';
import { Container, List, ListItem, Separator, Header, Content, Card, CardItem, Thumbnail, Text, Button, Icon, Left, Body, Right } from 'native-base';
import {randomShow, show} from './../api/phishin';
import {trackJamcharts} from './../Filters';
import { Actions } from 'react-native-router-flux';
import Spinner from 'react-native-loading-spinner-overlay';
import {CachedImage} from "react-native-img-cache";
import EventEmitter from "react-native-eventemitter";
import Controls from './../Controls';

const isJamchart = (id) => {
  return (trackJamcharts.indexOf(id) !== -1);
}

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
    this.setState({loading: true})
    switch (id) {
      case 'random':
        randomShow().then(show => {
          Actions.refresh({title: show.date});
          this.setState({
            show: show,
            loading: false
          });
        });
        
        break;
      default: 
        show(id).then(show => {
          Actions.refresh({title: show.date});
          this.setState({
            show: show,
            loading: false
          });
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
            <Text style={{fontSize: 12}}>{track.title}</Text>
          </Body>
          <Right style={styles.listItemContent}>
            <Text note>{isJamchart(track.id) ? "Jamcharts" : ""}</Text>
          </Right>
          <Right style={styles.listItemContent}>
            <Text note> {msToSec(track.duration)} </Text>
          </Right>
          <Right style={styles.listItemContent}>
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

    console.log(show);

    return (
      <Container style={{backgroundColor: '#DCDDD8'}}>
        <View style={styles.showContainer}>
          <CachedImage
            source={{uri: 'https://s3.amazonaws.com/hose/images/' + show.date + '.jpg'}}
            style={styles.showImage}
          />
          <View style={styles.showInfo}>
            <Text style={{fontSize: 16, fontWeight: 'bold'}}>{show.date}</Text>
            <Text>{show.venue.name}</Text>
            <Text>{show.venue.location}</Text>
            <Icon name="heart">
              {show.likes_count}
            </Icon>
            {show.tags && 
              show.tags.map(tag => {
                return <Text key={tag}>{tag}</Text>
              })
            }
          </View>
        </View>
        <Content>
          {this.renderTrackContainer(show.tracks)}
        </Content>
      </Container>
    );
  }
}

var styles = StyleSheet.create({
  showContainer: {
    display: 'flex',
    flexDirection: 'row',
    padding: 5
  },
  showInfo: {
    display: 'flex',
    flexDirection: 'column',
    padding: 20
  },
  listItemContent: {
    marginLeft: 5
  },
  showImage: {
    alignSelf: 'center',
    justifyContent: 'center',
    height: 125,
    width: 125,
  }
});