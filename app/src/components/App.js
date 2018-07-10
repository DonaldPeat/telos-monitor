import React, { Component } from 'react';
import '../styles/App.css';
import { Grid, Row, Col,Button } from 'react-bootstrap'
import TableProducers from './TableProducers'
import TableBlocksTransactions from './TableBlocksTransactions';
import ModalRegisterProducer from './Modals/ModalRegisterProducer';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { showModalRegisterProd: false };
  }

  showModalRegisterProducer() {
    this.setState({
      showModalRegisterProd: !this.state.showModalRegisterProd
    });
  }
  render() {
    return (
      <Router>
        <div className='site_wrapper'>
          <Header />
          <Grid>
            <ModalRegisterProducer show={this.state.showModalRegisterProd} onHide={() => this.showModalRegisterProducer()} />
            <Button onClick={()=>this.showModalRegisterProducer()}>Register</Button>
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