import React, { Component } from 'react';
import nodeInfoAPI from '../scripts/nodeInfo';

class NodeInfo extends Component {
    constructor() {
        super();
        this.state = {
            nodeVersion: '-',
            currentBlockNumber: 0,
            lastIrrBlockNumber: 0
        };
    }

    async componentWillMount() {
        await this.updateProducersInfo();

    }

    async updateProducersInfo() {
        setInterval(async () => {
            let nodeInfo = await nodeInfoAPI.getInfo();
            if (nodeInfo != null) {
                this.setState({
                    nodeVersion: nodeInfo.server_version,
                    currentBlockNumber: nodeInfo.head_block_num,
                    lastIrrBlockNumber: nodeInfo.last_irreversible_block_num
                });
            }
        }, 1000);
    }

    render() {
        const { nodeVersion, currentBlockNumber, lastIrrBlockNumber } = this.state;
        return (
            <div className='node_info'>
                <h4>Block version: {nodeVersion}</h4>
                <h6>Block: {currentBlockNumber}</h6>
                <h6>Last irreversible block: {lastIrrBlockNumber}</h6>
            </div>
        );
    }
}

export default NodeInfo;