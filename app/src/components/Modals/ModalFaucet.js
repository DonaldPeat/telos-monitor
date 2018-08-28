import React, {Component} from 'react';
import {Button, FormControl, Modal, Well} from 'react-bootstrap';
import serverAPI from '../../scripts/serverAPI';
import FormCustomControl from '../FormControls/FormCustomControl';

class ModelFaucet extends Component {
  constructor(props) {
    super(props);
    this.state = {
      accountName: '',
      accountGotTLOS: false,
    }
  }

  onModalHide() {
    this.props.onHide();
  }

  getAccountNameValidationState() {
    const producerRegex = new RegExp(/^[a-z1-5_\-]+$/);
    const {accountName} = this.state;
    const length = accountName.length;

    if (length != 12 || !producerRegex.test(accountName))
      return 'error';
    else
      return 'success';
  }

  onAccountNameChange(arg) {
    this.setState({accountName: arg.target.value});
  }

  onGetTLOS() {
    let account = {};
    account.name = this.state.accountName;

    serverAPI.getTLOS(account, (res) => {
      let response = res.data;

      this.setState({
        serverResponse: response,
        accountGotTLOS: !this.state.accountGotTLOS
      });
    });
  }

  displayModalButtons() {
    if (!this.state.accountGotTLOS) {
        return (
            <div>
                <Button onClick={() => this.onModalHide()}>Close</Button>
                <Button 
                    onClick={() => this.onGetTLOS()} 
                    disabled={this.getAccountNameValidationState() === 'error'}>Get TLOS</Button>
            </div>
        );
    } else return (<div> <Button onClick={() => this.onModalHide()}>Close</Button> </div>);
}

displayCreateAccountForm(){
    return (
        <div>
            <FormCustomControl
                id="txtAccountName"
                validationstate={this.getAccountNameValidationState()}
                label="Account name"
                type="text"
                help="length 12, lowercase a-z, 1-5"
                value={this.state.accountName}
                onChange={(arg) => this.onAccountNameChange(arg)}
            />
        </div>
    );
    }

    displayResponseMessage() {
      if (this.state.serverResponse == null) return (<Well><h3>Internal error. Please contact one our dev team on Telegram at https://t.me/TelosTestnet</h3></Well>);
      else if (this.state.serverResponse.msg){
        return (
            <Well>
                <h3>TLOS wasn't transfered.</h3>
                <p>{this.state.serverResponse.msg}</p>
            </Well>
        );
      } else { 
        var timeRequested = new Date(this.state.serverResponse.timeRequested).toString();
        return (
            <Well>
                <h3>TLOS transfered successfully</h3>
                <p><bold>Account name</bold>: {this.state.serverResponse.name}</p>
                <p><bold>Time requested</bold>: {timeRequested}</p>
            </Well>
        );
      }          
}

  render() {
    const {accountGotTLOS} = this.state;
    return (
        <Modal
            {...this.props}
            bsSize="large"
            aria-labelledby="contained-modal-title-lg">
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-lg">TLOS Faucet</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {accountGotTLOS ? this.displayResponseMessage() : this.displayCreateAccountForm()}
            </Modal.Body>
            <Modal.Footer>
                {this.displayModalButtons()}
            </Modal.Footer>
        </Modal>
    );
    }
    }

  export default ModelFaucet;