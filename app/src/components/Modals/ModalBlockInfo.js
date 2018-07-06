import React, { Component } from 'react';
import { Modal, Button, Row, Col } from 'react-bootstrap'

class ModalBlockInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }


    onModalHide() {
        this.props.onHide();
    }

    render() {

        console.log(this.props.block)
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
                        <Col xs={9} md={9}>{this.props.block != null ? this.props.block.producer : ""}</Col>

                        <Col xs={3} md={3}>Timestamp: </Col>
                        <Col xs={9} md={9}>{this.props.block != null ? this.props.block.timestamp : ""}</Col>

                        <Col xs={3} md={3}>Block id: </Col>
                        <Col xs={9} md={9}>{this.props.block != null ? this.props.block.id : ""}</Col>

                        <Col xs={3} md={3}>Previous block id: </Col>
                        <Col xs={9} md={9}>{this.props.block != null ? this.props.block.previous : ""}</Col>

                        <Col xs={3} md={3}>Transaction Merkle root: </Col>
                        <Col xs={9} md={9}>{this.props.block != null ? this.props.block.transaction_mroot : ""}</Col>

                        <Col xs={3} md={3}>Action Merkle root: </Col>
                        <Col xs={9} md={9}>{this.props.block != null ? this.props.block.action_mroot : ""}</Col>

                        <Col xs={3} md={3}>Transactions: </Col>
                        <Col xs={9} md={9}>{this.props.block != null ? this.props.block.transactions ? this.props.block.transactions.length : 0 : 0}</Col>
                    </Row>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => this.onModalHide()}>Close</Button>
                </Modal.Footer>
            </Modal>
        )
    }
}

export default ModalBlockInfo;