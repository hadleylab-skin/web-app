import React from 'react';
import BaobabPropTypes from 'baobab-prop-types';
import {
    HashRouter,
    Route,
} from 'react-router-dom';
import { DoctorPage, PatientListPage, PatientPage } from 'pages';
import schema from 'libs/state';
import { InnerLayout } from './layout';

const model = (props, context) => ({
    tree: {
        patients: context.services.patientsService,
        patientScreen: {},
        patientsService: {},
    },
});

export const AppRouter = schema(model)(React.createClass({
    propTypes: {
        tree: BaobabPropTypes.cursor.isRequired,
        logout: React.PropTypes.func.isRequired,
    },

    contextTypes: {
        services: React.PropTypes.shape({
            patientsService: React.PropTypes.func.isRequired,
        }),
    },

    render() {
        const patientsCursor = this.props.tree.patients;
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
                                patientsCursor={patientsCursor}
                                {...props}
                            />)}
                    />
                    <Route
                        path="/patient/:id"
                        render={(props) => {
                            const id = props.match.params.id;
                            const patientCursor = patientsCursor.data.select(id);
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
}));

