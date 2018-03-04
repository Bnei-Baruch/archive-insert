import React, { Component } from 'react';
import PropTypes from 'prop-types';
import noop from 'lodash/noop';
import moment from 'moment';
import './App.css';
import 'semantic-ui-css/semantic.min.css';
import 'react-dates/lib/css/_datepicker.css';
import { Button, Header, Modal, Dropdown, Container, Segment, Input } from 'semantic-ui-react'
import { DateRangePicker, SingleDatePicker, isInclusivelyBeforeDay } from 'react-dates';

import {fetchSources, fetchTags, fetchPublishers, fetchUnits, fetchPersons, insertName, content_options, language_options, upload_options, article_options, getName, MDB_LANGUAGES} from './shared/consts';
import MdbData from './components/MdbData';
import NestedModal from './components/NestedModal';

class ModalContent extends Component {
    static propTypes = {
        filedata: PropTypes.object,
        onComplete: PropTypes.func,
        onCancel: PropTypes.func,
    };
    static defaultProps = {
        filedata: {},
        onComplete: noop,
        onCancel: noop,
    };
    constructor(props) {
        super(props);
        this.state = {
            filedata: { ...props.filedata },
            unit: {},
            files: [],
            store: {
                sources: [],
                tags: [],
                publishers: [],
            },
            today_date: moment().format('YYYY-MM-DD'),
            start_date: this.props.filedata.start_date ? this.props.filedata.start_date : moment().format('YYYY-MM-DD'),
            end_date: this.props.filedata.end_date ? this.props.filedata.end_date : moment().add(340, 'days').format('YYYY-MM-DD'),
            content_type: this.props.filedata.content_type ? this.props.filedata.content_type : null,
            language: this.props.filedata.language ? this.props.filedata.language : null,
            upload_type: this.props.filedata.upload_type ? this.props.filedata.upload_type : "",
            input_uid: this.props.filedata.input_uid ? this.props.filedata.input_uid : null,
            isValidated: false,
        };
    }

    componentDidMount() {
        fetchSources(sources => this.setState({ store: { ...this.state.store, sources } }));
        fetchTags(tags => this.setState({ store: { ...this.state.store, tags } }));
        fetchPublishers(publishers => this.setState({ store: { ...this.state.store, publishers: publishers.data } }));
    }

    handleContentFilter = (e, data) => {
        console.log(data.value);
        this.setState({content_type: data.value, input_uid: "", upload_type: ""});
    };

    handleLanguageFilter = (e, data) => {
        console.log(data.value);
        this.setState({language: data.value});
    };

    handleUploadFilter = (e, data) => {
        console.log(data.value);
        this.setState({upload_type: data.value});
    };

    handleDatesChange = ({startDate, endDate }) => {
        let startdate = (startDate) ? startDate.format('YYYY-MM-DD') : this.props.filedata.filename.split(".")[0].split("_")[3];
        let enddate = (endDate) ? endDate.format('YYYY-MM-DD') : moment().format('YYYY-MM-DD');
        this.setState({ startDate, endDate, start_date: startdate, end_date: enddate, input_uid: ""});
    };

    handleDateChange = (date) => {
        if(date === null)
            return
        let startdate = (date) ? date.format('YYYY-MM-DD') : this.props.filedata.filename.split(".")[0].split("_")[3];
        let enddate = (date) ? date.format('YYYY-MM-DD') : moment().format('YYYY-MM-DD');
        this.setState({ date, start_date: startdate, end_date: enddate, input_uid: ""});
    };

    handleOnComplete = () => {
        console.log("::HandelOnComplete::");
        // Object we return from react
        let metadata = {};
        metadata.upload_type = this.state.upload_type;
        metadata.language = this.state.language;
        metadata.insert_type = this.props.url === "upload.kli.one" ? "1" : "2";
        metadata.sha1 = this.state.filedata.sha1;
        metadata.size = this.state.filedata.size;
        metadata.send_id = this.state.send_name ? this.state.send_name.split(".")[0].split("_").pop().slice(0,-1) : null;
        metadata["line"] = {};
        metadata.line.uid = this.state.unit.uid;
        metadata.line.send_name = this.state.send_name ? this.state.send_name : null;
        metadata.line.content_type = this.state.content_type;
        metadata.line.mime_type = this.state.filedata.type;
        metadata.line.upload_filename = this.state.filedata.filename;
        metadata.line.url = this.state.filedata.url;
        metadata.line.capture_date = this.state.unit.properties.capture_date;
        metadata.line.film_date = this.state.unit.properties.film_date;
        metadata.line.original_language = MDB_LANGUAGES[this.state.unit.properties.original_language];
        metadata.line.lecturer = this.state.lecturer;
            // Calculate new name here
        metadata.filename = getName(metadata);
        console.log(metadata);
        this.props.onComplete(metadata);
    };

