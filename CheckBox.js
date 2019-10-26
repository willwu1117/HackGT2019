import React, { Component } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
//import { StackNavigator, TabNavigator, createStackNavigator } from 'react-navigation';
import { CheckBox } from 'react-native-elements';

export default class App extends Component {

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

      </View>
    );
  }
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
