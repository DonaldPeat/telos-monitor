import React, { Component } from 'react';
import '../../styles/tableproducers.css'
import { Row, Col, Table, Alert } from 'react-bootstrap'
import ModalProducerInfo from '../Modals/ModalProducerInfo'
import nodeInfoAPI from '../../scripts/nodeInfo'
import getHumanTime from '../../scripts/timeHelper'
import serverAPI from '../../scripts/serverAPI';
import ProducerMap from '../ProducerMap';

class TableProducers extends Component {
    constructor(props) {
        super(props);
        this.state = {
            accounts: [],
            producers: [],
            activeProducerName: '',
            totalVotesWheight: 0,
            currentBlockNumber: 0,
            blocksProduced: [],
            blockTime: 0,
            lastTimeProduced: [],
            producersLatency: [],
            showModalProducerInfo: false,
            producerSelected: ''
        }
    }

    componentWillMount() {
        serverAPI.getAllAccounts(async (res) => {
            this.setState({
                accounts: res.data
            });
            if (await this.getProducersInfo()) {
                await this.updateProducersInfo();
            }
        });
    }

    componentDidMount() {
        let producerIndex = 0;
        setInterval(async () => {
            await this.getProducerLatency(producerIndex);
            if (++producerIndex > this.state.producers.length - 1) producerIndex = 0;
        }, 1000);
    }

    async getProducersInfo() {
        let data = await nodeInfoAPI.getProducers();
        if (data != null) {
            let producers = data.rows;
            this.setState({
                producers: producers,
                totalVotesWheight: data.total_producer_vote_weight
            });
            return true;
        } else return false;
    }

    async updateProducersInfo() {
        if (this.state.producers.length > 0) {
            setInterval(async () => {
                let nodeInfo = await nodeInfoAPI.getInfo();
                if (nodeInfo != null) {
                    let producerIndex = this.state.producers.findIndex((bp) => bp.owner === nodeInfo.head_block_producer);
                    let blocksProduced = new Array(this.state.producers.length);
                    let lastTimeProduced = new Array(this.state.producers.length);

                    if (producerIndex > -1) {
                        blocksProduced = this.state.blocksProduced;
                        blocksProduced[producerIndex] = nodeInfo.head_block_num;

                        lastTimeProduced = this.state.lastTimeProduced;
                        lastTimeProduced[producerIndex] = nodeInfo.head_block_time;

                        await this.getProducerLatency(producerIndex);
                    }

                    this.setState({
                        activeProducerName: nodeInfo.head_block_producer,
                        currentBlockNumber: nodeInfo.head_block_num,
                        blockTime: nodeInfo.head_block_time,
                        blocksProduced: blocksProduced
                    });
                }
            }, 1000);
        }
    }

    getLastTimeBlockProduced(bpBlockTime) {
        let bTime = new Date(bpBlockTime);
        bTime = Number(bTime);
        let now = new Date();
        let utc = new Date(now.getTime() + now.getTimezoneOffset() * 60000);
        now = Number(utc);

        let lastTimeProduced = getHumanTime(Math.floor(now - bTime) / 1000);

        return lastTimeProduced;
    }

    getProducerPercentage(bp) {
        if (parseFloat(bp.total_votes) > 0) {
            let producerPercentage = (parseFloat(bp.total_votes * 100)) / parseFloat(this.state.totalVotesWheight);
            let strProducerPercentage = producerPercentage.toString().match(/^-?\d+(?:\.\d{0,2})?/)[0];

            return strProducerPercentage;
        }
        else return 0;
    }

    async getProducerLatency(producerIndex) {
        if (this.state.producers.length > 0 && this.state.accounts.length > 0) {
            let producerName = this.state.producers[producerIndex].owner;
            let matchedProducer = this.state.accounts.find((item) => item.name === producerName);
            let url = matchedProducer.p2pServerAddress;
            let result = await serverAPI.getEndpointLatency(url);
            let pLatency = new Array(this.state.producers.length);
            pLatency = this.state.producersLatency;
            let latency = result != null ? result.latency : "-";
            pLatency[producerIndex] = latency != "-" ? latency < 1000 ? latency : "-" : "-";
            this.setState({
                producersLatency: pLatency
            });
        }
    }

    showProducerInfo(producerSelected) {
        this.setState({
            producerSelected: producerSelected,
            showModalProducerInfo: !this.state.showModalProducerInfo
        });
    }

    renderTableBody() {
        if (this.state.producers.length > 0) {
            let prods = this.state.producers.filter(val => val.is_active === 1);
            let body =
                <tbody>
                    {
                        prods.map((val, i) => {
                            return (
                                <tr key={i} className={val.owner === this.state.activeProducerName ? "activeProducer" : ""}>
                                    <td>{i + 1}</td>
                                    <td>
                                        <a href="#" onClick={(e) => {
                                            e.preventDefault();
                                            this.showProducerInfo(val.owner);
                                        }}>
                                            {val.owner}
                                        </a>
                                    </td>
                                    <td>{this.state.producersLatency[i]} ms</td>
                                    <td>{val.owner === this.state.activeProducerName ? this.state.currentBlockNumber : this.state.blocksProduced[i] > 0 ? this.state.blocksProduced[i] : "-"} </td>
                                    <td>{val.owner === this.state.activeProducerName ?
                                        "producing blocks..." :
                                        this.getLastTimeBlockProduced(this.state.lastTimeProduced[i])}
                                    </td>
                                    {/* <td>organization</td> */}
                                    <td>{this.getProducerPercentage(val) + "%"}</td>
                                </tr>
                            )
                        })
                    }
                </tbody>;
            return body;
        } else return (<div></div>);
    }

    render() {
        if (this.state.producers.length > 0) {
            return (

                <div>
                    <Row>
                        <h2>Producers</h2>
                        <div className="tableContainer">
                            <Table responsive>
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Name</th>
                                        <th>Latency</th>
                                        <th>Last block</th>
                                        <th>Last time produced</th>
                                        {/* <th>Organization</th> */}
                                        <th>Votes</th>
                                    </tr>
                                </thead>
                                {this.renderTableBody()}
                            </Table>
                        </div>
                        {/*<ProducerMap />*/}
                        <ModalProducerInfo show={this.state.showModalProducerInfo} onHide={() => this.showProducerInfo('')} producername={this.state.producerSelected} />
                    </Row>
                </div>
            );
        } else return (
            <Alert bsStyle="warning">
                <strong>Warning:</strong> There are no producers found yet.
            </Alert>
        );
    }
}

export default TableProducers;
