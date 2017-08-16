import React, { Component } from 'react';
import { Table, Modal, Button, Popup, Grid, Header, Icon } from 'semantic-ui-react'
import { Fetcher } from '../shared/consts';
import PopupInfo from './PopupInfo';

class MdbData extends Component {
    constructor(props) {
        super(props);
        this.state = {
            units: [],
            active: null,
        };
    };

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
    };

    handleClick = (unit) => {
        this.props.onUidSelect(unit);
        this.setState({active: unit.uid});
    };

    render() {
        // console.log("::Render MdbData::")
        let uidList = this.state.units.map((unit) => {
            let name = (unit.i18n.he) ? unit.i18n.he.name : "Name not found";
            var active = (this.state.active === unit.uid ? 'active' : '');
            return (
                <Table.Row className={active} key={unit.id} onClick={() => this.handleClick(unit)}>
                    <Table.Cell>
                        {/*<NestedModal {...this.props}*/}
                                     {/*uid={unit.uid}*/}
                                     {/*name={name}*/}
                                     {/*id={unit.id}*/}
                                     {/*capture_date={unit.properties.capture_date}*/}
                        {/*/>*/}
                        <Popup
                            trigger={<Icon link name='help' />}
                            flowing
                            position='bottom left'
                            hoverable >
                            <PopupInfo id={unit.id} />
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