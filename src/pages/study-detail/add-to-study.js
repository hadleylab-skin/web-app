import React from 'react';
import BaobabPropTypes from 'baobab-prop-types';
import schema from 'libs/state';
import { Button, Form, Message } from 'semantic-ui-react';
import { Input, prepareErrorTexts, FormErrorMessages, Select, TextArea } from 'components';


const model = {
    tree: {
        selectedDoctor: null,
        emails: '',
        addDoctorToStudyResult: {}
    },
};

function titleMap(title) {
    switch (title) {
        case 0:
        case 'doctorPk':
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
        cursors: React.PropTypes.shape({
            doctor: BaobabPropTypes.cursor.isRequired,
        }),
    },

    propTypes: {
        study: React.PropTypes.object,
        doctors: React.PropTypes.array,
        tree: BaobabPropTypes.cursor.isRequired,
    },

    componentWillMount() {
      this.props.tree.set(model.tree);
    },

    async submit() {
        let emails = this.props.tree.emails.get();
        const selectedDoctorPk = this.props.tree.selectedDoctor.get();
        const { study, doctors } = this.props;
        emails = _.compact(_.map(emails.split(','), (email) => email.trim()));

        const result = await this.context.services.addDoctorToStudyService(
            study.pk,
            this.props.tree.addDoctorToStudyResult,
            {
                emails: emails,
                doctorPk: selectedDoctorPk
            }
        );

        if (result.status === 'Succeed') {
            const selectedDoctor = _.first(_.filter(doctors, {pk: selectedDoctorPk}));
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
        const doctors = this.props.doctors;
        let options = [];

        let errorTexts = [];
        let errors = {};
        if (addDoctorToStudyResult && addDoctorToStudyResult.status === 'Failure') {
            errors = _.get(addDoctorToStudyResult, 'error.data', {});
            errorTexts = prepareErrorTexts(errors, titleMap);
        }

        const { coordinatorOfSite } = this.context.cursors.doctor.data.get();
        if (doctors) {
            let filteredDoctors = doctors;

            if (coordinatorOfSite) {
                filteredDoctors = _.filter(
                    doctors,
                    (doctor) => _.includes(doctor.sites, coordinatorOfSite));
            }

            options = _.map(filteredDoctors, (doctor) => (
                {
                    text: `${doctor.firstName} ${doctor.lastName}`,
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
                    <label>Patients emails list</label>
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
                            Invites successfully sent
                        </Message.Header>
                        <Message.Content>
                            {addDoctorToStudyResult.data.allSuccess ?
                                <div>All invitations were sent</div>
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
