import React, { Component } from 'react';
import {client,BASE_URL} from '../tools/UserManager';
import { Container,Message,Button,Dropdown } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
import '../App.css';

class LoginPage extends Component {

    getUser = () => {
        client.getUser().then(function(user) {
            (user === null) ? client.signinRedirect({state: `${BASE_URL}`}) : console.log(":: What just happend?");
        }).catch(function(error) {
            console.log("Error: ",error);
        });
    };

    handleInsert = (e, data) => {
      console.log("-- Handle Insert --", data.value);
        this.props.onInsert(data.value);
    };

  render() {

      let login = (<Button size='massive' primary onClick={this.getUser} {...this.props} disabled={this.props.loading} >Login</Button>);
      //let logout = (<Button size='mini' primary onClick={() => client.signoutRedirect()}>LogOut</Button>);
      let profile = (
          <Dropdown inline text=''>
          <Dropdown.Menu>
              <Dropdown.Item content='Profile:' disabled />
              <Dropdown.Item text='My Account' onClick={() => window.open("https://accounts.kbb1.com/auth/realms/main/account", "_blank")} />
              <Dropdown.Item text='Sign Out' onClick={() => client.signoutRedirect()} />
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
                  {this.props.user === null ? "" : profile}
              </Message.Header>
              <p>Service for inserting new materials into the bb archive.</p>
              {this.props.user === null ? login : main}
          </Message>
          </Container>
    );
  }
}

export default LoginPage;
