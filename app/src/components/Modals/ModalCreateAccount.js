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
        isAccountCreated: false
    }
  }

  onModalHide() {

    this.props.onHide();
  }

  getProducerNameValidationState() {
    // if (!this.state.producerNameTouched) return null;

    const producerRegex = new RegExp(/^[a-z1-5_\-]+$/);
    const {accountName} = this.state;
    const length = accountName.length;

    if (length != 12 || !producerRegex.test(accountName))
      return 'error';
    else
      return 'success';
  }

  getProducerPublicKeyValidationState() {
    // if (!this.state.producerPublicKeyTouched) return null;
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

onAccountNameChange(arg) {
  this.setState({accountName: arg.target.value});
    }

onPublicKeyChange(arg) {
  this.setState({publicKey: arg.target.value});
}

onCreateAccount(){
    let account = {};
    account.name = this.state.accountName;
    account.pubKey = this.state.publicKey;

    serverAPI.createAccount(account, (res)=>{
        let response = res.data;

        console.log("res",response.msg);
    });
}

displayModalButtons() {
    if (!this.state.isAccountCreated) {
        return (
            <div>
                <Button onClick={() => this.setState({isAccountCreated: !this.state.isAccountCreated})}>Test Toggle</Button>
                <Button onClick={() => this.onModalHide()}>Close</Button>
                <Button onClick={() => this.onCreateAccount()}>Create account</Button>
            </div>
        );
    } else {
        return (<Button onClick={() => this.onModalHide()}>Close</Button>);
    }
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
                // onFocus={() => this.setState({ producerNameTouched: true })}
            />
             <FormCustomControl
                id="txtPublicKey"
                validationstate={this.getProducerPublicKeyValidationState()}
                label="Public key"
                type="text"
                help="TLOS7d9vjuzCT67Jv9hZrBY8R3LhvHMrHepN1ArSeY3e1EKKaEUEc8"
                value={this.state.publicKey}
                onChange={(arg) => this.onPublicKeyChange(arg)}
                // onFocus={() => this.setState({ producerPublicKeyTouched: true })}
            />
        </div>
    );
}

displayResponseMessage(){
    return (
        <div className='createAccountResponseContainer'>
            <h3>Response message here.</h3>
        </div>
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