import React, { Component } from 'react';
import '../styles/App.css';
import nodeInfoAPI from '../scripts/nodeInfo'
import { Grid, Row, Col } from 'react-bootstrap'
import TableProducers from './TableProducers'
import TableTransactions from './TableTransactions';

class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Grid fluid>
        <Row >
          <Col xs={12} md={12}>
            <TableProducers />
          </Col>
        </Row>
        <Row >
          <Col xs={12} md={12}>
            <TableTransactions />
          </Col>
        </Row>
      </Grid>
    );
  }
}

export default App;
