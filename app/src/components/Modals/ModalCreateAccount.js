import React, {Component} from 'react';
import {Button, FormControl, Modal, Well} from 'react-bootstrap';
import serverAPI from '../../scripts/serverAPI';
import FormCustomControl from '../FormControls/FormCustomControl';

import '../../styles/createaccount.css';

class ModalCreateAccount extends Component {
  constructor(props) {
    super(props);
    this.state = {
        accountName:"",
        publicKey:"",
        isAccountCreated: false,
        serverResponse:null
    }
  }

  onModalHide() {
  this.props.onHide();
  }

  getProducerNameValidationState() {
    const producerRegex = new RegExp(/^[a-z1-5_\-]+$/);
    const {accountName} = this.state;
    const length = accountName.length;

    if (length != 12 || !producerRegex.test(accountName))
      return 'error';
    else
      return 'success';
  }

  getProducerPublicKeyValidationState() {
    const { publicKey } = this.state;
    const length = publicKey.length;
    const publicKeyRegex = new RegExp(/^[a-zA-Z0-9_\-]+$/);

    if (publicKey.slice(0, 4) != 'TLOS' ||
        length != 54 ||
        !publicKeyRegex.test(publicKey)) {
        return 'error';
    } else {
        return 'success';
    }
    return null;
}

  onAccountNameChange(arg) { this.setState({accountName: arg.target.value}); }

  onPublicKeyChange(arg) { this.setState({publicKey: arg.target.value}) }

onCreateAccount(){
    let account = {};
    account.name = this.state.accountName;
    account.pubKey = this.state.publicKey;
    
    serverAPI.createAccount(account, (res) => {
      let response = res.data;
      this.setState({
          serverResponse: response,
          isAccountCreated: !this.state.isAccountCreated
        });
    });
}

displayModalButtons() {
    if (!this.state.isAccountCreated) {
        return (
            <div>
                <Button onClick={() => this.onModalHide()}>Close</Button>
                <Button 
                    onClick={() => this.onCreateAccount()} 
                    disabled={this.getProducerNameValidationState() === 'error' || this.getProducerPublicKeyValidationState() === 'error'}>Create account</Button>
            </div>
        );
    } else return (<div> <Button onClick={() => this.onModalHide()}>Close</Button> </div>);
}

displayCreateAccountForm(){
    return (
        <div>
            <FormCustomControl
                id="txtAccountName"
                validationstate={this.getProducerNameValidationState()}
                label="Account name"
                type="text"
                help="length 12, lowercase a-z, 1-5"
                value={this.state.accountName}
                onChange={(arg) => this.onAccountNameChange(arg)}
            />
             <FormCustomControl
                id="txtPublicKey"
                validationstate={this.getProducerPublicKeyValidationState()}
                label="Public key"
                type="text"
                help="TLOS7d9vjuzCT67Jv9hZrBY8R3LhvHMrHepN1ArSeY3e1EKKaEUEc8"
                value={this.state.publicKey}
                onChange={(arg) => this.onPublicKeyChange(arg)}
            />
        </div>
    );
}

displayResponseMessage(){
    if(this.state.serverResponse == null) return <h3>'Internal error. Please contact one our dev team on Telegram at https://t.me/TelosTestnet'</h3>
                
    return (
            <Well>
                <h3>{this.state.serverResponse.account_created == true ? "Account created" : "Account was not created"}</h3>
                <p>{this.state.serverResponse.msg}</p>
                <p><bold>Account name</bold>: {this.state.serverResponse.account}</p>
                <p><bold>Public key</bold>: {this.state.serverResponse.pubKey}</p>
            </Well>
    );
}

render() {
    const {isAccountCreated} = this.state;
    return (
        <Modal
            {...this.props}
            bsSize="large"
            aria-labelledby="contained-modal-title-lg">
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-lg">Create account</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {/*need a different state, like form submitted.  Not every server response will be acct created*/}
                {isAccountCreated ? this.displayResponseMessage() : this.displayCreateAccountForm()}
            </Modal.Body>
            <Modal.Footer>
                {this.displayModalButtons()}
            </Modal.Footer>
        </Modal>
    );
  }

}

export default ModalCreateAccount;