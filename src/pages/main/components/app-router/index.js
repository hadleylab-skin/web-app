import React from 'react';
import BaobabPropTypes from 'baobab-prop-types';
import {
    BrowserRouter,
    Route,
} from 'react-router-dom';
import { InnerLayout } from './layout';
import { DoctorPage, PatientListPage } from 'pages';


export const AppRouter = React.createClass({
    propTypes: {
        tree: BaobabPropTypes.cursor.isRequired,
    },
    render() {
        return (
            <BrowserRouter
                basename="/_dist/index.html"
            >
                <InnerLayout>
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
            </BrowserRouter>
        );
    },
});

