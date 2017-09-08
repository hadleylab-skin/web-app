import React from 'react';
import BaobabPropTypes from 'baobab-prop-types';
import _ from 'lodash';
import { GridWrapper, Input, DatePicker, Select } from 'components';
import { Grid, Header, Image, Form, Button } from 'semantic-ui-react';

import schema from '../../libs/state';

export const PatientPage = React.createClass({
    // We need this wrapper to make hot module replacement work
    render() {
        return <Patient {...this.props} />;
    },
});

const Patient = schema({})(React.createClass({
    propTypes: {
        patientCursor: BaobabPropTypes.cursor.isRequired,
    },

    contextTypes: {
        races: React.PropTypes.object.isRequired,
        services: React.PropTypes.shape({
            updatePatientService: React.PropTypes.func.isRequired,
        }),
    },

    async submit() {
        const pk = this.props.patientCursor.data.get('pk');
        let result = await this.context.services.updatePatientService(
            pk,
            this.props.patientCursor,
            _.pick(this.props.patientCursor.data.get(),
                   ['mrn', 'firstName', 'lastName', 'sex', 'dateOfBirth', 'race'])
        );
        console.log(result);
    },

    renderPhoto(photo) {
        if (_.isEmpty(photo)) {
            return null;
        }
        return (
            <Image src={photo} size="large" />
        );
    },

    render() {
        const patientCursor = this.props.patientCursor.data;
        return (
            <GridWrapper>
                <Grid>
                    <Grid.Row>
                        <Grid.Column width={2}>
                            {this.renderPhoto(patientCursor.photo.get('thumbnail'))}
                        </Grid.Column>
                        <Grid.Column width={14}>
                            <Form
                                onSubmit={this.submit}
                            >
                                <Header>
                                    {`Patient ${patientCursor.firstName.get()} ${patientCursor.lastName.get()}`}
                                </Header>
                                <Form.Group>
                                    <Form.Field>
                                        <label>MRN</label>
                                        <Input
                                            cursor={patientCursor.mrn}
                                        />
                                    </Form.Field>
                                </Form.Group>
                                <Form.Group>
                                    <Form.Field>
                                        <label>First name</label>
                                        <Input
                                            cursor={patientCursor.firstName}
                                        />
                                    </Form.Field>
                                    <Form.Field>
                                        <label>Last name</label>
                                        <Input
                                            cursor={patientCursor.lastName}
                                        />
                                    </Form.Field>
                                    <Form.Field>
                                        <label>Sex</label>
                                        <Select
                                            cursor={patientCursor.sex}
                                            placeholder="Select Sex"
                                            options={
                                            [{ text: 'Male', value: 'm' },
                                            { text: 'Female', value: 'f' },
                                            ]}
                                        />
                                    </Form.Field>
                                </Form.Group>
                                <Form.Group>
                                    <Form.Field>
                                        <label>Date of birth</label>
                                        <DatePicker
                                            cursor={patientCursor.dateOfBirth}
                                            showYearDropdown
                                        />
                                    </Form.Field>
                                    <Form.Field>
                                        <label>Race</label>
                                        <Select
                                            cursor={patientCursor.race}
                                            placeholder="Select Race"
                                            options={_.map(this.context.races,
                                                        (text, value) => ({ text, value }))}
                                        />
                                    </Form.Field>
                                </Form.Group>
                                <Button
                                    type="submit"
                                    color="pink"
                                >
                                    Submit
                                </Button>
                            </Form>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </GridWrapper>
        );
    },
}));

