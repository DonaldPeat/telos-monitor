import React, { Component } from 'react';
import { Row, Col, Table, Alert, Button } from 'react-bootstrap'
import NodeInfoAPI from '../../scripts/nodeInfo'
import ModalBlockInfo from '../Modals/ModalBlockInfo'
import ModalTransactionInfo from '../Modals/ModalTransactionInfo'
import { PacmanLoader } from 'react-spinners'
import { withRouter } from 'react-router-dom';
import FormTextboxButton from '../FormControls/FormTextboxButton'
import nodeInfo from '../../scripts/nodeInfo';

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
            isFindingBlocks: true,
            blockNumberSearch: "",
            txIdBlckNumberFilter: ""
        }

        this.maxTableItems = 30;
    }

    async componentWillMount() {
        if (this.updateBlocksAndTransactions()) {
            setTimeout(() => this.updateBlocksAndTransactions(), 30000);
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
            if (block != null) {
                if (arrBlocksProduced.length < this.maxTableItems) {

                    if (block.transactions.length > 0) {
                        arrBlocksProduced.push(block);
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
                    this.setState({
                        blocksProduced: arrBlocksProduced,
                        transactions: arrTransactions,
                        isLoading: false
                    });
                }
            } else {
                this.setState({
                    isLoading: false
                });
            }
        }
    }

    renderBlocksTableBody() {
        if (this.state.blocksProduced.length > 0) {
            let body =
                <tbody>
                    {
                        this.state.blocksProduced.map((val, i) => {
                            return (
                                <tr key={i}>
                                    <td>{i + 1}</td>
                                    <td>
                                        <a href="#"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                this.showHideModalBlockInfo(val);
                                            }}>
                                            {val.block_num}
                                        </a>
                                    </td>
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
                            <Alert bsStyle="warning">
                                <strong>Warning:</strong> Blocks not found
                        </Alert>
                        </td>
                    </tr>
                </tbody>
            );
        }
    }

    renderTransactionsTableBody() {
        if (this.state.transactions.length > 0) {
            let tx;

            if (this.state.txIdBlckNumberFilter === "") tx = this.state.transactions;
            else {
                tx = isNaN(this.state.txIdBlckNumberFilter) ?
                this.state.transactions.filter(val => val.trx.id === this.state.txIdBlckNumberFilter)
                :
                this.state.transactions.filter(val => val.blockId == this.state.txIdBlckNumberFilter)
            }

            let body =
                <tbody>
                    {
                        tx.map((val, i) => {
                            return (
                                <tr key={i}>
                                    <td>
                                        <div style={{ whiteSpace: "noWrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                            <a href="#" onClick={() => this.showHideModalTransactionInfo(val)}>{val.trx.id}</a>
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
                            <Alert bsStyle="warning">
                                <strong>Warning:</strong> Transactions not found
                        </Alert>
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
    onBlockSearchChange(arg) {
        var value = arg.target.value.trim();

        if (!isNaN(value)) this.setState({ blockNumberSearch: value });
    }

    onSearchButtonClicked() {
        NodeInfoAPI.getBlockInfo(this.state.blockNumberSearch).then(b => {
            if (b) this.showHideModalBlockInfo(b);
            else alert("block not found");
        }).catch(err => alert(err));
    }

    onTxIdBlockIdChange(arg) {
        let value = arg.target.value.trim();

        this.setState({ txIdBlckNumberFilter: value });
    }

    onTxIdBlckIdSearch() {
        if (isNaN(this.state.txIdBlckNumberFilter)) {
            nodeInfo.getTransactionInfo(this.state.txIdBlckNumberFilter).then(tx => {
                console.log(tx);
                // if (tx) this.showHideModalTransactionInfo(tx);
                // else alert("tx not found");
            }).catch(err => alert(err));
        }

    }

    render() {
        const { pathname } = this.props.location;
        const renderBlocks = () => {
            return (
                <div>
                    <Row>
                        <Col sm={7}>
                            <h2>Blocks</h2>
                            <h6>Last 30 blocks produced</h6>
                        </Col>
                        <Col sm={5}>
                            <FormTextboxButton
                                id="txtbBlockId"
                                buttonname="Search"
                                type="text"
                                hasbutton={true}
                                placeHolder="Filter by block id"
                                value={this.state.blockNumberSearch}
                                buttonclicked={() => this.onSearchButtonClicked()}
                                onChange={(arg) => this.onBlockSearchChange(arg)}
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={12}>
                            <div className="tableContainer">
                                <Table responsive>
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Block id</th>
                                            <th>Producer</th>
                                            <th>Timestamp</th>
                                            <th>Trx</th>
                                        </tr>
                                    </thead>
                                    {this.renderBlocksTableBody()}
                                </Table>
                                <div className="loadingContainer">
                                    <h4>{this.state.isLoading ? "Loading blocks..." : ""}</h4>
                                    <PacmanLoader
                                        margin="0px 0px 0px 45px"
                                        color="#DF4D31"
                                        loading={this.state.isLoading}
                                    />
                                </div>
                            </div>
                        </Col>
                    </Row>
                </div>
            );
        };

        const renderTransactions = () => {
            return (
                <div>
                    <Row>
                        <Col xs={7}>
                            <h2>Transactions</h2>
                            <h6>Last 30 transactions</h6>
                        </Col>
                        <Col xs={5}>
                            <FormTextboxButton
                                id="txtbTxIdBlckId"
                                buttonname="Search"
                                type="text"
                                hasbutton={true}
                                value={this.state.txIdBlckNumberFilter}
                                onChange={(arg) => this.onTxIdBlockIdChange(arg)}
                                buttonclicked={() => this.onTxIdBlckIdSearch()}
                                placeHolder="Filter by tx id or block number"
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={12}>
                            <div className="tableContainer">
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
                                <div className="loadingContainer">
                                    <h4>{this.state.isLoading ? "Loading transactions..." : ""}</h4>
                                    <PacmanLoader
                                        margin="0px 0px 0px 45px"
                                        color="#DF4D31"
                                        loading={this.state.isLoading}
                                    />
                                </div>
                            </div>
                        </Col>
                    </Row>
                </div>
            );
        };

        return (
            <div>
                {pathname === '/blocks' ? renderBlocks() : renderTransactions()}
                <ModalBlockInfo show={this.state.showModalBlockInfo} onHide={() => this.showHideModalBlockInfo(null)} block={this.state.blockSelected} />
                <ModalTransactionInfo show={this.state.showModalTxInfo} onHide={() => this.showHideModalTransactionInfo(null)} tx={this.state.transactionSelected} />
            </div>
        )
    }
}

export default withRouter(TableBlockTransactions);