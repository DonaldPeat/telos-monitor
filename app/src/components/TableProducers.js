import React, { Component } from 'react';
import { Grid, Row, Col, Table } from 'react-bootstrap'
import nodeInfoAPI from '../scripts/nodeInfo'
import getHummanTime from '../scripts/timeHelper'
import axios from 'axios';

class TableProducers extends Component {
    constructor(props) {
        super(props);
        this.state = {
            producers: [],
            activeProducerName: '',
            totalVotesWheight: 0,
            nodeVersion: '',
            currentBlockNumber: 0,
            blocksProduced: [],
            blockTime: 0,
            lastTimeProduced: [],
            lastIrrBlockNumber: 0,
            // currentLatency:0,
            producersLatency: []
        }
    }

    async componentWillMount() {
        await this.getProducersInfo();
        await this.updateProducersInfo();
    }

    componentDidMount() {
        let producerIndex = 0;
        setInterval(() => {
            this.getProducerLatency(producerIndex++);
            if (producerIndex > this.state.producers.length - 1) producerIndex = 0;
        }, 1000);
    }

    async getProducersInfo() {
        let data = await nodeInfoAPI.getProducers();
        let producers = data.rows;

        this.setState({
            producers: producers,
            totalVotesWheight: data.total_producer_vote_weight
        });
    }

    async updateProducersInfo() {
        let lastProducerIndex = 0;
        setInterval(async () => {
            let nodeInfo = await nodeInfoAPI.getInfo();
            let producerIndex = this.state.producers.findIndex((bp) => bp.owner == nodeInfo.head_block_producer);
            let blocksProduced = new Array(this.state.producers.length);
            let lastTimeProduced = new Array(this.state.producers.length);

            if (producerIndex > -1) {
                blocksProduced = this.state.blocksProduced;
                blocksProduced[producerIndex] = nodeInfo.head_block_num;

                lastTimeProduced = this.state.lastTimeProduced;
                lastTimeProduced[producerIndex] = nodeInfo.head_block_time;

                this.getProducerLatency(producerIndex);
                lastProducerIndex = lastProducerIndex;
            }

            this.setState({
                nodeVersion: nodeInfo.server_version,
                activeProducerName: nodeInfo.head_block_producer,
                currentBlockNumber: nodeInfo.head_block_num,
                blockTime: nodeInfo.head_block_time,
                lastIrrBlockNumber: nodeInfo.last_irreversible_block_num,
                blocksProduced: blocksProduced
            });
        }, 1000);
    }

    getLasTimeBlockProduced(bpBlockTime) {
        let bTime = new Date(bpBlockTime);
        bTime.setHours(bTime.getHours() - 7);
        bTime = Number(bTime);
        let now = Number(new Date());

        let lastTimeProduced = getHummanTime(Math.floor(now - bTime) / 1000);

        return lastTimeProduced;
    }

    getProducerPercentage(bp) {
        let producerPercentage = (parseFloat(bp.total_votes * 100)) / parseFloat(this.state.totalVotesWheight);
        let strProducerPercentage = producerPercentage.toString().match(/^-?\d+(?:\.\d{0,2})?/)[0];

        return strProducerPercentage;
    }

    getProducerLatency(producerIndex) {
        let timeOut = 3000;
        let timer;
        let url = this.state.producers[producerIndex].url;
        let pName = this.state.producers[producerIndex].owner;
        let start = new Date().getTime();
        let img = new Image();
        img.src = url;
        img.onload = pingCheck;
        img.onerror = pingCheck;
        let that = this;
        timer = setTimeout(pingCheck(), timeOut);
        function pingCheck(arg) {
            if (timer) clearTimeout(timer);

            let end = new Date().getTime();
            let latency = end - start;

            let pLatency = new Array(that.state.producers.length);
            pLatency = that.state.producersLatency;
            pLatency[producerIndex] = latency < timeOut ? latency : "-";
            that.setState({
                producersLatency: pLatency
            });
        }
    }

    renderTableBody() {
        if (this.state.producers) {
            let body =
                <tbody>
                    {
                        this.state.producers.map((val, i) => {
                            return (
                                <tr key={i}>
                                    <td>{val.owner == this.state.activeProducerName ? "Active" : i + 1}</td>
                                    <td>{val.owner}</td>
                                    <td>{this.state.producersLatency[i]} ms</td>
                                    <td>{val.owner == this.state.activeProducerName ? this.state.currentBlockNumber : this.state.blocksProduced[i]} </td>
                                    <td>{val.owner == this.state.activeProducerName ?
                                        "producing..." :
                                        this.getLasTimeBlockProduced(this.state.lastTimeProduced[i])}
                                    </td>
                                    {/* <td>-</td> */}
                                    <td>{this.getProducerPercentage(val) + "%"}</td>
                                </tr>
                            )
                        })
                    }
                </tbody>;
            return body;
        }
    }

    render() {
        return (
            <div>
                <h4>Block version: {this.state.nodeVersion}</h4>
                <h6>Block: {this.state.currentBlockNumber}</h6>
                <h6>Last irreversible block: {this.state.lastIrrBlockNumber}</h6>
                <div style={{ height: '56em', overflowY: 'scroll' }}>
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
            </div >
        );
    }
}


export default TableProducers;
