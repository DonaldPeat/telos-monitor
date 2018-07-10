import React, { Component } from 'react';
import { Grid, Row, Col,Button } from 'react-bootstrap'
import TableProducers from './TableProducers'
import TableBlocksTransactions from './TableBlocksTransactions';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { showModalRegisterProd: false };
  }

 
  render() {
    return (
      <Router>
        <div className='site_wrapper'>
          <Header />
          <Grid>
            <Switch>
              <Route path='/blocks' component={TableBlocksTransactions} />
              <Route path='/transactions' component={TableBlocksTransactions} />
              <Route path='/' component={TableProducers} />
            </Switch>
          </Grid>
          <Footer />
        </div>
      </Router>
    );
  }
}

export default App;