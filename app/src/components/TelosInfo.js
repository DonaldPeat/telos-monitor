import React, { Component } from 'react';
import { Row, Col } from 'react-bootstrap'
import '../styles/index.css'

class TelosInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        return (
            <Row>
                <div className="infoContainer">
                    <Col sm={12}>
                        <p className="pInfo">Hello and welcome to the Telos Testnet! If you are here, you must be interested in participating in this stage of Telos. Below are the steps you need to follow to get your own node on the Testnet.</p>
                        <p className="pInfo1"><strong>1.</strong> Go to http://github.com/Telos-Foundation/telos and clone the most recent changes from our “developer” branch.</p>
                        <p className="pInfo1"><strong>2.</strong> Open a terminal and navigate to where you cloned the source. Run the below commands.</p>
                        <p className="pInfo2">
                            <pre>{`./eosio_build.sh -s TLOS
cd build
sudo make install`}</pre>
                        </p>
                        <p className="pInfo1"><strong>3.</strong> Now setup your nodeos config.ini file.</p>
                        <p className="pInfo2"><strong>a.</strong> Determine your Producer name. This is what your node will be identified by on the testnet. You’ll notice we have a naming convention of using ancient philosphers, feel free to follow this convention or come up with your own name. The only rules are the name must be exactly 12 characters and have no special or uppercase characters. Enter your Producer name into the producer-name field in the config.ini file</p>
                        <p className="pInfo2"><strong>b.</strong> Determine your Signature Provider. In order to generate a new public and private key pair, you must run “teclos create key” after building the project. Copy your new keys into the signature-provider field in the config.ini file. Don’t forget to run “teclos wallet import your-private-key” to import your private key into your telos wallet.</p>
                        <p className="pInfo2"><strong>c.</strong> Configure your p2p endpoints and addresses in the config.ini file. The fields to be changed are http-server-address, p2p-listen-endpoint, p2p-server-address, and p2p-peer-address.</p>
                        <p className="pInfo2"><strong>d.</strong> The only plugin required to become a producer is the eosio::producer_plugin, but if you’d like to be able to process transactions or respond to API requests then include the following plugins: </p>
                        <p className="pInfo2">
                            <pre>{
                                `plugin = eosio::http_plugin
plugin = eosio::chain_plugin
plugin = eosio::chain_api_plugin
plugin = eosio::history_plugin
plugin = eosio::history_api_plugin
plugin = eosio::net_plugin
plugin = eosio::net_api_plugin
plugin = eosio::producer_plugin`
                            }</pre>
                        </p>
                        <p className="pInfo1"><strong>4.</strong> Navigate to testnet.telosfoundation.io and click on the register tab. Enter your configuration into the form and click submit. This will create your account on the testnet. Copy the command generated from the form, you will need it in the following step.</p>
                        <p className="pInfo2"><strong>a.</strong> Run the ‘regproducer’ command generated from the previous step in your terminal to register your node on the network. You MUST run this command in order to be added as a producer.</p>
                        <p className="pInfo2"><strong>b.</strong> At this point your Producer account has been created and you are registered as a producer. Feel free to cast your votes now and watch the testnet monitor reflect your actions.</p>
                        <p className="pInfo">Connection Info:</p>
                        <pre>{
                            `p2p-peer-address = stage01.telosfoundation.io:9876`
                        }</pre>
                        <a href="./resources/genesis.json" download="genesis.json">Download genesis.json</a>
                    </Col>
                </div>
            </Row>
        );
    }
}

export default TelosInfo;