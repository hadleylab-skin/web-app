import _ from 'lodash';
import {
    buildPostService, buildGetService,
    defaultHeaders, convertListToDict,
    wrapItemsAsRemoteData,
} from './base';

export function getDoctorService({ token }) {
    const headers = {
        Authorization: `JWT ${token}`,
    };

    return (cursor) => {
        const _service = buildGetService(
            '/api/v1/auth/current_user/',
            _.identity,
            _.merge({}, defaultHeaders, headers));

        return _service(cursor);
    };
}

export function updateDoctorService({ token }) {
    const headers = {
        Accept: 'application/json',
        Authorization: `JWT ${token}`,
    };

    return (cursor, data) => {
        const service = buildPostService('/api/v1/auth/current_user/',
            'PATCH',
            JSON.stringify,
            _.identity,
            _.merge({}, defaultHeaders, headers));
        return service(cursor, data);
    };
}

export function getDoctorResistrationRequestsService({ token }) {
    const headers = {
        Authorization: `JWT ${token}`,
    };

    return (cursor) => {
        const _service = buildGetService(
            '/api/v1/doctors_registration_requests/',
            _.flow([wrapItemsAsRemoteData, convertListToDict]),
            _.merge({}, defaultHeaders, headers));

        return _service(cursor);
    };
}

export function handleDoctorRegistrationRequestService({ token }) {
    const headers = {
        Accept: 'application/json',
        Authorization: `JWT ${token}`,
    };

    return (cursor, doctorPk, action) => {
        let method = '';
        let data = {};
        switch (action) {
        case 'approve':
            method = 'PATCH';
            data = { approvedByCoordinator: true };
            break;
        case 'reject':
            method = 'DELETE';
            break;
        default:
            throw { error: "Wrong action it should be 'approve' or 'reject'" };
        }
        const service = buildPostService(`/api/v1/doctors_registration_requests/${doctorPk}/`,
                                         method,
                                         JSON.stringify,
                                         _.identity,
                                         _.merge({}, defaultHeaders, headers));
        return service(cursor, data);
    };
}

