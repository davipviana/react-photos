import React, { Component } from 'react';
import {createStore} from 'redux';

import Header from './componentes/Header';
import Timeline from './componentes/Timeline';

import TimelineStore from './stores/TimelineStore';

const timelineStore = new TimelineStore([]);

// REDUCER
function timeline(state = [], action) {
  if(action.type === 'LIST') {
    console.log('action list');
    return action.photos;
  }

  return state;
}

const store = createStore(timeline);

class App extends Component {
  render() {
    return (
      <div id="root">
        <div className="main">
          <Header />
          <Timeline login={this.props.params.login} store={store}/>
      </div>
    </div>
    );
  }
}

export default App;
