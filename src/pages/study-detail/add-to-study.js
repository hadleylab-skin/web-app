import React from 'react';
import schema from 'libs/state';
import { Button, Form } from 'semantic-ui-react';
import { Input, prepareErrorTexts, FormErrorMessages } from 'components';


export const AddToStudy = schema({})(React.createClass({
    contextTypes: {
        services: React.PropTypes.shape({
            addDoctorToStudyService: React.PropTypes.func.isRequired,
        }),
    },

    submit() {

    },

    render() {
        console.log(this.context.services.addDoctorToStudyService);
        return (
            <Form
                onSubmit={this.submit}
            >
                <Form.Field>
                    <label>Doctor</label>
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
