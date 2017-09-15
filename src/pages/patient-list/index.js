import React from 'react';
import BaobabPropTypes from 'baobab-prop-types';
import _ from 'lodash';
import moment from 'moment';
import { Table, Grid, Header, Image } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { GridWrapper, Input, Consent, PatientMolesInfo, Checkbox } from 'components';
import schema from 'libs/state';

const model = {
    tree: {
        search: '',
        requireAttention: false,
    },
};


export const PatientListPage = React.createClass({
    // We need this wrapper to make hot module replacement work
    render() {
        return <PatientList {...this.props} />;
    },
});

const PatientList = schema(model)(React.createClass({
    propTypes: {
        tree: BaobabPropTypes.cursor.isRequired,
        patientsCursor: BaobabPropTypes.cursor.isRequired,
    },

    contextTypes: {
        services: React.PropTypes.shape({
            patientsService: React.PropTypes.func.isRequired,
        }),
        mapRace: React.PropTypes.func.isRequired,
    },

    formatMrn(mrn) {
        if (_.isEmpty(mrn)) {
            return null;
        }
        return `(${mrn})`;
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

    renderTable(visiblePatients) {
        return (
            <Table celled>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Patient</Table.HeaderCell>
                        <Table.HeaderCell>Date of birth</Table.HeaderCell>
                        <Table.HeaderCell>Sex</Table.HeaderCell>
                        <Table.HeaderCell>Race</Table.HeaderCell>
                        <Table.HeaderCell>Moles information</Table.HeaderCell>
                        <Table.HeaderCell>Consent</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    { _.map(visiblePatients, (patient) => {
                        let dateOfBirth = moment(patient.data.dateOfBirth).format('MMM D, YYYY');
                        return (
                            <Table.Row key={patient.data.pk}>
                                {_.map([
                                    (<Link to={`/patient/${patient.data.pk}`}>
                                        {patient.data.firstName} {patient.data.lastName} {this.formatMrn(patient.data.mrn)}
                                    </Link>),
                                    ((dateOfBirth === 'Invalid date') ? null : dateOfBirth),
                                    this.renderSex(patient.data.sex),
                                    this.renderRace(patient.data.race),
                                    (<PatientMolesInfo patient={patient.data} />),
                                    (<Consent noPhoto consent={patient.data.validConsent} />)],
                                (data, index) => (
                                    <Table.Cell key={`${patient.data.pk}-${index}`}>
                                        {data}
                                    </Table.Cell>))
                                }
                            </Table.Row>
                        );
                    })}
                </Table.Body>
            </Table>
        );
    },

    render() {
        const patients = this.props.patientsCursor.get();
        if (patients.status !== 'Succeed') {
            return (
                <div>
                    {JSON.stringify(this.props.tree.patients.get())}
                </div>
            );
        }
        const total = _.values(patients.data).length;
        const requireAttention = this.props.tree.requireAttention.get();
        const visiblePatients = _.filter(patients.data, (patient) => {
            const search = _.toLower(this.props.tree.search.get());
            if (requireAttention &&
                patient.data.moleImagesApproveRequired === 0 &&
                patient.data.moleImagesWithDiagnoseRequired === 0) {
                return false;
            }
            return _.isEmpty(search) ||
                _.includes(_.toLower(patient.data.mrn), search) ||
                _.includes(_.toLower(patient.data.firstName), search) ||
                _.includes(_.toLower(patient.data.lastName), search);
        });

        return (
            <GridWrapper>
                <Grid>
                    <Grid.Row />
                    <Grid.Row>
                        <Grid.Column>
                            <Header>Patients List</Header>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column width={4}>
                            <Input
                                fluid
                                icon="search"
                                placeholder="Search..."
                                cursor={this.props.tree.search}
                            />
                        </Grid.Column>
                        <Grid.Column width={4}>
                            <Checkbox
                                cursor={this.props.tree.requireAttention}
                                label="Show only patients require attention"
                            />
                        </Grid.Column>
                        <Grid.Column width={4}>
                            {visiblePatients.length} from {total}
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column>
                            {this.renderTable(visiblePatients)}
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </GridWrapper>
        );
    },
}));
