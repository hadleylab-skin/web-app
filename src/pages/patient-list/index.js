import React from 'react';
import BaobabPropTypes from 'baobab-prop-types';
import _ from 'lodash';
import { Table, Grid, Header, Image, Input } from 'semantic-ui-react';
import schema from '../../libs/state';

const model = (props, context) => ({
    tree: {
        patients: context.services.patientsService,
        search: '',
    },
});


export const PatientListPage = React.createClass({
    // We need this wrapper to make hot module replacement work
    render() {
        return <PatientList {...this.props} />;
    },
});

const PatientList = schema(model)(React.createClass({
    propTypes: {
        tree: BaobabPropTypes.cursor.isRequired,
    },

    contextTypes: {
        services: React.PropTypes.shape({
            patientsService: React.PropTypes.func.isRequired,
        }),
        mapRace: React.PropTypes.func.isRequired,
    },

    renderPhoto(photo) {
        if (_.isEmpty(photo)) {
            return null;
        }
        return (
            <Image src={photo} size="tiny" />
        );
    },

    renderSex(sex) {
        switch (sex) {
        case 'f': return 'Female';
        case 'm': return 'Male';
        default: return sex;
        }
    },

    renderRace(race) {
        return this.context.mapRace(race);
    },

    render() {
        const patients = this.props.tree.patients.get();
        if (patients.status !== 'Succeed') {
            return (
                <div>
                    {JSON.stringify(this.props.tree.patients.get())}
                </div>
            );
        }

        return (
            <Grid>
                <Grid.Row />
                <Grid.Row>
                    <Grid.Column width={1} />
                    <Grid.Column width={15}>
                        <Header>Patients List</Header>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column width={1} />
                    <Grid.Column width={4}>
                        <Input
                            fluid
                            icon="search"
                            placeholder="Search..."
                            value={this.props.tree.search.get()}
                            onChange={(e) => this.props.tree.search.set(e.target.value)}
                        />
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column width={1} />
                    <Grid.Column width={14}>
                        <Table celled>
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell>MRN</Table.HeaderCell>
                                    <Table.HeaderCell>First Name</Table.HeaderCell>
                                    <Table.HeaderCell>Last Name</Table.HeaderCell>
                                    <Table.HeaderCell>Date of birth</Table.HeaderCell>
                                    <Table.HeaderCell>Sex</Table.HeaderCell>
                                    <Table.HeaderCell>Race</Table.HeaderCell>
                                    <Table.HeaderCell>Images</Table.HeaderCell>
                                    <Table.HeaderCell>Consent</Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                { _.chain(patients.data)
                                   .filter((patient) => {
                                       const search = _.toLower(this.props.tree.search.get());
                                       return _.isEmpty(search) ||
                                           _.includes(_.toLower(patient.data.mrn), search) ||
                                           _.includes(_.toLower(patient.data.firstName), search) ||
                                           _.includes(_.toLower(patient.data.lastName), search);
                                   })
                                   .map((patient) => (
                                       <Table.Row key={patient.data.pk}>
                                           <Table.Cell>{patient.data.mrn}</Table.Cell>
                                           <Table.Cell>{patient.data.firstName}</Table.Cell>
                                           <Table.Cell>{patient.data.lastName}</Table.Cell>
                                           <Table.Cell>{patient.data.dateOfBirth}</Table.Cell>
                                           <Table.Cell>{this.renderSex(patient.data.sex)}</Table.Cell>
                                           <Table.Cell>{this.renderRace(patient.data.race)}</Table.Cell>
                                           <Table.Cell>{patient.data.molesImagesCount}</Table.Cell>
                                           <Table.Cell>{this.renderPhoto(patient.data.validConsent.signature)}</Table.Cell>
                                       </Table.Row>
                                   ))
                                   .value()
                                }
                            </Table.Body>
                        </Table>
                    </Grid.Column>
                    <Grid.Column width={1} />
                </Grid.Row>
            </Grid>
        );
    },
}));
