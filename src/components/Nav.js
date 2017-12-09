import React, { Component } from 'react';
import {
  Text,
} from 'react-native';

import {Content} from 'native-base';

export default class Nav extends Component {
  render() {
    return (
      <Content style={styles.drawerContainer}>
        <Text>Drawer</Text>
      </Content>
    );
  }
}

const styles = {
  drawerContainer: {
    width: 200,
    backgroundColor: '#ffAAff'
  }
}