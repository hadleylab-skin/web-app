import _ from 'lodash';
import React from 'react';
import { withRouter } from 'react-router';
import BaobabPropTypes from 'baobab-prop-types';
import { Grid, Header, Button, Form, Icon } from 'semantic-ui-react';
import { GridWrapper, Input, FilesInput, prepareErrorTexts, FormErrorMessages } from 'components';
import schema from 'libs/state';


const model = {
    tree: {
        title: '',
        consentDocs: [],
        addStudyResult: {},
    },
};


export const StudyAddPage = React.createClass({
    render() {
        return <StudyAdd {...this.props} />;
    },
});


const StudyAdd = schema(model)(withRouter(React.createClass({
    propTypes: {
        tree: BaobabPropTypes.cursor.isRequired,
        studiesCursor: BaobabPropTypes.cursor.isRequired,
        history: React.PropTypes.object.isRequired,
    },

    contextTypes: {
        services: React.PropTypes.shape({
            addConsentDocService: React.PropTypes.func.isRequired,
            addStudyService: React.PropTypes.func.isRequired,
        }),
    },

    async submit() {
        const title = this.props.tree.title.get();
        const consentDocs = this.props.tree.consentDocs.get();

        const result = await this.context.services.addStudyService(
            this.props.tree.addStudyResult, { title, consentDocs });
        if (result.status === 'Succeed') {
            this.props.tree.title.set('');
            this.props.tree.consentDocs.set([]);

            this.props.studiesCursor.data.unshift(result.data);
            this.props.history.push(`/studies/${result.data.pk}`);
        }
    },

    render() {
        const addStudyResult = this.props.tree.addStudyResult.get();

        let errorTexts = [];
        let errors = {};
        if (addStudyResult && addStudyResult.status === 'Failure') {
            errors = _.get(addStudyResult, 'error.data', {});
            errorTexts = prepareErrorTexts(errors);
        }

        return (
            <GridWrapper>
                <Grid>
                    <Grid.Row />
                    <Grid.Row>
                        <Grid.Column>
                            <Header>Study add form</Header>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column width={6}>
                            <Form
                                onSubmit={this.submit}
                            >
                                <Form.Field>
                                    <label>Title</label>
                                    <Input
                                        iconPosition="left"
                                        placeholder="Title"
                                        error={errors.title}
                                        cursor={this.props.tree.title}
                                    >
                                        <Icon name="font" />
                                        <input />
                                    </Input>
                                </Form.Field>
                                <Form.Field>
                                    <label>Consent Documents</label>
                                    <FilesInput
                                        cursor={this.props.tree.consentDocs}
                                        uploadService={this.context.services.addConsentDocService}
                                    >
                                        <Icon name="file" />
                                        <input />
                                    </FilesInput>
                                </Form.Field>
                                <div style={{height: '30px'}} />
                                <Button
                                    type="submit"
                                    color="pink"
                                >
                                    Submit
                                </Button>
                                <FormErrorMessages errorTexts={errorTexts} />
                            </Form>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </GridWrapper>
        );
    },
})));
