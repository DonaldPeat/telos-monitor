import React, { Component } from 'react';
import '../styles/App.css';
import nodeInfoAPI from '../scripts/nodeInfo'
import { Grid, Row, Col,Button } from 'react-bootstrap'
import TableProducers from './TableProducers'
import TableTransactions from './TableTransactions';
import ModalRegisterProducer from './Modals/ModalRegisterProducer'

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
      <Grid fluid>
        <ModalRegisterProducer show={this.state.showModalRegisterProd} onHide={() => this.showModalRegisterProducer()} />
        <Row >
          <Col xs={12} md={12}>
          <Button onClick={()=>this.showModalRegisterProducer()}>Register</Button>
          </Col>
        </Row>
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
