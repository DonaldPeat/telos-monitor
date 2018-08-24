import React, {Component} from 'react';
import nodeInfoAPI from '../../scripts/nodeInfo';
import serverAPI from '../../scripts/serverAPI';
import getHumanTime from '../../scripts/timeHelper';
import FormTextboxButton from '../FormControls/FormTextboxButton';
import ModalProducerInfo from '../Modals/ModalProducerInfo';
import nodeFlag from '../../scripts/constants';
import {displayTwoDigits} from '../../scripts/utils';

import '../../styles/tableproducers.css';

export default class TableProducers extends Component {
	constructor(){
		super();
		this.state = {
			accounts: [],
			producers: [],
			activeProducerName: '',
			currentBlockNumber: 0,
			blocksProduced: [],
			blockTime: 0,
			lastTimeProduced: [],
			producersLatency: [],
			showModalProducerInfo: false,
			producerSelected: '',
			producerFilter: '',
			percentageVoteStaked: '',
			totalVotesStaked: 0,
			sortBy: '',
			previousRotationTable: null,
			rotationTable: null,
			scheduleVersion: 0,
			lastRotationTime: null,
			rotationStatus: nodeFlag.WAITING_FOR_PROPOSAL,
			countdownStatus: nodeFlag.COUNTDOWN_ACTIVE,
		};

		this.totalTLOS = 190473249.0000;
	}

	async componentWillMount() {
		serverAPI.getAllAccounts(async(res) => {
			this. setState({accounts: res.data});
		});

		if (await this.getProducersInfo()) {
			await this.updateProducersInfo();
		}
	}

	componentDidMount() {
		let producerIndex = 0;

		this.initRotationData();

		setInterval(async() => {
			if (++producerIndex > this.state.producers.length - 1) producerIndex = 0;
		}, 1000);
	}

	async initRotationData(){
		let {currentBlockNumber} = this.state;
		if(!currentBlockNumber){
			const nodeInfo = await nodeInfoAPI.getInfo();
			if(nodeInfo != null){
				currentBlockNumber = nodeInfo.head_block_num;
				this.setState({currentBlockNumber: nodeInfo.head_block_num});
			}else{
				console.error('endpoint can\'t be reached. Server might be down.');
				return;
			}
		}//have current block number
		
		const rotationTable = await this.getRotationTable();
		if(!rotationTable) return;

		const rotationSchedule = await this.getRotationSchedule();
		if(!rotationSchedule) return;

		//if rotation times are equal, no rotation
		if(rotationTable.next_rotation_time !== rotationTable.last_rotation_time){
			const {bp_currently_out, sbp_currently_in} = rotationTable;
			const rsPendingVersion = rotationSchedule.pending_schedule.version;
			const rsHeaderVersion = rotationSchedule.header.schedule_version;
			//if bps aren't blank
			if(
				bp_currently_out != '' &&
				sbp_currently_in != ''
			){
				if(rsPendingVersion > rsHeaderVersion){
					this.setState({rotationStatus: nodeFlag.SCHEDULE_PENDING});
				}else{
					//schedule versions are equal
					//check which bp is in which array to determine status
					const pendingScheduleProducers = rotationSchedule.pending_schedule.producers;
					const activeScheduleProducers = rotationSchedule.active_schedule.producers;

					// if(pendingScheduleProducers.findIndex(bp => bp.producer_name === sbp_currently_in) > -1){
					// 	//sbp is in pending array, so status is pending
					// 	this.setState({rotationStatus: nodeFlag.SCHEDULE_PENDING});
					// }else if(activeScheduleProducers.findIndex(bp => bp.producer_name === sbp_currently_in) > -1){
					// 	//sbp is in active schedule, but must check if bp out is still in active.
					// 	const bp_out_index = activeScheduleProducers.findIndex(bp => bp.producer_name === bp_currently_out);
					// 	//if bp_out is in active schedule producers, it's pending.
					// 	bp_out_index > -1 ? this.setState({rotationStatus: nodeFlag.SCHEDULE_PENDING}) : this.setState({rotationStatus : nodeFlag.ROTATION_ACTIVE});
					// }
					
					
					if(inProducerArray(pendingScheduleProducers, sbp_currently_in)){
						//sbp is in pending producer array, schedule is pending
						this.setState({rotationStatus: nodeFlag.SCHEDULE_PENDING});
					}else if(inProducerArray(activeScheduleProducers, sbp_currently_in)){
						
						//check if bp_out is in active schedule producers.
						const bp_out_in_active = inProducerArray(activeScheduleProducers, bp_currently_out);
						if(bp_out_in_active) this.setState({rotationStatus: nodeFlag.SCHEDULE_PENDING});
						else this.setState({rotationStatus: nodeFlag.ROTATION_ACTIVE});
					}
				}
			}
		}
		
		//helper functions
		const inProducerArray = (arr, needle) => {
			return arr.findIndex(bp => bp.producer_name === needle);
		};
	}

/*    //init schedule version and last block rotated time
    async initRotationData() {
      if(!this.state.currentBlockNumber) {
        const nodeInfo = await nodeInfoAPI.getInfo();
        if(nodeInfo != null) this.setState({currentBlockNumber: nodeInfo.head_block_num});
        else {
          // console.error('endpoint can\'t be reached.');
          return;
        }
      }

      const rotation = await nodeInfoAPI.getProducersRotation();

      if(rotation == null) return;
      if(rotation.rows[0] == null) return;

      const rotationTable = rotation.rows[0];
      const blockHeaderState = await nodeInfoAPI.getBlockHeaderState(this.state.currentBlockNumber);;

      // Network is activated and there is a time to propose a new schedule
      if (rotationTable.next_rotation_time !== rotationTable.last_rotation_time) { 
        //if there is a schedule already proposed
        if(rotationTable.bp_currently_out != "" && rotationTable.sbp_currently_in != "") {
          if(blockHeaderState == null) return;
          //verify peding schedule version
          if(blockHeaderState.pending_schedule.version > blockHeaderState.header.version) this.setState({rotationStatus: nodeFlag.SCHEDULE_PENDING}); 
          else {
            //verify if sbp in is in the peding and active schdule
            const pendingProducersSchedule = blockHeaderState.active_schedule.producers;
            const activeProducersSchedule = blockHeaderState.active_schedule.producers;
            
            if(pendingProducersSchedule.findIndex(bp=> bp.producer_name === rotationTable.sbp_currently_in) > -1){
              this.setState({rotationStatus: nodeFlag.SCHEDULE_PENDING});
            }
            else if(activeProducersSchedule.findIndex(bp=> bp.producer_name === rotationTable.sbp_currently_in) > -1)
            {
              // console.log('rotation active set in init');
              // this.setState({rotationStatus: nodeFlag.ROTATION_ACTIVE});
              // this.rotateBlockProducers();

              // if bp out is still in active producers array, then we don't have an active schedule yet
              if(activeProducersSchedule.findIndex(bp => bp.producer_name === rotationTable.bp_currently_out) > -1){
                this.setState({rotationStatus: nodeFlag.SCHEDULE_PENDING});
              }else{
                //bp out has changed
                this.setState({rotationStatus: nodeFlag.ROTATION_ACTIVE});
              }
            } 
          }
        } else this.setState({rotationStatus: nodeFlag.EMPTY_ROTATION_TABLE});
      } else this.setState({rotationStatus: nodeFlag.EMPTY_ROTATION_TABLE});
      
      // console.log("rotation 1 ", rotationTable);
      console.log('rotation table set in init');
      this.setState({
        rotationTable: rotationTable,
         scheduleVersion: blockHeaderState != null ? blockHeaderState.header.version : 0
      });
      // this.setState({
      //   rotationTable: testTable,
      //   scheduleVersion: blockHeaderState != null ? blockHeaderState.header.version : 0
      // });
    }*/	

