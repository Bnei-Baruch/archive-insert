/*
class TabContent extends Component {
    render() {
        return (
            <Tab panes={
                [
                    {
                        menuItem: <Menu.Item key='units'>Units<Label>50</Label></Menu.Item>,
                        render: () => <Tab.Pane><TabContent1 {...this.props} /></Tab.Pane>,
                    },
                    {
                        menuItem: <Menu.Item key='files'>Files<Label>50</Label></Menu.Item>,
                        render: () => <Tab.Pane><TabContent2 {...this.props} /></Tab.Pane>,
                    },
                ]} >
            </Tab>
        );
    }
}

class TabContent2 extends Component {
    constructor(props) {
        super(props);
        this.state = {
            files: {},
        };
    }
    componentDidMount() {
        let path = '?page_no=1&content_type=LESSON_PART'
        Fetcher(path)
            .then(data => {
                console.log(data)
                this.setState({
                    files: data
                });
        })
    }
    render() {
        console.log(this.state.files)
        return (
            <div className="tabContent">
                <TabData2 files={this.state.files.data || []} {...this.props}/>
            </div>
        );
    }
}

class TabData2 extends Component {
    render() {
        let filesList = this.props.files.map(function (files) {
            return (
                <p key={files.uid}> {files.name}</p>
            );
        });
        return (
            <div className="filesList">
                {filesList}
            </div>
        );
    }
}

class TabContent1 extends Component {
    constructor(props) {
        super(props);
        this.state = {
            units: [],
        };
    }
    componentDidMount() {
        console.log("--Did mount--");
        return fetch('http://app.mdb.bbdomain.org/rest/content_units/?page_no=1&content_type=LESSON_PART&start_date='+this.props.start_date+'&end_date='+this.props.end_date)
            .then((response) => response.json())
            .then((responseJson) => {
                console.log("::FetchData::");
                console.log(responseJson);
                this.setState({units: responseJson.data});
            })
            .catch((error) => {
                console.error("::FetchData::");
                console.error(error);
            });
    }
    componentWillReceiveProps(nextProps) {
        console.log("--ReceiveProps--");
        console.log(nextProps);
        if (nextProps.ctype !== this.props.ctype || nextProps.end_date !== this.props.end_date) {
            return fetch('http://app.mdb.bbdomain.org/rest/content_units/?page_no=1&content_type='+nextProps.ctype+'&start_date='+nextProps.start_date+'&end_date='+nextProps.end_date)
                .then((response) => response.json())
                .then((responseJson) => {
                    console.log("::FetchData::");
                    console.log(responseJson);
                    this.setState({units: responseJson.data});
                })
                .catch((error) => {
                    console.error("::FetchData::");
                    console.error(error);
                    return;
                });
        }
    }
    render() {
        return (
            <div className="tabContent">
                <TabData1 units={this.state.units} {...this.props} />
            </div>
        );
    }
}

class TabData1 extends Component {
    render() {
        let uidList = this.props.units.map(function (unit) {
            let name = (unit.i18n.he) ? unit.i18n.he.name : "WTF!?"
            return (
                <Table.Row key={unit.id}>
                    <Table.Cell>
                        <NestedModal
                            uid={unit.uid}
                            name={unit.i18n.he.name}
                            id={unit.id}
                            capture_date={unit.properties.capture_date}
                        />
                    </Table.Cell>
                    <Table.Cell textAlign='right' className={(unit.i18n.he ? "rtl-dir" : "negative")}>{name}</Table.Cell>
                    <Table.Cell>{unit.properties.capture_date}</Table.Cell>
                </Table.Row>
            );
        });
        return (
            <Table selectable color='grey' key='teal'>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>ID</Table.HeaderCell>
                        <Table.HeaderCell textAlign='right'>Name</Table.HeaderCell>
                        <Table.HeaderCell>Created At</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                {uidList}
                </Table.Body>
            </Table>
        );
    }
}

*/
