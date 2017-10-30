import React from 'react';
import BaobabPropTypes from 'baobab-prop-types';
import _ from 'lodash';
import { Container, Header } from 'semantic-ui-react';
import schema from 'libs/state';
import { ServiceProvider, BaseWrapper } from 'components';
import { getRacesList } from 'services/constants';
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
        this.props.tree.set(model.tree);
    },

    render() {
        const token = this.props.tree.token.get() || {};
        if (token.status !== 'Succeed') {
            return (
                <BaseWrapper>
                    <Container text>
                        <Header as="h1">
                            Melanoma Detection Web UI
                        </Header>
                        <LoginForm
                            tree={this.props.tree.loginPage}
                            tokenCursor={this.props.tree.token}
                        />
                    </Container>
                </BaseWrapper>
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

