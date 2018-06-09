import _ from 'lodash';
import React from 'react';
import BaobabPropTypes from 'baobab-prop-types';
import { Table, Grid, Header, Button, Form, Icon, Message } from 'semantic-ui-react';
import { GridWrapper, FilesInput, Input } from 'components';
import { AddToStudy } from './add-to-study';
import schema from 'libs/state';
import docIcon from 'components/files-input/doc_icon.svg';
import docStyles from 'components/files-input/styles.css'


const model = (props, context) => ({
    tree: {
        invites: (c) => context.services.getInvitesOfStudyService(props.study.pk, c),
        addToStudyScreen: {},
        saveStudyResult: {},

        title: props.study.title,
        consentDocs: [],
    },
});


export const StudyDetailPage = React.createClass({
    render() {
        return <StudyDetail {...this.props} />;
    },
});


const StudyDetail = schema(model)(React.createClass({
    propTypes: {
        study: React.PropTypes.object,
        tree: BaobabPropTypes.cursor.isRequired,
        isCoordinator: React.PropTypes.bool,
    },

    contextTypes: {
        services: React.PropTypes.shape({
            getInvitesOfStudyService: React.PropTypes.func.isRequired,
            addConsentDocService: React.PropTypes.func.isRequired,
            updateStudyService: React.PropTypes.func.isRequired,
        }),
    },

    componentWillMount() {
        this.props.tree.consentDocs.set(
            _.map(this.props.study.consentDocs, (doc) => doc.pk)
        );
    },

    saveStudy() {
        const { tree, study } = this.props;

        this.context.services.updateStudyService(
            study.pk,
            tree.saveStudyResult,
            {
                title: tree.title.get(),
                consentDocs: tree.consentDocs.get(),
            }
        );
    },

    renderDoctors(doctors) {
        return _.map(doctors, (doctor, index) => (
            <div key={index}>
                {doctor.firstName} {doctor.lastName} {doctor.email}
            </div>
        ));
    },

    renderInvitesEmails(invites) {
        return _.map(invites, (invite, index) => (
            <div key={index}>
                {invite.email}
            </div>
        ));
    },

    renderNewInvites(invites) {
        return this.renderInvitesEmails(
            _.filter(invites.data, { status: 1 })
        );
    },

    renderPatients(invites) {
        return this.renderInvitesEmails(
            _.filter(invites.data, { status: 2 })
        );
    },

    renderConsentDocs() {
        const { isCoordinator } = this.props;

        if (isCoordinator) {
            return (
                <FilesInput
                    cursor={this.props.tree.consentDocs}
                    initials={this.props.study.consentDocs}
                    uploadService={this.context.services.addConsentDocService}
                >
                    <Icon name="file" />
                    <input />
                </FilesInput>
            );
        }

        const consentDocs = this.props.tree.consentDocs.get();

        return _.map(consentDocs, (consentDoc, index) => (
            <div key={index} className={docStyles.upload_row}>
                <a href={consentDoc.file} target="_blank">
                    <img className={docStyles.upload_row__img}
                        src={consentDoc.thumbnail ? consentDoc.file : docIcon} />
                </a>
                <span className={docStyles.upload_row__name}>{consentDoc.originalFilename}</span>
            </div>
        ));
    },

    renderTitle() {
        const { isCoordinator } = this.props;

        if (isCoordinator) {
            return (
                <Input
                    style={{ width: '100%' }}
                    iconPosition="left"
                    placeholder="Title"
                    cursor={this.props.tree.title}
                >
                    <Icon name="font" />
                    <input />
                </Input>
            );
        }

        return this.props.tree.title.get();
    },

    renderTable(study) {
        if (!study) {
            return (<div>Loading...</div>);
        }

        const { isCoordinator } = this.props;
        const saveStudyResult = this.props.tree.saveStudyResult.get();

        return (
            <Form
                onSubmit={this.saveStudy}
            >
                <Table celled>
                    <Table.Body>
                        {_.map([
                            ['Study ID', study.pk],
                            ['Study title', this.renderTitle()],
                            ['Doctors', this.renderDoctors(study.doctors)],
                            ['Patients', this.renderPatients(this.props.tree.invites.get())],
                            ['Invites', this.renderNewInvites(this.props.tree.invites.get())],
                            ['Consent docs', this.renderConsentDocs()],
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
                {isCoordinator ?
                    <div>
                        <Button
                            type="submit"
                            color="pink"
                        >
                            Save
                        </Button>
                        {saveStudyResult && saveStudyResult.status === 'Succeed' ?
                            <Message positive>
                                <Message.Header>
                                    Success
                                </Message.Header>
                                <Message.Content>
                                    {_.isEqual(
                                        _.map(saveStudyResult.data.consentDocs, _.clone).sort(),
                                        _.map(study.consentDocs, (doc) => doc.pk).sort()) ?
                                        'Study successfully changed'
                                    :
                                        'Study successfully changed and all patient consents invalidated'}
                                </Message.Content>
                            </Message>
                        : null}
                    </div>
                : null}
            </Form>
        );
    },

    render() {
        const { study, isCoordinator } = this.props;

        return (
            <GridWrapper>
                <Grid>
                    <Grid.Row />
                    <Grid.Row>
                        <Grid.Column width={10}>
                            <Header>Study Detail</Header>
                            {this.renderTable(study)}
                        </Grid.Column>
                        {isCoordinator ?
                            <Grid.Column width={6}>
                                <Header>Add doctor to study</Header>
                                <AddToStudy
                                    study={study}
                                    doctors={this.props.tree.doctors.data.get()}
                                    tree={this.props.tree.addToStudyScreen}
                                />
                            </Grid.Column>
                        : null}
                    </Grid.Row>
                </Grid>
            </GridWrapper>
        );
    },
}));
