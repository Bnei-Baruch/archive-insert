import React, { Component } from 'react';
import { Table, Popup, Icon } from 'semantic-ui-react'
import { fetchUnits, fetchCollections, toHms } from '../shared/tools';
import NameHelper from './NameHelper';

class MdbData extends Component {

    constructor(props) {
        super(props);
        this.state = {
            units: [],
            active: null,
        };
    };

    componentDidUpdate(prevProps) {
        console.log("--DidUpdate----");
        let prev = [prevProps.content_type, prevProps.start_date, prevProps.input_uid];
        let next = [this.props.content_type, this.props.start_date, this.props.input_uid];
        if (JSON.stringify(prev) !== JSON.stringify(next)) {
            if(this.props.content_type === "LESSON_PART") {
                var path = `?&page_size=1000&content_type=FULL_LESSON&content_type=WOMEN_LESSON&content_type=${this.props.content_type}&start_date=${this.props.start_date}&end_date=${this.props.end_date}`
            } else if (this.props.content_type === "OTHER") {
                var path = `?&page_size=1000&content_type=FRIENDS_GATHERING&content_type=EVENT_PART&content_type=LECTURE&start_date=${this.props.start_date}&end_date=${this.props.end_date}`
            } else {
                var path = `?&page_size=1000&content_type=${this.props.content_type}&start_date=${this.props.start_date}&end_date=${this.props.end_date}`
            }
            if(this.props.content_type === "LESSON_PART" && !this.props.input_uid) {
                fetchUnits(path, (data) => fetchCollections(data, (units) => this.setState({units: units.data})))
            } else if(this.props.input_uid) {
                console.log("Got new input UID");
                let unit_uid = this.state.units.filter((unit) => unit.uid == this.props.input_uid);
                this.setState({units: unit_uid });
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
        console.log("--MdbData Render--")
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
                            <NameHelper id={unit.id} {...this.props.metadata} />
                        </Popup>
                    </Table.Cell>
                    <Table.Cell>{this.props.upload_type.match(/^(article|publication)$/) ? "" : toHms(unit.properties.duration)}</Table.Cell>
                    <Table.Cell textAlign='right' className={"rtl-dir"} >{unit.number !== undefined ?  '(שיעור: ' +unit.number + ' חלק: ' +unit.part + ')' : ""}</Table.Cell>
                    <Table.Cell textAlign='right' className={(unit.i18n.he ? "rtl-dir" : "negative")}>{name}</Table.Cell>
                    <Table.Cell>{unit.properties.capture_date}</Table.Cell>
                </Table.Row>
            );
        });
        return (
            <Table selectable color='grey' key='teal' >
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