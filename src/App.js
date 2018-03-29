import React, {Component, Fragment} from 'react';
import { Modal } from 'semantic-ui-react'
import UploadFile from './components/UploadFile';
import LoginPage from './components/LoginPage';
import {client, getUser} from "./tools/UserManager";
import ModalApp from './ModalApp';
import 'semantic-ui-css/semantic.min.css';
import './App.css';

class App extends Component {

    state = {
        user: null,
        insert: null,
        filedata: null,
        open: false,
    };

    componentDidMount() {
        getUser(cb => this.setState({ user: cb }));
        client.signinRedirectCallback().then(function(user) {
            console.log(":: callback", user);
            if(user.state)
                window.location = user.state;
        }).catch(function(err) {
            //console.log("callback error",err);
        });
    };

    setUser = (user) => {
        console.log(":: App User:", user);
        this.setState({user: user});
    };

    setMode = (mode) => {
        console.log(":: Setting Mode:", mode);
        this.setState({insert: mode});
    };

    setFileData = (filedata) => {
        console.log(":: Setting Filedata:", filedata);
        this.setState({filedata: filedata, open: true});
    };

    onComplete = (metadata) => {
        console.log(":: Complete Metadata:", metadata);
        this.setState({open: false});
        //TODO: post json for workflow
    };

    onCancel = (data) => {
        console.log(":: Cancel acton:", data);
        //TODO: What happen here?
    };

  render() {

      let login = (<LoginPage onGetUser={this.setUser} onInsert={this.setMode} user={this.state.user}/>);
      let upload = (<UploadFile onFileData={this.setFileData}/>);

    return (
        <Fragment>
        {this.state.insert === null ? login : upload}
            <Modal { ...this.props }
                   closeOnDimmerClick={true}
                   closeIcon={false}
                   defaultOpen={false}
                   onClose={this.handleOnClose}
                   open={this.state.open}
                   size="large"
            >
                <ModalApp { ...this.state } onComplete={this.onComplete} />
            </Modal>
        </Fragment>
    );

  }
}

export default App;