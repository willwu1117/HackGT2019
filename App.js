import * as React from 'react';
import { Button, View, Text, StyleSheet, Image} from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

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

class SearchScreen extends React.Component {
  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Search</Text>
        <Button
          title="Begin Movie"
          onPress={() => this.props.navigation.navigate('Timer')}
        />
      </View>
    );
  }
}

class TimerScreen extends React.Component {
  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Timer</Text>
      </View>
    );
  }
}

const RootStack = createStackNavigator(
  {
    Home: HomeScreen,
    Search: SearchScreen,
    Timer: TimerScreen,
    },
  {
    initialRouteName: 'Home',
    },

);

const styles = StyleSheet.create({
  bigBlue: {
    color: 'blue',
    fontWeight: 'bold',
    fontSize: 30,
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

const AppContainer = createAppContainer(RootStack);

export default class App extends React.Component {
  render() {
    return <AppContainer />;
  }
}

