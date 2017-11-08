import React, { Component } from 'react';
import { fetcher, getName } from '../shared/consts';
import { Grid, Header } from 'semantic-ui-react'

class NameHelper extends Component {
    constructor(props) {
        super(props);
        this.state = {
            files: [],
        };
    };

    componentWillMount() {
        console.log("--NameHelper Did mount--");
        let path = this.props.id + '/files/';
        fetcher(path, (data) => {
            // TODO: make sure we get last trimmed
            let unit_file = data.filter((file) => file.name.split(".")[0].split("_").pop().match(/^t[\d]{10}o$/));
            console.log("Try to get trim source:",unit_file);
            this.setState({files: data, send_name: unit_file ? unit_file[0].name : null});
            // this.setState({name: getName({...this.props, send_name: unit_file[0].name})});
        });
    };

    render() {
        return (
            <Grid>
                <Grid.Column textAlign='left'>
                    <Header
                        as='h4'
                        color={ this.props.uploaded_filename === this.state.name ? "" : "red" } >
                    {this.state.send_name}
                    </Header>
                </Grid.Column>
            </Grid>
        )
    }
}

export default NameHelper;

