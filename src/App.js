import React, {Component, Fragment} from 'react';
import { Modal } from 'semantic-ui-react';
import moment from 'moment';
import UploadFile from './components/UploadFile';
import LoginPage from './components/LoginPage';
import {client, getUser} from "./tools/UserManager";
import InsertApp from './components/InsertApp';
import {insertName, insertSha, putData} from './shared/tools';
import 'semantic-ui-css/semantic.min.css';
import './App.css';

class App extends Component {

    state = {
        user: null,
        insert: null,
        filedata: null,
        metadata: {},
        open: false,
    };

    componentDidMount() {
        this.appLogin();
    };

    appLogin = () => {
        getUser(user => {
            if(user) {
                this.checkPermission(user);
            } else {
                client.signinRedirectCallback().then((user) => {
                    if(user.state) window.location = user.state;
                }).catch(() => {
                    client.signinSilent().then(user => {
                        if(user) this.appLogin();
                    }).catch((error) => {
                        console.log("SigninSilent error: ",error);
                    });
                });
            }
        });
    };

    checkPermission = (user) => {
        let bbrole = user.roles.filter(role => role.match(/^(bb_user)$/)).length;
        console.log(":: BB Role: ", bbrole);
        if(bbrole > 0) {
            this.setState({user: user});
        } else {
            alert("Access denied!");
            client.signoutRedirect();
        }
    };

    setInserMode = (mode) => {
        console.log(":: Setting Mode:", mode);
        this.setState({insert: mode});
    };

    checkFileData = (filedata) => {
        const {insert} = this.state;
        insertSha(filedata.sha1, (data) => {
            console.log(":: Got SHA1 check", data);
            if (data.total > 0 && insert === "1") {
                console.log(":: File with SHA1: " + filedata.sha1 + " - already exist!");
                alert("File already exist in MDB!");
            } else if (data.total > 0 && insert === "2") {
                console.log(":: File with SHA1: " + filedata.sha1 + " - already exist - Set rename mode");
                this.setState({insert: "3"});
                this.setMetaData(filedata);
            } else {
                this.setMetaData(filedata);
            }
        });
    };

    setMetaData = (filedata) => {
        console.log(":: Setting metadata from:", filedata);
        const {sha1,size,filename,type,url} = filedata;
        const {roles} = this.state.user;
        let archive_typist = roles.find(r => r === "archive_typist");
        let line = {content_type: null, upload_filename: filename, mime_type: type,
            url: `https://insert.kbb1.com/u/${url}`};
        let metadata = {sha1, size, line, content_type: "", language: null,
            send_uid: "", upload_type: (archive_typist ? "akladot": ""), insert_type: this.state.insert};

        // Extract and validate UID from filename
        let uid = filename.split(".")[0].split("_").pop();
        if(uid.match(/^([a-zA-Z0-9]{8})$/) && (/[_]/).test(filename))
            metadata.send_uid = uid;

        // Extract and validate date from filename
        if((/\d{4}-\d{2}-\d{2}/).test(filedata.filename)) {
            let string_date = filedata.filename.match(/\d{4}-\d{2}-\d{2}/)[0];
            let test_date = moment(string_date);
            let date = test_date.isValid() ? string_date : moment().format('YYYY-MM-DD');
            metadata.date = date;
        } else {
            metadata.date = moment().format('YYYY-MM-DD');
        }

        // If mode rename get insert workflow data
        if(this.state.insert === "3") {
            insertName(sha1, "sha1", (data) => {
                console.log(":: insert data - got: ",data);
                if(data.length > 0) {
                    metadata.send_uid = data[0].line.uid;
                    metadata.line.uid = data[0].line.uid;
                    metadata.line.old_name = data[0].insert_name;
                    let {upload_type, language, insert_id} = data[0];
                    metadata = {...metadata, upload_type, language, insert_id};
                    this.setState({filedata, metadata, open: true});
                } else {
                    console.log("File exist in MDB, but come from import");
                    alert("File exist in MDB, but did NOT found in insert workflow");
                    // TODO: What we going to do in this case?
                    this.setState({insert: null});
                    return false;
                }
            });
        } else if(this.state.insert === "4") {
            metadata.line.film_date = metadata.date;
            // Clean string
            metadata.insert_name = metadata.line.upload_filename.replace(/([^-_a-zA-Z0-9\\.]+)/g, '').toLowerCase();
            metadata.language = metadata.insert_name.slice(0, 3);
            //FIXME: Here will detection content_type from filename string
            metadata.line.content_type = "BLOG_POST";
            metadata.line.lecturer = "rav";
            metadata.line.source = "upload";
            metadata.line.language = metadata.language;
            metadata.line.original_language = metadata.language;
            [metadata.file_name, metadata.extension] = metadata.insert_name.split('.');
            metadata.upload_type = "dgima";
            metadata.send_id = null;
            delete metadata.send_uid;
            delete metadata.content_type;
            this.onComplete(metadata);
        } else {
            this.setState({filedata, metadata, open: true});
        }
    };

    onComplete = (metadata) => {
        console.log(":: Put Metadata:", metadata);
        putData(`insert`, metadata, (cb) => {
            console.log(":: WFSRV respond: ",cb);
            if(cb.status === "ok") {
                alert("Insert successful :)");
                this.setState({open: false, insert: null});
            } else {
                alert("Something gone wrong :(");
                this.setState({open: false});
            }
        });
    };

    onCancel = () => {
        this.setState({open: false, insert: null});
    };

  render() {
      const {filedata,metadata,user,insert,open} = this.state;
      let login = (<LoginPage onInsert={this.setInserMode} user={user} />);
      let upload = (<UploadFile onFileData={this.checkFileData} mode={insert} />);

    return (
        <Fragment>
        {this.state.insert === null ? login : upload}
            <Modal { ...this.props }
                   closeOnDimmerClick={false}
                   closeIcon={true}
                   onClose={this.onCancel}
                   open={open}
                   size="large">
                <InsertApp
                    filedata={filedata}
                    metadata={metadata}
                    user={user}
                    onComplete={this.onComplete} />
            </Modal>
        </Fragment>
    );

  }
}

export default App;