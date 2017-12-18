import { AppRegistry } from 'react-native';
import App from './App';
import TrackPlayer from 'react-native-track-player';
import PlayerHandler from './src/PlayerHandler';

AppRegistry.registerComponent('hosemobile', () => App);
TrackPlayer.registerEventHandler(PlayerHandler);