import React, { Component } from 'react';
import { FormControl, FormGroup, InputGroup, Button } from 'react-bootstrap'

class FormTextboxButton extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    renderControl() {
        if (this.props.hasbutton) {
            return (
                <InputGroup>
                    <FormControl type="text" {...this.props} />
                    <InputGroup.Button>
                        <Button onClick={this.props.buttonclicked}>{this.props.buttonname}</Button>
                    </InputGroup.Button>
                </InputGroup>
            );
        } else return (<FormControl type="text" {...this.props} />);

    }

    render() {
        return (
            <FormGroup style={{ "marginTop": "1em" }}>
                {this.renderControl()}
            </FormGroup >
        );
    }
}


export default FormTextboxButton;