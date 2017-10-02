import React from 'react';
import _ from 'lodash';
import moment from 'moment';
import BaobabPropTypes from 'baobab-prop-types';
import { GridWrapper } from 'components';
import schema from 'libs/state';
import { Grid, Header, Table, Label, Button, Message } from 'semantic-ui-react';

export const DoctorResistrationRequestsPage = React.createClass({
    // We need this wrapper to make hot module replacement work
    render() {
        return <DoctorResistrationRequests {...this.props} />;
    },
});

const model = (props, context) => ({
    tree: {
        requests: context.services.getDoctorResistrationRequestsService,
    },
});

const DoctorResistrationRequests = schema(model)(React.createClass({
    propTypes: {
        tree: BaobabPropTypes.cursor.isRequired,
    },

    contextTypes: {
        services: React.PropTypes.shape({
            getDoctorResistrationRequestsService: React.PropTypes.func.isRequired,
            handleDoctorRegistrationRequestService: React.PropTypes.func.isRequired,
        }),
    },


    isLoading(pk) {
        const status = this.props.tree.requests.data.select(pk).get('status');
        return status === 'Loading' || typeof status === 'undefined';
    },

    async handle(pk, action, succesText) {
        const cursor = this.props.tree.requests.data.select(pk);
        const result = await this.context.services.handleDoctorRegistrationRequestService(
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
                        There are no pending reqistration requests
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
                            <Table.HeaderCell>First Name</Table.HeaderCell>
                            <Table.HeaderCell>Last Name</Table.HeaderCell>
                            <Table.HeaderCell>Email</Table.HeaderCell>
                            <Table.HeaderCell>Email Is Confirmed</Table.HeaderCell>
                            <Table.HeaderCell>Actions</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {_.map(data, (request, pk) => (
                            <Table.Row
                                key={pk}
                            >
                                <Table.Cell>
                                    {moment(request.data.dateCreated).format('MMM D, YYYY')}
                                </Table.Cell>
                                <Table.Cell>{request.data.firstName}</Table.Cell>
                                <Table.Cell>{request.data.lastName}</Table.Cell>
                                <Table.Cell>{request.data.email}</Table.Cell>
                                <Table.Cell>
                                    {
                                    request.data.isActive
                                    ?
                                        <Label color="green">Yes</Label>
                                    :
                                        <Label color="red">No</Label>
                                    }
                                </Table.Cell>
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
                            <Header>Doctors Registration Requests</Header>
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