    handleOnClose = () => {
        console.log("::HandelOnCancel::");
        this.props.onCancel();
    };

    handleUidInput = (e, data) => {
        console.log("Input changed:", data.value);
        this.setState({input_uid: data.value, isValidated: false});
    };

    handleUidSelect = (data, state) => {
        console.log("::HandleUidSelect::");
        //TODO: Filter publication uid
        console.log(data);
        if(state === "publisher") {
            this.setState({publisher: data});
            return
        }
        let path = data.id + '/files/';
        fetchUnits(path, (data) => {
                let units = data.filter((file) => (file.name.split(".")[0].split("_").pop().match(/^t[\d]{10}o$/)));
                // Filter trimmed without send
                let unit_file = units.filter(capd => capd.properties.capture_date);
                console.log("Try to get trim source:",unit_file);
                if(unit_file.length == 0) {
                    console.log("No trim source found, taking first file:",data[0]);
                    let unit_sendname = data[0].name.split(".")[0];
                    let unit_sendext = data[0].name.split(".")[1];
                    let unit_name = unit_sendname + "_" + data[0].uid + "." + unit_sendext;
                    this.setState({files: data, send_name: unit_name});
                } else {
                    this.setState({files: data, send_name: unit_file[0].name});
                }
                let metadata = {};
                metadata.upload_type = this.state.upload_type;
                metadata.language = this.state.language;
                metadata.insert_type = this.props.url === "upload.kli.one" ? "1" : "2";
                metadata.sha1 = this.state.filedata.sha1;
                metadata.size = this.state.filedata.size;
                metadata.send_id = this.state.send_name ? this.state.send_name.split(".")[0].split("_").pop().slice(0,-1) : null;
                metadata["line"] = {};
                metadata.line.uid = this.state.unit.uid;
                metadata.line.send_name = this.state.send_name ? this.state.send_name : null;
                metadata.line.content_type = this.state.content_type;
                metadata.line.mime_type = this.state.filedata.type;
                metadata.line.upload_filename = this.state.filedata.filename;
                metadata.line.url = this.state.filedata.url;
                metadata.line.capture_date = this.state.unit.properties.capture_date;
                metadata.line.film_date = this.state.unit.properties.film_date;
                metadata.line.original_language = MDB_LANGUAGES[this.state.unit.properties.original_language];
                fetchPersons(this.state.unit.id, (data) => {
                    console.log(data);
                    if(data.length > 0 && data[0].person.uid === "abcdefgh") {
                        metadata.line.lecturer = "rav";
                        this.setState({lecturer: "rav"});
                    } else {
                        metadata.line.lecturer = "norav";
                        this.setState({lecturer: "norav"});
                    }
                    // Calculate new name here
                    metadata.filename = getName(metadata);
                    console.log(metadata);
                    insertName(metadata.filename, (data) => {
                        console.log(data);
                        if(data.length > 0 && this.props.url === "upload.kli.one") {
                            console.log("File with name: "+metadata.filename+" - already exist!");
                            alert("File with name: "+metadata.filename+" - already exist!");
                            this.setState({ isValidated: false });
                        } else if(data.length == 0 && this.props.url === "update.kli.one") {
                            console.log("File with name: "+metadata.filename+" - does NOT exist! In current mode the operation must be update only");
                            alert("File with name: "+metadata.filename+" - does NOT exist! In current mode the operation must be update only");
                            this.setState({ isValidated: false });
                        } else {
                            this.state.content_type && this.state.language && this.state.upload_type ? this.setState({ isValidated: true }) : this.setState({ isValidated: false });
                        }
                    });
                });
            });
        //this.state.content_type && this.state.language && this.state.upload_type ? this.setState({ isValidated: true }) : this.setState({ isValidated: false });
        this.setState({ unit: data });
    };

