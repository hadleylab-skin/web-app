import React from 'react';
import schema from '../../libs/state';
import { loginService } from '../../services/login'; 
import { PatientList } from '../patient-list';
import { ServiceProvider } from '../service-provider';

const model = {
    tree: {
        form: {
            username: '',
            password: '',
        },
        token: {},
        patientList: {},
    },
};


export const LoginForm = schema(model)(React.createClass({
    submit() {
        loginService(
            this.props.tree.token,
            this.props.tree.form.get());
    },

    render() {
        const usernameCursor = this.props.tree.form.username;
        const passwordCursor = this.props.tree.form.password;
        const token = this.props.tree.token.get() || {};
        if (token.status === 'Succeed') {
            return (
                <ServiceProvider
                    token={token.data}
                >
                    <PatientList tree={this.props.tree.patientList} />
                </ServiceProvider>
            );
        }

        return (
            <div>
                <div>
                    <span>Username</span>
                    <input
                        value={usernameCursor.get()}
                        onChange={(e) => usernameCursor.set(e.target.value)}
                    />
                </div>
                <div>
                    <span>password</span>
                    <input
                        value={passwordCursor.get()}
                        onChange={(e) => passwordCursor.set(e.target.value)}
                    />
                </div>
                <div>
                    <input type="Submit" value="Submit" onClick={this.submit} />
                </div>
            </div>
        );
    },
}));
