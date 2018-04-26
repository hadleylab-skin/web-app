import React from 'react';
import BaobabPropTypes from 'baobab-prop-types';
import {
    HashRouter,
    Route,
} from 'react-router-dom';
import { DoctorPage,
         SiteJoinRequestPage,
         PatientListPage,
         PatientPage,
         PatientMoleListPage,
         MoleImagesListPage,
         StudyListPage,
         StudyAddPage,
         StudyDetailPage,
} from 'pages';
import schema from 'libs/state';
import { InnerLayout } from './layout';


const model = (props, context) => ({
    tree: {
        patients: context.services.patientsService,
        doctors: context.services.getDoctorListService,
        patientsMoles: {},
        molesImages: {},

        studies: context.services.getStudiesService,

        patientMolesScreen: {},
        patientScreen: {},
        registrationRequestsScreen: {},
        moleScreen: {},
        studyAddScreen: {},
        studyDetailScreen: {},
    },
});

export const AppRouter = schema(model)(React.createClass({
    propTypes: {
        tree: BaobabPropTypes.cursor.isRequired,
        logout: React.PropTypes.func.isRequired,
    },

    contextTypes: {
        cursors: React.PropTypes.shape({
            doctor: BaobabPropTypes.cursor.isRequired,
        }),
        services: React.PropTypes.shape({
            patientsService: React.PropTypes.func.isRequired,
            getStudiesService: React.PropTypes.func.isRequired,
            getPatientMolesService: React.PropTypes.func.isRequired,
            getDoctorListService: React.PropTypes.func.isRequired,
        }),
    },

    render() {
        const { isCoordinator } = this.context.cursors.doctor.data.get();
        const patientsCursor = this.props.tree.patients;
        const doctorsCursor = this.props.tree.doctors;
        const patientsMolesCursor = this.props.tree.patientsMoles;
        const molesImagesCursor = this.props.tree.molesImages;
        const moleScreenCursor = this.props.tree.moleScreen;
        const patientScreenCursor = this.props.tree.patientScreenCursor;
        const patientMolesScreenCursor = this.props.tree.patientMolesScreen;
        const registrationRequestsScreenCursor = this.props.tree.registrationRequestsScreen;
        const studiesCursor = this.props.tree.studies;

        return (
            <HashRouter>
                <InnerLayout
                    isCoordinator={isCoordinator}
                    logout={this.props.logout}
                >
                    <Route
                        exact
                        path="/"
                        render={(props) => (
                            <PatientListPage
                                tree={this.props.tree.patientsPage}
                                patientsCursor={patientsCursor}
                                studies={studiesCursor.data.get()}
                                {...props}
                            />)}
                    />
                    <Route
                        exact
                        path="/patient/:id"
                        render={(props) => {
                            const id = props.match.params.id;
                            const patientCursor = patientsCursor.data.select(id);
                            return (
                                <PatientPage
                                    tree={patientScreenCursor}
                                    patientCursor={patientCursor}
                                />
                            );
                        }}
                    />
                    <Route
                        exact
                        path="/patient/:id/moles"
                        render={(props) => {
                            const id = props.match.params.id;
                            const patientCursor = patientsCursor.data.select(id);
                            const patientMolesCursor = patientsMolesCursor.select(id);
                            return (
                                <PatientMoleListPage
                                    id={id}
                                    tree={patientMolesScreenCursor.select(id)}
                                    studies={studiesCursor.data.get()}
                                    patient={patientCursor.data.get()}
                                    patientMolesCursor={patientMolesCursor}
                                />
                            );
                        }}
                    />
                    <Route
                        exact
                        path="/patient/:patientId/mole/:moleId"
                        render={(props) => {
                            const patientId = props.match.params.patientId;
                            const moleId = props.match.params.moleId;
                            const moleImagesCursor = molesImagesCursor.select(moleId);
                            const patientMolesCursor = patientsMolesCursor.select(patientId);
                            return (
                                <MoleImagesListPage
                                    patientId={patientId}
                                    moleId={moleId}
                                    moleImagesCursor={moleImagesCursor}
                                    tree={moleScreenCursor}
                                    updateParent={async () => {
                                        const currentStudy = this.context.cursors.currentStudy.get();
                                        await this.context.services.getPatientMolesService(
                                            patientId,
                                            patientMolesCursor,
                                            currentStudy);
                                        await this.context.services.patientsService(
                                            patientsCursor,
                                            currentStudy);
                                    }}
                                />
                            );
                        }}
                    />
                    {
                        isCoordinator
                    ?
                        <Route
                            exact
                            path="/site-join-requests"
                            render={() => (
                                <SiteJoinRequestPage
                                    tree={registrationRequestsScreenCursor}
                                />
                            )}
                        />
                    :
                        null
                    }

                    <Route
                        exact
                        path="/doctor-info"
                        component={DoctorPage}
                    />
                    <Route
                        exact
                        path="/studies"
                        render={() => (
                            <StudyListPage
                                tree={studiesCursor}
                                isCoordinator={isCoordinator}
                            />
                        )}
                    />
                    <Route
                        exact
                        path="/studies/:id"
                        render={(props) => {
                            const id = parseInt(props.match.params.id);
                            const study = _.first(_.filter(studiesCursor.data.get(), {pk: id}));
                            return study ? (
                                <StudyDetailPage
                                    study={study}
                                    tree={this.props.tree}
                                    isCoordinator={isCoordinator}
                                    doctorsCursor={doctorsCursor}
                                />
                            ) : null;
                        }}
                    />
                    <Route
                        exact
                        path="/studies/add/"
                        render={() => (
                            <StudyAddPage
                                tree={this.props.tree.studyAddScreen}
                                studiesCursor={studiesCursor}
                            />
                        )}
                    />
                </InnerLayout>
            </HashRouter>
        );
    },
}));
