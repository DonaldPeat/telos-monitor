import React, { Component } from 'react';
import { Col, Table } from 'react-bootstrap'
import NodeInfoAPI from '../scripts/nodeInfo'
import ModalBlockInfo from './Modals/ModalBlockInfo'
import ModalTransactionInfo from './Modals/ModalTransactionInfo'
import { PacmanLoader } from 'react-spinners'

class TableBlockTransactions extends Component {
    constructor(props) {
        super(props);
        this.state = {
            blocksProduced: [],
            transactions: [],
            blockSelected: {},
            transactionSelected: {},
            isLoading: true,
            showModalBlockInfo: false,
            showModalTxInfo: false,
            isFindingBlocks: true
        }

        this.maxTableItems = 30;
    }

    async componentWillMount() {
        if (this.updateBlocksAndTransactions()) {
            setTimeout(() => this.updateBlocksAndTransactions(), 10000);
        }
    }

    async updateBlocksAndTransactions() {
        let nodeInfo = await NodeInfoAPI.getInfo();
        if (!nodeInfo) {
            this.setState({
                isLoading: false,
                isFindingBlocks: false
            });
            return false;
        }

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
                    if (tr.trx.transaction) {
                        tr.blockId = block.block_num;
                        arrTransactions.push(tr);
                    }
                }
            }
            blockNum--;
        }

        this.setState({
            blocksProduced: arrBlocksProduced,
            transactions: arrTransactions,
            isLoading: false
        });
    }

    renderBlocksTableBody() {
        if (this.state.blocksProduced.length > 0) {
            let body =
                <tbody>
                    {
                        this.state.blocksProduced.map((val, i) => {
                            return (
                                <tr key={i}>
                                    <td><a onClick={() => this.showHideModalBlockInfo(val)}>{val.block_num}</a></td>
                                    <td>{val.producer}</td>
                                    <td>{val.timestamp}</td>
                                    <td>{val.transactions.length}</td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            return body;
        } else if (this.state.blocksProduced.length < 1 && !this.state.isFindingBlocks) {
            return (
                <tbody>
                    <tr>
                        <td colSpan={4}>
                            <h3>Blocks not found</h3>
                        </td>
                    </tr>
                </tbody>
            );
        }
    }

    renderTransactionsTableBody() {
        if (this.state.transactions.length > 0) {
            let body =
                <tbody>
                    {
                        this.state.transactions.map((val, i) => {
                            return (
                                <tr key={i}>
                                    <td>
                                        <div style={{ whiteSpace: "noWrap", overflow: "hidden", textOverflow: "ellipsis", width: "25%" }}>
                                            <a onClick={() => this.showHideModalTransactionInfo(val)}>{val.trx.id}</a>
                                        </div>
                                    </td>
                                    <td>{val.blockId}</td>
                                    <td>{val.trx.transaction.expiration}</td>
                                    <td>{val.trx.transaction.actions.length}</td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            return body;
        } else if (this.state.transactions.length < 1 && !this.state.isFindingBlocks) {
            return (
                <tbody>
                    <tr>
                        <td colSpan={4}>
                            <h3>Transactions not found</h3>
                        </td>
                    </tr>
                </tbody>
            );
        }
    }

    showHideModalBlockInfo(blockSelected) {
        this.setState({
            blockSelected: blockSelected,

        });
        this.forceUpdate(() => {
            this.setState({
                showModalBlockInfo: !this.state.showModalBlockInfo
            });
        })
    }

    showHideModalTransactionInfo(txSelected) {
        this.setState({
            transactionSelected: txSelected
        });
        this.forceUpdate(() => {
            this.setState({
                showModalTxInfo: !this.state.showModalTxInfo
            });
        })
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
                        <div style={{ width: "20%", margin: "0 auto" }}>
                            <PacmanLoader
                                color="red" height={50} margin="3px"
                                loading={this.state.isLoading}
                            />
                        </div>
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
                        <div style={{ width: "20%", margin: "0 auto" }}>
                            <PacmanLoader
                                color="red"
                                loading={this.state.isLoading}
                            />
                        </div>
                    </div>
                </Col>

                <ModalBlockInfo show={this.state.showModalBlockInfo} onHide={() => this.showHideModalBlockInfo(null)} block={this.state.blockSelected} />
                <ModalTransactionInfo show={this.state.showModalTxInfo} onHide={() => this.showHideModalTransactionInfo(null)} tx={this.state.transactionSelected} />
            </div>
        )
    }
}

export default TableBlockTransactions;