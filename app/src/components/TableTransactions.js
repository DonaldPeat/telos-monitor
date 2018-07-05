import React, { Component } from 'react';
import { Grid, Row, Col, Table } from 'react-bootstrap'
import NodeInfoAPI from '../scripts/nodeInfo'

class TableTransactions extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    async componentDidMount() {
       
    }

    render() {
        return (
            <div>
                <h2>Transactions</h2>
            </div>
        )
    }
}

export default TableTransactions;