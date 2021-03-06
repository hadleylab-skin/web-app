import React from 'react';
import _ from 'lodash';
import moment from 'moment';
import BaobabPropTypes from 'baobab-prop-types';
import { GridWrapper } from 'components';
import schema from 'libs/state';
import { Grid, Header, Table, Button, Message } from 'semantic-ui-react';

export const SiteJoinRequestPage = React.createClass({
    // We need this wrapper to make hot module replacement work
    render() {
        return <SiteJoinRequest {...this.props} />;
    },
});

const model = (props, context) => ({
    tree: {
        requests: context.services.getSiteJoinRequestsService,
    },
});

const SiteJoinRequest = schema(model)(React.createClass({
    propTypes: {
        tree: BaobabPropTypes.cursor.isRequired,
    },

    contextTypes: {
        services: React.PropTypes.shape({
            getSiteJoinRequestsService: React.PropTypes.func.isRequired,
            handleSiteJoinRequestService: React.PropTypes.func.isRequired,
        }),
    },

    isLoading(pk) {
        const status = this.props.tree.requests.data.select(pk).get('status');
        return status === 'Loading' || typeof status === 'undefined';
    },

    async handle(pk, action, succesText) {
        const cursor = this.props.tree.requests.data.select(pk);
        const result = await this.context.services.handleSiteJoinRequestService(
            cursor, pk, action);
        if (result.status === 'Succeed') {
            cursor.message.set(succesText);
            setTimeout(() => cursor.unset(), 5000);
        }
    },

    async approve(pk) {
        await this.handle(pk, 'approve', 'The request was accepted');
    },

    async reject(pk) {
        await this.handle(pk, 'reject', 'The request was rejected');
    },

    renderTable(data) {
        if (_.keys(data).length === 0) {
            return (
                <Grid.Column width={5}>
                    <Message>
                        There are no pending join requests
                    </Message>
                </Grid.Column>
            );
        }
        return (
            <Grid.Column>
                <Table celled>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>Registration date</Table.HeaderCell>
                            <Table.HeaderCell>Join request date</Table.HeaderCell>
                            <Table.HeaderCell>First Name</Table.HeaderCell>
                            <Table.HeaderCell>Last Name</Table.HeaderCell>
                            <Table.HeaderCell>Email</Table.HeaderCell>
                            <Table.HeaderCell>Actions</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {_.map(data, (request, pk) => (
                            <Table.Row
                                key={pk}
                            >
                                <Table.Cell>
                                    {moment(request.data.doctor.dateCreated).format('MMM D, YYYY')}
                                </Table.Cell>
                                <Table.Cell>
                                    {moment(request.data.dateCreated).format('MMM D, YYYY')}
                                </Table.Cell>
                                <Table.Cell>{request.data.doctor.firstName}</Table.Cell>
                                <Table.Cell>{request.data.doctor.lastName}</Table.Cell>
                                <Table.Cell>{request.data.doctor.email}</Table.Cell>
                                <Table.Cell>
                                    {
                                    request.message
                                    ?
                                        <Message positive>
                                            {request.message}
                                        </Message>
                                    :
                                        <div>
                                            <Button
                                                loading={this.isLoading(pk)}
                                                onClick={() => this.approve(pk)}
                                                color="green"
                                            >
                                                Approve
                                            </Button>
                                            <Button
                                                loading={this.isLoading(pk)}
                                                onClick={() => this.reject(pk)}
                                                color="red"
                                            >
                                                Reject
                                            </Button>
                                        </div>
                                    }
                                </Table.Cell>
                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table>
            </Grid.Column>
        );
    },

    render() {
        const requests = this.props.tree.requests.get();
        if (requests.status !== 'Succeed') {
            return (
                <div>
                    {JSON.stringify(this.props.tree.patients.get())}
                </div>
            );
        }
        return (
            <GridWrapper>
                <Grid>
                    <Grid.Row />
                    <Grid.Row>
                        <Grid.Column>
                            <Header>Site join requests</Header>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        {this.renderTable(requests.data)}
                    </Grid.Row>
                </Grid>
            </GridWrapper>
        );
    },
}));
