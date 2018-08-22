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
                        <br/>
                        <h3>Node Setup with Grow</h3>
                        <hr/>
                        <p className="pInfo">The Telos Foundation has created a lightweight, powerful tool that helps with automating many of the repetitive steps involved in setting up and configuring Telos nodes.</p>
                        <p className="pInfo1"><strong>1.</strong> Follow the installation instructions [here](https://github.com/Telos-Foundation/grow) to set up Grow.</p>
                        <p className="pInfo1"><strong>2.</strong> Navigate to your desired working directory and run <code>grow init pull.</code></p>
                        <p className="pInfo1"><strong>3.</strong> The <code>grow spin single</code> command will spin up a single node, but requires 4 positional arguments: producer name, p2p address, genesis.json path, and node address.</p>
                        <p className="pInfo2"><strong>a.</strong> Example: <code>grow spin single prodname1234 [your-ip] path/to/genesis.json testnet.telosfoundation.io:6789</code></p>
                        <p className="pInfo2"><strong>b.</strong> There are also 2 optional flags: <code>--p2p-port</code> and <code>--http-port</code>. These flags have default values of <code>9876</code> and <code>8888</code>, respectively.</p>
                        <p className="pInfo1"><strong>4.</strong> Run <code>grow spin output prodname1234</code> to view the feed from the node.</p>
                        <p className="pInfo1"><strong>5.</strong> By default, Grow creates nodes in folders inside the current working directory. For example, the node created above would be in a folder named <code>tn-prodname1234</code>. Inside the node folder is the <code>config.ini</code> and <code>genesis.json</code> used to start the node. If you need reference to the config options used for registering your node, see the <code>config.ini</code> in this folder.</p>
                        <p className="pInfo1"><strong>6.</strong> Register Node on Testnet.</p>
                        <p className="pInfo2"><strong>a.</strong> Navigate to testnet.telosfoundation.io and click on the Register button.</p>
                        <p className="pInfo2"><strong>b.</strong> Enter your configuration into the web form.</p>
                        <p className="pInfo2"><strong>c.</strong> Copy the command generated by submitting the form.</p>
                        <p className="pInfo2"><strong>d.</strong> Run the generated <code>regproducer</code> command on your local node.</p>
                        <p className="pInfo2"><strong>e.</strong> Your account is now created and registered as a producer on the testnet.</p>
                        <br/>
                        <h3>Manual Node Setup</h3>
                        <hr/>
                        <p className="pInfo1"><strong>1.</strong> Clone master branch</p>
                        <p className="pInfo2"><strong>a.</strong> <code>git clone https://github.com/Telos-Foundation/telos</code></p>
                        <p className="pInfo2"><strong>b.</strong> <code>git checkout Stage2.0</code></p>
                        <p className="pInfo2"><strong>c.</strong> <code>git submodule update --init --recursive</code></p>
                        <p className="pInfo1"><strong>2.</strong> Inside the telos folder run the following commands:</p>
                        <p className="pInfo2"><strong>a.</strong> <code>./telos_build.sh</code></p>
                        <p className="pInfo2"><strong>b.</strong> <code>cd build && sudo make install</code></p>
                        <p className="pInfo1"><strong>3.</strong> Set up config.ini file</p>
                        <p className="pInfo2"><strong>a.</strong> Run nodeos to generate a config file. This will generate a config.ini file in the current directory if none exists.</p>
                        <pre>nodeos --config-dir ./</pre>
                        <p className="pInfo2"><strong>b.</strong> Determine your Producer name. Please be aware there are restrictions on the allowed characters.</p>
                        <pre>producer-name = prodname1234</pre>
                        <p className="pInfo2"><strong>c.</strong> Determine your Signature Provider. Run <code>teclos create key</code>, and import your keys into your wallet.</p>
                        <pre>signature-provider = TLOS[public key]=KEY:[private key]</pre>
                        <p className="pInfo2"><strong>d.</strong> Determine your p2p and http endpoints. Choose your own p2p and http ports.</p>
                        <pre>{`
 http-server-address = 0.0.0.0:[http port]
 p2p-listen-endpoint = 0.0.0.0:[p2p port]
 p2p-server-address = [external IP address]:[p2p port]
 p2p-peer-address = testnet.telosfoundation.io:6789

`}</pre>
                        <p className="pInfo2"><strong>e.</strong>  Determine your Plugins. The only required plugin is producer_plugin, but other plugins add extended functionality to your nodes.</p>
                        <pre>{`
 plugin = eosio::http_plugin
 plugin = eosio::chain_plugin
 plugin = eosio::chain_api_plugin
 plugin = eosio::history_plugin
 plugin = eosio::history_api_plugin
 plugin = eosio::net_plugin
 plugin = eosio::net_api_plugin
 plugin = eosio::producer_plugin

`}</pre>
                        <p className="pInfo1"><strong>4.</strong> Register Node on Testnet</p>
                        <p className="pInfo2"><strong>a.</strong> Navigate to testnet.telosfoundation.io and click on the Register button.</p>
                        <p className="pInfo2"><strong>b.</strong> Enter your configuration into the web form.</p>
                        <p className="pInfo2"><strong>c.</strong> Copy the command generated by submitting the form.</p>
                        <p className="pInfo2"><strong>d.</strong> Run the generated <code>regproducer</code> command on your local node.</p>
                        <p className="pInfo2"><strong>e.</strong> Your account is now created and registered as a producer on the testnet.</p>
                        <br/>
                        <a href="./resources/genesis.json" download="genesis.json">Download genesis.json</a>
                    </Col>
                </div>
            </Row>
        );
    }
}


export default TelosInfo;