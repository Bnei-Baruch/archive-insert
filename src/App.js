import React, { Component } from 'react';
import PropTypes from 'prop-types';
import noop from 'lodash/noop';
import moment from 'moment';
import './App.css';
import 'semantic-ui-css/semantic.min.css';
import 'react-dates/lib/css/_datepicker.css';
import { Button, Header, Icon, Modal, Dropdown, Container, Segment, Input } from 'semantic-ui-react'
import { DateRangePicker, SingleDatePicker } from 'react-dates';

import {content_options, language_options, upload_options, mime_list } from './shared/consts';
import MdbData from './components/MdbData';

class ModalContent extends Component {
    static propTypes = {
        metadata: PropTypes.object,
        onComplete: PropTypes.func,
        onCancel: PropTypes.func,
    };
    static defaultProps = {
        metadata: {},
        onComplete: noop,
        onCancel: noop,
    };
    constructor(props) {
        super(props);
        this.state = {
            metadata: { ...props.metadata,
                uploaded_filename: props.metadata.filename,
                content_type: null,
                language: null,
                upload_type: null,
                capture_date: null,
                uid: "",
            },
            today_date: moment().format('YYYY-MM-DD'),
            start_date: moment().format('YYYY-MM-DD'),
            end_date: moment().format('YYYY-MM-DD'),
            content_type: null,
            language: null,
            upload_type: null,
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
        let startdate = (startDate) ? startDate.format('YYYY-MM-DD') : moment().format('YYYY-MM-DD');
        let enddate = (endDate) ? endDate.format('YYYY-MM-DD') : moment().format('YYYY-MM-DD');
        this.setState({ startDate, endDate });
        this.setState({start_date: startdate});
        this.setState({end_date: enddate});
    };

    handleOutsideRange = () => {
        return false;
    };

    handleOnComplete = (e) => {
        console.log("::HandelOnComplete::");
        console.log(this.state.metadata);
        this.props.onComplete(this.state.metadata);
    };

    handleUidSelect = (data) => {
        console.log("::HandleUidSelect::");
        console.log(data);
        this.state.content_type && this.state.language && this.state.upload_type ? this.setState({ isValidated: true }) : this.setState({ isValidated: false });
        let filedata = this.state.metadata;
        filedata.uid = data.uid;
        filedata.content_type = this.state.content_type;
        filedata.language = this.state.language;
        filedata.upload_type = this.state.upload_type;
        filedata.capture_date = data.properties.film_date;
        // TODO: Calculate new name here
        filedata.filename = "NEWFILENAME." + mime_list[filedata.type];
        this.setState({ metadata: filedata });
    };

    render() {
        return (
            <Container className="ui fullscreen modal visible transition">
                <Segment clearing>
                    <Header floated='left' >
                        <Dropdown
                            error={!this.state.content_type}
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
                        onUidSelect={this.handleUidSelect}
                    />
                </Modal.Content>
                </Segment>
                <Segment clearing tertiary color='yellow'>
                <Modal.Actions>
                    <Dropdown
                        error={!this.state.upload_type}
                        placeholder="Upload Type:"
                        selection
                        options={upload_options}
                        upload_type={this.state.upload_type}
                        onChange={this.handleUploadFilter}
                        value={this.state.value} >
                    </Dropdown>
                    <Input
                        className="filename"
                        icon='file'
                        iconPosition='left'
                        focus={true}
                        value={ this.state.metadata.filename } />
                    <Input
                        className="uid"
                        value={this.state.metadata.uid}
                        icon='vcard'
                        iconPosition='left'
                        focus={false} />
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
            size='fullscreen'
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
