import React, { Component } from 'react';
import tree from './libs/tree';
import { LoginForm } from './components/login';

class App extends Component {
    render() {
        return (
            <LoginForm tree={tree} />
        );
    }
}

export default App;
