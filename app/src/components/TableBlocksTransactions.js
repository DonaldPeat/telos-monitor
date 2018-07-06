import React, { Component } from 'react';
import { Grid, Row, Col, Table } from 'react-bootstrap'
import NodeInfoAPI from '../scripts/nodeInfo'

class TableBlockTransactions extends Component {
    constructor(props) {
        super(props);
        this.state = {
            blocksProduced: [],
            transactions: []
        }

        this.maxTableItems = 30;
    }

    async componentWillMount() {
        this.updateBlocksAndTransactions();

        setTimeout(() => this.updateBlocksAndTransactions(), 10000);
    }

    async updateBlocksAndTransactions() {
        console.log("here")
        let nodeInfo = await NodeInfoAPI.getInfo();
        let blockNum = nodeInfo.head_block_num;

        let arrBlocksProduced = new Array(0);
        let arrTransactions = new Array(0);

        while (arrBlocksProduced.length < this.maxTableItems || arrTransactions.length < this.maxTableItems) {
            let block = await NodeInfoAPI.getBlockInfo(blockNum);
            if (arrBlocksProduced.length < this.maxTableItems) {
                arrBlocksProduced.push(block);
            }

            if (block.transactions) {
                let trx = block.transactions;
                for (let i = 0; i < trx.length; i++) {
                    let tr = trx[i];
                    if(tr.trx.transaction){
                        tr.blockId = block.block_num;
                        arrTransactions.push(tr);
                    }
                }
            }
            blockNum--;
        }

        this.setState({
            blocksProduced: arrBlocksProduced,
            transactions: arrTransactions
        });
    }

    renderBlocksTableBody() {
        if (this.state.blocksProduced) {
            let body =
                <tbody>
                    {
                        this.state.blocksProduced.map((val, i) => {
                            return (
                                <tr key={i}>
                                    <td>{val.block_num}</td>
                                    <td>{val.producer}</td>
                                    <td>{val.timestamp}</td>
                                    <td>{val.transactions.length}</td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            return body;
        }
    }

    renderTransactionsTableBody() {
        if (this.state.transactions) {
            let body =
                <tbody>
                    {
                        this.state.transactions.map((val, i) => {
                            return ( 
                                <tr key={i}>
                                    <td>{val.trx.id}</td>
                                    <td>{val.blockId}</td>
                                    <td>{val.trx.transaction.expiration}</td>
                                    <td>{val.trx.transaction.actions.length}</td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            return body;
        }
    }

    render() {
        return (
            <div>
                <Col xs={6}>
                    <h2>Blocks</h2>
                    <h6>Last 30 blocks produced</h6>
                    <div style={{ height: '15em', overflowY: 'scroll' }}>
                        <Table responsive>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Producer</th>
                                    <th>Timestamp</th>
                                    <th>Trx</th>
                                </tr>
                            </thead>
                            {this.renderBlocksTableBody()}
                        </Table>
                    </div>
                </Col>
                <Col xs={6}>
                    <h2>Transactions</h2>
                    <h6>Last 30 transactions</h6>
                    <div style={{ height: '15em', overflowY: 'scroll' }}>
                        <Table responsive>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>BlockId</th>
                                    <th>Expiration</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            {this.renderTransactionsTableBody()}
                        </Table>
                    </div>
                </Col>
            </div>
        )
    }
}

export default TableBlockTransactions;