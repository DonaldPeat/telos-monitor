import React, { Component } from 'react';
import { Modal, Button, Row, Col } from 'react-bootstrap'
import nodeInfoAPI from '../../scripts/nodeInfo'
import getHummanTime from '../../scripts/nodeInfo'

class ModalProducerInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            producerInfo: null,
            One_MiB: 1048576,
            One_KiB: 1034.067383,
            EOS_Weight: 10000
        }
    }

    async componentWillUpdate() {
        if (this.state.producerInfo == null) {
            if (this.props.producername != "") {
                let producerInfo = await nodeInfoAPI.getAccountInfo(this.props.producername);
                if (producerInfo) {
                    this.setState({
                        producerInfo: producerInfo
                    })
                }
            }
        }
    }
    
    onModalHide() {
        this.setState({
            producerInfo: null
        })
        this.props.onHide();
    }

    getPSTHour(utcDate) {
        let date = new Date(utcDate);
        date.setHours(date.getHours() - 7);
        return date.toString();
    }

    getMiB(bytes) {
        return bytes / this.state.One_MiB;
    }

    getKiB(bytes) {
        return bytes / this.state.One_KiB;
    }

    render() {
        return (
            <Modal
                {...this.props}
                bsSize="large"
                aria-labelledby="contained-modal-title-lg"
            >
                <Modal.Header>
                    <Modal.Title id="contained-modal-title-lg">{this.state.producerInfo != null ? "Producer: " + this.state.producerInfo.account_name : " "}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        <Col xs={3} md={3}>Created at:</Col>
                        <Col xs={9} md={9}>{this.state.producerInfo != null ? this.getPSTHour(this.state.producerInfo.created) : ""}</Col>

                        <Col xs={3} md={3}>Last update:</Col>
                        <Col xs={9} md={9}>{this.state.producerInfo != null ? this.getPSTHour(this.state.producerInfo.head_block_time) : ""}</Col>

                        <Col xs={3} md={3}>RAM:</Col>
                        <Col xs={9} md={9}>
                            <div>
                                <p> {this.state.producerInfo != null ? "Quota: " + this.getKiB(this.state.producerInfo.ram_quota) + " KiB" : ""}</p>
                                <p> {this.state.producerInfo != null ? "Used: " + this.getKiB(this.state.producerInfo.ram_usage) + " KiB" : ""}</p>
                            </div>
                        </Col>

                        <Col xs={3} md={3}>NET:</Col>
                        <Col xs={9} md={9}>
                            <div>
                                <p>Staked: {this.state.producerInfo != null ? this.state.producerInfo.cpu_weight / this.state.EOS_Weight + " EOS" : ""}</p>
                                <p>Available: {this.state.producerInfo != null ? this.getMiB(this.state.producerInfo.net_limit.available) + " MiB" : ""}</p>
                                <p>Used: {this.state.producerInfo != null ? this.state.producerInfo.net_limit.used + " bytes" : ""}</p>
                                <p>Max: {this.state.producerInfo != null ? this.getMiB(this.state.producerInfo.net_limit.max) + " MiB" : ""}</p>
                            </div>
                        </Col>

                        <Col xs={3} md={3}>CPU:</Col>
                        <Col xs={9} md={9}>
                            <div>
                                <p>Staked: {this.state.producerInfo != null ? this.state.producerInfo.cpu_weight / this.state.EOS_Weight + " EOS" : ""}</p>
                                <p>Available: {this.state.producerInfo != null ? (this.state.producerInfo.cpu_limit.available / 1000) + " ms" : ""}</p>
                                <p>Used: {this.state.producerInfo != null ? (this.state.producerInfo.cpu_limit.used / 1000) + " ms" : ""}</p>
                                <p>Max: {this.state.producerInfo != null ? (this.state.producerInfo.cpu_limit.max / 1000) + " ms" : ""}</p>
                            </div>
                        </Col>

                    </Row>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => this.onModalHide()}>Close</Button>
                </Modal.Footer>
            </Modal>
        );
    }
}

export default ModalProducerInfo;