    render() {
        const { store } = this.state;

        // const BAD_DATES = [moment(), moment().add(1, 'days')];
        // const isDayBlocked = day => BAD_DATES.filter(d => d.isSame(day, 'day')).length > 0;
        let single_date = (
            <SingleDatePicker
                showDefaultInputIcon
                hideKeyboardShortcutsPanel
                displayFormat="YYYY-MM-DD"
                // isDayBlocked={isDayBlocked}
                isOutsideRange={day => !isInclusivelyBeforeDay(day, moment())}
                numberOfMonths={1}
                date={this.state.date}
                onDateChange={this.handleDateChange}
                focused={this.state.focused}
                onFocusChange={({ focused }) => this.setState({ focused })}
            />
        );

        let range_date = (
            <DateRangePicker
                displayFormat="YYYY-MM-DD"
                hideKeyboardShortcutsPanel
                // isDayBlocked={isDayBlocked}
                isOutsideRange={day => !isInclusivelyBeforeDay(day, moment())}
                startDate={this.state.startDate}
                endDate={this.state.endDate}
                onDatesChange={this.handleDatesChange}
                focusedInput={this.state.focusedInput}
                onFocusChange={focusedInput => this.setState({ focusedInput })}
            />
        );

        let input_uid = (
            <Input
                error={false}
                className="input_uid"
                size="mini"
                icon='barcode'
                placeholder="UID"
                iconPosition='left'
                value={this.state.input_uid}
                onChange={this.handleUidInput}
            />
        );

        let update_style = (<style>{'.ui.segment { background-color: #F8E0E0; }'}</style>);

        return (
            <Container className="ui modal fullscreen visible transition">
                <Segment clearing>
                    {this.props.url === "update.kli.one" ? update_style : ""}
                    <Header floated='left' >
                        <Dropdown
                            error={!this.state.content_type}
                            defaultValue={this.state.content_type}
                            className="large"
                            placeholder="Content:"
                            selection
                            options={content_options}
                            content_type={this.state.content_type}
                            onChange={this.handleContentFilter}
                            value={this.state.value} >
                        </Dropdown>
                        <Dropdown
                            error={!this.state.language}
                            defaultValue={this.state.language}
                            className="large"
                            placeholder="Language:"
                            selection
                            options={language_options}
                            language={this.state.language}
                            onChange={this.handleLanguageFilter}
                            value={this.state.value} >
                        </Dropdown>
                        {!this.state.upload_type.match(/^(aricha|article|publication)$/) ? input_uid : ""}
                    </Header>
                    <Header floated='right'>
                        {this.state.upload_type.match(/^(aricha|article|publication)$/) ? range_date : single_date}
                    </Header>
                </Segment>
                <Segment clearing secondary color='blue'>
                <Modal.Content className="tabContent">
                    <MdbData
                        content_type={this.state.content_type}
                        start_date={this.state.start_date}
                        end_date={this.state.end_date}
                        language={this.state.language}
                        upload_type={this.state.upload_type}
                        uploaded_filename={this.state.filedata.filename}
                        mime_type={this.state.filedata.type}
                        input_uid={this.state.input_uid}
                        onUidSelect={this.handleUidSelect}
                    />
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
                        value={ this.state.filedata.filename }
                    />
                    <Dropdown
                        upward
                        error={!this.state.upload_type}
                        defaultValue={this.state.upload_type}
                        placeholder="Upload Type:"
                        selection
                        options={this.state.content_type === "ARTICLE" ? article_options : upload_options}
                        upload_type={this.state.upload_type}
                        onChange={this.handleUploadFilter}
                        value={this.state.value} >
                    </Dropdown>
                    <NestedModal
                        upload_type={this.state.upload_type}
                        store={this.state.store}
                        onUidSelect={this.handleUidSelect}
                    />
                    <Button
                        color='green'
                        disabled={!this.state.isValidated}
                        onClick={this.handleOnComplete} >Select
                    </Button>
                </Modal.Actions>
                </Segment>
            </Container>
        );
    }
}


class App extends Component {
    handleOnClose = () => {
        console.log("::HandelOnCancel::");
        //this.props.onCancel();
    };
  render() {
    return (
        <Modal { ...this.props }
            size="large"
            closeOnDimmerClick={false}
            closeIcon={true}
            defaultOpen={true}
            onClose={this.handleOnClose}
        >
            <ModalContent url={window.location.host} { ...this.props } />
        </Modal>
    );
  }
}

export default App;
