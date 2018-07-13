import React, { Component } from 'react';
import serverAPI from '../../scripts/serverAPI';
import { withRouter } from 'react-router-dom';
import { Row, Col, Table, Tooltip } from 'react-bootstrap'
import '../../styles/tableproducers.css'
import { CopyToClipboard } from 'react-copy-to-clipboard';

class TableP2Ps extends Component {
    constructor(props) {
        super(props);
        this.state = {
            accounts: [],
            peerAddresses: '',
            showCopiedTooltip: false
        }
    }

    componentWillMount() {
        serverAPI.getAllAccounts((res) => {
            var accnts = res.data;
            var peers = "";

            for (let i = 0; i < accnts.length - 1; i++) peers += `p2p-peer-address =  ${accnts[i].p2pServerAddress}\n`;

            this.setState({
                accounts: accnts,
                peerAddresses: peers
            });
        });
    }

    renderTableBody() {
        if (this.state.accounts.length > 0) {
            let body =
                <tbody>
                    {
                        this.state.accounts.map((val, i) => {
                            return (
                                <tr key={i}>
                                    <td>{i + 1}</td>
                                    <td>{val.name}</td>
                                    <td>{val.organization}</td>
                                    <td><a target="_blank" href={val.url}>{val.url}</a></td>
                                    <td>{val.httpServerAddress != "" ? val.httpServerAddress : val.httpsServerAddress}</td>
                                    <td>{val.p2pServerAddress}</td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            return body;
        }
    }

    copyAddress() {
        this.setState({
            showCopiedTooltip: !this.state.showCopiedTooltip
        });

        setTimeout(() => {
            this.setState({
                showCopiedTooltip: !this.state.showCopiedTooltip
            });
        }, 3000);
    }

    render() {
        return (
            <Row>
                <Col sm={12}>
                    <div style={{ display: "flex" }}>
                        <h2>Accounts peers</h2>
                        <CopyToClipboard text={this.state.peerAddresses}>
                            <button className="copyPeersBtn" onClick={() => this.copyAddress()}>
                                Copy peers addresses to clipboard
                                <i class="fa fa-clipboard" aria-hidden="true"></i>
                            </button>
                        </CopyToClipboard>
                        <Tooltip placement="right" className={this.state.showCopiedTooltip ? "in" : ""} id="tooltip-right">Copied</Tooltip>
                    </div>
                </Col>
                <Col sm={12}>
                    <div className="tableContainer">
                        <Table responsive>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Account</th>
                                    <th>Organization</th>
                                    <th>URL</th>
                                    <th>HTTP / HTTPS server address</th>
                                    <th>Peer server address</th>
                                </tr>
                            </thead>
                            {this.renderTableBody()}
                        </Table>
                    </div>
                </Col>
            </Row>
        );
    }
}

export default TableP2Ps;