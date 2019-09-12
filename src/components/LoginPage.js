import React, {Component, Fragment} from 'react';
import {client,BASE_URL,getUser} from '../tools/UserManager';
import { Container,Message,Button,Dropdown,Icon } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
import '../App.css';

class LoginPage extends Component {

    state = {
        disabled: true,
        loading: true,
    };

    componentDidMount() {
        setTimeout(() => this.setState({disabled: false, loading: false}), 1000);
    };

    userLogin = () => {
        this.setState({disabled: true, loading: true});
        getUser(cb => {
            if(!cb) client.signinRedirect({state: `${BASE_URL}`});
        });
    };

  render() {

      const {user,onInsert} = this.props;
      const {disabled, loading} = this.state;

      let login = (<Button size='massive' primary onClick={this.userLogin} disabled={disabled} loading={loading}>Login</Button>);
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
                            <Icon name='archive' />&nbsp;&nbsp;Insert&nbsp;
                        </Button>
                        <Button value='2'
                                onClick={(e,{value}) => onInsert(value)}
                                color='orange'>
                            <Icon name='wrench' />Update
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
