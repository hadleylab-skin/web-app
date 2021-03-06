import React from 'react';
import BaobabPropTypes from 'baobab-prop-types';
import _ from 'lodash';
import moment from 'moment';
import { Table, Grid, Header, Image, Label } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { GridWrapper, Checkbox, Select } from 'components';
import schema from 'libs/state';

const model = {
    tree: {
        requireAttention: false,
        anatomicalSite: null,
    },
};


export const PatientMoleListPage = React.createClass({
    // We need this wrapper to make hot module replacement work
    render() {
        return <PatientMoleList {...this.props} />;
    },
});

const PatientMoleList = schema(model)(React.createClass({
    propTypes: {
        id: React.PropTypes.string.isRequired,
        tree: BaobabPropTypes.cursor.isRequired,
        patient: React.PropTypes.object,
        studies: React.PropTypes.array,
        patientMolesCursor: BaobabPropTypes.cursor.isRequired,
    },

    contextTypes: {
        services: React.PropTypes.shape({
            getPatientMolesService: React.PropTypes.func.isRequired,
        }),
        cursors: React.PropTypes.shape({
            currentStudy: BaobabPropTypes.cursor.isRequired,
        }),
    },

    componentWillMount() {
        this.context.services.getPatientMolesService(
            this.props.id,
            this.props.patientMolesCursor,
            this.context.cursors.currentStudy.get());
    },

    renderMolesInfo(mole) {
        return (
            <Grid.Column width={10}>
                {
                    mole.data.imagesWithClinicalDiagnosisRequired
                    ?
                    (
                        <div><Label color="red" basic>
                            Clinical Diagnosis Required for {mole.data.imagesWithClinicalDiagnosisRequired}/{mole.data.imagesCount} images
                        </Label><br /><br /></div>
                    )
                    :
                    null
                }
                {
                    mole.data.imagesWithPathologicalDiagnosisRequired
                    ?
                    (
                        <div><Label color="red" basic>
                            Pathology Diagnosis Required for {mole.data.imagesWithPathologicalDiagnosisRequired}/{mole.data.imagesBiopsyCount} images
                        </Label><br /><br /></div>
                    )
                    :
                    null
                }

                {
                    mole.data.imagesApproveRequired
                    ?
                    (
                        <div><Label color="red" basic>
                            Approval Required for {mole.data.imagesApproveRequired}/{mole.data.imagesCount} images
                        </Label><br /><br /></div>
                    )
                    :
                    null
                }
                <Label basic>
                    Total: {mole.data.imagesCount} images
                </Label>
            </Grid.Column>
        );
    },

    renderPhoto(mole) {
        const photo = mole.data.lastImage.photo.thumbnail;
        if (_.isEmpty(photo)) {
            return null;
        }
        return (
            <Link to={`/patient/${this.props.id}/mole/${mole.data.pk}`}>

                <Grid>
                    <Grid.Row>
                        <Grid.Column width={6}>
                            <Image src={photo} size="tiny" />
                        </Grid.Column>
                        {this.renderMolesInfo(mole)}
                    </Grid.Row>
                </Grid>
            </Link>
        );
    },

    renderAnatomicalSite(anatomicalSites) {
        return _.chain(anatomicalSites)
                .map((site) => site.name)
                .join('/')
                .value();
    },

    renderStudies(studyPks) {
        const { studies } = this.props;

        return _.map(studyPks, (studyPk, index) => {
            const study = _.find(studies, { pk: studyPk });
            if (!study) {
                return null;
            }

            return (
                <p key={index}>
                    <Link to={`/studies/${study.pk}`}>
                        {study.title}
                    </Link>
                </p>
            );
        });
    },

    renderTable(moles) {
        return (
            <Table celled>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Created</Table.HeaderCell>
                        <Table.HeaderCell>Anatomical site</Table.HeaderCell>
                        <Table.HeaderCell>Last Image</Table.HeaderCell>
                        <Table.HeaderCell>Last Path Diagnosis</Table.HeaderCell>
                        <Table.HeaderCell>Last Clinical Diagnosis</Table.HeaderCell>
                        <Table.HeaderCell>Studies</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {_.map(moles, (mole, id) => (
                        <Table.Row
                            key={id}
                        >
                            <Table.Cell>{moment(mole.data.lastImage.dateCreated).format('MMM D, YYYY')}</Table.Cell>
                            <Table.Cell>
                                {this.renderAnatomicalSite(mole.data.anatomicalSites)}
                            </Table.Cell>
                            <Table.Cell>{this.renderPhoto(mole)}</Table.Cell>
                            <Table.Cell>{mole.data.lastImage.pathDiagnosis}</Table.Cell>
                            <Table.Cell>{mole.data.lastImage.clinicalDiagnosis}</Table.Cell>
                            <Table.Cell>{this.renderStudies(mole.data.studies)}</Table.Cell>
                        </Table.Row>))
                    }
                </Table.Body>
            </Table>
        );
    },

    renderPatientName() {
        if (!this.props.patient) {
            return null;
        }
        const patientName = `${this.props.patient.firstName} ${this.props.patient.lastName}`;
        return (
            <Link to={`/patient/${this.props.patient.pk}`}>
                {patientName}
            </Link>
        );
    },

    render() {
        const moles = this.props.patientMolesCursor.get();
        if (moles.status !== 'Succeed') {
            return null;
        }
        const total = _.values(moles.data).length;
        const requireAttention = this.props.tree.requireAttention.get();
        const selectedAnatomicalSite = this.props.tree.anatomicalSite.get();
        const visibleMoles = _.filter(moles.data, (mole) => {
            if (requireAttention &&
                mole.data.imagesApproveRequired === 0 &&
                mole.data.imagesWithClinicalDiagnosisRequired === 0 &&
                mole.data.imagesWithPathologicalDiagnosisRequired === 0) {
                return false;
            }

            let result = true;
            if (selectedAnatomicalSite) {
                result &= _.last(mole.data.anatomicalSites).pk === selectedAnatomicalSite;
            }

            return result;
        });
        const availableAnatomicalSites =
            _.chain(moles.data)
            .map((mole) => mole.data.anatomicalSites)
            .map((sites) => ({
                text: _.join(_.map(sites, (s) => s.name), '/'),
                value: _.last(sites).pk,
            }))
            .uniqBy((option) => option.value)
            .value();

        const options =
            _.flatten([[{ text: 'All', value: null }], availableAnatomicalSites]);

        return (
            <GridWrapper>
                <Grid>
                    <Grid.Row />
                    <Grid.Row>
                        <Grid.Column>
                            <Header>Patient {this.renderPatientName()} moles</Header>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column width={4}>
                            <Select
                                search
                                selection
                                fluid
                                placeholder="filter by anatomical site"
                                cursor={this.props.tree.anatomicalSite}
                                options={options}
                            />
                        </Grid.Column>
                        <Grid.Column width={4}>
                            <Checkbox
                                cursor={this.props.tree.requireAttention}
                                label="Show only moles require attention"
                            />
                        </Grid.Column>
                        <Grid.Column width={2}>
                            {visibleMoles.length} from {total}
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column>
                            {this.renderTable(visibleMoles)}
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </GridWrapper>
        );
    },
}));
