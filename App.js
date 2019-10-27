import * as React from 'react';
import { Component, Fragment } from 'react';
import { Button, View, Text, TouchableOpacity, StyleSheet, FlatList, ActivityIndicator, Platform, SafeAreaView, Vibration } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { Stopwatch, Timer } from 'react-native-stopwatch-timer';
import { List, SearchBar, CheckBox, ListItem } from 'react-native-elements';
import SearchableDropdown from 'react-native-searchable-dropdown';
import movies from './api/movies';
import _ from 'lodash';


function toSeconds(datetime) {
  const times = datetime.split(":");
  var seconds;
  if (times.length == 1) {
    seconds = Number(times[0]);
  } else if (times.length == 2) {
    seconds = Number(times[0]) * 60 + Number(times[1]);
  } else if (times.length == 3) {
    seconds = Number(times[0]) * 3600 + Number(times[1]) * 60 + Number(times[2]);
  }

  return seconds;
}

class HomeScreen extends React.Component {
  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Adverscary!</Text>
        <Button
          title="Get Started"
          onPress={() => this.props.navigation.navigate('Search')}
        />
      </View>
    );
  }
}

var items = movies;
class SearchScreen extends Component {
  constructor() {
    super();
    this.state = {
      selectedItem: "",
    };
  }
  render() {
    return (
      <View style={{ flex: 1, marginTop: 30 }}>
        <Text>What movie are you watching?</Text>
        <SearchableDropdown
          onTextChange={text => console.log(text)}
          //On text change listner on the searchable input
          onItemSelect={item => {
            this.setState({selectedItem: item})
          }}
          //onItemSelect called after the selection from the dropdown
          containerStyle={{ padding: 5 }}
          //suggestion container style
          textInputStyle={{
            //inserted text style
            padding: 12,
            borderWidth: 1,
            borderColor: '#ccc',
            backgroundColor: '#FAF7F6',
          }}
          itemStyle={{
            //single dropdown item style
            padding: 10,
            marginTop: 2,
            backgroundColor: '#FAF9F8',
            borderColor: '#bbb',
            borderWidth: 1,
          }}
          itemTextStyle={{
            //single dropdown item's text style
            color: '#222',
          }}
          itemsContainerStyle={{
            //items container style you can pass maxHeight
            //to restrict the items dropdown hieght
            maxHeight: '60%',
          }}
          items={items}
          //mapping of item array
          placeholder="Search..."
          //place holder for the search input
          resetValue={false}
          //reset textInput Value with true and false state
          underlineColorAndroid="transparent"
          //To remove the underline from the android input
        />
        <Button
          title="Next"
          onPress={() => this.props.navigation.navigate('CheckList', this.state)}
        />
      </View>
    );
  }
}

class CheckListScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      movie: props.navigation.state.params.selectedItem,
      jumpscares: false,
      gore: false,
    }
  }
  
  render() {
    return (
      <View style={styles.container}>
        <Text>Select what you would like to be warned about.</Text>

        <CheckBox
          title='Jump scares'
          checked={this.state.jumpscares}
          onPress={() => this.setState({jumpscares: !this.state.jumpscares})}
        />

        <CheckBox
          title='Gore'
          checked={this.state.gore}
          onPress={() => this.setState({gore: !this.state.gore})}
        />
        <Button
          title="Begin Movie"
          onPress={() => this.props.navigation.navigate('Timer', this.state)}
        />
      </View>
    );
  }
}

class TimerScreen extends React.Component {
  constructor(props) {
    super(props);
 
    this.state = {
      movie: props.navigation.state.params.movie,
      gore: props.navigation.state.params.gore,
      jumpscares: props.navigation.state.params.jumpscares,
      timer: null,
      minutes_Counter: '00',
      seconds_Counter: '00',
      hours_Counter: '00',
      startDisable: false,
      timerStartTime: null,
      buffer: 0,
    }
  }

  componentWillUnmount() {
    clearInterval(this.state.timer);
  }
  
  onButtonStart = () => {
    this.state.timerStartTime = Date.now();
    let timer = setInterval(() => {
      var sec = (Math.floor(((Date.now() - this.state.timerStartTime)/1000) + this.state.buffer) % 60).toString(),
        min = Math.floor(((Math.floor((Date.now() - this.state.timerStartTime)/1000) + this.state.buffer) % 3600)/60).toString(),
          hr = Math.floor((Math.floor((Date.now() - this.state.timerStartTime)/1000) + this.state.buffer) /3600).toString();

      this.setState({
        minutes_Counter: min.length == 1 ? '0' + min : min,
        seconds_Counter: sec.length == 1 ? '0' + sec : sec,
        hours_Counter: hr.length == 1 ? '0' + hr:hr,
      });
    }, 1000);
    this.setState({ timer });

    this.setState({startDisable : true})
  }
 
  onButtonStop = () => {
    clearInterval(this.state.timer);
    this.setState({
      startDisable : false,
      buffer : (Math.floor(Date.now() - this.state.timerStartTime) / 1000) + this.state.buffer,
    })
  }
 
  onButtonClear = () => {
    this.setState({
      timer: null,
      minutes_Counter: '00',
      seconds_Counter: '00',
      hours_Counter: '00',
      timerStartTime: null,
      alreadyStarted: false,
    });
  }
 
  render() {
    return (
      <View style={styles.MainContainer}>
 
        <Text style={styles.counterText}>{this.state.hours_Counter} : {this.state.minutes_Counter} : {this.state.seconds_Counter}</Text>
 
        <TouchableOpacity
          onPress={this.onButtonStart}
          activeOpacity={0.6}
          style={[styles.button, { backgroundColor: this.state.startDisable ? '#B0BEC5' : '#FF6F00' }]} 
          disabled={this.state.startDisable} >
          <Text style={styles.buttonText}>START</Text>
        </TouchableOpacity>
 
        <TouchableOpacity
          onPress={this.onButtonStop}
          activeOpacity={0.6}
          style={[styles.button, { backgroundColor:  '#FF6F00'}]} >
          <Text style={styles.buttonText}>STOP</Text>
        </TouchableOpacity>
 
        <TouchableOpacity
          onPress={this.onButtonClear}
          activeOpacity={0.6}
          style={[styles.button, { backgroundColor: this.state.startDisable ? '#B0BEC5' : '#FF6F00' }]} 
          disabled={this.state.startDisable} >
          <Text style={styles.buttonText}> CLEAR </Text>
        </TouchableOpacity>
      </View>
    );
  }
} 
 
const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  button: {
    width: '80%',
    paddingTop:8,
    paddingBottom:8,
    borderRadius:7,
    marginTop: 10
  },
  buttonText:{
      color:'#fff',
      textAlign:'center',
      fontSize: 20
  },
  counterText:{
    fontSize: 28,
    color: '#000'
  }
});

const RootStack = createStackNavigator(
  {
    Home: HomeScreen,
    Search: SearchScreen,
    CheckList: CheckListScreen,
    Timer: TimerScreen,
  },
  {
    initialRouteName: 'Home',
  }
);

const AppContainer = createAppContainer(RootStack);

export default class App extends React.Component {
  render() {
    return <AppContainer />;
  }
}