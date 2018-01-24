import React, { Component } from 'react';
import { Table, Popup, Icon } from 'semantic-ui-react'
import { fetchUnits, fetchCollections, toHms, MDB_LANGUAGES } from '../shared/consts';
import NameHelper from './NameHelper';

class MdbData extends Component {

    static defaultProps = {
        uploaded_filename: "",
    };

    constructor(props) {
        super(props);
        this.state = {
            units: [],
            active: null,
        };
        console.log("--ConstractorProps--");
        //let path = `?page_no=1&content_type=${this.props.content_type}&start_date=${this.props.start_date}&end_date=${this.props.end_date}`
        //if (this.props.content_type && this.props.language && this.props.upload_type ) {
        //    fetchUnits(path, (data) => this.setState({units: data.data}))
        //}
    };

    componentWillReceiveProps(nextProps) {
        console.log("--ReceiveProps--");
        if (JSON.stringify(this.props) !== JSON.stringify(nextProps) && nextProps.content_type && nextProps.language && nextProps.upload_type ) {
            // Yeah it's look long :)
            let path = nextProps.content_type.match(/^(LESSON_PART)$/) ? `?&page_size=1000&content_type=FULL_LESSON&content_type=WOMEN_LESSON&content_type=${nextProps.content_type}&start_date=${nextProps.start_date}&end_date=${nextProps.end_date}` : `?&page_size=1000&content_type=${nextProps.content_type}&start_date=${nextProps.start_date}&end_date=${nextProps.end_date}`
            if(nextProps.content_type === "LESSON_PART" && !nextProps.input_uid) {
                fetchUnits(path, (data) => fetchCollections(data, (units) => this.setState({units: units.data})))
            } else if(nextProps.input_uid) {
                console.log("Got new input UID");
                let unit_uid = this.state.units.filter((unit) => unit.uid == nextProps.input_uid);
                this.setState({units: unit_uid });
                //fetchUnits(path, (data) => fetchCollections(data, (units) => this.setState({units: units.data.filter((unit) => unit.uid == nextProps.input_uid) })))
            } else {
                fetchUnits(path, (data) => this.setState({units: data.data}))
            }
        }
    };

    handleClick = (unit) => {
        this.props.onUidSelect(unit);
        this.setState({active: unit.uid});
    };

    render() {
        console.log("::MdbData Render::")
        let uidList = this.state.units.map((unit) => {
            let name = (unit.i18n.he) ? unit.i18n.he.name : "Name not found";
            let active = (this.state.active === unit.uid ? 'active' : '');
            return (
                <Table.Row className={active} key={unit.id} onClick={() => this.handleClick(unit)}>
                    <Table.Cell>
                        <Popup
                            trigger={this.props.upload_type.match(/^(aricha|article|publication)$/) ? "" : <Icon link name='help' />}
                            flowing
                            position='bottom left'
                            hoverable >
                            <NameHelper
                                id={unit.id}
                                language={this.props.language}
                                upload_type={this.props.upload_type}
                                mime_type={this.props.mime_type}
                                uploaded_filename={this.props.uploaded_filename}
                                send_name={this.props.send_name}
                                film_date={unit.properties.film_date}
                                original_language={MDB_LANGUAGES[unit.properties.original_language]}
                            />
                        </Popup>
                    </Table.Cell>
                    <Table.Cell>{this.props.upload_type.match(/^(article|publication)$/) ? "" : toHms(unit.properties.duration)}</Table.Cell>
                    <Table.Cell textAlign='right' className={"rtl-dir"} >{unit.number !== undefined ?  '(שיעור: ' +unit.number + ' חלק: ' +unit.part + ')' : ""}</Table.Cell>
                    <Table.Cell  textAlign='right' className={(unit.i18n.he ? "rtl-dir" : "negative")}>{name}</Table.Cell>
                    <Table.Cell>{unit.properties.capture_date}</Table.Cell>
                </Table.Row>
            );
        });
        return (
            <Table selectable color='grey' key='teal' {...this.props}>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell width={1}>Info</Table.HeaderCell>
                        <Table.HeaderCell width={2}>Duration</Table.HeaderCell>
                        <Table.HeaderCell width={3}></Table.HeaderCell>
                        <Table.HeaderCell textAlign='right'>Content Name</Table.HeaderCell>
                        <Table.HeaderCell width={2}>Date</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {uidList}
                </Table.Body>
            </Table>
        );
    }
}

export default MdbData;