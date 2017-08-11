import React, { Component } from 'react';
import PropTypes from 'prop-types';
import noop from 'lodash/noop';
import moment from 'moment';
import './App.css';
import 'semantic-ui-css/semantic.min.css';
import 'react-dates/lib/css/_datepicker.css';
import { Table, Button, Header, Icon, Modal, Label, Menu, Tab, Dropdown, Container, Segment, Input } from 'semantic-ui-react'
import { DateRangePicker, SingleDatePicker } from 'react-dates';

const ctype_options = [
    { value: 'LESSON_PART', text: 'Lesson', icon: 'student' },
    { value: 'VIDEO_PROGRAM_CHAPTER', text: 'Program', icon: 'record' },
    { value: 'MEAL', text: 'Meals', icon: 'food' },
];

const language_options = [
    { key: 'he', value: 'he', flag: 'il', text: 'Hebrew' },
    { key: 'ru', value: 'ru', flag: 'ru', text: 'Russian' },
    { key: 'en', value: 'en', flag: 'us', text: 'English' },
];

const API_BACKEND = 'http://app.mdb.bbdomain.org/rest/content_units/';
// http://app.mdb.bbdomain.org/rest/files/?page_no=1&content_type=LESSON_PART'

const Fetcher = (path) => fetch(`${API_BACKEND}${path}`)
    .then((response) => response.json())
    .then((responseJson) => {
        console.log("::FetchData::");
        console.log(responseJson);
        return responseJson;
    })
    .catch(ex => console.log(`get ${path}`, ex));

/*
class TabContent extends Component {
    render() {
        return (
            <Tab panes={
                [
                    {
                        menuItem: <Menu.Item key='units'>Units<Label>50</Label></Menu.Item>,
                        render: () => <Tab.Pane><TabContent1 {...this.props} /></Tab.Pane>,
                    },
                    {
                        menuItem: <Menu.Item key='files'>Files<Label>50</Label></Menu.Item>,
                        render: () => <Tab.Pane><TabContent2 {...this.props} /></Tab.Pane>,
                    },
                ]} >
            </Tab>
        );
    }
}

class TabContent2 extends Component {
    constructor(props) {
        super(props);
        this.state = {
            files: {},
        };
    }
    componentDidMount() {
        let path = '?page_no=1&content_type=LESSON_PART'
        Fetcher(path)
            .then(data => {
                console.log(data)
                this.setState({
                    files: data
                });
        })
    }
    render() {
        console.log(this.state.files)
        return (
            <div className="tabContent">
                <TabData2 files={this.state.files.data || []} {...this.props}/>
            </div>
        );
    }
}

class TabData2 extends Component {
    render() {
        let filesList = this.props.files.map(function (files) {
            return (
                <p key={files.uid}> {files.name}</p>
            );
        });
        return (
            <div className="filesList">
                {filesList}
            </div>
        );
    }
}

class TabContent1 extends Component {
    constructor(props) {
        super(props);
        this.state = {
            units: [],
        };
    }
    componentDidMount() {
        console.log("--Did mount--");
        return fetch('http://app.mdb.bbdomain.org/rest/content_units/?page_no=1&content_type=LESSON_PART&start_date='+this.props.start_date+'&end_date='+this.props.end_date)
            .then((response) => response.json())
            .then((responseJson) => {
                console.log("::FetchData::");
                console.log(responseJson);
                this.setState({units: responseJson.data});
            })
            .catch((error) => {
                console.error("::FetchData::");
                console.error(error);
            });
    }
    componentWillReceiveProps(nextProps) {
        console.log("--ReceiveProps--");
        console.log(nextProps);
        if (nextProps.ctype !== this.props.ctype || nextProps.end_date !== this.props.end_date) {
            return fetch('http://app.mdb.bbdomain.org/rest/content_units/?page_no=1&content_type='+nextProps.ctype+'&start_date='+nextProps.start_date+'&end_date='+nextProps.end_date)
                .then((response) => response.json())
                .then((responseJson) => {
                    console.log("::FetchData::");
                    console.log(responseJson);
                    this.setState({units: responseJson.data});
                })
                .catch((error) => {
                    console.error("::FetchData::");
                    console.error(error);
                    return;
                });
        }
    }
    render() {
        return (
            <div className="tabContent">
                <TabData1 units={this.state.units} {...this.props} />
            </div>
        );
    }
}

class TabData1 extends Component {
    render() {
        let uidList = this.props.units.map(function (unit) {
            let name = (unit.i18n.he) ? unit.i18n.he.name : "WTF!?"
            return (
                <Table.Row key={unit.id}>
                    <Table.Cell>
                        <NestedModal
                            uid={unit.uid}
                            name={unit.i18n.he.name}
                            id={unit.id}
                            capture_date={unit.properties.capture_date}
                        />
                    </Table.Cell>
                    <Table.Cell textAlign='right' className={(unit.i18n.he ? "rtl-dir" : "negative")}>{name}</Table.Cell>
                    <Table.Cell>{unit.properties.capture_date}</Table.Cell>
                </Table.Row>
            );
        });
        return (
            <Table selectable color='grey' key='teal'>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>ID</Table.HeaderCell>
                        <Table.HeaderCell textAlign='right'>Name</Table.HeaderCell>
                        <Table.HeaderCell>Created At</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                {uidList}
                </Table.Body>
            </Table>
        );
    }
}

*/

