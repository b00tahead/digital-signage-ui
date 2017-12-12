import React from 'react';
import './App.css';

import Games from './Games';
import TeamSchedule from './TeamSchedule';

import { BrowserRouter as Router, Route, } from 'react-router-dom';

const App = () => {
  return ( <Router>
    <div>
      <Route exact="exact" path="/games" component={Games}/>
      <Route path="/games/:id" component={TeamSchedule}/>
    </div>
  </Router> );
};

export default App;
