import React from 'react';
import BaobabPropTypes from 'baobab-prop-types';
import _ from 'lodash';
import schema from 'libs/state';
import { Button, Form, Icon } from 'semantic-ui-react';
import autofill from 'react-autofill';
import { FormErrorMessages, prepareErrorTexts, Input } from 'components';
import { loginService } from 'services/auth';

const model = {
    tree: {
        username: '',
        password: '',
    },
};

function titleMap(title) {
    switch (title) {
    case 'username':
        return 'Email:';
    case 'nonFieldErrors':
        return '';
    default:
        return `${_.capitalize(title)}:`;
    }
}

export const LoginForm = schema(model)(React.createClass({
    propTypes: {
        tree: BaobabPropTypes.cursor.isRequired,
        tokenCursor: BaobabPropTypes.cursor.isRequired,
    },

    submit() {
        loginService(
            this.props.tokenCursor,
            this.props.tree.get());
    },

    render() {
        const usernameCursor = this.props.tree.username;
        const passwordCursor = this.props.tree.password;
        const token = this.props.tokenCursor.get();
        const errors = _.get(token, 'error.data', {});
        const errorTexts = prepareErrorTexts(errors, titleMap);
        return (
            <Form
                onSubmit={this.submit}
            >
                <Form.Field>
                    <label>Email</label>
                    <Input
                        iconPosition="left"
                        placeholder="Email"
                        error={!!errors.username}
                        cursor={usernameCursor}
                    >
                        <Icon name="mail outline" />
                        <input />
                    </Input>
                </Form.Field>
                <Form.Field>
                    <label>Password</label>
                    <Input
                        iconPosition="left"
                        placeholder="Password"
                        type="password"
                        cursor={passwordCursor}
                        error={!!errors.password}
                        autoFocus
                    >
                        <Icon name="lock" />
                        <input />
                    </Input>
                </Form.Field>
                <Button
                    type="submit"
                    color="pink"
                >
                    Submit
                </Button>
                <FormErrorMessages errorTexts={errorTexts} />
            </Form>
        );
    },
}));
