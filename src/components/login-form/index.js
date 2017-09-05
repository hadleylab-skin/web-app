import React from 'react';
import schema from 'libs/state';
import { Button, Form } from 'semantic-ui-react';
import { loginService } from 'services/login'; 

const model = {
    tree: {
        username: '',
        password: '',
    },
};


export const LoginForm = schema(model)(React.createClass({
    submit() {
        loginService(
            this.props.tree.tokenCursor,
            this.props.tree.get());
    },

    render() {
        const usernameCursor = this.props.tree.form.username;
        const passwordCursor = this.props.tree.form.password;
        return (
            <Form
                onSubmit={this.submit}
            >
                <Form.Field>
                    <label>Username</label>
                    <input
                        value={usernameCursor.get()}
                        onChange={(e) => usernameCursor.set(e.target.value)}
                    />
                </Form.Field>
                <Form.Field>
                    <label>Password</label>
                    <input
                        value={passwordCursor.get()}
                        onChange={(e) => passwordCursor.set(e.target.value)}
                    />
                </Form.Field>
                <Button type="submit">
                    Submit
                </Button>
            </Form>
        );
    },
}));
