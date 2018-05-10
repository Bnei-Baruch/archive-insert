import React, { Component } from 'react';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import 'moment/locale/he';
import 'moment/locale/ru';
import 'moment/locale/es';
import 'moment/locale/fr';
import 'moment/locale/it';
import 'moment/locale/de';
import 'moment/locale/en-gb';
import 'react-datepicker/dist/react-datepicker.css';
import 'semantic-ui-css/semantic.min.css';
import './ModalApp.css';
import { Button, Header, Modal, Dropdown, Container, Segment, Input } from 'semantic-ui-react';
import { fetchPublishers, fetchUnits, fetchPersons, insertName, getName, getLang } from './shared/tools';
import {content_options, language_options, upload_options, article_options, MDB_LANGUAGES, CONTENT_TYPE_BY_ID} from './shared/consts';

import MdbData from './components/MdbData';
import NestedModal from './components/NestedModal';

class ModalApp extends Component {

    state = {
        metadata: {},
        unit: {},
        files: [],
        store: { sources: [], tags: [], publishers: []},
        startDate: moment(),
        start_date: moment().format('YYYY-MM-DD'),
        end_date: moment().format('YYYY-MM-DD'),
        content_type: null,
        language:  null,
        locale: "he",
        upload_type: "",
        input_uid:  null,
        isValidated: false,
        cTypeSelection: true,
        disable_selection: false,
    };


    componentDidMount() {
        const {filedata, start_date = "", content_type = null, language = null, upload_type = "", input_uid = ""} = this.props;
        const {sha1,size,filename,type,url} = filedata;
        this.setState({
            start_date, end_date: start_date, startDate: moment(start_date),
            content_type, language, disable_selection: upload_type !==  "", upload_type, input_uid,
            metadata: { sha1, size, line:{upload_filename: filename, mime_type: type, url}}
        });
        // Set sunday first weekday in russian
        moment.updateLocale('ru', { week: {dow: 0,},});
        moment.updateLocale('es', { week: {dow: 0,},});
        moment.updateLocale('it', { week: {dow: 0,},});
        moment.updateLocale('de', { week: {dow: 0,},});
        moment.updateLocale('fr', { week: {dow: 0,},});
        moment.updateLocale('en', { week: {dow: 0,},});
        fetchPublishers(publishers => this.setState({ store: { ...this.state.store, publishers: publishers.data } }));
    };

    componentDidUpdate(prevProps, prevState) {
        const prev = [prevState.content_type, prevState.language, prevState.upload_type, prevState.start_date];
        const next = [this.state.content_type, this.state.language, this.state.upload_type, this.state.start_date];
        if (JSON.stringify(prev) !== JSON.stringify(next))
            this.setState({ isValidated: false });
    };

    selectContentType = (content_type) => {
        if(content_type === "ARTICLE") {
            this.setState({content_type, input_uid: "", upload_type: "", cTypeSelection: false})
        } else {
            this.setState({content_type, input_uid: ""})
        }
    };

    selectLanguage = (language) => {
        this.setState({language, locale: getLang(language)});
    };

    selectUpload = (upload_type) => {
        if(upload_type === "aricha") {
            this.setState({upload_type, uTypeSelection: false});
        } else {
            this.setState({upload_type});
        }
    };

    selectDate = (date) => {
        this.setState({
            startDate: date,
            start_date: date.format('YYYY-MM-DD'),
            end_date: date.format('YYYY-MM-DD'),
        });
    };

    onComplete = () => {
        console.log("::onComplete metadata: ", this.state.metadata);
        this.props.onComplete(this.state.metadata);
    };

    onClose = () => {
        console.log("--onCancel--");
        this.props.onCancel();
    };

    inputUid = (input_uid) => {
        console.log(":: Input changed: ", input_uid);
        this.setState({input_uid, isValidated: false});
    };

    setPublisher = (data) => {
        console.log(":: Set Publisher: ", data);
        this.setState({metadata: { ...this.state.metadata, publisher: data.pattern, publisher_uid: data.uid }});
    };

