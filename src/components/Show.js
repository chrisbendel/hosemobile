import React, { Component } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { Container, Header, Content, Card, CardItem, Thumbnail, Text, Button, Icon, Left, Body, Right } from 'native-base';
import {randomShow, show} from './../api/phishin';
import { Actions } from 'react-native-router-flux';
import Spinner from 'react-native-loading-spinner-overlay';
import {CachedImage} from "react-native-img-cache";

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

  render() {
    let show = this.state.show;
    if (!show) {
      return (
        // <View style={{ flex: 1 }}>
        <Container>
          <Spinner visible={this.state.loading} textStyle={{color: '#FFF'}} />
        </Container>
        // </View>
      );
    }
    return (
      <Container>
        <Card>
          <CardItem cardBody>
            <CachedImage
              source={{uri: 'https://s3.amazonaws.com/hose/images/' + show.date + '.jpg'}}
              style={styles.showImage}
            />
          </CardItem>
          <CardItem>
              <Body>
                <Text>NativeBase</Text>
                <Text note>GeekyAnts</Text>
              </Body>
          </CardItem>
          <CardItem>
            <Left>
              <Button transparent>
                <Icon name="thumbs-up" />
                <Text>{show.likes_count} Likes</Text>
              </Button>
            </Left>
            <Body>
              <Button transparent>
                <Icon active name="chatbubbles" />
                <Text>4 Comments</Text>
              </Button>
            </Body>
            <Right>
              <Text>11h ago</Text>
            </Right>
          </CardItem>
        </Card>
      </Container>
    );
  }
}

var styles = StyleSheet.create({
  showImage: {
    flex: 1,
    height: 150,
    resizeMode: 'contain'
  },
});