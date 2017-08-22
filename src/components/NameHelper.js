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
        console.log("--Did mount--");
        let path = this.props.id + '/files/';
        fetcher(path,(data) => {
                let unit_file = data.filter((file) => file.name.split(".")[0].split("_").pop().match(/^t[\d]{10}o$/));
                this.setState({name: getName({...this.props, send_name: unit_file[0].name})});
            })
    };

    render() {
        return (
            <Grid>
                <Grid.Column textAlign='left'>
                    <Header
                        as='h4'
                        color={ this.props.uploaded_filename === this.state.name ? "" : "red" } >
                    {this.state.name}
                    </Header>
                </Grid.Column>
            </Grid>
        )
    }
}

export default NameHelper;

