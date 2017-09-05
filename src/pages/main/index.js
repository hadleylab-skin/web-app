import React from 'react';
import { Container, Header, Grid } from 'semantic-ui-react';
import { BaseLayout, LoginForm, ServiceProvider } from 'components';
import tree from 'libs/tree';
import schema from 'libs/state';

const Intro = React.createClass({
    render() {
        return (
            <Header as="h1"> Hello this is SkinIQ Web UI</Header>
        );
    },
});

const model = {
    token: { status: 'NotAscked' },
    loginPage: {},
    doctorPage: {},
};

const Router = schema(model)(React.createClass({
    render() {
        const tokenStatus = this.props.tree.token.status.get();
        if (tokenStatus !== 'Succeed') {
            return (
                <Container text>
                    <Intro />
                    <LoginForm
                        tree={this.props.tree.loginPage}
                        tokenCursor={this.props.tree.token}
                    />
                </Container>
            );
        }
        return <Intro/>;
    },
}));

export const Main = React.createClass({
    render() {
        return (
            <BaseLayout>
                <Router tree={tree} />
            </BaseLayout>
        );
    },
});
