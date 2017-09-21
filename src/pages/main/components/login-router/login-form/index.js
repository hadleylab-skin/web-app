import React from 'react';
import BaobabPropTypes from 'baobab-prop-types';
import _ from 'lodash';
import schema from 'libs/state';
import { Button, Form, Input, Icon } from 'semantic-ui-react';
import { FormErrorMessages, prepareErrorTexts } from 'components';
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
                    >
                        <Icon name="mail outline" />
                        <input
                            value={usernameCursor.get()}
                            onChange={(e) => usernameCursor.set(e.target.value)}
                        />
                    </Input>
                </Form.Field>
                <Form.Field>
                    <label>Password</label>
                    <Input
                        iconPosition="left"
                        placeholder="Password"
                        error={!!errors.password}
                    >
                        <Icon name="lock" />
                        <input
                            type="password"
                            value={passwordCursor.get()}
                            onChange={(e) => passwordCursor.set(e.target.value)}
                        />
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
