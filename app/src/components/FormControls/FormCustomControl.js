import React, { Component } from 'react';
import { FormGroup, ControlLabel, FormControl, HelpBlock } from 'react-bootstrap'

class FormCustomControl extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    render() {
        return (
            <FormGroup controlId={this.props.id} validationState={this.props.validationstate} className={this.props.httpclass}>
                <ControlLabel>{this.props.label}</ControlLabel>
                <FormControl {...this.props} />
                {this.props.help && <HelpBlock>{this.props.help}</HelpBlock>}
            </FormGroup>
        )
    }
}
export default FormCustomControl;