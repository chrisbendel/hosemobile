import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  TouchableOpacity,
  FlatList
} from 'react-native';
import {
  List, 
  ListItem,
  Text,
  Container, 
  Card, 
  CardItem,
  Left, 
  Right,
  Body, 
  Button,
  Icon
} from 'native-base';
import {shows, showsForYear, showsToday, showsForVenue, showsForTour, show} from './../api/phishin';
import ModalFilterPicker from 'react-native-modal-filter-picker';
import { Actions } from 'react-native-router-flux';
import {yearFilters, tourFilters, venueFilters, sortByOptions, showJamcharts} from './../Filters';
import {CachedImage} from "react-native-img-cache";
import Spinner from 'react-native-loading-spinner-overlay';
import PlayerController from './../PlayerController';

const width = Dimensions.get('window').width;

const isJamchart = (id) => {
  return (showJamcharts.indexOf(id) !== -1);
}

export default class Shows extends Component {
  constructor(props) {
    super(props);

    this.state = {
      shows: null,
      page: 1,
      loading: false,
      fetchingMoreShows: false,
      filterVisible: false,
      filterOptions: null,
      filterType: null,
      loadMoreShows: false
    }
  }
  
  componentWillMount() {
    this.setState({loading: true});
    if (this.props.id === 'today') {
      this.fetchShowsToday();
    } else {
      this.fetchShows();
    }
  }

  fetchShowsToday = () => {
    let today = new Date();
    let day = today.getDate().toString();
    let month = (today.getMonth() + 1).toString();
    date = month + "-" + day;
    showsToday(date).then(shows => {
      this.setState({
        shows: shows,
        loading: false,
        loadMoreShows: false
      });
      Actions.refresh({title: 'Shows on ' + date})
    });
  }

  fetchShows = (page = 1) => {
    shows(page).then(shows => {
      this.setState({
        shows: shows,
        page: page,
        filterOptions: null,
        filterVisible: false,
        loading: false,
        loadMoreShows: true
      });
      Actions.refresh({title: 'Shows'});
    })
  }

  loadMoreShows = () => {
    this.setState({fetchingMoreShows: true});
    let page = this.state.page + 1;

    shows(page).then(shows => {
      this.setState(previousState => ({
        fetchingMoreShows: false,
        page: page,
        shows: [...previousState.shows, ...shows]
      }));
    })
  }

  onShow = (options, filterType) => {
    this.setState({ 
      filterVisible: true, 
      filterOptions: options,
      filterType
    });
  }

  onSelect = (picked) => {
    this.setState({loading: true});
    let info = this.state.filterOptions.find(x => x.key === picked);
    switch (this.state.filterType) {
      case 'years': 
        if (info.key === 'all') {
          this.fetchShows();
        } else {
          showsForYear(info.key).then(shows => {
            this.setState({
              shows: shows.reverse(),
              filterVisible: false,
              loading: false,
              loadMoreShows: false
            });
          });
        }
        break;
      case 'venues':
        showsForVenue(info.key).then(showIds => {
          let promises = [];
          showIds.forEach(id => {
            promises.push(show(id).then(showInfo => {
              return showInfo;
            }));
          });
    
          Promise.all(promises).then(data => {
            this.setState({
              shows: data.reverse(),
              filterVisible: false,
              loading: false,
              loadMoreShows: false
            })
          })
        });
        break;
      case 'tours':
        showsForTour(info.key).then(shows => {
          this.setState({
            shows: shows.reverse(),
            filterVisible: false,
            loading: false,
            loadMoreShows: false
          });
        });
        break;
    }
    Actions.refresh({title: info.label})
  }

  onCancel = () => {
    this.setState({
      filterVisible: false
    });
  }

  onScroll = (e) => {
    let el = e.nativeEvent;
    if (el.contentSize.height - 100 <= el.contentOffset.y + el.layoutMeasurement.height) {
      if (!this.state.fetchingMoreShows && this.state.loadMoreShows) {
        this.loadMoreShows();
      }
    }
  }

  renderRow = (item) => {
    let show = item.item;
    return (
      <TouchableOpacity onPress={() => {Actions.show({id: show.id, title: show.date})}} key={show.date} style={styles.item}>
        <Card >
          <CardItem cardBody>
            <CachedImage
              source={{uri: 'https://s3.amazonaws.com/hose/images/' + show.date + '.jpg'}}
              style={styles.showImage}
            />
          </CardItem>
          <View style={styles.showText}>
            <Text style={{fontSize: 16, fontWeight: 'bold', color: "#4080B0"}}>
              {show.date}
            </Text>
            {show.venue ?
            <View>
              <Text numberOfLines={1} style={{fontSize: 12}}>
                {show.venue.name}
              </Text>
              <Text numberOfLines={1} style={{fontSize: 10}}>
                {show.venue.location}
              </Text>
            </View>
            :
            <View>
              <Text numberOfLines={1} style={{fontSize: 12}}>
                {show.venue_name}
              </Text>
              <Text numberOfLines={1} style={{fontSize: 10}}>
                {show.location}
              </Text>
            </View>
          }
          </View>
        </Card>
      </TouchableOpacity>
    );
  }

  render() {
    let shows = this.state.shows;
    
    if (this.state.loading) {
      return (
        <Container>
          <Spinner visible={this.state.loading} textStyle={{color: '#FFF'}} />
        </Container>
      );
    }

    return (
      <Container style={{backgroundColor: '#FFF'}}>
        <ModalFilterPicker
          visible={this.state.filterVisible}
          onSelect={(picked) => {this.onSelect(picked)}}
          onCancel={this.onCancel}
          options={this.state.filterOptions ? this.state.filterOptions : []}
        />
        
        <View style={styles.filters}>
          <Button style={styles.filterButton} title="Shows" onPress={() => {
            this.fetchShows();
          }}>
            <Text>Shows</Text>
          </Button>
          <Button style={styles.filterButton} title="Years" onPress={() => {
            this.onShow(yearFilters, 'years');
          }}>
            <Text>Years</Text>
          </Button>
          <Button style={styles.filterButton} onPress={() => {
            this.onShow(venueFilters, 'venues');
          }}>
            <Text>Venues</Text>
          </Button>
          <Button style={styles.filterButton} onPress={() => {
            this.onShow(tourFilters, 'tours');
          }}>
            <Text>Tours</Text>
          </Button>
        </View>

        {shows.length ?
        <FlatList
          contentContainerStyle={styles.list}
          onScroll={this.onScroll}
          data={shows}
          numColumns={3}
          renderItem={this.renderRow}
          keyExtractor={(item, index) => index}
        />
        :
        <View style={{alignSelf: 'center', justifyContent: 'center'}}>
          <Text> No Shows Found </Text>
        </View>
        }

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
    margin: 2.5,
    width: width / 3 - 5,
    height: 175
  },
  showText: {
    flex: 1,
    height: 'auto',
    padding: 5,
  },
  showImage: {
    flex: 1,
    height: 100,
    resizeMode: 'cover'
  },
  filterButton: {
    backgroundColor: '#4080B0'
  },
  filters: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 5
  }
});