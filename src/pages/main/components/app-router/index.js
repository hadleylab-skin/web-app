import React from 'react';
import BaobabPropTypes from 'baobab-prop-types';
import {
    HashRouter,
    Route,
} from 'react-router-dom';
import { DoctorPage, PatientListPage, PatientPage } from 'pages';
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
                        path="/patient/:id"
                        render={(props) => {
                            const id = props.match.params.id;
                            const patientCursor = this.props.tree.patientsPage.patients.data.select(id);
                            return (
                                <PatientPage
                                    patientCursor={patientCursor}
                                />
                            );
                        }}
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

