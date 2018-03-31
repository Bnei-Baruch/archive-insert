import React, { Component } from 'react';
import {client,BASE_URL} from '../tools/UserManager';
import { Container,Message,Button,Divider,Dropdown } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
import '../App.css';

class LoginPage extends Component {

    getUser = () => {
        const onGetUser = this.props.onGetUser;
        client.getUser().then(function(user) {
            if(user === null) {
                client.signinRedirect({state: `${BASE_URL}`});
            } else {
                //FIXME: We need show "logout" button if going to use this function
                client.signoutRedirect();
                //window.location = `${BASE_URL}`;
                //console.log(":: Get User", user);
                //onGetUser(user);
            }
        }).catch(function(error) {
            console.log("Error: ",error);
        });
    };

    handleInsert = (e, data) => {
      console.log("-- Handle Insert --", data.value);
        this.props.onInsert(data.value);
    };

  render() {

      let login = (<Button size='massive' primary onClick={this.getUser} {...this.props} >Login</Button>);
      //let logout = (<Button size='mini' primary onClick={() => client.signoutRedirect()}>LogOut</Button>);
      let user_dropdown = (
          <Dropdown inline text=''>
          <Dropdown.Menu>
              <Dropdown.Item text='Settings' />
              <Dropdown.Item text='Logout' onClick={() => client.signoutRedirect()} />
          </Dropdown.Menu>
          </Dropdown>);
      let main = (
            <Button.Group size='massive' >
                <Button positive value='new' onClick={this.handleInsert}>&nbsp;&nbsp;Insert&nbsp;</Button>
                <Button.Or />
                <Button value='update' onClick={this.handleInsert} color='orange'>Update</Button>
            </Button.Group>
      );

    return (
          <Container textAlign='center' >
          <Message size='massive'>
              <Message.Header {...this.props}>
                  {this.props.user === null ? "Insert Archive" : "Welcome, "+this.props.user.name}
                  {this.props.user === null ? "" : user_dropdown}
              </Message.Header>
              <p>Service for inserting new materials into the bb archive.</p>
              {this.props.user === null ? login : main}
          </Message>
          </Container>
    );
  }
}

export default LoginPage;
