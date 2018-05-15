import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Image,
  ImageBackground,
  Modal,
  TouchableOpacity,
  Share,
  StatusBar
} from 'react-native';
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';
 var Sound = require('react-native-sound');
var slap = new Sound('slap.mp3',Sound.MAIN_BUNDLE)
var rogerrant = new Sound('rogerrant.mp3', Sound.MAIN_BUNDLE)
let timerId = 0

export default class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      head: require('./manhead.png'),
      slap: 'right',
      count: 0,
      timer: 0,
      global_count: 0,
      start: false,
      finish: false
    };
  }

  componentWillMount(){
    this.getScore()
  }

  postScore(score){
    fetch(`http://159.89.172.199/counter/add/${score}`, {
      method: 'POST',
    }).then((response) => response.json())
    .then((responseJson) => {
      this.setState({
        global_count : responseJson.count
      })
    })
    .catch((error) => {
      console.error(error);
    });
  }

  getScore(){
    fetch('http://159.89.172.199/counter', {
      method: 'GET',
    }).then((response) => response.json())
    .then((responseJson) => {
      this.setState({
        global_count : responseJson.count
      })
    })
    .catch((error) => {
      console.error(error);
    });
  }

  hand=()=>{
    if (this.state.slap === 'right'){
      return (
        <View style={{flexDirection:'row'}}>
            <Image style={{height: 80, width: 80, top: -64,position: 'absolute'}} source={require('./handOnRight.png')} resizeMode='contain'/>
        </View>
      )
    }else{
      return (
        <View style={{flexDirection:'row'}}>
            <Image style={{height: 80, width: 80,left: -64, top: -64, position: 'absolute'}} source={require('./handOnLeft.png')} resizeMode='contain'/>
        </View>
      )
    }
  }
  onSwipeLeft=(gestureState)=>{
    rogerrant.stop()

    if (timerId == 0 ){
      this.startTimer()
    }
    if (this.state.slap == 'right'){
      slap.stop(() => {
        slap.play();
      });
      this.setState({count: this.state.count + 1})
    }
    this.setState({head: require('./headOnLeft.png'),slap: 'left'});
  }

  onSwipeRight=(gestureState)=> {
    rogerrant.stop()

    if (timerId == 0 ){
      this.startTimer()
    }
    if (this.state.slap == 'left'){
      slap.stop(() => {
        slap.play();
      });
      this.setState({count: this.state.count + 1})
    }
    this.setState({head: require('./headOnRight.png'), slap: 'right'});
  }

  incrementTimer = ()=>{
    this.setState({timer: this.state.timer + 1})
    if (this.state.timer == 10){
      this.postScore(this.state.count)
      this.setState({finish: true})
      clearInterval(timerId)
    }
  }

  startTimer = ()=>{
    this.setState({timer: 0})
    timerId = setInterval(this.incrementTimer,1000)
  }

  onPressPlayAgain = ()=>{
    timerId = 0
    this.setState({
      head: require('./manhead.png'),
      finish:false,
      count: 0,
      timer: 0
    })
  }

  onPressShare = ()=>{
    Share.share({
      message: `i scored ${this.state.scorePercentage} in the slap.`,
      url: 'http://google.com',
      title: 'Wow, did you see that?'
    })
  }

  render() {
    if (this.state.start) {
      const config = {
        velocityThreshold: 0.001,
        directionalOffsetThreshold: 500
      };
      return (
        <ImageBackground style={styles.container} source={require('./bg.png')}>
          <StatusBar hidden={true} />
        <GestureRecognizer
          onSwipeLeft={this.onSwipeLeft}
          onSwipeRight={this.onSwipeRight}
          style={{
            flex: 1,
            alignItems: 'stretch',
            justifyContent: 'center'
          }}
           config={config}
          >
            <View style={{flex: 2, justifyContent: 'flex-end',   alignItems: 'center', zIndex: 100}}>
              <Image style={{ height: 200, width: 200}} source={this.state.head}/>
              <Image source={require('./callout.png')} style={{height: 100, width: 100, resizeMode:'contain', right: 0, top: 44, position: 'absolute'}}/>
              {this.hand()}
            </View>
            <View   style={{flex: 3, alignItems: 'center', justifyContent: 'center'}}>
              <Image
                resizeMode= 'contain'
                source={require('./table.png')}
                style={{flex: 1}}
              />
              <View style={{position: 'absolute'}}>
                <View style={{alignItems: 'center'}}>
                  <Text style={{fontSize: 18, color: '#fff', fontWeight: 'bold'}}>SLAP COUNT</Text>
                  <Text style={{fontSize: 44, color: '#fff', fontWeight: 'bold'}}>{this.state.count}</Text>
                </View>
                <View style={{alignItems: 'center', marginTop: 32}}>
                  <Text style={{fontSize: 18, color: '#fff', fontWeight: 'bold'}}>TIME</Text>
                  <Text style={{fontSize: 44, color: '#fff', fontWeight: 'bold'}}>{this.state.timer}</Text>
                </View>
              </View>
              <View style={{position: 'absolute', left: 10, bottom: 10}}>
                <Text style={{fontSize: 12, color: '#fff', fontWeight: 'bold'}}>GLOBAL SLAP COUNT</Text>
                <Text style={{fontSize: 16, color: '#fff', fontWeight: 'bold', textAlign: 'center'}}>{this.state.global_count}</Text>
              </View>
              <View style={{position: 'absolute', right: 10, bottom: 10}}>
                <Text style={{fontSize: 12, color: '#fff', fontWeight: 'bold'}}>GLOBAL SLAP TARGET</Text>
                <Text style={{fontSize: 16, color: '#fff', fontWeight: 'bold', textAlign: 'center'}}>1000000</Text>
              </View>
            </View>

        </GestureRecognizer>
        <Modal
              animationType="fade"
              transparent={true}
              visible={this.state.finish}>
              <View style={styles.finishContainer}>
                <View style={styles.modalView}>
                  <Text style={{color: '#2c3e50', fontSize: 14}}>FINISH!</Text>
                  <Text style={{fontSize: 88, color: '#2c3e50'}}>{this.state.count}</Text>
                  <View style={{flexDirection: 'row'}}>
                    <TouchableOpacity style={[styles.optionButton,{backgroundColor: '#f39c12'}]} onPress={this.onPressPlayAgain}>
                      <Text style={[styles.optionButtonText,{color: '#fff'}]}>PLAY AGAIN!</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.optionButton,{backgroundColor: '#3498db'}]} onPress={this.onPressShare}>
                      <Text style={[styles.optionButtonText,{color: '#fff'}]}>SHARE</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>
      </ImageBackground>
      );
    }
    return (
      <ImageBackground style={[styles.container,{justifyContent:'space-around', alignItems:'center'}]} source={require('./bg.png')}>
        <StatusBar hidden={true} />
        <View style={{alignItems:'center'}}>
          <Image style={{height: 150, width: 150}}/>
          <Text style={{color: '#2c3e50', fontSize: 32, fontWeight: 'bold', fontStyle:'italic', marginTop: 16}}>SLAP</Text>
          <TouchableOpacity
            style={{margin: 64, padding: 8, alignItems: 'center',height: 40, width: 200, borderColor:'rgba(0,0,0,0.3)', borderWidth:2, borderRadius: 2, backgroundColor: '#f39c12'}}
            onPress={()=>{
              this.setState({start: true})
              rogerrant.play()
            }}
            >
            <Text style={styles.optionButtonText}>PLAY!</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    )

  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  finishContainer:{
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)'
  },
  modalView:{
    backgroundColor: '#fff',
    borderRadius: 4,
    width: 300,
    padding: 16,
    alignItems:'center'
  },
  optionButton: {
    height: 40,
    backgroundColor: '#9b59b6',
    borderWidth: 2,
    borderColor: 'rgba(0,0,0,0.3)',
    borderRadius: 2,
    justifyContent: 'center',
    alignItems:'center',
    padding: 8,
    margin: 8,
    flex:1
  },
  optionButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
    textAlign: 'center'
  },
});
