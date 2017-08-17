import React, { Component } from 'react';
import { Table, Modal, Button, Popup, Grid, Header, Icon } from 'semantic-ui-react'
import { Fetcher } from '../shared/consts';
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
    };

    componentWillReceiveProps(nextProps) {
        console.log("--ReceiveProps--");
        let path = '?page_no=1&content_type='+nextProps.content_type+'&start_date='+nextProps.start_date+'&end_date='+nextProps.end_date
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
            var active = (this.state.active === unit.uid ? 'active' : '');
            return (
                <Table.Row className={active} key={unit.id} onClick={() => this.handleClick(unit)}>
                    <Table.Cell>
                        <Popup
                            trigger={<Icon link name='help' />}
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
                            />
                        </Popup>
                    </Table.Cell>
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