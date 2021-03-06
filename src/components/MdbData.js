import React, { Component } from 'react';
import { Table, Popup, Icon } from 'semantic-ui-react'
import { fetchUnits, toHms, getLang } from '../shared/tools';
import NameHelper from './NameHelper';
import {DCT_OPTS} from '../shared/consts';

class MdbData extends Component {

    state = {
        units: [],
        active: null,
    };

    componentDidUpdate(prevProps) {
        const {content_type, date, send_uid, insert_type} = this.props.metadata;
        if(send_uid && send_uid.length < 8) {
            return
        }
        if (JSON.stringify(prevProps.metadata) !== JSON.stringify(this.props.metadata)) {
            if(this.props.units[0] && send_uid.length === 8) {
                this.setState({units: this.props.units, active: null});
                return
            }
            if(send_uid.length === 0) {
                let path = ['page_size=1000', `start_date=${date}`, `end_date=${date}`];
                if(content_type) DCT_OPTS[content_type].map(ct => path.push(`content_type=${ct}`));
                fetchUnits('?' + path.join('&'), (data) => {
                    console.log(" :: Fetch units: ", data);
                    // In insert mode we creating new unit for blogpost
                    // so we does not show nothing to choose
                    if(content_type === "BLOG_POST" && insert_type === "1") {
                        this.props.onUidSelect(null);
                    } else if(content_type === "BLOG_POST" && insert_type !== "1") {
                        //TODO: find unit to fix
                    } else {
                        this.setState({units: data.data, active: null});
                    }
                });
            }
        }
    };

    rawClick = (unit) => {
        this.props.onUidSelect(unit);
        this.setState({active: unit.uid});
    };

    render() {
        const {language,upload_type,content_type} = this.props.metadata;
        const {units,active} = this.state;
        let lang = getLang(language);

        let uidList = units.map((unit) => {
            if(!unit.properties) return false;
            const {number,part,capture_date,film_date,duration,workflow_id} = unit.properties;
            let name = lang && unit.i18n[lang] ? unit.i18n[lang].name : unit.i18n.he ? unit.i18n.he.name : "Name not found";
            let a = active === unit.uid ? 'active' : '';
            let n = number || "-";
            let p = part === -1 ? "full" : part !== undefined ? part : "";
            let np = n !== "-" && content_type === "LESSONS" ? '( n: ' + n + ' p: ' + p + ' )' : "";
            let date = capture_date || film_date;
            let d = upload_type.match(/^(article|publication)$/) ? "" : toHms(duration);
            let rtlclass = lang === "he" || !lang ? "rtl-dir" : "";
            return (
                <Table.Row className={a} key={unit.id} onClick={() => this.rawClick(unit)}>
                    <Table.Cell>
                        <Popup
                            trigger={upload_type.match(/^(aricha|article|publication)$/) ? "" : <Icon link name='help' />}
                            flowing
                            position='bottom left'
                            hoverable >
                            <NameHelper id={workflow_id} />
                        </Popup>
                    </Table.Cell>
                    <Table.Cell>{d}</Table.Cell>
                    <Table.Cell textAlign='left' >{np}</Table.Cell>
                    <Table.Cell textAlign='right' className={rtlclass}>{name}</Table.Cell>
                    <Table.Cell>{date}</Table.Cell>
                </Table.Row>
            );
        });
        return (
            <Table selectable color='grey' key='teal' >
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell width={1}>Info</Table.HeaderCell>
                        <Table.HeaderCell width={1}>Duration</Table.HeaderCell>
                        <Table.HeaderCell width={2}>No</Table.HeaderCell>
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