import React from 'react';
import { Image, View } from 'react-native';

export default class GifScreen extends React.Component {
  static navigationOptions = {
    title: 'Cat',
  };
  
  render() {
    return (
      <View
        style={{
          flex: 1,
          padding: 10,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Image
          source={{ uri: 'http://d23dyxeqlo5psv.cloudfront.net/cat.gif' }}
          style={{ height: 140, width: 200 }}
          />
      </View>
    );
  }
}
