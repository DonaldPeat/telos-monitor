import React, { Component } from 'react';
import '../styles/App.css';
import nodeInfoAPI from '../scripts/nodeInfo'
import { Grid, Row, Col } from 'react-bootstrap'
import TableProducers from './TableProducers'

class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      // <div className="App">
      //   <header className="App-header">
      //     <h1 className="App-title">Telos monitor</h1>
      //   </header>
      // </div>
      <Grid fluid>
        <Row >
          <Col xs={12} md={12}>
            <TableProducers />
          </Col>
        </Row>
      </Grid>

    );
  }
}

export default App;