    setUid = (data) => {
        console.log("--HandleUidSelect--");
        console.log(":::: Unit Selected :::: ", data);
        let path = data.id + '/files/';
        fetchUnits(path, (data) => {
                console.log(":: Got FILES: ", data);
                let units = data.filter((file) => (file.name.split(".")[0].split("_").pop().match(/^t[\d]{10}o$/)));
                // Filter trimmed without send
                let unit_file = units.filter(capd => capd.properties.capture_date);
                console.log(":: Try to get trim source: ", unit_file);
                if(unit_file.length === 0 && this.state.upload_type !== "aricha" && data.length > 0) {
                    console.log("No trim source found, taking first file:",data[0]);
                    let unit_sendname = data[0].name.split(".")[0];
                    let unit_sendext = data[0].name.split(".")[1];
                    let unit_name = unit_sendname + "_" + data[0].uid + "." + unit_sendext;
                    this.setState({files: data, send_name: unit_name});
                } else if(data.length === 0 && this.state.upload_type !== "aricha") {
                    console.log(":: No files in this UNIT!");
                    this.setState({files: null, send_name: null});
                } else if(unit_file.length === 0 && this.state.upload_type === "aricha") {
                    this.setState({files: data, send_name: this.props.filedata.filename});
                } else {
                    this.setState({files: data, send_name: unit_file[0].name});
                }
                let metadata = this.state.metadata;
                metadata.upload_type = this.state.upload_type;
                metadata.language = this.state.language;
                metadata.insert_type = this.props.insert === "new" ? "1" : "2";
                metadata.send_id = this.state.send_name ? this.state.send_name.split(".")[0].split("_").pop().slice(0,-1) : null;
                metadata.line.uid = this.state.unit.uid;
                metadata.line.send_name = this.state.send_name ? this.state.send_name : this.state.unit.uid;
                metadata.line.content_type = CONTENT_TYPE_BY_ID[this.state.unit.type_id];
                metadata.line.capture_date = this.state.unit.properties.capture_date;
                metadata.line.film_date = this.state.unit.properties.film_date;
                metadata.line.original_language = MDB_LANGUAGES[this.state.unit.properties.original_language];
                fetchPersons(this.state.unit.id, (data) => {
                    console.log(":: Got Persons: ",data);
                    if(data.length > 0 && data[0].person.uid === "abcdefgh") {
                        metadata.line.lecturer = "rav";
                        this.setState({lecturer: "rav"});
                    } else {
                        metadata.line.lecturer = "norav";
                        this.setState({lecturer: "norav"});
                    }
                    // Calculate new name here
                    metadata.filename = getName(metadata);
                    console.log(":: Metadata - after getName: ",metadata);
                    // Check if name already exist
                    insertName(metadata.filename, (data) => {
                        console.log(":: Got WFObject",data);
                        if(data.length > 0 && this.props.insert === "new") {
                            console.log(":: File with name: "+metadata.filename+" - already exist!");
                            alert("File with name: "+metadata.filename+" - already exist!");
                            this.setState({ isValidated: false });
                        } else if(data.length === 0 && this.props.insert === "update") {
                            console.log(":: File with name: "+metadata.filename+" - does NOT exist! In current mode the operation must be update only");
                            alert("File with name: "+metadata.filename+" - does NOT exist! In current mode the operation must be update only");
                            this.setState({ isValidated: false });
                        } else {
                            this.state.content_type && this.state.language && this.state.upload_type ? this.setState({ isValidated: true }) : this.setState({ isValidated: false });
                            this.setState({metadata: { ...this.state.metadata }});
                        }
                    });
                });
            });
        this.setState({ unit: data });
    };

    render() {

        const {filename} = this.props.filedata;
        const {locale,start_date,startDate,input_uid,upload_type,content_type,cTypeSelection,value,language,disable_selection,isValidated} = this.state;

        let date_picker = (
            <DatePicker
                className="datepickercs"
                locale={locale}
                dateFormat="YYYY-MM-DD"
                showYearDropdown
                showMonthDropdown
                scrollableYearDropdown
                maxDate={moment()}
                openToDate={moment(start_date)}
                selected={startDate}
                onChange={this.selectDate}
            />
        );

        let uid_input = (
            <Input
                error={false}
                className="input_uid"
                size="mini"
                icon='barcode'
                placeholder="UID"
                iconPosition='left'
                value={input_uid}
                onChange={(e,{value}) => this.inputUid(value)}
            />
        );

        let update_style = (<style>{'.ui.segment { background-color: #f9e7db; }'}</style>);

        return (
            <Container className="ui modal fullscreen visible transition">
                <Segment clearing>
                    {this.props.insert === "update" ? update_style : ""}
                    <Header floated='left' >
                        <Dropdown
                            error={!content_type}
                            disabled={!cTypeSelection}
                            defaultValue={content_type}
                            className="large"
                            placeholder="Content:"
                            selection
                            options={content_options}
                            content_type={content_type}
                            onChange={(e,{value}) => this.selectContentType(value)}
                            value={value} >
                        </Dropdown>
                        <Dropdown
                            error={!language}
                            defaultValue={language}
                            className="large"
                            placeholder="Language:"
                            selection
                            options={language_options}
                            language={language}
                            onChange={(e,{value}) => this.selectLanguage(value)}
                            value={value} >
                        </Dropdown>
                    </Header>
                    <Header floated='right'>
                        {uid_input}
                    </Header>
                        {date_picker}
                </Segment>
                <Segment clearing secondary color='blue'>
                <Modal.Content className="tabContent">
                    <MdbData {...this.state} onUidSelect={this.setUid} />
                </Modal.Content>
                </Segment>
                <Segment clearing tertiary color='yellow'>
                <Modal.Actions>
                    <Input
                        disabled
                        className="filename"
                        icon='file'
                        iconPosition='left'
                        focus={true}
                        value={filename}
                    />
                    <Dropdown
                        upward
                        error={!upload_type}
                        disabled={disable_selection}
                        defaultValue={upload_type}
                        placeholder="Upload Type:"
                        selection
                        options={content_type === "ARTICLE" ? article_options : upload_options}
                        upload_type={upload_type}
                        onChange={(e,{value}) => this.selectUpload(value)}
                        value={value}
                    />
                    <NestedModal
                        upload_type={upload_type}
                        publishers={this.state.store.publishers}
                        onUidSelect={this.setUid}
                        onPubSelect={this.setPublisher}
                    />
                    <Button
                        color='green'
                        disabled={!isValidated}
                        onClick={this.onComplete} >Select
                    </Button>
                </Modal.Actions>
                </Segment>
            </Container>
        );
    }
}

export default ModalApp;
