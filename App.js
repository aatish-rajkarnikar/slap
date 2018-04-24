'use strict';
import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Image
} from 'react-native';
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';


export default class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      head: require('./manhead.png'),
      slap: 'right'
    };
  }

  hand=()=>{
    if (this.state.slap === 'right'){
      return (
        <View style={{flexDirection:'row'}}>
            <Image style={{height: 100, width: 100, left: 64, top: -64}} source={require('./handOnRight.png')} resizeMode='contain'/>
        </View>
      )
    }else{
      return (
        <View style={{flexDirection:'row'}}>
            <Image style={{height: 100, width: 100,left: -64, top: -64}} source={require('./handOnLeft.png')} resizeMode='contain'/>
        </View>
      )
    }
  }
  onSwipeLeft=(gestureState)=>{
    this.setState({head: require('./headOnLeft.png'),slap: 'left'});
  }

  onSwipeRight=(gestureState)=> {
    this.setState({head: require('./headOnRight.png'), slap: 'right'});
  }

  render() {
    const config = {
      velocityThreshold: 0.001,
      directionalOffsetThreshold: 500
    };
    return (
      <GestureRecognizer
        onSwipeLeft={this.onSwipeLeft}
        onSwipeRight={this.onSwipeRight}
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center'
        }}
         config={config}
        >
          <View>
            <Image style={{height: 200, width: 200}} source={this.state.head}/>
          </View>
          {this.hand()}
        <Text>{this.state.myText}</Text>
      </GestureRecognizer>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  }
});
