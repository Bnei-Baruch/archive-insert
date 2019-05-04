import React, {Component, Fragment} from 'react';
import {client,BASE_URL} from '../tools/UserManager';
import { Container,Message,Button,Dropdown,Icon } from 'semantic-ui-react';
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

  render() {

      const {user,loading,onInsert} = this.props;

      let login = (<Button size='massive' primary onClick={this.getUser} disabled={loading} >Login</Button>);
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
                {user && user.roles.find(role => role === "wf_insert") ?
                    <Fragment>
                        <Button value='4'
                                onClick={(e,{value}) => onInsert(value)}
                                color='brown'>
                            <Icon name='upload' />Upload
                        </Button>
                    </Fragment> : ""
                }
                {user && user.roles.find(role => role.match(/^(archive_)/)) ?
                    <Fragment>
                        <Button positive value='1'
                                onClick={(e,{value}) => onInsert(value)}>
                            <Icon name='download' />&nbsp;&nbsp;Insert&nbsp;
                        </Button>
                        <Button value='2'
                                onClick={(e,{value}) => onInsert(value)}
                                color='orange'>
                            <Icon name='sync' />Update
                        </Button>
                    </Fragment> : ""
                }
            </Button.Group>
      );

    return (
          <Container textAlign='center' >
          <Message size='massive'>
              <Message.Header>
                  {user === null ? "Insert Archive" : "Welcome, "+user.name}
                  {user === null ? "" : profile}
              </Message.Header>
              <p>Service for inserting new materials into the bb archive.</p>
              {user === null ? login : main}
          </Message>
          </Container>
    );
  }
}

export default LoginPage;
