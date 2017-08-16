import React, { Component } from 'react';
import { Fetcher } from '../shared/consts';
import { Grid, Header } from 'semantic-ui-react'

class PopupInfo extends Component {
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
                this.setState({files: data});
            })
    };

    render() {
        let files = this.state.files.map((file, i) => {
            if(i > this.state.files.length - 7)
                return (
                    <p key={file.id}>{file.name}</p>
                );
        });
        return (
            <Grid>
                <Grid.Column textAlign='left'>
                    <Header as='h4'>Files</Header>
                    {files}
                </Grid.Column>
            </Grid>
        )
    }
}

export default PopupInfo;

