import React, { Component } from 'react';
import PropTypes from 'prop-types';
import noop from 'lodash/noop';
import moment from 'moment';
import './App.css';
import 'semantic-ui-css/semantic.min.css';
import 'react-dates/lib/css/_datepicker.css';
import { Button, Header, Modal, Dropdown, Container, Segment, Input } from 'semantic-ui-react'
import { DateRangePicker } from 'react-dates';

import {content_options, language_options, upload_options, Fetcher, getName, MDB_LANGUAGES } from './shared/consts';
import MdbData from './components/MdbData';

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
            today_date: moment().format('YYYY-MM-DD'),
            start_date: this.props.filedata.start_date ? this.props.filedata.start_date : moment().format('YYYY-MM-DD'),
            end_date: this.props.filedata.end_date ? this.props.filedata.end_date : moment().add(340, 'days').format('YYYY-MM-DD'),
            content_type: this.props.filedata.content_type ? this.props.filedata.content_type : null,
            language: this.props.filedata.language ? this.props.filedata.language : null,
            upload_type: this.props.filedata.upload_type ? this.props.filedata.upload_type : null,
            isValidated: false,
        };
    }

    handleContentFilter = (e, data) => {
        console.log(data.value);
        this.setState({content_type: data.value});
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
        this.setState({ startDate, endDate, start_date: startdate, end_date: enddate });
    };

    handleOutsideRange = () => {
        return false;
    };

    handleOnComplete = () => {
        console.log("::HandelOnComplete::");
        // Object we return from react
        let metadata = this.state.filedata;
        metadata.uid = this.state.unit.uid;
        metadata.send_name = this.state.send_name;
        metadata.content_type = this.state.content_type;
        metadata.language = this.state.language;
        metadata.upload_type = this.state.upload_type;
        metadata.mime_type = this.state.filedata.type;
        metadata.upload_filename = this.state.filedata.filename;
        metadata.capture_date = this.state.unit.properties.capture_date;
        metadata.film_date = this.state.unit.properties.film_date;
        metadata.original_language = MDB_LANGUAGES[this.state.unit.properties.original_language];
        metadata.send_id = this.state.send_name.split(".")[0].split("_").pop().slice(0,-1);
        // Calculate new name here
        metadata.filename = getName(metadata);
        console.log(metadata);
        this.props.onComplete(metadata);
    };

    handleUidSelect = (data) => {
        console.log("::HandleUidSelect::");
        console.log(data);
        let path = data.id + '/files/';
        Fetcher(path)
            .then(data => {
                let unit_file = data.filter((file) => file.name.split(".")[0].split("_").pop().match(/^t[\d]{10}o$/));
                this.setState({files: data, send_name: unit_file[0].name});
            });
        this.state.content_type && this.state.language && this.state.upload_type ? this.setState({ isValidated: true }) : this.setState({ isValidated: false });
        this.setState({ unit: data });
    };

    render() {
        return (
            <Container className="ui fullscreen modal visible transition">
                <Segment clearing>
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
                    </Header>
                    <Header floated='right'>
                        <DateRangePicker
                            displayFormat="YYYY-MM-DD"
                            isOutsideRange={this.handleOutsideRange}
                            startDate={this.state.startDate}
                            endDate={this.state.endDate}
                            onDatesChange={this.handleDatesChange}
                            focusedInput={this.state.focusedInput}
                            onFocusChange={focusedInput => this.setState({ focusedInput })}
                        />
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
                        options={upload_options}
                        upload_type={this.state.upload_type}
                        onChange={this.handleUploadFilter}
                        value={this.state.value} >
                    </Dropdown>
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
  render() {
    return (
        <Modal
            size="large"
            closeOnDimmerClick={false}
            closeIcon={true}
            defaultOpen={true}
            onClose={this.handleClose}
        >
            <ModalContent {...this.props} />
        </Modal>
    );
  }
}

export default App;
