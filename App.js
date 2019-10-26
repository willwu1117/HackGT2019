import * as React from 'react';
import { Component, Fragment } from 'react';
import { Button, View, Text, TouchableOpacity, StyleSheet, FlatList, ActivityIndicator, Platform, SafeAreaView } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { Stopwatch, Timer } from 'react-native-stopwatch-timer';
import { List, SearchBar, CheckBox, ListItem } from 'react-native-elements';
import SearchableDropdown from 'react-native-searchable-dropdown';
import { getMovies, contains } from './api/index';
import _ from 'lodash';
import firebase from 'firebase';

var config = {
  databaseURL: 'https://adverscary.firebaseio.com/',
  projectId: 'adverscary'
};
firebase.initializeApp(config);

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

class SearchScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      data: [],
      error: null,
      query: "",
      fullData: [],
      movie_list: {}
    }
  }



  componentDidMount() {
    this.makeRemoteRequest();
  }

  makeRemoteRequest = _.debounce(() => {
    this.setState({ loading: true });
    let that = this;

    getMovies(500, this.state.query)
      .then(movies => {
        this.setState({
          loading: false,
          data: movies,
          fullData: movies,
        });
      })
      .catch(error => {
        this.setState({ error, loading: false });
      });
      firebase.database().ref('movies/').once('value', function (snapshot) {
        that.setState({movie_list: snapshot.val()});
        console.log(that.state.movie_list);
    });
  });

  handleSearch = (text) => {
    const formatQuery = text.toLowerCase();
    const data = _.filter(this.state.fullData, movie => {
      return contains(movie, formatQuery);
    })
    this.setState({ query: formatQuery, data }, () => this.makeRemoteRequest());
  };

  renderSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: "86%",
          backgroundColor: "#CED0CE",
          marginLeft: "14%"
        }}
      />
    );
  };

  renderHeader = () => {
    return (
      <SearchBar 
        placeholder="Type Here..." 
        darkTheme 
        round 
        onChangeText={this.handleSearch}/>
    );
  };

  renderFooter = () => {
    if (!this.state.loading) return null;

    return (
      <View
        style={{
          paddingVertical: 20,
          borderTopWidth: 1,
          borderColor: "#CED0CE"
        }}
      >
        <ActivityIndicator animating size="large" />
      </View>
    );
  };

  render() {
    return (
      <View>
        <Text>What movie are you watching?</Text>
        <FlatList
          data={this.state.data}
          renderItem={({ item }) => (
            <ListItem
              title={`${item.name}`}
              containerStyle={{ borderBottomWidth: 0 }}
            />
          )}
          keyExtractor={item => item.name}
          ItemSeparatorComponent={this.renderSeparator}
          ListHeaderComponent={this.renderHeader}
          ListFooterComponent={this.renderFooter}
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