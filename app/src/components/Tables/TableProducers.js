import '../../styles/tableproducers.css'
import React, {Component} from 'react';
import {Alert, Col, ProgressBar, Row, Table, Popover} from 'react-bootstrap'
import nodeInfoAPI from '../../scripts/nodeInfo'
import serverAPI from '../../scripts/serverAPI';
import getHumanTime from '../../scripts/timeHelper'
import FormTextboxButton from '../FormControls/FormTextboxButton'
import ModalProducerInfo from '../Modals/ModalProducerInfo'
import nodeFlag from '../../scripts/constants';
import {displayTwoDigits} from '../../scripts/utils';

const testTable = {  
   "bp_currently_out":"prodnamejogz",
   "sbp_currently_in":"prodnamefjkk",
   "bp_out_index":4,
   "sbp_in_index":25,
   "next_rotation_time":"2018-08-22T00:10:55.500",
   "last_rotation_time":"2018-08-22T00:25:55.500"
};

class TableProducers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      accounts: [],
      producers: [],
      activeProducerName: '',
      //   totalVotesWheight: 0,
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
    }

    this.totalTLOS = 190473249.0000;

    this.updateProducersOrder = this.updateProducersOrder.bind(this);
    this.sortByName = this.sortByName.bind(this);
    this.sortByNameReverse = this.sortByNameReverse.bind(this);
    this.rotateBlockProducers = this.rotateBlockProducers.bind(this);
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
      await this.checkForNewRotationTable();
      await this.updateRotationStatus();
      await this.updateProducersOrder();
      await this.getProducerLatency(producerIndex);
      if (++producerIndex > this.state.producers.length - 1) producerIndex = 0;
    }, 1000);
  }
  
    //gets producers, reorders them
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

        this.rotateBlockProducers();

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

    async updateRotationStatus(){
      console.log(this.state.rotationTable);
      //timer
      const nextRotation = this.getNextRotation();
      //console.log(nextRotation);
      //state
      const {lastRotationTime, rotationTable, scheduleVersion, rotationStatus} = this.state;
      if(nextRotation === nodeFlag.COUNTDOWN_EXPIRED){
        this.setState({rotationStatus: nodeFlag.WAITING_FOR_PROPOSAL});
        return;
      }
      
      if(!this.state.rotationTable){
        // console.log('No rotation table found');
        return;
      }

      //check for no rotation
      if(rotationTable.next_rotation_time != rotationTable.last_rotation_time){
        if(rotationTable.sbp_currently_in === '' && rotationTable.bp_currently_out === ''){
          this.setState({rotationStatus: nodeFlag.EMPTY_ROTATION_TABLE});
          return
        }
      }else{
        this.setState({rotationStatus: nodeFlag.EMPTY_ROTATION_TABLE});
        return;
      }
      
      if(!lastRotationTime){
        //if none, we're gonna initialize it.
        const initRotationTable = await this.getRotationTable();
        this.setState({lastRotationTime: initRotationTable.last_rotation_time});
      }

      //compare timestamp of last rotation.  If newer, we have a proposal
      if(
        new Date(lastRotationTime) < new Date(rotationTable.last_rotation_time) ||
        nextRotation != nodeFlag.COUNTDOWN_EXPIRED ||
        rotationStatus === nodeFlag.SCHEDULE_PENDING
      ){
        //console.log('not waiting.  Conditions met.');
        const rs = await this.getRotationSchedule();
        //no rotation schedule
        if(!rs){
          console.log('No rotation schedule found');
          this.setState({rotationStatus: nodeFlag.WAITING_FOR_PROPOSAL});
          return;
        }

        const rsHeaderVersion = rs.header.schedule_version;
        const rsPendingVersion = rs.pending_schedule.version;
        const rsActiveVersion = rs.active_schedule.version;

        if(rsHeaderVersion === rsPendingVersion === rsActiveVersion){
          // console.log('all versions equal');
          this.setState({rotationStatus: nodeFlag.WAITING_FOR_PROPOSAL});
          return;
        }

        //must save last rotation timestamp
        this.setState({lastRotationTime: rotationTable.last_rotation_time});

        // console.log(`pending: ${rsPendingVersion}, active: ${rsHeaderVersion}`);

        if(rsPendingVersion > rsHeaderVersion){
          console.log('set pending after rsPendingVersion > rsHeaderVersion');
          this.setState({rotationStatus: nodeFlag.SCHEDULE_PENDING});
        }else{
          const activeProducers = rs.active_schedule.producers;
          const pendingProducers = rs.pending_schedule.producers;
         
          const {sbp_currently_in} = rotationTable;
          
          if(pendingProducers.findIndex(bp=> bp.producer_name === sbp_currently_in) > -1){
            console.log('set pending after findIndex producer name in pendingProducers')
            this.setState({rotationStatus: nodeFlag.SCHEDULE_PENDING});
          }
          else if(activeProducers.findIndex(bp=> bp.producer_name === sbp_currently_in) > -1)
          {
            //console.log('rotation active in update');
            this.setState({rotationStatus: nodeFlag.ROTATION_ACTIVE});
            this.rotateBlockProducers();
          } else{
            console.log('set pending after versions match, but sbp not in arrays');
            this.setState({rotationStatus: nodeFlag.SCHEDULE_PENDING});
            //console.log('countdown started, but sbp not in pending or active');
          }
        }
        return;

      } else{
        const rs = await this.getRotationSchedule();
        if(rs){
          if(rs.pending_schedule.version > rs.header.schedule_version){
            console.log('set pending after conditions not met, but pending version > header version');
            this.setState({rotationStatus: nodeFlag.SCHEDULE_PENDING});
            return;
          }
        }

        //either active rotation, or waiting for proposal.
        if(rotationStatus != nodeFlag.WAITING_FOR_PROPOSAL){ 
          // console.log('no new rotation table, not pending');
          this.setState({rotationStatus: nodeFlag.WAITING_FOR_PROPOSAL});
        }
        return;
      }
    }

    //init schedule version and last block rotated time
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
              this.setState({rotationStatus: nodeFlag.ROTATION_ACTIVE});
              this.rotateBlockProducers();
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
    }

    async getRotationSchedule(){
      let {currentBlockNumber} = this.state;
      if(!currentBlockNumber){
        const producerInfo = await nodeInfoAPI.getInfo();
        currentBlockNumber = producerInfo.head_block_num;
      }
      if(currentBlockNumber === 0) {
        const blockHeaderState = await nodeInfoAPI.getBlockHeaderState(currentBlockNumber);
        return blockHeaderState;
      }
    }

    //need to figure out what this function does
    async rotateBlockProducers(){
        if(this.state.rotationStatus != nodeFlag.ROTATION_ACTIVE) return;

        const rotation = await nodeInfoAPI.getProducersRotation();
        if(rotation){
          // console.log('rotationTable set in rotateBlockProducers');
          this.setState({rotationTable: rotation.rows[0]}); //not sure this is actually necessary
          
        //bps out of index
        if(rotation.bp_out_index >= 21 && rotation.sbp_in_index >= 51) return;
        } else{
          this.setState({rotationStatus: nodeFlag.NO_ROTATION});
        }
    }

    async checkForNewRotationTable(){
      const {rotationTable, rotationStatus} = this.state;
      if(rotationStatus != nodeFlag.WAITING_FOR_PROPOSAL) return;
      const rotation = await nodeInfoAPI.getProducersRotation();
      
      if(rotation != null && rotationTable != null){
        const newRotationTable = rotation.rows[0];
        if(rotationTable.bp_currently_out != newRotationTable.bp_currently_out){
          //new table
          console.log('rotationTable set in checkForNewRotationTable');
          this.setState({
            rotationTable: newRotationTable,
            previousRotationTable: rotationTable
          });
        }
      }
    }

    async getRotationTable(){
      const rotation = await nodeInfoAPI.getProducersRotation();
      if(rotation) return rotation.rows[0];
      return null;
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
        setInterval(async() => {
          let nodeInfo = await nodeInfoAPI.getInfo();
          if (nodeInfo != null) {
            let producerIndex = this.state.producers.findIndex(
                bp => bp.owner === nodeInfo.head_block_producer);
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

  getLastTimeBlockProduced(bpLastTimeProduced, headBlockTime) {
    let bpTime = new Date(bpLastTimeProduced);
    let headTime = new Date(headBlockTime);
    bpTime = Number(bpTime);
    headTime = Number(headTime);

    let lastTimeProduced = getHumanTime(Math.floor(headTime - bpTime) / 1000);
    return lastTimeProduced;
  }

  getProducerPercentage(bp) {
    if (parseFloat(bp.total_votes) > 0 && this.state.totalVotesStaked > 0) {
      //   console.log(bp.owner, bp.total_votes / 10000);
      let bpVote = bp.total_votes / 10000;
      let producerPercentage = (bpVote * 100) / this.state.totalVotesStaked;
      let strProducerPercentage =
          producerPercentage.toString().match(/^-?\d+(?:\.\d{0,2})?/)[0];

      return strProducerPercentage;
      }
    else
      return 0;
    }

  async getProducerLatency(producerIndex) {
    if (this.state.producers.length > 0 && this.state.accounts.length > 0) {
      let producerName = this.state.producers[producerIndex].owner;
      let matchedProducer = this.state.accounts.find((item) => item.name === producerName);
      
      if (matchedProducer) {
        let url = matchedProducer.p2pServerAddress;
        let result = await serverAPI.getEndpointLatency(url);
        let pLatency = new Array(this.state.producers.length);
        pLatency = this.state.producersLatency;
        let latency = result != null ? result.latency : '-';
        pLatency[producerIndex] =
            latency != '-' ? latency < 1000 ? latency : '-' : '-';
        this.setState({producersLatency: pLatency});
      }
    }
  }
  
  showProducerInfo(producerSelected) {
    this.setState({
      producerSelected: producerSelected,
    });
    this.forceUpdate(() => {
      this.setState({showModalProducerInfo: !this.state.showModalProducerInfo});
    });
  }
  
    sortByName(producers){
        return producers.sort((a, b) => {
            if(a.owner < b.owner) return -1;
            if(a.owner > b.owner) return 1;
            return 0;
        });
    }

    sortByNameReverse(producers){
        return producers.sort((a, b) => {
            if(a.owner < b.owner) return 1;
            if(a.owner > b.owner) return -1;
            return 0;
        });
    }

    renderTableBody() {
        const {sortBy, rotationTable, previousRotationTable, rotationStatus} = this.state;
        let displayRotationTable;
        //If rotation is active or no previous, show current rotation table
        if(!previousRotationTable || rotationStatus === nodeFlag.ROTATION_ACTIVE){
          displayRotationTable = rotationTable;
        }else{
          displayRotationTable = previousRotationTable;
        }

        if (this.state.producers.length > 0) {
            let prods; 
            
          if(this.state.producerFilter==="") prods = this.state.producers.filter(val => val.is_active === 1);
          else prods = this.state.producers.filter(val => val.is_active === 1 && val.owner.includes(this.state.producerFilter));
        
        const prodsCopy = prods.slice();

        let bpOut = -1;
        let sbpIn = -1;

        if(displayRotationTable){
            const testbpOut = prods.findIndex(item => item.owner === displayRotationTable.bp_currently_out);
            const testsbpIn = prods.findIndex(item => item.owner === displayRotationTable.sbp_currently_in);
            bpOut = displayRotationTable.bp_out_index;
            sbpIn = displayRotationTable.sbp_in_index;

            if(bpOut == testbpOut && sbpIn == testsbpIn){
                //swap them
                prods[bpOut] = prods.splice(sbpIn, 1, prods[bpOut])[0];
            }
        }

        //producers sort options
        switch(sortBy){
            case nodeFlag.SORT_BY_PROD:
                prods = this.sortByName(prods);
                break;
            case nodeFlag.SORT_BY_PROD_REV:
                prods = this.sortByNameReverse(prods);
                break;
            default:
                //do nothing
                break;
        }

          let body =
                <tbody>
                    {
                        prods.map((val, i) => {
                           const rankPosition = prodsCopy.findIndex(item => item.owner === val.owner);
                            return (
                                <tr key={i} className={val.owner === this.state.activeProducerName ? 'activeProducer' : ''}>
                                    <td>{i + 1}</td>
                                    <td>{rankPosition + 1}</td>
                                    <td>
                                        <a href={`producers/${
            val.owner}`} onClick={(e) => {
                                            e.preventDefault();
                                            this.showProducerInfo(val.owner);
                                        }}>
                                            {val.owner}
                                            {bpOut === rankPosition && displayRotationTable.bp_currently_out != '' ? <i className='bp_rotate_out fa fa-circle'></i> : ''}
                                            {sbpIn === rankPosition && displayRotationTable.sbp_currently_in != '' ? <i className='bp_rotate_in fa fa-circle'></i> : ''}
                                        </a>
                                    </td>
                                    <td>{this.state.producersLatency[rankPosition]} ms</td>
                                    <td>{rankPosition < 21 || rankPosition === sbpIn ? 
                                          val.owner === this.state.activeProducerName ? this.state.currentBlockNumber : this.state.blocksProduced[rankPosition] > 0 ? this.state.blocksProduced[rankPosition] : "-" 
                                        : '-'} </td>
                                    <td>{i < 51 || rankPosition === sbpIn ? 
                                          val.owner === this.state.activeProducerName ?
                                          "producing blocks..." :
                                          this.getLastTimeBlockProduced(this.state.lastTimeProduced[rankPosition], this.state.blockTime)
                                        : '0 sec'}
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


    getNextRotation() {
      const {rotationTable, countdownStatus} = this.state;
        if(rotationTable != null) {

          if(!rotationTable.bp_currently_out && !rotationTable.sbp_currently_in) return nodeFlag.EMPTY_ROTATION_TABLE;

          let timeFuture = new Date(rotationTable.next_rotation_time);
          timeFuture = new Date(timeFuture.setHours(timeFuture.getHours() - 7));
          let now = new Date();            
          now = new Date(now.toUTCString());
        //   console.log(now.getHours(), timeFuture.getHours(),timeFuture.getHours() - now.getHours());
          now.setHours(timeFuture.getHours());
          
          //Should be updated to get hours
          //get total seconds
          let timer = (timeFuture - now)/1000;

          let hours = Math.floor(timer / 3600);
          let minutes = Math.floor(timer / 60);
          let seconds = Math.floor(timer - minutes * 60);

          //console.log(`next: ${rotationTable.next_rotation_time}, last: ${rotationTable.last_rotation_time}`);

          if(timer <= 0) {
            return nodeFlag.COUNTDOWN_EXPIRED;
          }
          
          //return `${hours} hrs ${minutes} min ${seconds} sec`;
          //format is 00:00:00
          return `${displayTwoDigits(hours)}:${displayTwoDigits(minutes)}:${displayTwoDigits(seconds)}`;
        }
        //no rotation yet
        return nodeFlag.NO_ROTATION;
    }

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
          rotationMessage = `Schedule Pending, ${nextRotation}`;
          break;
        case nodeFlag.EMPTY_ROTATION_TABLE:
          rotationMessage = producers.length < 22 ? `No rotation, there are ${producers.length} producers.` : `The network is inactive`;
          break;
        case nodeFlag.NO_ROTATION:
          rotationMessage = nextRotation;
          break;
        default:
          rotationMessage = 'Waiting for a proposal';
          break;
      }
      return rotationMessage;
    }

    getLastTimeBPsRotated() {
        if(this.state.rotationTable != null) {
            let time = new Date(this.state.rotationTable.last_rotation_time);
            let item= <p>{`UTC ${time.toLocaleString()}`}</p>;
            return item;
        }
    }

    onProducerFilterChange(arg) {
        let value = arg.target.value.trim();
        this.setState({ producerFilter: value });
    }

    render() {
        //get sort, and classes for table headers
        const {sortBy} = this.state;
        const prodNameClass = () => {
            let prodClass = 'sortable';
            switch(sortBy){
                case nodeFlag.SORT_BY_PROD:
                    prodClass = 'sortable sortByProd';
                    break;
                case nodeFlag.SORT_BY_PROD_REV:
                    prodClass = 'sortable sortByProdRev';
                    break;
                default:
                    prodClass = 'sortable';
                    break;
            }
            return prodClass;
        };

        if (this.state.producers.length > 0) {
            return (
                <div>
                    <Row>
                        <Col sm={7}>
                            <h2>Producers</h2>
                        </Col>
                        <Col sm={5}>
                            <FormTextboxButton
                                id="txtbProducerName"
                                type="text"
                                hasbutton={false}
                                value={this.state.producerFilter}
                                onChange={(arg) => this.onProducerFilterChange(arg)}
                                placeHolder="Filter by producer name"
                            />
                        </Col>
                        <Col sm={2}>
                            <p>Voting progress</p>
                        </Col>
                        <Col sm={10}>
                            <ProgressBar active now={this.state.percentageVoteStaked} bsStyle="success" 
                                label={this.state.percentageVoteStaked == "" ? "": `${this.state.percentageVoteStaked}%`} />
                        </Col>
                        <Col sm={2}>
                            <p>Last time rotated:</p>
                        </Col>
                        <Col sm={10}>
                            {this.getLastTimeBPsRotated()}
                        </Col>
                        <Col sm={2}>
                            <p>Next rotation:</p>
                        </Col>
                        <Col sm={10}>
                            {this.getRotationStatus()}
                        </Col>
                    </Row>
                    <Row>
                        <Col sm={12}>
                            <div className="tableContainer">
                                <Table responsive>
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Rank</th>
                                            <th
                                                onClick={() => {
                                                    if(sortBy === nodeFlag.SORT_BY_PROD){
                                                        this.setState({sortBy: nodeFlag.SORT_BY_PROD_REV});
                                                    }else if(sortBy === nodeFlag.SORT_BY_PROD_REV){
                                                        this.setState({sortBy: ''});
                                                    }else{
                                                        this.setState({sortBy: nodeFlag.SORT_BY_PROD});
                                                    }
                                                }}
                                                className={prodNameClass()}
                                            >
                                                Name</th>
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
                        </Col>
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
