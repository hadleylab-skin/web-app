import React from 'react';
import BaobabPropTypes from 'baobab-prop-types';
import { Container, Header } from 'semantic-ui-react';
import schema from 'libs/state';
import { ServiceProvider } from 'components';
import { BaseLayout } from './layout';
import { LoginForm } from './login-form';

import { AppRouter } from '../app-router';

const model = {
    tree: {
        token: { status: 'NotAsked' },
        loginPage: {},
        app: {},
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
    },

    getChildContext() {
        return {
            cursors: {
                doctor: this.props.tree.token.data.doctor,
            },
        };
    },

    render() {
        const token = this.props.tree.token.get();
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
        return (
            <ServiceProvider
                token={token.data}
            >
                <AppRouter
                    tree={this.props.tree.app}
                />
            </ServiceProvider>
        );
    },
}));

