import React, {Component} from 'react';
import nodeInfoAPI from '../scripts/nodeInfo';

export default class NodeInfo extends Component {

	constructor(){
		super();
		this.state = {
			nodeVersion: '',
			currentBlockNumber: 0,
			lastIrrBlockNumber: 0
		};
	}

    async componentWillMount() {
        if (await this.getProducersInfo()) {
            await this.updateProducersInfo();
        }
    }

    componentDidMount() {
        let producerIndex = 0;
        setInterval(async () => {
            await this.getProducerLatency(producerIndex++);
            if (producerIndex > this.state.producers.length - 1) producerIndex = 0;
        }, 1000);
    }

    async updateProducersInfo() {
        setInterval(async () => {
            let nodeInfo = await nodeInfoAPI.getInfo();
            this.setState({
                nodeVersion: nodeInfo.server_version,
                currentBlockNumber: nodeInfo.head_block_num,
                lastIrrBlockNumber: nodeInfo.last_irreversible_block_num
            });
        }, 1000);
    }

	render(){

		const {nodeVersion, currentBlockNumber, lastIrrBlockNumber} = this.state;

		return (
			<div className='node_info'>
	            <h4>Block version: {nodeVersion}</h4>
	            <h6>Block: {currentBlockNumber}</h6>
	            <h6>Last irreversible block: {lastIrrBlockNumber}</h6>
			</div>
		);
	}
}