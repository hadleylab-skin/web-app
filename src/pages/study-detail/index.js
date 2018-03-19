import _ from 'lodash';
import React from 'react';
import { Table, Grid, Header, Button, Form, Icon } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { GridWrapper, Input, FilesInput } from 'components';
import schema from 'libs/state';



export const StudyDetailPage = React.createClass({
    render() {
        return <StudyDetail {...this.props} />;
    },
});


const StudyDetail = schema({})(React.createClass({
    propTypes: {
        study: React.PropTypes.object,
    },

    renderDoctors(doctors) {
        return _.map(doctors, (doctor, index) => (
            <div key={index}>
                {doctor.firstName} {doctor.lastName} {doctor.email}
            </div>
        ));
    },

    renderPatients() {
        return '123123';
    },

    renderConsentDocs(consentDocs) {
        return _.map(consentDocs, (consentDoc, index) => (
            <div key={index}>
                <a href={consentDoc.file} target="_blank">
                    {consentDoc.file}
                </a>
            </div>
        ));
    },

    renderTable(study) {
        if (!study) {
            return (<div>Loading...</div>)
        }

        return (
            <Table celled>
                <Table.Body>
                    {_.map([
                        ['Study ID', study.pk],
                        ['Study title', study.title],
                        ['Doctors', this.renderDoctors(study.doctors)],
                        ['Patients', this.renderPatients()],
                        ['Consent docs', this.renderConsentDocs(study.consentDocs)],
                    ], (row, index) => (
                        <Table.Row key={index}>
                            <Table.Cell>
                                {row[0]}
                            </Table.Cell>
                            <Table.Cell>
                                {row[1]}
                            </Table.Cell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table>
        );
    },

    render() {
        const { study } = this.props;
        console.log(study);

        return (
            <GridWrapper>
                <Grid>
                    <Grid.Row />
                    <Grid.Row>
                        <Grid.Column>
                            <Header>Study Detail</Header>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column width={8}>
                            {this.renderTable(study)}
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </GridWrapper>
        );
    },
}));
