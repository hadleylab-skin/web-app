import React from 'react';
import BaobabPropTypes from 'baobab-prop-types';
import _ from 'lodash';
import schema from 'libs/state';
import { Button, Form, Icon } from 'semantic-ui-react';
import { FormErrorMessages, prepareErrorTexts, Input } from 'components';
import { loginService } from 'services/auth';
import { withRouter } from 'react-router';

const model = {
    tree: {
        username: 'doctor@yandex.ru',
        password: '1',
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

export const LoginForm = schema(model)(withRouter(React.createClass({
    propTypes: {
        tree: BaobabPropTypes.cursor.isRequired,
        tokenCursor: BaobabPropTypes.cursor.isRequired,
        history: React.PropTypes.object.isRequired,
    },

    async submit() {
        let result = await loginService(
            this.props.tokenCursor,
            this.props.tree.get());
        if (result.status === 'Succeed') {
            const privateKey = result.data.doctor.data.privateKey;
            if (_.isEmpty(privateKey)) {
                this.props.history.push('/how-to-share-private-key');
                this.props.tokenCursor.set({});
                this.props.tree.set(model);
            }
        }
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
                <div style={{ margin: '10px 0' }}>
                    <a href="https://www.freeprivacypolicy.com/privacy/view/d2a3a4d6658dd04af75792af4676e91f"
                       target="_blank">
                        Private policy
                    </a>
                </div>
            </Form>
        );
    },
})));
