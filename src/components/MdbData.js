import React, { Component } from 'react';
import { Table, Modal, Button } from 'semantic-ui-react'

const API_BACKEND = 'https://upload.kli.one/rest/content_units';
// http://app.mdb.bbdomain.org/rest/files/?page_no=1&content_type=LESSON_PART'

const Fetcher = (path) => fetch(`${API_BACKEND}/${path}`)
    .then((response) => response.json())
    .then((responseJson) => {
        console.log("::FetchData::");
        console.log(responseJson);
        return responseJson;
    })
    .catch(ex => console.log(`get ${path}`, ex));

class NestedModal extends Component {
    state = {
        open: false,
        files: [],
    }

    open = () => {
        this.setState({ open: true })
        let path = this.props.id + '/files/';
        Fetcher(path)
            .then(data => {
                this.setState({files: data});
            })
    }
    close = () => this.setState({ open: false })

    componentDidMount() {
        // console.log("--Did mount--");
        // let path = this.props.id + '/files/';
        // Fetcher(path)
        //     .then(data => {
        //         this.setState({files: data.data});
        //     })
    }

    render() {
        const { open } = this.state

        return (
            <Modal
                dimmer={true}
                open={open}
                onOpen={this.open}
                onClose={this.close}
                trigger={<a href='#'>{this.props.id}</a>}
            >
                <Modal.Header>{this.props.name}</Modal.Header>
                <Modal.Content>
                    <p>{this.props.uid}</p>
                    <p>{this.props.id}</p>
                    <p>{this.props.capture_date}</p>
                </Modal.Content>
                <Modal.Actions>
                    {/*<Button icon='check' color='green' content='Select' onClick={this.open} />*/}
                    <Button color='blue' content='Done' onClick={this.close} />
                </Modal.Actions>
            </Modal>
        )
    }
}

class MdbData extends Component {
    constructor(props) {
        super(props);
        this.state = {
            units: [],
            active: null,
        };
    }
    componentDidMount() {
        console.log("--Did mount--");
        // let path = '?page_no=1&content_type=LESSON_PART&start_date='+this.props.start_date+'&end_date='+this.props.end_date
        // Fetcher(path)
        //     .then(data => {
        //         this.setState({units: data.data});
        //     })
    }
    componentWillReceiveProps(nextProps) {
        console.log("--ReceiveProps--");
        // console.log(nextProps);
        // console.log(this.props);
        let path = '?page_no=1&content_type='+nextProps.content_type+'&start_date='+nextProps.start_date+'&end_date='+nextProps.end_date
        // TODO: We must be sure start_date < end_date
        if (JSON.stringify(this.props) !== JSON.stringify(nextProps) && nextProps.content_type ) {
            Fetcher(path)
                .then(data => {
                    this.setState({units: data.data});
                })
        }
    }
    handleClick = (unit) => {
        this.props.onUidSelect(unit);
        this.setState({active: unit.uid});
    }
    render() {
        // console.log("::Render MdbData::")
        let uidList = this.state.units.map((unit) => {
            let name = (unit.i18n.he) ? unit.i18n.he.name : "Name not found";
            var active = (this.state.active === unit.uid ? 'active' : '');
            return (
                <Table.Row className={active} key={unit.id} onClick={() => this.handleClick(unit)}>
                    <Table.Cell>
                        <NestedModal {...this.props}
                                     uid={unit.uid}
                                     name={name}
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
            <Table selectable color='grey' key='teal' {...this.props}>
                <Table.Header>
                    {/*<Table.Row>*/}
                        {/*<Table.HeaderCell>ID</Table.HeaderCell>*/}
                        {/*<Table.HeaderCell textAlign='right'>Name</Table.HeaderCell>*/}
                        {/*<Table.HeaderCell>Created At</Table.HeaderCell>*/}
                    {/*</Table.Row>*/}
                </Table.Header>
                <Table.Body>
                    {uidList}
                </Table.Body>
            </Table>
        );
    }
}

export default MdbData;