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

export function getDoctorListService({ token }) {
    const headers = {
        Authorization: `JWT ${token}`,
    };

    return buildGetService(
        '/api/v1/doctor/',
        _.identity,
        _.merge({}, defaultHeaders, headers));
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

export function getSiteJoinRequestsService({ token }) {
    const headers = {
        Authorization: `JWT ${token}`,
    };

    return (cursor) => {
        const _service = buildGetService(
            '/api/v1/site_join_requests/?state=0',
            _.flow([wrapItemsAsRemoteData, convertListToDict]),
            _.merge({}, defaultHeaders, headers));

        return _service(cursor);
    };
}

export function handleSiteJoinRequestService({ token }) {
    const headers = {
        Accept: 'application/json',
        Authorization: `JWT ${token}`,
    };

    return (cursor, doctorPk, action) => {
        if (action !== 'approve' && action !== 'reject') {
            throw { error: "Wrong action it should be 'approve' or 'reject'" };
        }
        const service = buildPostService(`/api/v1/site_join_requests/${doctorPk}/${action}/`,
                                         'POST',
                                         JSON.stringify,
                                         _.identity,
                                         _.merge({}, defaultHeaders, headers));
        return service(cursor, {});
    };
}

