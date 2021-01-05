import React, {PureComponent} from 'react';
import LiveMenu from "./views/screens/LiveMenu";
import {
    HashRouter as Router,
    Switch,
    Route,
    Redirect
} from "react-router-dom";

import ApiService, {Database} from "./api/ApiService";
import VodMenu from "./views/screens/VodMenu";
import Login from "./views/screens/Login/Login";

interface AppState {
    ready: boolean
    authenticated: boolean,
    database: Database | null
}

class App extends PureComponent<any, AppState> {
    private dbService: ApiService;

    constructor(props: any, context: any) {
        super(props, context);

        this.dbService = new ApiService()
        this.state = {
            ready: false,
            authenticated: false,
            database: null
        }
    }

    private async loadDatabase() {
        this.setState({
            database: await this.dbService.database()
        })
    }

    async componentDidMount() {
        this.setState({
            ready: true,
            authenticated: await this.dbService.authenticated()
        })
    }

    render() {
        const {ready, authenticated, database} = this.state
        if (!ready) {
            return null
        }
        if (!authenticated) {
            return (
                <Router>
                    <Redirect to="/login"/>
                    <Route path="/login">
                        <Login apiService={this.dbService} onAuthenticated={() => this.componentDidMount()}/>
                    </Route>
                </Router>
            )
        }
        if (!database) {
            this.loadDatabase()
            return <div>Loading database...</div>
        }
        return (
            <Router>
                <Switch>
                    <Route path="/livetv">
                        <LiveMenu apiService={this.dbService} database={database}/>
                    </Route>
                    <Route path="/movies">
                        <VodMenu apiService={this.dbService} database={database}/>
                    </Route>
                    <Redirect to="/livetv"/>
                </Switch>
            </Router>
        );
    }
}

export default App;
