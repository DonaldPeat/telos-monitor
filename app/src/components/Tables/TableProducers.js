import '../../styles/tableproducers.css'
import React, {Component} from 'react';
import {Alert, Col, ProgressBar, Row, Table, Popover} from 'react-bootstrap'
import nodeInfoAPI from '../../scripts/nodeInfo'
import serverAPI from '../../scripts/serverAPI';
import getHumanTime from '../../scripts/timeHelper'
import FormTextboxButton from '../FormControls/FormTextboxButton'
import ModalProducerInfo from '../Modals/ModalProducerInfo'

const SORT_BY_PROD = 'sortByProducerName';
const SORT_BY_PROD_REV = 'sortByProducerNameReverse';

const EMPTY_ROTATION_TABLE = 'emptyRotationTable';
const COUNTDOWN_EXPIRED = 'countdownExpired';
const NO_ROTATION = 'noRotation';
const WAITING_FOR_PROPOSAL = 'waitingForProposal';
const HAVE_PROPOSAL = 'haveProposal';
const SCHEDULE_PENDING = 'schedulePending';
const ROTATION_ACTIVE = 'rotationActive';

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
      rotationTable: null,
      scheduleVersion: 0,
      lastRotationTime: null,
      rotationStatus: ''
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
    setInterval(async() => {
      await this.getProducerLatency(producerIndex);
      if (++producerIndex > this.state.producers.length - 1) producerIndex = 0;
    }, 1000);

    // update producers every 2 seconds
    setInterval(this.updateProducersOrder, 2000);
    // rotate bps every 6 minutes
    this.rotateBlockProducers();
    this.getScheduleVersion();
    this.setLastRotationTime();

    setTimeout(()=>{
      var proposalStatus;
      var t = this.checkForProposal();//.then(res => proposalStatus = res);
        // console.log(proposalStatus)
        var x = Promise.resolve(t);
        console.log(x);
        console.log(x.resolved);
    },1500);
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
          this.setState({producers: newProd.filter(el => el.owner)});
        }
    }

    async getScheduleVersion(){
      const producerInfo = await nodeInfoAPI.getInfo();
      const currentBlockNumber = producerInfo.head_block_num;

      if(currentBlockNumber === 0) console.log('problem! block number is zero!');
      const blockHeaderState = await nodeInfoAPI.getBlockHeaderState(currentBlockNumber);
      this.setState({scheduleVersion: blockHeaderState.header.schedule_version});
    }

    async getRotationSchedule(){
      const {currentBlockNumber} = this.state;
      if(currentBlockNumber === 0) console.log('problem! block number is zero!');
      const blockHeaderState = await nodeInfoAPI.getBlockHeaderState(currentBlockNumber);
      return blockHeaderState;
    }

    async rotateBlockProducers(){
        const rotation = await nodeInfoAPI.getProducersRotation();
        // console.log(rotation);
        if(rotation){
          if(!this.state.rotationTable) this.setState({rotationTable: rotation.rows[0]});
          for(let field in rotation.rows[0]){
            if(rotation.rows[0][field] != this.state.rotationTable[field]){
              this.setState({rotationTable: rotation.rows[0]});
              return;
            }
          }
          //matches, do nothing
        }
    }

    async getRotationTable(){
      const rotation = await nodeInfoAPI.getProducersRotation();
      if(rotation) return rotation.rows[0];
      return null;
    }

    async setLastRotationTime(){
      const rt = await this.getRotationTable();
      if(rt){
        this.setState({lastRotationTime: rt.last_rotation_time});
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
        const {sortBy, rotationTable} = this.state;
        if (this.state.producers.length > 0) {
            let prods; 
            
          if(this.state.producerFilter==="") prods = this.state.producers.filter(val => val.is_active === 1);
          else prods = this.state.producers.filter(val => val.is_active === 1 && val.owner.includes(this.state.producerFilter));
        
        const prodsCopy = prods.slice();

        let bpOut = -1;
        let sbpIn = -1;
        let rotatePopover = '';

        if(rotationTable){
            const testbpOut = prods.findIndex(item => item.owner === rotationTable.bp_currently_out);
            const testsbpIn = prods.findIndex(item => item.owner === rotationTable.sbp_currently_in);
            bpOut = rotationTable.bp_out_index;
            sbpIn = rotationTable.sbp_in_index;

            if(bpOut != testbpOut) console.log('bp out doesn\'t match');
            if(sbpIn != testsbpIn) console.log('sbp in doesn\'t match');
            //swap them
            prods[bpOut] = prods.splice(sbpIn, 1, prods[bpOut])[0];
        }

        //producers sort options
        switch(sortBy){
            case SORT_BY_PROD:
                prods = this.sortByName(prods);
                break;
            case SORT_BY_PROD_REV:
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
                                            {bpOut === rankPosition ? <i className='bp_rotate_out fa fa-circle'></i> : ''}
                                            {sbpIn === rankPosition ? <i className='bp_rotate_in fa fa-circle'></i> : ''}
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
      const {rotationTable, rotationStatus} = this.state;
        if(rotationTable != null){

          if(!rotationTable.bp_currently_out && !rotationTable.sbp_currently_in) return EMPTY_ROTATION_TABLE;

          if(rotationStatus != ROTATION_ACTIVE) this.setState({rotationStatus: ROTATION_ACTIVE});

          let timeFuture = new Date(rotationTable.next_rotation_time); 
          let now = new Date();            
          now = new Date(now.toUTCString());
          now.setHours(now.getHours() + 7);
          
          //Should be updated to get hours
          //get total seconds
          let timer = (timeFuture - now)/1000;

          let minutes = Math.floor(timer / 60);
          let seconds = Math.floor(timer - minutes * 60);
          

          // if(timer.getTime() == 0){
          //get block number
          //get block header state
          // }
          if(timer <= 0){
            return COUNTDOWN_EXPIRED;
          }
          var item = <p>{`${minutes} min ${seconds} sec`}</p>;
          return item;
        }
        //no rotation yet
        return NO_ROTATION;
    }

    async checkForProposal(){
      const {lastRotationTime, rotationTable, scheduleVersion, rotationStatus} = this.state;
      if(
        new Date(lastRotationTime) < new Date(rotationTable.last_rotation_time) ||
        rotationStatus === SCHEDULE_PENDING ||
        rotationStatus === HAVE_PROPOSAL
      ){
        //have new rotation table
        //check for new schedule version
        const rotationSchedule = await this.getRotationSchedule();
        if(
          rotationSchedule.pendingSchedule.version > scheduleVersion ||
          rotationStatus === SCHEDULE_PENDING
        ){
          //we have a pending schedule
          this.setState({
            scheduleVersion: rotationSchedule.pendingSchedule,
            rotationStatus: SCHEDULE_PENDING
          });
          return SCHEDULE_PENDING;
        }else{
          //we have a proposal
          this.setState({
            lastRotationTime: rotationTable.last_rotation_time,
            rotationStatus: HAVE_PROPOSAL
          });
          return HAVE_PROPOSAL;
        }

      }else{
        //don't have a new rotation table yet
        return WAITING_FOR_PROPOSAL;
      }
    }

    getRotationStatus(){
      const nextRotation = this.getNextRotation();
      if(nextRotation === EMPTY_ROTATION_TABLE) return 'No rotation pending or activated.  Maybe fewer than 21 producers.';
      if(nextRotation === NO_ROTATION) return `<p>No rotation yet...</p>`;
      if(nextRotation === COUNTDOWN_EXPIRED){

        let proposalStatus = WAITING_FOR_PROPOSAL;
        var t = this.checkForProposal().then(res => proposalStatus = res);
        // console.log(proposalStatus)
        var x = Promise.resolve(t);
        console.log(x);
        if(proposalStatus === WAITING_FOR_PROPOSAL) return 'Waiting for a proposal';
        if(proposalStatus === SCHEDULE_PENDING) return 'Schedule is pending';
        if(proposalStatus === HAVE_PROPOSAL) return 'We have a proposal';
        return 'proposal status not working';
      }
      return nextRotation;
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
                case SORT_BY_PROD:
                    prodClass = 'sortable sortByProd';
                    break;
                case SORT_BY_PROD_REV:
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
                                                    if(sortBy === SORT_BY_PROD){
                                                        this.setState({sortBy: SORT_BY_PROD_REV});
                                                    }else if(sortBy === SORT_BY_PROD_REV){
                                                        this.setState({sortBy: ''});
                                                    }else{
                                                        this.setState({sortBy: SORT_BY_PROD});
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
