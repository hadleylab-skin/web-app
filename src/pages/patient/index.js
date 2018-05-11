import React from 'react';
import BaobabPropTypes from 'baobab-prop-types';
import _ from 'lodash';
import moment from 'moment';
import tv4 from 'tv4';
import { Link } from 'react-router-dom';
import { GridWrapper, Input,
         DatePicker, Select,
         FormErrorMessages, prepareErrorTexts,
         Consent, PatientMolesInfo,
} from 'components';
import { Grid, Header, Image, Form, Button, Message } from 'semantic-ui-react';

import schema from '../../libs/state';


function titleMap(title) {
    switch (title) {
    case 'mrnHash':
        return 'MRN:';
    case 'nonFieldErrors':
        return '';
    default:
        return `${_.capitalize(title)}:`;
    }
}

function errorsMap(errors) {
    return _.chain(errors)
            .map((error) => [error.dataPath.slice(1), [error.message]])
            .fromPairs()
            .value();
}

tv4.setErrorReporter((error, data, itemSchema) => itemSchema.message);

const patientValidationSchema = {
    type: 'object',
    properties: {
        firstName: {
            minLength: 2,
            message: 'too short',
        },
        lastName: {
            minLength: 2,
            message: 'too short',
        },
        mrn: {
            type: 'string',
            pattern: '^\\d{0,9}$',
            message: 'MRN should be an integer number, less than 10 digits',
        },
    },
    required: ['firstName', 'lastName'],
    message: 'required',
};

export const PatientPage = React.createClass({
    // We need this wrapper to make hot module replacement work
    render() {
        return <Patient {...this.props} />;
    },
});

const model = {
    doctorKeys: {},
};

