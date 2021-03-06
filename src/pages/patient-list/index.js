import React from 'react';
import BaobabPropTypes from 'baobab-prop-types';
import _ from 'lodash';
import moment from 'moment';
import { Table, Grid, Header, Image } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import cookie from 'react-cookies';
import { GridWrapper, Input, Select, Consent, PatientMolesInfo, Checkbox } from 'components';
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
        studies: React.PropTypes.array,
    },

    contextTypes: {
        services: React.PropTypes.shape({
            patientsService: React.PropTypes.func.isRequired,
        }),
        cursors: React.PropTypes.shape({
            doctor: BaobabPropTypes.cursor.isRequired,
            currentStudy: BaobabPropTypes.cursor.isRequired,
        }),
        mapRace: React.PropTypes.func.isRequired,
    },

    componentWillMount() {
        this.context.cursors.currentStudy.on('update', this.currentStudyUpdated);
    },

    componentWillUnmount() {
        this.context.cursors.currentStudy.off('update', this.currentStudyUpdated);
    },

    async currentStudyUpdated() {
        const { cursors, services } = this.context;
        const currentStudy = cursors.currentStudy.get();

        await services.patientsService(this.props.patientsCursor, currentStudy);

        cookie.save('currentStudy', currentStudy);
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

    renderStudies(studies) {
        const { isCoordinator, isParticipant, pk } = this.context.cursors.doctor.data.get();
        const studyPks = _.map(this.props.studies, (study) => study.pk);

        let filteredStudies = studies;
        if (isCoordinator) {
            filteredStudies = _.filter(filteredStudies, (study) => study.author === pk);
        } else if (!isParticipant) {
            filteredStudies = _.filter(filteredStudies, (study) => _.includes(studyPks, study.pk));
        }

        return _.map(filteredStudies, (study) => (
            <div key={study.pk}>
                <Link to={`/studies/${study.pk}`}>
                    {study.title} [{study.pk}]
                </Link>
            </div>
        ));
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
                        <Table.HeaderCell>Studies</Table.HeaderCell>
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
                                    (<Consent noPhoto consent={patient.data.validConsent} />),
                                    this.renderStudies(patient.data.studies)],
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
        const total = _.values(patients.data).length;
        const requireAttention = this.props.tree.requireAttention.get();
        let visiblePatients = [];
        if (patients.status === 'Succeed') {
            visiblePatients = _.filter(patients.data, (patient) => {
                const search = _.toLower(this.props.tree.search.get());
                if (requireAttention &&
                    patient.data.molesImagesApproveRequired === 0 &&
                    patient.data.molesImagesWithClinicalDiagnosisRequired === 0 &&
                    patient.data.molesImagesWithPathologicalDiagnosisRequired === 0) {
                    return false;
                }

                return _.isEmpty(search) ||
                    _.includes(_.toLower(patient.data.mrn), search) ||
                    _.includes(_.toLower(patient.data.firstName), search) ||
                    _.includes(_.toLower(patient.data.lastName), search);
            });
        }

        const { studies } = this.props;
        if (!studies) {
            return null;
        }

        const studyOptions = _.flatten(
            [
                [{ text: 'Without studies', value: null }],
                _.map(studies, (study) => ({
                    text: study.title,
                    value: study.pk,
                })),
            ]
        );

        return (
            <GridWrapper>
                <Grid>
                    <Grid.Row />
                    <Grid.Row>
                        <Grid.Column>
                            <Header>Patients</Header>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column width={4}>
                            <Select
                                search
                                selection
                                fluid
                                placeholder="Without studies"
                                cursor={this.context.cursors.currentStudy}
                                options={studyOptions}
                            />
                        </Grid.Column>
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
