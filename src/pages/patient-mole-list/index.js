import React from 'react';
import BaobabPropTypes from 'baobab-prop-types';
import _ from 'lodash';
import { Table, Grid, Header, Image, Label } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { GridWrapper } from 'components';
import schema from 'libs/state';

const model = (props, context) => ({
    patientMolesCursor: (c) => context.services.getPatientMolesService(props.id, c),
});


export const PatientMoleListPage = React.createClass({
    // We need this wrapper to make hot module replacement work
    render() {
        return <PatientMoleList {...this.props} />;
    },
});

const PatientMoleList = schema(model)(React.createClass({
    propTypes: {
        id: React.PropTypes.string.isRequired,
        patientMolesCursor: BaobabPropTypes.cursor.isRequired,
    },

    contextTypes: {
        services: React.PropTypes.shape({
            getPatientMolesService: React.PropTypes.func.isRequired,
        }),
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
                        <Grid.Column width={10}>
                            {
                                mole.data.imagesWithDiagnoseRequired
                                ?
                                (
                                    <div><Label color="red" basic>
                                        Diagnose Required for {mole.data.imagesWithDiagnoseRequired}/{mole.data.imagesCount} images
                                    </Label><br /></div>
                                )
                                :
                                null
                            }
                            {
                                mole.data.imagesApproveRequired
                                ?
                                (
                                    <div><Label color="red" basic>
                                        Approve Required for {mole.data.imagesApproveRequired}/{mole.data.imagesCount} images
                                    </Label><br /></div>
                                )
                                :
                                null
                            }
                            <Label basic>
                                Total: {mole.data.imagesCount} images
                            </Label>
                        </Grid.Column>
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

    renderTable() {
        const moles = this.props.patientMolesCursor.data.get();
        return (
            <Table celled>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Created</Table.HeaderCell>
                        <Table.HeaderCell>Anatomical site</Table.HeaderCell>
                        <Table.HeaderCell>Last Image</Table.HeaderCell>
                        <Table.HeaderCell>Last Path Diagnoses</Table.HeaderCell>
                        <Table.HeaderCell>Last Clinical Diagnoses</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {_.map(moles, (mole, id) => (
                        <Table.Row
                            key={id}
                        >
                            <Table.Cell>{mole.data.lastImage.dateCreated}</Table.Cell>
                            <Table.Cell>
                                {this.renderAnatomicalSite(mole.data.anatomicalSites)}
                            </Table.Cell>
                            <Table.Cell>{this.renderPhoto(mole)}</Table.Cell>
                            <Table.Cell>{mole.data.lastImage.pathDiagnosis}</Table.Cell>
                            <Table.Cell>{mole.data.lastImage.clinicalDiagnosis}</Table.Cell>
                        </Table.Row>))
                    }
                </Table.Body>
            </Table>
        );
    },

    render() {
        const moles = this.props.patientMolesCursor.get();
        if (moles.status !== 'Succeed') {
            return (
                <div>
                    {JSON.stringify(moles)}
                </div>
            );
        }
        return (
            <GridWrapper>
                <Grid>
                    <Grid.Row />
                    <Grid.Row>
                        <Grid.Column>
                            <Header>Patient moles</Header>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column>
                            {this.renderTable()}
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </GridWrapper>
        );
    },
}));
