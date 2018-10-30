import React, {Component} from 'react';

import {
    Text,  
    View
} from 'react-native';
import { connect } from 'react-redux'

import styles from './Style.js'
import AppNoLeftHeader from './AppNoLeftHeader.js';


class StatusScreen extends Component<Props> {
    constructor(props){
      super(props)
      this.state = {text: ''};
    }
    render() {

      return (
        <View style={{flex:1}}>
          {/*Header*/}
          <View style={{flex:1}}>
            <AppNoLeftHeader route={this.props.navigation.state.routeName} />
          </View>
          {/*Content*/}
          <View  style={[styles.background,{flex:9}]}>
            <View style={[styles.container, {flex:1}]}>
              <Text style={styles.welcome}>Status Screen</Text>
            </View>
          </View>
        </View>
      );
    }
}

const mapStatetoProps = (state) => {
  const { records } = state
  return { records }
}

export default connect(mapStatetoProps)(StatusScreen)

