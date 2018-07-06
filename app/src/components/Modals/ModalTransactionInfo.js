import React, { Component } from 'react';
import { Modal, Button, Row, Col } from 'react-bootstrap'

class ModalTransactionInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    onModalHide() {
        this.props.onHide();
    }

    render() {
        console.log(this.props.tx)
        return (
            <Modal
                {...this.props}
                bsSize="large"
                aria-labelledby="contained-modal-title-lg"
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-lg">Transaction id: {this.props.tx ? this.props.tx.trx ? this.props.tx.trx.id : "" : ""}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        <Col xs={3} md={3}>Block id: </Col>
                        <Col xs={9} md={9}>{this.props.tx ? this.props.tx.blockId : ""}</Col>

                        <Col xs={3} md={3}>CPU usage: </Col>
                        <Col xs={9} md={9}>{this.props.tx ? (this.props.tx.cpu_usage_us/1000) + " ms" : ""}</Col>

                        <Col xs={3} md={3}>NET usage: </Col>
                        <Col xs={9} md={9}>{this.props.tx ? (this.props.tx.net_usage_words/1000) + " Kbs" : ""}</Col>

                        <Col xs={3} md={3}>Status: </Col>
                        <Col xs={9} md={9}>{this.props.tx ? this.props.tx.status : ""}</Col>

                        <Col xs={3} md={3}>Actions: </Col>
                        {/* <Col xs={9} md={9}>{this.props.tx ? this.props.tx.trx.transaction ? this.props.tx.trx.transaction.actions.length : "" : ""}</Col> */}
                    </Row>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => this.onModalHide()}>Close</Button>
                </Modal.Footer>
            </Modal>
        )
    }
}



export default ModalTransactionInfo;