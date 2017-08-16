import React, { Component } from 'react';
import { Fetcher } from '../shared/consts';
import { Modal, Button } from 'semantic-ui-react'

class NestedModal extends Component {
    state = {
        open: false,
        files: [],
    };

    open = () => {
        this.setState({ open: true })
        let path = this.props.id + '/files/';
        Fetcher(path)
            .then(data => {
                this.setState({files: data});
            })
    };

    close = () => this.setState({ open: false })

    componentDidMount() {
        // console.log("--Did mount--");
        // let path = this.props.id + '/files/';
        // Fetcher(path)
        //     .then(data => {
        //         this.setState({files: data.data});
        //     })
    };

    render() {
        const { open } = this.state

        return (
            <Modal
                dimmer={true}
                open={open}
                onOpen={this.open}
                onClose={this.close}
                trigger={<a href='#'>{this.props.id}</a>}
            >
                <Modal.Header>{this.props.name}</Modal.Header>
                <Modal.Content>
                    <p>{this.props.uid}</p>
                    <p>{this.props.id}</p>
                    <p>{this.props.capture_date}</p>
                </Modal.Content>
                <Modal.Actions>
                    {/*<Button icon='check' color='green' content='Select' onClick={this.open} />*/}
                    <Button color='blue' content='Done' onClick={this.close} />
                </Modal.Actions>
            </Modal>
        )
    }
}

export default NestedModal;
