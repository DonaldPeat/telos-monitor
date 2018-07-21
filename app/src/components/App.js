import React, { Component } from 'react';
import { Grid, Row, Col, Button } from 'react-bootstrap'
import TableProducers from './Tables/TableProducers'
import TableBlocksTransactions from './Tables/TableBlocksTransactions';
import TableP2Ps from './Tables/TableP2Ps'
import TelosInfo from './TelosInfo'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import InfoBar from './InfoBar';
import StagesPage from './StagesPage';

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
            <InfoBar />
            <Switch>
              <Route path='/info' component={TelosInfo} />
              <Route path='/blocks' component={TableBlocksTransactions} />
              <Route path='/transactions' component={TableBlocksTransactions} />
              <Route path='/p2plist' component={TableP2Ps} />
              <Route path='/stages' component={StagesPage} />
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