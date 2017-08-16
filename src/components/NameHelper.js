import React, { Component } from 'react';
import { getName, Fetcher } from '../shared/consts';
import { Grid, Header } from 'semantic-ui-react'

class NameHelper extends Component {
    constructor(props) {
        super(props);
        this.state = {
            files: [],
        };
    };

    componentDidMount() {
        console.log("--Did mount--");
        let path = this.props.id + '/files/';
        Fetcher(path)
            .then(data => {
                let unit_file = data.filter((file) => file.name.split(".")[0].split("_").pop().match(/^t[\d]{10}o$/));
                this.setState({files: data , send_file: unit_file[0].name});
            })
    };

    render() {
        // let unit_file = this.state.files.filter((file) => file.name.split(".")[0].split("_").pop().match(/^t[\d]{10}o$/));
        // let send_name = unit_file[0];
        //WTF?!?
        // console.log(unit_file[0]);
        return (
            <Grid>
                <Grid.Column textAlign='left'>
                    <Header as='h4'>{getName({...this.props, send_name: this.state.send_file})}</Header>
                </Grid.Column>
            </Grid>
        )
    }
}

export default NameHelper;

