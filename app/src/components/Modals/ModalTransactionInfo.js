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
        return (
            <Modal
                {...this.props}
                bsSize="large"
                aria-labelledby="contained-modal-title-lg"
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-lg">Block number: {this.props.block != null ? this.props.block.block_num : ""}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        <Col xs={3} md={3}>Producer: </Col>
                        <Col xs={9} md={9}></Col>

                        <Col xs={3} md={3}>Timestamp: </Col>
                        <Col xs={9} md={9}></Col>

                        <Col xs={3} md={3}>Block id: </Col>
                        <Col xs={9} md={9}></Col>

                        <Col xs={3} md={3}>Previous block id: </Col>
                        <Col xs={9} md={9}></Col>

                        <Col xs={3} md={3}>Transaction Merkle root: </Col>
                        <Col xs={9} md={9}></Col>

                        <Col xs={3} md={3}>Action Merkle root: </Col>
                        <Col xs={9} md={9}></Col>

                        <Col xs={3} md={3}>Transactions: </Col>
                        <Col xs={9} md={9}></Col>
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