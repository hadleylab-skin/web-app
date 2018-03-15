import _ from 'lodash';
import React from 'react';
import BaobabPropTypes from 'baobab-prop-types';
import { Table, Grid, Header, Button, Form, Icon } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { GridWrapper, Input, FilesInput } from 'components';
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


const StudyAdd = schema(model)(React.createClass({
    propTypes: {
        tree: BaobabPropTypes.cursor.isRequired
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
            this.props.tree.addStudyResult, {title, consentDocs});
        console.log(result);
    },

    render() {
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
                                        cursor={this.props.tree.title}
                                    >
                                        <Icon name="font" />
                                        <input />
                                    </Input>
                                </Form.Field>
                                <Form.Field>
                                    <label>Consent docs</label>
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
                            </Form>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </GridWrapper>
        );
    },
}));
