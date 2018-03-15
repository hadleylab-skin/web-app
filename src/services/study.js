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
