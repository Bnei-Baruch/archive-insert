import React, { Component } from 'react';
import PropTypes from 'prop-types';
import noop from 'lodash/noop';
import moment from 'moment';
import './App.css';
import 'semantic-ui-css/semantic.min.css';
import 'react-dates/lib/css/_datepicker.css';
import { Button, Header, Icon, Modal, Dropdown, Container, Segment, Input } from 'semantic-ui-react'
import { DateRangePicker, SingleDatePicker } from 'react-dates';

import {ctype_options, language_options, upload_options, mime_list } from './shared/consts';
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
                oldfilename: props.metadata.filename,
                uid: "",
            },
            today_date: moment().format('YYYY-MM-DD'),
            start_date: moment().format('YYYY-MM-DD'),
            end_date: moment().format('YYYY-MM-DD'),
            ctype: "LESSON_PART",
        };
    }
    handleChange = (e, data) => {
        console.log(data.value);
        this.setState({ctype: data.value})
    }
    handleDatesChange = ({startDate, endDate }) => {
        let startdate = (startDate) ? startDate.format('YYYY-MM-DD') : moment().format('YYYY-MM-DD');
        let enddate = (endDate) ? endDate.format('YYYY-MM-DD') : moment().format('YYYY-MM-DD');
        this.setState({ startDate, endDate });
        this.setState({start_date: startdate});
        this.setState({end_date: enddate});
    }
    handleOutsideRange = () => {
        return false;
    }
    handleOnComplete = (e) => {
        console.log("::HandelOnComplete::");
        console.log(this.state.metadata);
        this.props.onComplete(this.state.metadata);
    }
    handleUidSelect = (data) => {
        console.log("::HandleUidSelect::");
        let filedata = this.state.metadata;
        filedata.uid = data;
        // TODO: Calculate new name here
        filedata.filename = "NEWFILENAME." + mime_list[filedata.type];
        this.setState({ metadata: filedata })
    }
    render() {
        return (
            <Container className="ui fullscreen modal visible transition">
                <Segment clearing>
                    <Header floated='left' >
                        <Dropdown
                            className="large"
                            placeholder="Content:"
                            selection
                            options={ctype_options}
                            ctype={this.state.ctype}
                            onChange={this.handleChange}
                            value={this.state.value} >
                        </Dropdown>
                        <Dropdown
                            className="large"
                            placeholder="Language:"
                            selection
                            options={language_options} >
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
                        ctype={this.state.ctype}
                        start_date={this.state.start_date}
                        end_date={this.state.end_date}
                        onUidSelect={this.handleUidSelect}
                    />
                </Modal.Content>
                </Segment>
                <Segment clearing tertiary color='yellow'>
                <Modal.Actions>
                    <Dropdown
                        placeholder="Upload CTYPE:"
                        selection
                        options={upload_options} >
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
                        disabled={!this.state.metadata.uid}
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
