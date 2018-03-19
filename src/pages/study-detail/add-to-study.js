import React from 'react';
import BaobabPropTypes from 'baobab-prop-types';
import schema from 'libs/state';
import { Button, Form } from 'semantic-ui-react';
import { Input, prepareErrorTexts, FormErrorMessages, Select, TextArea } from 'components';


const model = {
    tree: {
        doctors: {},
        selectedDoctor: {},
        emails: '',
    },
};


export const AddToStudy = schema(model)(React.createClass({
    contextTypes: {
        services: React.PropTypes.shape({
            addDoctorToStudyService: React.PropTypes.func.isRequired,
        }),
    },

    propTypes: {
        tree: BaobabPropTypes.cursor.isRequired,
    },

    submit() {
        const emails = this.props.tree.emails.get();
        const selectedDoctor = this.props.tree.selectedDoctor.get();

        console.log(emails);
        console.log(selectedDoctor);
    },

    render() {
        const doctors = this.props.tree.doctors.get();
        let options = [];
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
                <div style={{height: '30px'}} />
                <Button
                    type="submit"
                    color="pink"
                >
                    Submit
                </Button>
            </Form>
        );
    },
}));