class NestedModal extends Component {
    state = { open: false }

    open = () => this.setState({ open: true })
    close = () => this.setState({ open: false })

    render() {
        const { open } = this.state

        return (
            <Modal
                dimmer={true}
                open={open}
                onOpen={this.open}
                onClose={this.close}
                size='fullscreen'
                trigger={<a href='#'>{this.props.id}</a>}
            >
                <Modal.Header>{this.props.name}</Modal.Header>
                <Modal.Content>
                    <p>{this.props.uid}</p>
                    <p>{this.props.id}</p>
                    <p>{this.props.capture_date}</p>
                </Modal.Content>
                <Modal.Actions>
                    <Button icon='check' color='green' content='Select' onClick={this.open} />
                    <Button color='red' content='Cancel' onClick={this.close} />
                </Modal.Actions>
            </Modal>
        )
    }
}

class DataContent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            units: [],
        };
    }
    componentDidMount() {
        console.log("--Did mount--");
        let path = '?page_no=1&content_type=LESSON_PART&start_date='+this.props.start_date+'&end_date='+this.props.end_date
        Fetcher(path)
            .then(data => {
                this.setState({units: data.data});
        })
    }
    componentWillReceiveProps(nextProps) {
        console.log("--ReceiveProps--");
        console.log(nextProps);
        let path = '?page_no=1&content_type='+nextProps.ctype+'&start_date='+nextProps.start_date+'&end_date='+nextProps.end_date
        if (nextProps.ctype !== this.props.ctype || nextProps.end_date !== this.props.end_date) {
            Fetcher(path)
                .then(data => {
                    this.setState({units: data.data});
                })
        }
    }
    handleClick = (data) => {
        // console.log(data);
        this.props.onUidSelect(data);
    }
    render() {
        let uidList = this.state.units.map((unit) => {
            let name = (unit.i18n.he) ? unit.i18n.he.name : "WTF!?"
            return (
                <Table.Row key={unit.id} onClick={() => this.handleClick(unit.uid)}>
                    <Table.Cell>
                        <NestedModal {...this.props}
                            uid={unit.uid}
                            name={unit.i18n.he.name}
                            id={unit.id}
                            capture_date={unit.properties.capture_date}
                        />
                    </Table.Cell>
                    <Table.Cell  textAlign='right' className={(unit.i18n.he ? "rtl-dir" : "negative")}>{name}</Table.Cell>
                    <Table.Cell>{unit.properties.capture_date}</Table.Cell>
                </Table.Row>
            );
        });
        return (
            <Table selectable color='blue' key='teal' {...this.props}>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>ID</Table.HeaderCell>
                        <Table.HeaderCell textAlign='right'>Name</Table.HeaderCell>
                        <Table.HeaderCell>Created At</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {uidList}
                </Table.Body>
            </Table>
        );
    }
}

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
            metadata: { ...props.metadata },
            today_date: moment().format('YYYY-MM-DD'),
            start_date: moment().format('YYYY-MM-DD'),
            end_date: moment().format('YYYY-MM-DD'),
            ctype: "LESSON_PART",
            uid: "Here Go UID",
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
        this.props.onComplete(this.state.uid);
    }
    handleUidSelect = (data) => {
        console.log("::HandleUidSelect::");
        this.setState({ uid: data })
    }
    render() {
        return (
            <Container className="ui fullscreen modal visible transition">
                <Segment clearing color='red'>
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
                    <Header floated='right' className="large">
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
                <Segment clearing secondary color='grey'>
                <Modal.Content className="tabContent">
                    <DataContent
                        ctype={this.state.ctype}
                        start_date={this.state.start_date}
                        end_date={this.state.end_date}
                        onUidSelect={this.handleUidSelect}
                    />
                </Modal.Content>
                </Segment>
                <Segment clearing tertiary color='yellow'>
                <Modal.Actions>
                    {/*<NestedModal />*/}
                    <Input
                        className="filename"
                        icon='file'
                        iconPosition='left'
                        focus={true}
                        // disabled
                        placeholder="Here Filename go"
                        value={ this.props.metadata ? this.props.metadata.filename : "sasdfsdf" } />
                    <Input
                        className="uid"
                        value={this.state.uid}
                        icon='vcard'
                        iconPosition='left'
                        focus={false} />
                    <Button color='green' onClick={this.handleOnComplete}>Select</Button>
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
            defaultOpen={true}
            onClose={this.handleClose}
        >
            <ModalContent {...this.props} />
        </Modal>
    );
  }
}

export default App;
