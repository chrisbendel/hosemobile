import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  View,
  Image,
  Dimensions,
  TouchableOpacity,
  FlatList
} from 'react-native';
import {
  List, 
  ListItem,
  Text,
  Container, 
  Spinner, 
  Card, 
  CardItem,
  Left, 
  Right,
  Body, 
  Button,
  Icon
} from 'native-base';
import {shows} from './../api/phishin';
import ModalFilterPicker from 'react-native-modal-filter-picker';
import { Actions } from 'react-native-router-flux';

const width = Dimensions.get('window').width;

export default class Shows extends Component {
  constructor(props) {
    super(props);

    this.state = {
      shows: null,
      page: 1,
      loadingShows: false
    }
  }

  componentWillMount() {
    this.fetchShows(1);
  }

  fetchShows = (page) => {
    shows(page).then(shows => {
      this.setState({
        shows: shows,
        page: page
      })
    })
  }

  loadMoreShows = () => {
    this.setState({loadingShows: true});
    let page = this.state.page + 1;

    shows(page).then(shows => {
      this.setState(previousState => ({
        loadingShows: false,
        page: page,
        shows: [...previousState.shows, ...shows]
      }));
    })
  }

  onScroll = (e) => {
    let el = e.nativeEvent;
    if (el.contentSize.height - 100 <= el.contentOffset.y + el.layoutMeasurement.height) {
      if (!this.state.loadingShows) {
        this.loadMoreShows();
      }
    }
  }

  renderRow = (item) => {
    let show = item.item;
    console.log(show);
    return (
      <TouchableOpacity onPress={() => {Actions.show()}} key={show.date} style={styles.item}>
        <Card>
          <CardItem cardBody>
            <Image
              source={{uri: 'https://s3.amazonaws.com/hose/images/' + show.date + '.jpg'}}
              style={styles.showImage}
            />
          </CardItem>
          <CardItem>
            <Body>
            <Text style={{fontSize: 10}}>
                {show.date}
              </Text>
              <Text style={{fontSize: 10}}>
                {show.venue_name}
              </Text>
              <Text style={{fontSize: 10}}>
                {show.location}
              </Text>
            </Body>
          </CardItem>
        </Card>
      </TouchableOpacity>
    );  
  }

  render() {
    let shows = this.state.shows;
    if (!shows) {
      return (
        <Text> Loading ... </Text>
      );
    }

    return (
      <Container>
        <View style={styles.filters}>
          <Button>
            <Text>Years</Text>
          </Button>
          <Button>
            <Text>Venues</Text>
          </Button>
          <Button>
            <Text>Tours</Text>
          </Button>
          <Button>
            <Text>Years</Text>
          </Button>
        </View> 
        <FlatList
          contentContainerStyle={styles.list}
          onScroll={this.onScroll}
          data={shows}
          numColumns={2}
          renderItem={this.renderRow}
          keyExtractor={(item, index) => index}
        />
      </Container>
    );
  }
}

var styles = StyleSheet.create({
  list: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  item: {
    margin: 7.5,
    width: width/2 - 15,
    height: 250
  },
  showImage: {
    height: 175,
    width: width/2 - 20
  },
  filters: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 5
  }
});