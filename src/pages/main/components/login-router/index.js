import React from 'react';
import BaobabPropTypes from 'baobab-prop-types';
import _ from 'lodash';
import { Container, Header, Image, Grid } from 'semantic-ui-react';
import schema from 'libs/state';
import { ServiceProvider, BaseWrapper } from 'components';
import { getRacesList } from 'services/constants';
import { LoginForm } from './login-form';
import { AppRouter } from '../app-router';
import step1 from './assets/step1.png';
import step2 from './assets/step2.png';
import step3 from './assets/step3.png';

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
                        <Header as="h1"> Hello this is SkinIQ Web UI</Header>
                        <LoginForm
                            tree={this.props.tree.loginPage}
                            tokenCursor={this.props.tree.token}
                        />
                    </Container>
                </BaseWrapper>
            );
        }
        const privateKey = this.props.tree.token.data.doctor.data.privateKey.get();

        if (_.isEmpty(privateKey)) {
            return (
                <BaseWrapper>
                    <Grid>
                        <Grid.Row>
                            <Grid.Column width={16}>
                                <Container text>
                                    <Header as="h1">You don't export your private key yet</Header>
                                    <p>Please follow the instruction to export your private key from the iOS app.</p>
                                    <p>You need to log into the iOS app first.</p>
                                </Container>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column width={2} />
                            <Grid.Column width={6}>
                                <p>Open 'My Profile' tab </p>
                                <Image size="medium" src={step1} />
                            </Grid.Column>
                            <Grid.Column width={6}>
                                <p>Tap on 'Cryptography configuration'</p>
                                <p>And enable the switch</p>
                                <Image size="medium" src={step2} />
                                <p>If you see this you key is successfully exported</p>
                                <Image size="medium" src={step3} />
                            </Grid.Column>
                            <Grid.Column width={2} />
                        </Grid.Row>
                    </Grid>
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

