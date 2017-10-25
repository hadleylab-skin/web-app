import React from 'react';
import tree from 'libs/tree';
import {
    HashRouter,
    Route,
    Switch,
} from 'react-router-dom';
import { LoginRouter } from './components/login-router';
import { ActivatePage } from './components/activate';
import { PasswordResetPage } from './components/password-reset';
import { HowToShare } from './components/how-to-share';

export const MainPage = React.createClass({
    render() {
        return (
            <HashRouter>
                <Switch>
                    <Route
                        path="/how-to-share-private-key"
                        component={HowToShare}
                    />
                    <Route
                        path="/activate/:uid/:token"
                        render={(props) => {
                            const uid = props.match.params.uid;
                            const token = props.match.params.token;
                            return (
                                <ActivatePage
                                    tree={tree.activate}
                                    uid={uid}
                                    token={token}
                                />
                            );
                        }}
                    />
                    <Route
                        path="/password/reset/confirm/:uid/:token"
                        render={(props) => {
                            const uid = props.match.params.uid;
                            const token = props.match.params.token;
                            return (
                                <PasswordResetPage
                                    tree={tree.passwordReset}
                                    uid={uid}
                                    token={token}
                                />
                            );
                        }}
                    />

                    <Route
                        render={() => (
                            <LoginRouter tree={tree.main} />
                        )}
                    />
                </Switch>
            </HashRouter>
        );
    },
});
