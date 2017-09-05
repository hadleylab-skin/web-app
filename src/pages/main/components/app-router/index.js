import React from 'react';
import BaobabPropTypes from 'baobab-prop-types';
import {
    HashRouter,
    Route,
} from 'react-router-dom';
import { DoctorPage, PatientListPage } from 'pages';
import { InnerLayout } from './layout';


export const AppRouter = React.createClass({
    propTypes: {
        tree: BaobabPropTypes.cursor.isRequired,
        logout: React.PropTypes.func.isRequired,
    },
    render() {
        return (
            <HashRouter>
                <InnerLayout
                    logout={this.props.logout}
                >
                    <Route
                        exact
                        path="/"
                        render={(props) => (
                            <PatientListPage
                                tree={this.props.tree.patientsPage}
                                {...props}
                            />)}
                    />
                    <Route
                        path="/doctor-info"
                        component={DoctorPage}
                    />
                </InnerLayout>
            </HashRouter>
        );
    },
});