	//update methods. These are called every second or so

    //gets producers from server, reorders them
    async updateProducersOrder(){
     	let newProd = [];
     	const {producers} = this.state;
     	if(producers.length < 1) return;
     	const newProdData = await nodeInfoAPI.getProducers();
     	// console.log(newProdData.rows);
    	if(newProdData != null){
	        for(let i = 0; i < newProdData.rows.length; i++){
	        	const thisOwner = newProdData.rows[i].owner;
	        	const thisRow = producers.find(row => row.owner === thisOwner);
	        	newProd[i] = thisRow;
	    	}

	        //set state, remove empty values if they exist
	        this.setState({
	        	producers: newProd.filter(el => {
	            	if(!el) return false;
	            	if(!el.owner) return false;
	            	return true;
	          	})
	        });
      	}
    }


	async updateProducersInfo() {
		let data = await nodeInfoAPI.getGlobalState();
		// 10000 decimals
		let totalVoteStaked = data.rows[0].total_activated_stake / 10000;

		if (totalVoteStaked !== 0) {
		  let percentage = (totalVoteStaked * 100) / this.totalTLOS;
		  this.setState({
		    totalVotesStaked: totalVoteStaked,
		    percentageVoteStaked:
		        percentage.toString().match(/^-?\d+(?:\.\d{0,2})?/)[0]
		  });


		  if (this.state.producers.length > 0) {
		    setInterval( async () => {
		      let nodeInfo = await nodeInfoAPI.getInfo();
		      if (nodeInfo != null) {
		        const producerIndex = this.state.producers.findIndex(bp => bp.owner === nodeInfo.head_block_producer);
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
	}


    //check if there's a more recent rotationTable.  If so, save to state
    async updateRotationTable(){
    	const {rotationTable, rotationStatus} = this.state;
    	const newRotation = await this.getRotationTable();
    	if(!newRotation){
    		console.log('no new rotation. NO_ROTATION set in checkForNewRotationTable');
    		this.setState({rotationStatus: nodeFlag.NO_ROTATION});
    		return;
    	}
    	if(rotationTable){
    		if(rotationTable.bp_currently_out === newRotation.bp_currently_out) return;
    		this.setState({
    			previousRotationTable: rotationTable,
    			rotationTable: newRotation
    		});
    	}else{
    		this.setState({rotationTable: newRotation});
    	}
    }

    async updateRotationStatus(){

    }


    //get methods.  These retrieve data
    getRotationStatus(){
    	const nextRotation = this.getNextRotation();
    	const {rotationStatus, producers} = this.state;

    	let rotationMessage = '';
    	switch(rotationStatus){
    		case nodeFlag.ROTATION_ACTIVE:
    			rotationMessage = nextRotation;
    			break;
    		case nodeFlag.WAITING_FOR_PROPOSAL:
    			rotationMessage = 'Waiting for a proposal';
    			break;
    		case nodeFlag.SCHEDULE_PENDING:
    			rotationMessage = `New schedule pending, ${nextRotation}`;
    			break;
    		case nodeFlag.EMPTY_ROTATION_TABLE:
    			var activeVotedProds = producers.filter(bp=> bp.is_active == 1 && bp.total_votes > 0);
		        if(this.state.percentageVoteStaked == '' || parseInt(this.state.percentageVoteStaked) < 15) rotationMessage = 'The network is inactive';
		        else{
		        	if(activeVotedProds.length < 22) rotationMessage = `No rotation, there are ${producers.length} producers.`;
		            else rotationMessage = nextRotation;
		        }
    			break;
    		case nodeFlag.NO_ROTATION:
    			rotationMessage = nextRotation;
    			break;
    		default:
    			rotationMessage = nextRotation;
    			break;
    	}
    	return rotationMessage;
    }

    //rotation timer.  can also return COUNTDOWN_EXPIRED, EMPTY_ROTATION_TABLE, or NO_ROTATION
    getNextRotation() {
    	const {rotationTable, countdownStatus} = this.state;
    	if(rotationTable != null) {
    		if(!rotationTable.bp_currently_out && !rotationTable.sbp_currently_in) return nodeFlag.EMPTY_ROTATION_TABLE;

    		let timeFuture = new Date(rotationTable.next_rotation_time);
    		timeFuture = new Date(timeFuture.setHours(timeFuture.getHours() - 7));
    		let now = new Date();            
    		now = new Date(now.toUTCString());
        	now.setHours(timeFuture.getHours());

			//Should be updated to get hours
			//get total seconds
			let timer = (timeFuture - now)/1000;

			let hours = Math.floor(timer / 3600);
			let minutes = Math.floor(timer / 60);
			let seconds = Math.floor(timer - minutes * 60);

			if(timer <= 0) return nodeFlag.COUNTDOWN_EXPIRED;
          
          	//format is 00:00:00
          	return `${displayTwoDigits(hours)}:${displayTwoDigits(minutes)}:${displayTwoDigits(seconds)}`;
      	}
        //no rotation yet
        return nodeFlag.NO_ROTATION;
    }

	getLastTimeBlockProduced(bpLastTimeProduced, headBlockTime) {
		let bpTime = new Date(bpLastTimeProduced);
		let headTime = new Date(headBlockTime);
		bpTime = Number(bpTime);
		headTime = Number(headTime);

		let lastTimeProduced = getHumanTime(Math.floor(headTime - bpTime) / 1000);
		return lastTimeProduced;
	}

	getProducerPercentage(bp){
		if(parseFloat(bp.total_votes) > 0 && this.state.totalVotesStaked > 0){
			let bpVote = bp.total_votes / 10000;
			let producerPercentage = (bpVote * 100) / this.state.totalVotesStaked;
			let strProducerPercentage = producerPercentage.toString().match(/^-?\d+(?:\.\d{0,2})?/)[0];
			return strProducerPercentage;
		}else{
			return 0;
		}
	}

    async getProducersInfo() {
        let data = await nodeInfoAPI.getProducers();
        if (data != null) {
            let producers = data.rows;
            // console.log({producers: producers});
            this.setState({
                producers: producers,
                totalVotesWheight: data.total_producer_vote_weight
            });
            return true;
        } else return false;
    }

    //retrieve current rotation table
    async getRotationTable(){
    	const rotation = await nodeInfoAPI.getProducersRotation();
    	if(rotation){
    		if(rotation.rows) return rotation.rows[0];
    	}
    	return null;
    }

    async getRotationSchedule(){
      let {currentBlockNumber} = this.state;
      if(!currentBlockNumber){
        const producerInfo = await nodeInfoAPI.getInfo();
        currentBlockNumber = producerInfo.head_block_num;
      }
      if(currentBlockNumber === 0) return undefined;
      else{
        const blockHeaderState = await nodeInfoAPI.getBlockHeaderState(currentBlockNumber);
        return blockHeaderState;
      }
    }

    getLastTimeBPsRotated() {
        if(this.state.rotationTable != null) {
            let time = new Date(this.state.rotationTable.last_rotation_time);
            let item= <p>{`UTC ${time.toLocaleString()}`}</p>;
            return item;
        }
    }

    //events (?)
    onProducerFilterChange(arg) {
        let value = arg.target.value.trim();
        this.setState({ producerFilter: value });
    }


    render(){
    	return (
    		<div></div>
    	);
    }
}