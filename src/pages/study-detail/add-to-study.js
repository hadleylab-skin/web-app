import React from 'react';
import BaobabPropTypes from 'baobab-prop-types';
import schema from 'libs/state';
import { Button, Form, Message } from 'semantic-ui-react';
import { Input, prepareErrorTexts, FormErrorMessages, Select, TextArea } from 'components';


const model = {
    tree: {
        doctors: {},
        selectedDoctor: null,
        emails: '',
        addDoctorToStudyResult: {}
    },
};

function titleMap(title) {
    switch (title) {
        case 0:
            return 'doctor';
        default:
            return `${_.capitalize(title)}:`;
    }
}


export const AddToStudy = schema(model)(React.createClass({
    contextTypes: {
        services: React.PropTypes.shape({
            addDoctorToStudyService: React.PropTypes.func.isRequired,
        }),
    },

    propTypes: {
        study: React.PropTypes.object,
        tree: BaobabPropTypes.cursor.isRequired,
    },

    async submit() {
        let emails = this.props.tree.emails.get();
        const selectedDoctorPk = this.props.tree.selectedDoctor.get();
        const { study } = this.props;
        emails = _.map(emails.split(','), (email) => email.trim());

        const result = await this.context.services.addDoctorToStudyService(
            study.pk,
            this.props.tree.addDoctorToStudyResult,
            {
                emails: emails,
                doctorPk: selectedDoctorPk
            }
        );

        if (result.status === 'Succeed') {
            const doctors = this.props.tree.doctors.get();
            const selectedDoctor = _.first(_.filter(doctors.data, {pk: selectedDoctorPk}));
            // this.props.study.doctors.push(selectedDoctor);
            this.props.tree.selectedDoctor.set(null);
            this.props.tree.emails.set('');
        }
    },

    renderFailEmails(emails) {
        return _.map(emails, (value, key) => {
            return (
                <div key={key}>
                    <b>{key}</b>
                    {' '}
                    <span>{value}</span>
                </div>
            )
        });
    },

    render() {
        const addDoctorToStudyResult = this.props.tree.addDoctorToStudyResult.get();
        const doctors = this.props.tree.doctors.get();
        let options = [];

        let errorTexts = [];
        let errors = {};
        if (addDoctorToStudyResult && addDoctorToStudyResult.status === 'Failure') {
            errors = _.get(addDoctorToStudyResult, 'error.data', {});
            errorTexts = prepareErrorTexts(errors, titleMap);
        }

        if (doctors.status === 'Succeed') {
            options = _.map(doctors.data, (doctor) => (
                {
                    text: doctor.firstName,
                    value: doctor.pk,
                }
            ))
        }

        return (
            <Form
                onSubmit={this.submit}
            >
                <Form.Field>
                    <label>Doctor</label>
                    <Select
                        fluid
                        error={!!errors.doctorPk}
                        placeholder="Select doctor"
                        cursor={this.props.tree.selectedDoctor}
                        options={options}
                    />
                </Form.Field>
                <Form.Field>
                    <label>Email list</label>
                    <TextArea
                        cursor={this.props.tree.emails}
                        placeholder="Enter emails, separated by comma (,)"
                    />
                </Form.Field>
                <Button
                    type="submit"
                    color="pink"
                >
                    Submit
                </Button>
                <FormErrorMessages errorTexts={errorTexts} />
                {addDoctorToStudyResult && addDoctorToStudyResult.status === 'Succeed' ?
                    <Message positive>
                        <Message.Header>
                            Invites Successfully sended
                        </Message.Header>
                        <Message.Content>
                            {addDoctorToStudyResult.data.allSuccess ?
                                <div>All invitations sended</div>
                            :
                                this.renderFailEmails(addDoctorToStudyResult.data.failEmails)
                            }
                        </Message.Content>
                    </Message>
                : null}
            </Form>
        );
    },
}));
