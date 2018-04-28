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

let timerId = 0
export default class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      head: require('./manhead.png'),
      slap: 'right',
      count: 0,
      timer: 0,
      start: false,
      finish: false
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
    if (timerId == 0 ){
      this.startTimer()
    }
    if (this.state.slap == 'right'){
      this.setState({count: this.state.count + 1})
    }
    this.setState({head: require('./headOnLeft.png'),slap: 'left'});
  }

  onSwipeRight=(gestureState)=> {
    if (timerId == 0 ){
      this.startTimer()
    }
    if (this.state.slap == 'left'){
      this.setState({count: this.state.count + 1})
    }
    this.setState({head: require('./headOnRight.png'), slap: 'right'});
  }

  incrementTimer = ()=>{
    this.setState({timer: this.state.timer + 1})
    if (this.state.timer == 10){
      clearInterval(timerId)
      timerId = 0
      this.setState({finish: true})
    }
  }

  startTimer = ()=>{
    this.setState({timer: 0})
    timerId = setInterval(this.incrementTimer,1000)
  }

  onPressPlayAgain = ()=>{
    this.setState({
      finish:false,
      count: 0,
      timer: 0
    })
  }

  onPressShare = ()=>{
    Share.share({
      message: `i scored ${this.state.scorePercentage} in the coin logo quiz.`,
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
            justifyContent: 'center',
            alignItems: 'center'
          }}
           config={config}
          >
            <View>
              <Text style={{fontSize: 44, marginBotton: 32, color: '#fff', fontWeight: 'bold'}}>{this.state.count}</Text>
            </View>
            <View>
              <Image style={{height: 200, width: 200}} source={this.state.head}/>
            </View>
            {this.hand()}
            <View>
              <Text style={{fontSize: 44, color: '#fff', fontWeight: 'bold'}}>{this.state.timer}</Text>
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
          <Text style={{color: '#2c3e50', fontSize: 32, fontWeight: 'bold', fontStyle:'italic', marginTop: 16}}>COIN LOGO QUIZ</Text>
          <TouchableOpacity
            style={{margin: 64, padding: 8, alignItems: 'center',height: 40, width: 200, borderColor:'rgba(0,0,0,0.3)', borderWidth:2, borderRadius: 2, backgroundColor: '#f39c12'}}
            onPress={()=>this.setState({start: true})}
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
    justifyContent: 'space-around',
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
