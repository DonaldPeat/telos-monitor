import React, { Component } from 'react';
import nodeInfoAPI from '../scripts/nodeInfo';

class NodeInfo extends Component {
    constructor() {
        super();
        this.state = {
            nodeVersion: '-',
            currentBlockNumber: 0,
            lastIrrBlockNumber: 0,
            chainId:""
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
                    lastIrrBlockNumber: nodeInfo.last_irreversible_block_num,
                    chainId: nodeInfo.chain_id
                });
            }
        }, 1000);
    }

    render() {
        const { nodeVersion, currentBlockNumber, lastIrrBlockNumber, chainId } = this.state;
        return (
            <div className='node_info'>
                <h4>Node version: {nodeVersion}</h4>
                <h6>Chain id: {chainId}</h6>
                <h6>Block: {currentBlockNumber}</h6>
                <h6>Last irreversible block: {lastIrrBlockNumber}</h6>
            </div>
        );
    }
}

export default NodeInfo;