import React, { Component } from 'react'
import {
  Button,
  Text,
  Icon,
  Thumbnail,
  View,
  Spinner
} from 'native-base';
import { autoSubscriber } from 'firebase-nest';
import { observer } from 'mobx-react/native';
import SwipeCards from 'react-native-swipe-cards';
import { StyleSheet } from 'react-native';

class MatchList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      fetching: null
    }
  }

  static getSubs(props, state) {
    return props.stores.matches.subs;
  }

  subscribeSubs(subs, props, state) {
    const { matches } = props.stores;
    const { unsubscribe, promise } = matches.subscribeSubsWithPromise(subs);

    this.setState({fetching: true},
      () => {
          promise.then(() => {
            this.setState({fetching: false})
            }
          )
    });

    return unsubscribe;
  }

  markViewed(match) {
    this.props.stores.matches.markViewed(match[0]);
  }

  renderCard(post, store) {
    const postObj = post ? post[0] : null;

    if (postObj) {
      let pic = {uri: postObj.url};
      let text = postObj.text;

      return (
        <View style={styles.card}>
          {
            pic.uri !== undefined && pic.uri !== ""
            ?
            <Thumbnail source={pic}/>
            :
            null
          }
          <Text style={styles.text}>{text}</Text>
        </View>
      )
    }
    return null;
  }

  renderNoMoreCards() {
    return (
      <View style={styles.noMoreCards}>
        <Text>Out Of Matches</Text>
      </View>
    )
  }

  render() {
    const { matches } = this.props.stores;
    const postList = matches.getData('posts');

    const list = postList ? postList.entries() : [];

    console.log("list is: ", list);

    const { fetching } = this.state;

    return (
      <View>
        {
          fetching
          ?
          <Spinner />
          :
          <SwipeCards
            cards={list}
            renderCard={(cards) => renderCard(card, matches)}
            renderNoMoreCards={this.renderNoMoreCards}
            handleYup={this.markViewed.bind(this)}
            handleNope={this.markViewed.bind(this)}
          />
        }
      </View>
    )
  }
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    borderRadius: 5,
    overflow: 'hidden',
    borderColor: 'gray',
    backgroundColor: 'white',
    borderWidth: 1,
    elevation: 1
  },
  text: {
    color: 'black',
    fontSize: 20,
    paddingTop: 10,
    paddingBottom: 10,
  },
  noMoreCards: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default autoSubscriber(observer(MatchList));
