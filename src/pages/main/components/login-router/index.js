import React from 'react';
import BaobabPropTypes from 'baobab-prop-types';
import _ from 'lodash';
import { Container, Header } from 'semantic-ui-react';
import schema from 'libs/state';
import { ServiceProvider } from 'components';
import { getRacesList } from 'services/constants';
import { BaseLayout } from './layout';
import { LoginForm } from './login-form';

import { AppRouter } from '../app-router';

const model = {
    tree: {
        token: { status: 'NotAsked' },
        loginPage: {},
        app: {},
        raceList: getRacesList(),
    },
};

export const LoginRouter = schema(model)(React.createClass({
    propTypes: {
        tree: BaobabPropTypes.cursor.isRequired,
    },

    childContextTypes: {
        cursors: React.PropTypes.shape({
            doctor: BaobabPropTypes.cursor.isRequired,
        }),
        mapRace: React.PropTypes.func.isRequired,
        races: React.PropTypes.object.isRequired,
    },

    getChildContext() {
        const races = this.props.tree.raceList.get('data') || {};
        return {
            cursors: {
                doctor: this.props.tree.token.data.doctor,
            },
            mapRace: (race) => _.get(races, race, race),
            races,
        };
    },

    logout() {
        this.props.tree.tree.set({});
    },

    render() {
        const token = this.props.tree.token.get() || {};
        if (token.status !== 'Succeed') {
            return (
                <BaseLayout>
                    <Container text>
                        <Header as="h1"> Hello this is SkinIQ Web UI</Header>
                        <LoginForm
                            tree={this.props.tree.loginPage}
                            tokenCursor={this.props.tree.token}
                        />
                    </Container>
                </BaseLayout>
            );
        }
        const privateKey = this.props.tree.token.data.doctor.data.privateKey.get();

        if (_.isEmpty(privateKey)) {
            return (
                <BaseLayout>
                    <Container text>
                        <Header as="h1">You don't export your private key yet</Header>
                        <p>Please follow the instruction to export your private key for the web app.</p>
                    </Container>
                </BaseLayout>
            );
        }
        return (
            <ServiceProvider
                token={token.data}
            >
                <AppRouter
                    logout={this.logout}
                    tree={this.props.tree.app}
                />
            </ServiceProvider>
        );
    },
}));

