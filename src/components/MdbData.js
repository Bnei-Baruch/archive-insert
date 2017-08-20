import React, { Component } from 'react';
import { Table, Popup, Icon } from 'semantic-ui-react'
import { Fetcher, toHms, MDB_LANGUAGES } from '../shared/consts';
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
        let path = '?page_no=1&content_type='+this.props.content_type+'&start_date='+this.props.start_date+'&end_date='+this.props.end_date;
        if (this.props.content_type && this.props.language && this.props.upload_type ) {
            Fetcher(path)
                .then(data => {
                    this.setState({units: data.data});
                })
        }
    };

    componentWillReceiveProps(nextProps) {
        console.log("--ReceiveProps--");
        let path = '?page_no=1&content_type='+nextProps.content_type+'&start_date='+nextProps.start_date+'&end_date='+nextProps.end_date;
        if (JSON.stringify(this.props) !== JSON.stringify(nextProps) && nextProps.content_type && nextProps.language && nextProps.upload_type ) {
            Fetcher(path)
                .then(data => {
                    this.setState({units: data.data});
                })
        }
    };

    handleClick = (unit) => {
        this.props.onUidSelect(unit);
        this.setState({active: unit.uid});
    };

    render() {
        let uidList = this.state.units.map((unit) => {
            let name = (unit.i18n.he) ? unit.i18n.he.name : "Name not found";
            let active = (this.state.active === unit.uid ? 'active' : '');
            return (
                <Table.Row className={active} key={unit.id} onClick={() => this.handleClick(unit)}>
                    <Table.Cell>
                        <Popup
                            trigger={this.props.upload_type === "aricha" ? "" : <Icon link name='help' />}
                            flowing
                            position='bottom left'
                            hoverable >
                            <NameHelper
                                id={unit.id}
                                language={this.props.language}
                                upload_type={this.props.upload_type}
                                mime_type={this.props.mime_type}
                                uploaded_filename={this.props.uploaded_filename}
                                film_date={unit.properties.film_date}
                                original_language={MDB_LANGUAGES[unit.properties.original_language]}
                            />
                        </Popup>
                    </Table.Cell>
                    <Table.Cell>{toHms(unit.properties.duration)}</Table.Cell>
                    <Table.Cell  textAlign='right' className={(unit.i18n.he ? "rtl-dir" : "negative")}>{name}</Table.Cell>
                    <Table.Cell>{unit.properties.capture_date}</Table.Cell>
                </Table.Row>
            );
        });
        return (
            <Table selectable color='grey' key='teal' {...this.props}>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Info</Table.HeaderCell>
                        <Table.HeaderCell>Duration</Table.HeaderCell>
                        <Table.HeaderCell textAlign='right'>Content Name</Table.HeaderCell>
                        <Table.HeaderCell width="2">Date</Table.HeaderCell>
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