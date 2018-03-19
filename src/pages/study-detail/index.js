import _ from 'lodash';
import React from 'react';
import { Table, Grid, Header, Button, Form, Icon } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { GridWrapper, Input } from 'components';
import { AddToStudy } from './add-to-study';
import schema from 'libs/state';
import docIcon from 'components/files-input/doc_icon.svg';
import docStyles from 'components/files-input/styles.css'


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
            <div key={index} className={docStyles.upload_row}>
                <a href={consentDoc.file} target="_blank">
                    <img className={docStyles.upload_row__img}
                        src={consentDoc.thumbnail ? consentDoc.thumbnail : docIcon}/>
                </a>
                <span className={docStyles.upload_row__name}>{consentDoc.attachmentName}</span>
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
                            <Table.Cell style={{width: '20%'}}>
                                {row[0]}
                            </Table.Cell>
                            <Table.Cell style={{width: '80%'}}>
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
                        <Grid.Column width={10}>
                            {this.renderTable(study)}
                        </Grid.Column>
                        <Grid.Column width={6}>
                            <Header>Add doctor to study</Header>
                            <AddToStudy />
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </GridWrapper>
        );
    },
}));
