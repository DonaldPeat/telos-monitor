import React, {Component} from 'react';
import nodeInfoAPI from '../scripts/nodeInfo';

export default class RotationDebug extends Component {

	constructor(props){
		super(props);

		this.state = {
			rotationTable: null,
			rotationSchedule: null,
			prevRotationTable: null
		};
	}

	componentDidMount(){
		setInterval(async () => {
			await this.updateRotationTable();
			await this.updateRotationSchedule();
		}, 1000);
	}



	async updateRotationTable(){
		const {rotationTable} = this.state;
		const newRotationTable = await this.getRotationTable();
		//console.log(newRotationTable);
		if(newRotationTable){
			if(!rotationTable){
				this.setState({rotationTable: newRotationTable});
				return;
			}
			if(newRotationTable.bp_currently_out === rotationTable.bp_currently_out) return;
			this.setState({
				prevRotationTable: rotationTable,
				rotationTable: newRotationTable
			});
			return;
		}
	}

	async updateRotationSchedule(){
		const newRotationSchedule = await this.getRotationSchedule();
		//console.log(newRotationSchedule);
		if(newRotationSchedule){
			this.setState({rotationSchedule: newRotationSchedule});
		}
	}

	sbpInActive(){
		const {rotationTable, rotationSchedule} = this.state;
		if(!rotationTable || !rotationSchedule) return 'not enough data';
		const {sbp_currently_in} = rotationTable;
		const activeProducers = rotationSchedule.active_schedule.producers;
		return activeProducers.findIndex(item => item.producer_name === sbp_currently_in);
	}

    async getRotationTable(){
      const rotation = await nodeInfoAPI.getProducersRotation();
      if(rotation && rotation.rows) return rotation.rows[0];
      return null;
    }

    async getRotationSchedule(){
		const producerInfo = await nodeInfoAPI.getInfo();
		if(producerInfo){
			const currentBlockNumber = producerInfo.head_block_num;
			if(currentBlockNumber === 0) return null;
			const blockHeaderState = await nodeInfoAPI.getBlockHeaderState(currentBlockNumber);
			return blockHeaderState;
		}
    }

	render(){
		const {rotationTable, rotationSchedule, prevRotationTable} = this.state;
		const {rotationStatus} = this.props;
		return (
			<div>
				<h3>pending version: {rotationSchedule ? rotationSchedule.pending_schedule.version : 'none yet'}</h3>
				<h3>active version: {rotationSchedule ? rotationSchedule.active_schedule.version : 'none yet'}</h3>
				<h4>next rotation: {rotationTable ? rotationTable.next_rotation_time : 'none yet'}</h4>
				<h4>Future BP Out: {rotationTable ? rotationTable.bp_currently_out : 'no table yet'}</h4>
				<h4>Future SBP In: {rotationTable ? rotationTable.sbp_currently_in : 'no table yet'}</h4>
				<h4>Previous BP Out: {prevRotationTable ? prevRotationTable.bp_currently_out : 'no table yet'}</h4>
				<h4>Previous SBP In: {prevRotationTable ? prevRotationTable.sbp_currently_in : 'no table yet'}</h4>
				<h6>{rotationSchedule ? rotationStatus : 'no status yet'}</h6>
				<h6>SBP array index: {this.sbpInActive()}</h6>
			</div>
		);
	}
}