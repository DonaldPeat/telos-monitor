import React, { Component } from 'react';
import { Modal, Button, Row, Col, Collapse, Well, Glyphicon } from 'react-bootstrap'

class ModalTransactionInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    onModalHide() {
        this.props.onHide();
    }

    isObjEmpty(value) {
        return Boolean(value && typeof value == 'object') && !Object.keys(value).length;
    };

    renderActions() {
        if (this.props.tx) {
            let actions =
                <div>
                    {
                        this.props.tx.trx.transaction.actions.map((val, i) => {
                            return (
                                <Row key={i}>
                                    <hr />
                                    <Col xs={12}><h4>Action</h4></Col>
                                    <Col xs={3}>Handler account: </Col>
                                    <Col xs={9}>{val.account}</Col>
                                    <Col xs={3}>Authorization: </Col>
                                    <Col xs={9}>{val.authorization[0].actor}</Col>
                                    <Col xs={3}>Name: </Col>
                                    <Col xs={9}>{val.name}</Col>
                                    <Well>
                                        {Object.keys(val.data).map((objVal, i) => {
                                            return (
                                                <p key={i} >{objVal}: {val.data[objVal]}</p>
                                            )
                                        })}
                                    </Well>
                                </Row>
                            )
                        })
                    }
                </div>
            return actions;
        } else return (<div></div>)

    }

    renderBody() {
        if (this.props.tx) {
            let body =
                <div>
                    <Row>
                        <Col xs={3} md={3}>Block id: </Col>
                        <Col xs={9} md={9}>{!this.isObjEmpty(this.props.tx) ? this.props.tx.blockId : ""}</Col>

                        <Col xs={3} md={3}>CPU usage: </Col>
                        <Col xs={9} md={9}>{!this.isObjEmpty(this.props.tx) ? (this.props.tx.cpu_usage_us / 1000) + " ms" : ""}</Col>

                        <Col xs={3} md={3}>NET usage: </Col>
                        <Col xs={9} md={9}>{!this.isObjEmpty(this.props.tx) ? (this.props.tx.net_usage_words / 1000) + " Kbs" : ""}</Col>

                        <Col xs={3} md={3}>Status: </Col>
                        <Col xs={9} md={9}>{!this.isObjEmpty(this.props.tx) ? this.props.tx.status : ""}</Col>

                    </Row>
                    <Row>
                        <Col xs={3} md={3}>Actions: </Col>
                        <Col xs={9} md={9}>{!this.isObjEmpty(this.props.tx) ? this.props.tx.trx.transaction.actions.length : 0}</Col>
                        <Col xs={12} md={12}> {!this.isObjEmpty(this.props.tx) ? this.renderActions() : ""}</Col>

                    </Row>
                </div>
            return body;
        } else return (<div></div>)
    }

    render() {
        if(this.props.tx){
            return (
                <Modal
                    {...this.props}
                    bsSize="large"
                    aria-labelledby="contained-modal-title-lg">
                    <Modal.Header closeButton>
                        <Modal.Title id="contained-modal-title-lg">Transaction id: {this.props.tx ? this.props.tx.trx ? this.props.tx.trx.id : "" : ""}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {this.props.tx ? this.renderBody() : ""}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={() => this.onModalHide()}>Close</Button>
                    </Modal.Footer>
                </Modal>
            )
        }else return(<div></div>)
        
    }
}


export default ModalTransactionInfo;