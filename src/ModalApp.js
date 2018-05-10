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
        metadata: {...this.props.metadata},
        unit: {},
        files: [],
        store: { sources: [], tags: [], publishers: []},
        startDate: moment(),
        locale: "he",
        isValidated: false,
    };


    componentDidMount() {
        const {date} = this.state.metadata;
        this.setState({startDate: moment(date)});
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
        if (JSON.stringify(prevState.metadata) !== JSON.stringify(this.state.metadata))
            this.setState({ isValidated: false });
    };

    selectContentType = (content_type) => {
        let {metadata} = this.state;
        this.setState({metadata: {...metadata, content_type}});
    };

    selectLanguage = (language) => {
        let {metadata} = this.state;
        this.setState({metadata: {...metadata, language}, locale: getLang(language)});
    };

    selectUpload = (upload_type) => {
        let {metadata} = this.state;
        if(upload_type === "aricha") {
            this.setState({metadata: {...metadata, upload_type}, uTypeSelection: false});
        } else {
            this.setState({metadata: {...metadata,upload_type}});
        }
    };

    selectDate = (date) => {
        let {metadata} = this.state;
        this.setState({metadata: {...metadata, date: date.format('YYYY-MM-DD')}, startDate: date});
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
        const {metadata, isValidated, locale, startDate} = this.state;
        const {date,upload_type,content_type,language,insert_type,send_uid} = metadata;

        let date_picker = (
            <DatePicker
                className="datepickercs"
                locale={locale}
                dateFormat="YYYY-MM-DD"
                showYearDropdown
                showMonthDropdown
                scrollableYearDropdown
                maxDate={moment()}
                openToDate={moment(date)}
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
                value={send_uid}
                onChange={(e,{value}) => this.inputUid(value)}
            />
        );

        let update_style = (<style>{'.ui.segment { background-color: #f9e7db; }'}</style>);

        return (
            <Container className="ui modal fullscreen visible transition">
                <Segment clearing>
                    {insert_type === "2" ? update_style : ""}
                    <Header floated='left' >
                        <Dropdown
                            error={!content_type}
                            disabled={content_type === "ARTICLE"}
                            className="large"
                            placeholder="Content:"
                            selection
                            options={content_options}
                            content_type={content_type}
                            onChange={(e,{value}) => this.selectContentType(value)}
                            value={content_type} >
                        </Dropdown>
                        <Dropdown
                            error={!language}
                            className="large"
                            placeholder="Language:"
                            selection
                            options={language_options}
                            language={language}
                            onChange={(e,{value}) => this.selectLanguage(value)}
                            value={language} >
                        </Dropdown>
                    </Header>
                    <Header floated='right'>
                        {uid_input}
                    </Header>
                        {date_picker}
                </Segment>
                <Segment clearing secondary color='blue'>
                <Modal.Content className="tabContent">
                    <MdbData metadata={metadata} onUidSelect={this.setUid} />
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
                        disabled={upload_type === "aricha"}
                        placeholder="Upload Type:"
                        selection
                        options={content_type === "ARTICLE" ? article_options : upload_options}
                        upload_type={upload_type}
                        onChange={(e,{value}) => this.selectUpload(value)}
                        value={upload_type}
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