const Patient = schema(model)(React.createClass({
    propTypes: {
        tree: BaobabPropTypes.cursor.isRequired,
        patientCursor: BaobabPropTypes.cursor.isRequired,
    },

    contextTypes: {
        races: React.PropTypes.object.isRequired,
        services: React.PropTypes.shape({
            updatePatientService: React.PropTypes.func.isRequired,
            getDoctorKeyListService: React.PropTypes.func.isRequired,
        }),
        cursors: React.PropTypes.shape({
            doctor: BaobabPropTypes.cursor.isRequired,
            currentStudy: BaobabPropTypes.cursor.isRequired,
        }),
    },

    componentWillMount() {
        const patientCursor = this.props.patientCursor;
        if (_.isEmpty(patientCursor.get()) || patientCursor.status.get() === 'Loading') {
            patientCursor.on('update', this.setupAndUnsubscribe);
        } else {
            this.props.tree.set(patientCursor.get());
            this.setupDoctorKeys();
        }
    },

    setupAndUnsubscribe(e) {
        if (e.data.currentData.status === 'Succeed') {
            this.props.tree.set(e.data.currentData);
            this.props.patientCursor.off(this.setupAndUnsubscribe);
            this.setupDoctorKeys();
        }
    },

    async setupDoctorKeys() {
        const { cursors, services } = this.context;
        const { doctors } = this.props.patientCursor.get('data');
        const { pk, isCoordinator, myDoctorsPublicKeys } = cursors.doctor.data.get();

        if (isCoordinator) {
            const doctorsWithKeys = _.map(_.keys(myDoctorsPublicKeys), (key) => parseInt(key, 10));
            const doctorsWithoutKeys = _.filter(
                doctors,
                (doctor) => !_.includes(doctorsWithKeys, doctor) && doctor !== pk
            );

            if (!_.isEmpty(doctorsWithoutKeys)) {
                const result = await services.getDoctorKeyListService(
                    this.props.tree.doctorKeys,
                    doctorsWithoutKeys
                );
                if (result.status === 'Succeed') {
                    let keys = _.map(result.data, (item) => {
                        let result2 = {};
                        result2[item.pk] = item.publicKey;
                        return result2;
                    });
                    keys = Object.assign({}, ...keys);
                    cursors.doctor.data.myDoctorsPublicKeys.merge(keys);
                }
            }
        }
    },

    async submit() {
        const data = _.pick(
            this.props.tree.data.get(),
            ['mrn', 'firstName', 'lastName', 'sex', 'dateOfBirth', 'race', 'doctors']);
        const validationResult = tv4.validateMultiple(data, patientValidationSchema);
        if (validationResult.errors.length) {
            this.props.tree.error.data.set(errorsMap(validationResult.errors));
            return;
        }
        const pk = this.props.tree.data.get('pk');
        const currentStudy = this.context.cursors.currentStudy.get();
        let result = await this.context.services.updatePatientService(
            pk,
            this.props.tree,
            data,
            currentStudy,
            this.context.cursors.doctor.get(),
        );
        if (result.status === 'Succeed') {
            this.props.patientCursor.set(this.props.tree.get());
            this.props.tree.saved.set(true);
            setTimeout(() => this.props.tree.saved.set(false), 2000);
        }
    },

    renderPhoto(photo) {
        if (_.isEmpty(photo)) {
            return null;
        }
        return (
            <div>
                <Image src={photo} size="large" />
                <br />
            </div>
        );
    },

    render() {
        const patientCursor = this.props.tree.data;
        const status = this.props.patientCursor.status.get();
        const disabled = !status;
        const loading = status === 'Loading' || typeof status === 'undefined';
        const saved = this.props.tree.saved.get();
        const errors = this.props.tree.error.data.get() || {};
        const errorTexts = prepareErrorTexts(errors, titleMap);
        let studies = patientCursor.studies.get();
        const { isCoordinator, pk } = this.context.cursors.doctor.data.get();
        if (isCoordinator) {
            studies = _.filter(studies, (study) => study.author === pk);
        }

        return (
            <GridWrapper>
                <Grid>
                    <Grid.Row>
                        <Grid.Column width={2} />
                        <Grid.Column width={14}>
                            <Header>
                                {`Patient ${patientCursor.firstName.get()} ${patientCursor.lastName.get()}`}
                            </Header>
                        </Grid.Column >
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column width={2}>
                            {this.renderPhoto(patientCursor.photo.get('thumbnail'))}
                            <Consent consent={patientCursor.validConsent.get()} />
                        </Grid.Column>
                        <Grid.Column width={7}>
                            <Form
                                onSubmit={this.submit}
                            >
                                <Form.Group>
                                    <Form.Field>
                                        <label>MRN</label>
                                        <Input
                                            disabled={disabled}
                                            error={!!errors.mrnHash}
                                            cursor={patientCursor.mrn}
                                        />
                                    </Form.Field>
                                </Form.Group>
                                <Form.Group>
                                    <Form.Field>
                                        <label>First name</label>
                                        <Input
                                            disabled={disabled}
                                            error={!!errors.firstName}
                                            cursor={patientCursor.firstName}
                                        />
                                    </Form.Field>
                                    <Form.Field>
                                        <label>Last name</label>
                                        <Input
                                            disabled={disabled}
                                            error={!!errors.lastName}
                                            cursor={patientCursor.lastName}
                                        />
                                    </Form.Field>
                                    <Form.Field>
                                        <label>Sex</label>
                                        <Select
                                            disabled={disabled}
                                            error={!!errors.sex}
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
                                            maxDate={moment()}
                                            disabled={disabled}
                                            error={!!errors.dateOfBirth}
                                            cursor={patientCursor.dateOfBirth}
                                            showYearDropdown
                                        />
                                    </Form.Field>
                                    <Form.Field>
                                        <label>Race</label>
                                        <Select
                                            disabled={disabled}
                                            cursor={patientCursor.race}
                                            error={!!errors.race}
                                            placeholder="Select Race"
                                            options={_.map(this.context.races,
                                                        (text, value) => ({ text, value }))}
                                        />
                                    </Form.Field>
                                </Form.Group>
                                <Button
                                    loading={loading}
                                    disabled={disabled}
                                    type="submit"
                                    color="pink"
                                >
                                    Submit
                                </Button>
                                {
                                    saved
                                    ?
                                    (
                                        <Message positive>
                                            <Message.Header>Succeed</Message.Header>
                                            <p>The patient data is succesfully saved</p>
                                        </Message>
                                    )
                                    :
                                    null
                                }
                                <FormErrorMessages errorTexts={errorTexts} />
                            </Form>
                        </Grid.Column>
                        <Grid.Column width={4}>
                            <Header as="p">
                                Moles information
                            </Header>
                            {loading ? null : <PatientMolesInfo patient={this.props.patientCursor.data.get()} />}
                        </Grid.Column>
                        <Grid.Column width={3}>
                            <Header as="p">
                                Studies
                            </Header>
                            {_.map(studies, (study) => (
                                <div key={study.pk}>
                                    <Link to={`/studies/${study.pk}`}>
                                        {study.title} [{study.pk}]
                                    </Link>
                                </div>
                            ))}
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </GridWrapper>
        );
    },
}));

