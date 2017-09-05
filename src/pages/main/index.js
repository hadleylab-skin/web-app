import React from 'react';
import tree from 'libs/tree';
import { LoginRouter } from './components/login-router';

export const MainPage = React.createClass({
    render() {
        return (
            <LoginRouter tree={tree} />
        );
    },
});
