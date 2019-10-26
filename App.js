import * as React from 'react';
import { Component, Fragment } from 'react';
import { Button, View, Text, TouchableOpacity, StyleSheet, FlatList, ActivityIndicator, Platform, SafeAreaView, Image } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { Stopwatch, Timer } from 'react-native-stopwatch-timer';
import { List, SearchBar, CheckBox, ListItem } from 'react-native-elements';
import SearchableDropdown from 'react-native-searchable-dropdown';
import movies from './api/movies';
import _ from 'lodash';

class HomeScreen extends React.Component {
  static navigationOptions = {
    headerStyle: {
      backgroundColor: 'black'
    },
  }
  render() {
    let pic = { uri: 'https://owips.com/sites/default/files/clipart/ghost-clipart/339454/ghost-clipart-black-background-339454-9883748.png' };
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' ,
       backgroundColor: 'black'}}>
        <Text style={styles.white}>ADVERSCARY!</Text>
        <Image source={pic} style={{width: 250, height: 250}}/>
        <Button
          title="Get Started"
          color='#000000'
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
            this.setState({selectedItem: items})
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
          defaultIndex={2}
          //default selected item index
          placeholder="placeholder"
          //place holder for the search input
          resetValue={false}
          //reset textInput Value with true and false state
          underlineColorAndroid="transparent"
          //To remove the underline from the android input
        />
        <Button
          title="Next"
          onPress={() => this.props.navigation.navigate('CheckList')}
        />
      </View>
    );
  }
}

class CheckListScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      jumpscares: false,
      gore: false
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
          onPress={() => this.props.navigation.navigate('Timer')}
        />
      </View>
    );
  }
}

class TimerScreen extends React.Component {
  constructor(props) {
    super(props);
 
    this.state = {
      timer: null,
      minutes_Counter: '00',
      seconds_Counter: '00',
      startDisable: false
    }
  }
 
  componentWillUnmount() {
    clearInterval(this.state.timer);
  }
 
  onButtonStart = () => {
    let timer = setInterval(() => {
      var num = (Number(this.state.seconds_Counter) + 1).toString(),
        count = this.state.minutes_Counter;
 
      if (Number(this.state.seconds_Counter) == 59) {
        count = (Number(this.state.minutes_Counter) + 1).toString();
        num = '00';
      }
 
      this.setState({
        minutes_Counter: count.length == 1 ? '0' + count : count,
        seconds_Counter: num.length == 1 ? '0' + num : num
      });
    }, 1000);
    this.setState({ timer });
 
    this.setState({startDisable : true})
  }
 
  onButtonStop = () => {
    clearInterval(this.state.timer);
    this.setState({startDisable : false})
  }
 
  onButtonClear = () => {
    this.setState({
      timer: null,
      minutes_Counter: '00',
      seconds_Counter: '00',
    });
  }
 
  render() {
    return (
      <View style={styles.MainContainer}>
 
        <Text style={styles.counterText}>{this.state.minutes_Counter} : {this.state.seconds_Counter}</Text>
 
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
  },
    white: {
    color: 'white',
    fontSize: 30,
    fontWeight:'bold',
    fontFamily: 'sans-serif',
  },
    black: {
    color:'black'
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
