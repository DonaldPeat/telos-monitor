import React, { Component } from 'react';
import { Modal, Row, Col, Button } from 'react-bootstrap'
import FormCustomControl from '../FormControls/FormCustomControl'
import serverAPI from '../../scripts/serverAPI'

class ModalRegisterProducer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            producerName: "",
            organization: "",
            serverLocation: "",
            httpServerAddress: "",
            httpsServerAddress: "",
            p2pListenEndpoint: "",
            p2pServerAddress: "",
            producerPublicKey: "",
            ownerPublicKey: "",
            activePublicKey: "",
            url: "",
            telegramChannel: "",
        }
    }

    onModalHide() {
        this.props.onHide();
    }

    onRegister() {
        let producer = {};
        producer.name = this.state.producerName;
        producer.organization = this.state.organization;
        producer.serverLocation = this.state.serverLocation;
        producer.httpServerAddress = this.state.httpServerAddress;
        producer.httpsServerAddress = this.state.httpsServerAddress;
        producer.p2pListenEndpoint = this.state.p2pListenEndpoint;
        producer.p2pServerAddress = this.state.p2pServerAddress;
        producer.producerPublicKey = this.state.producerPublicKey;
        producer.ownerPublicKey = this.state.ownerPublicKey;
        producer.activePublicKey = this.state.activePublicKey;
        producer.url = this.state.url;
        producer.telegramChannel = this.state.telegramChannel;
        
        serverAPI.registerProducerNode(producer,(res)=>{
            alert(res);
            this.onModalHide();
        });
    }

    onProducerNameChange(arg) {
        this.setState({
            producerName: arg.target.value
        });
    }

    getProducerNameValidationState() {
        const producerRegex = new RegExp(/^[a-z1-5_\-]+$/);
        const {producerName} = this.state;
        const length = producerName.length;

        if (length != 12 || !producerRegex.test(producerName)) return 'error';
        else return 'success';

        return null;
    }

    onOrganizationChange(arg) {
        this.setState({
            organization: arg.target.value
        })
    }

    onServerLocationChange(arg) {
        this.setState({
            serverLocation: arg.target.value
        })
    }

    onHttpServerAddressChange(arg) {
        this.setState({
            httpServerAddress: arg.target.value
        })
    }

    getHttpServerAddressValidationState(){
        const {httpServerAddress} = this.state;
        const httpServerAddressRegex = new RegExp(/^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]):[0-9]+$/g);
        
        //
        let validationTarget = httpServerAddress;
        if(httpServerAddress.indexOf('http://') === 0){
            validationTarget = httpServerAddress.slice(7);
        }
        return httpServerAddressRegex.test(validationTarget);
        //return httpServerAddressRegex.test(validationTarget) && httpsServerAddress === '' ? 'success' : 'error';
    }

    onHttpsServerAddressChange(arg) {
        this.setState({
            httpsServerAddress: arg.target.value
        })
    }

    getHttpsServerAddressValidtationState(){
        const {httpsServerAddress} = this.state;
        const httpsServerAddressRegex = new RegExp(/^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]):[0-9]+$/g);
    
        //
        let validationTarget = httpsServerAddress;
        if(httpsServerAddress.indexOf('https://') === 0){
            validationTarget = httpsServerAddress.slice(8);
        }
        return httpsServerAddressRegex.test(validationTarget);
        //return httpsServerAddressRegex.test(validationTarget) && httpServerAddress === '' ? 'success' : 'error';
    }

    getServerAddressValidationState(){
        const {httpServerAddress, httpsServerAddress} = this.state;
        if(this.getHttpServerAddressValidationState() && httpsServerAddress === '') return 'success';
        if(this.getHttpsServerAddressValidtationState() && httpServerAddress === '') return 'success';
        return 'error';
    }

    onP2pListenEndpointChange(arg) {
        this.setState({
            p2pListenEndpoint: arg.target.value
        })
    }

    onP2pServerAddressChange(arg) {
        this.setState({
            p2pServerAddress: arg.target.value
        })
    }

    onProducerPublicKeyChange(arg) {
        this.setState({
            producerPublicKey: arg.target.value
        })
    }

    getProducerPublicKeyValidationState(){
        const {producerPublicKey} = this.state;
        const length = producerPublicKey.length;
        const producerPublicKeyRegex = new RegExp(/^[a-zA-Z0-9_\-]+$/);

        if( producerPublicKey.slice(0, 3) != 'EOS' ||
            length != 53 ||
            !producerPublicKeyRegex.test(producerPublicKey) ){
            return 'error';
        }else{
            return 'success';
        }
        return null;
    }

    onOwnerPublicKeyChange(arg) {
        this.setState({
            ownerPublicKey: arg.target.value
        })
    }

    getOwnerPublicKeyValidationState(){
        const {ownerPublicKey} = this.state;
        const length = ownerPublicKey.length;
        const ownerPublicKeyRegex = new RegExp(/^[a-zA-Z0-9_\-]+$/);
        
        if( ownerPublicKey.slice(0, 3) != 'EOS' ||
            length != 53 ||
            !ownerPublicKeyRegex.test(ownerPublicKey) ){
            return 'error';
        }else{
            return 'success';
        }
        return null;
    }

    onActivePublicKeyChange(arg) {
        this.setState({
            activePublicKey: arg.target.value
        })
    }

    getActivePublicKeyValidationState(){
        const {activePublicKey} = this.state;
        const length = activePublicKey.length;
        const activePublicKeyRegex = new RegExp(/^[a-zA-Z0-9_\-]+$/);
        
        if( activePublicKey.slice(0, 3) != 'EOS' ||
            length != 53 ||
            !activePublicKeyRegex.test(activePublicKey) ){
            return 'error';
        }else{
            return 'success';
        }
        return null;        
    }
    
    onUrlChange(arg) {
        this.setState({
            url: arg.target.value
        })
    }

    onTelegramChannelchange(arg) {
        this.setState({
            telegramChannel: arg.target.value
        })
    }


    render() {
        return (
            <Modal
                {...this.props}
                bsSize="large"
                aria-labelledby="contained-modal-title-lg">
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-lg">Register node</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form>
                        <FormCustomControl
                            id="txtProducerName"
                            validationstate={this.getProducerNameValidationState()}
                            label="Producer name"
                            type="text"
                            help="length 12, lowercase a-z, 1-5"
                            value={this.state.producerName}
                            onChange={(arg) => this.onProducerNameChange(arg)}
                        />
                        <FormCustomControl
                            id="txtOrganization"
                            label="Organization"
                            type="text"
                            value={this.state.organization}
                            onChange={(arg) => this.onOrganizationChange(arg)}
                        />
                        <FormCustomControl
                            id="txtServerLocation"
                            label="Server location"
                            help="Seattle, USA"
                            type="text"
                            value={this.state.serverLocation}
                            onChange={(arg) => this.onServerLocationChange(arg)}
                        />
                        <FormCustomControl
                            id="txtHttpServerAddress"
                            validationstate={this.getServerAddressValidationState()}
                            label="Http server address"
                            type="text"
                            help="0.0.0.0:8888, please choose either HTTP or HTTPS server address"
                            value={this.state.httpServerAddress}
                            onChange={(arg) => this.onHttpServerAddressChange(arg)}
                        />
                        <FormCustomControl
                            id="txtHttpsServerAddress"
                            validationstate={this.getServerAddressValidationState()}
                            label="Https server address"
                            type="text"
                            help="0.0.0.0:443, please choose either HTTP or HTTPS server address"
                            value={this.state.httpsServerAddress}
                            onChange={(arg) => this.onHttpsServerAddressChange(arg)}
                        />
                        <FormCustomControl
                            id="txtP2pListenEndpoint"
                            label="P2P Listen endpoint"
                            type="text"
                            help="0.0.0.0:9876"
                            value={this.state.p2pListenEndpoint}
                            onChange={(arg) => this.onP2pListenEndpointChange(arg)}
                        />
                        <FormCustomControl
                            id="txtP2pServerEndpoint"
                            label="P2P server address"
                            type="text"
                            help="IP_ADDRESS:9876"
                            value={this.state.p2pServerAddress}
                            onChange={(arg) => this.onP2pServerAddressChange(arg)}
                        />
                        <FormCustomControl
                            id="txtProducerPublicKey"
                            validationstate={this.getProducerPublicKeyValidationState()}
                            label="Producer public key"
                            type="text"
                            help="EOS7d9vjuzCT67Jv9hZrBY8R3LhvHMrHepN1ArSeY3e1EKKaEUEc8"
                            value={this.state.producerPublicKey}
                            onChange={(arg) => this.onProducerPublicKeyChange(arg)}
                        />
                        <FormCustomControl
                            id="txtOwnerPublicKey"
                            validationstate={this.getOwnerPublicKeyValidationState()}
                            label="Owner public key"
                            type="text"
                            help="EOS7d9vjuzCT67Jv9hZrBY8R3LhvHMrHepN1ArSeY3e1EKKaEUEc8"
                            value={this.state.ownerPublicKey}
                            onChange={(arg) => this.onOwnerPublicKeyChange(arg)}
                        />
                        <FormCustomControl
                            id="txtActivePublicKey"
                            validationstate={this.getActivePublicKeyValidationState()}
                            label="Active public key"
                            type="text"
                            help="EOS7d9vjuzCT67Jv9hZrBY8R3LhvHMrHepN1ArSeY3e1EKKaEUEc8"
                            value={this.state.activePublicKey}
                            onChange={(arg) => this.onActivePublicKeyChange(arg)}
                        />
                        <FormCustomControl
                            id="txtTelegramChannel"
                            label="Telegram channel"
                            type="text"
                            help="@yourTelegramChannel"
                            value={this.state.telegramChannel}
                            onChange={(arg) => this.onTelegramChannelchange(arg)}
                        />
                        <FormCustomControl
                            id="txtURL"
                            label="URL"
                            type="text"
                            help="http://telosfoundation.io"
                            value={this.state.url}
                            onChange={(arg) => this.onUrlChange(arg)}
                        />
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => this.onModalHide()}>Close</Button>
                    <Button onClick={() => this.onRegister()}>Register</Button>
                </Modal.Footer>
            </Modal>
        )
    }
}

export default ModalRegisterProducer;