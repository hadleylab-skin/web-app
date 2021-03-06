import _ from 'lodash';
import { buildGetService, buildPostService, defaultHeaders } from './base';


function dehydrateStudies(items) {
    return items;
}

export function getStudiesService({ token }) {
    const headers = {
        Authorization: `JWT ${token}`,
    };

    return (cursor) => {
        const _service = buildGetService(
            `/api/v1/study/`,
            dehydrateStudies,
            _.merge({}, defaultHeaders, headers));

        return _service(cursor);
    };
}

function hydrateStudyData(data) {
    return JSON.stringify(data);
}


export function addStudyService({ token }) {
    const headers = {
        Authorization: `JWT ${token}`,
    };

    return buildPostService(
        '/api/v1/study/',
        'POST',
        hydrateStudyData,
        _.identity,
        _.merge({}, defaultHeaders, headers));
}


export function updateStudyService({ token }) {
    const headers = {
        Authorization: `JWT ${token}`,
    };

    return (studyPk, cursor, data) => {
        const _service = buildPostService(
            `/api/v1/study/${studyPk}/`,
            'PATCH',
            hydrateStudyData,
            _.identity,
            _.merge({}, defaultHeaders, headers));

        return _service(cursor, data);
    };
}


export function addDoctorToStudyService({ token }) {
    const headers = {
        Authorization: `JWT ${token}`,
    };

    return (studyPk, cursor, data) => {
        const _service = buildPostService(
            `/api/v1/study/${studyPk}/add_doctor/`,
            'POST',
            hydrateStudyData,
            _.identity,
            _.merge({}, defaultHeaders, headers));

        return _service(cursor, data);
    };
}


export function getInvitesOfStudyService({ token }) {
    const headers = {
        Authorization: `JWT ${token}`,
    };

    return (studyPk, cursor) => {
        const _service = buildGetService(
            `/api/v1/study/${studyPk}/invites/`,
            _.identity,
            _.merge({}, defaultHeaders, headers));

        return _service(cursor);
    };
}

// when we will output patients in study, rewrite API and use this service
// export function getPatientsOfStudyService({ token }) {
//     const headers = {
//         Authorization: `JWT ${token}`,
//     };
//
//     return (studyPk, cursor) => {
//         const _service = buildGetService(
//             `/api/v1/study/${studyPk}/patients/`,
//             _.identity,
//             _.merge({}, defaultHeaders, headers));
//
//         return _service(cursor);
//     };
// }
