import React, { Component } from 'react';
import { FormControl, FormGroup, InputGroup, Button } from 'react-bootstrap'

class FormTextboxButton extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    render() {
        return (
            <FormGroup style={{ "marginTop": "1em" }}>
                <InputGroup>
                    <FormControl type="text" {...this.props}/>
                    <InputGroup.Button>
                        <Button onClick={this.props.buttonclicked}>{this.props.buttonname}</Button>
                    </InputGroup.Button>
                </InputGroup>
            </FormGroup >
        );
    }
}


export default FormTextboxButton;