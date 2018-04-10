import _ from 'lodash';
import { buildGetService, buildPostService, defaultHeaders, hydrateImage } from './base';


function hydrateConsentDocData(doc) {
    let data = new FormData();
    data.append('file', doc);
    return data;
}


export function addConsentDocService({ token }) {
    const headers = {
        Accept: 'application/json',
        Authorization: `JWT ${token}`,
    };

    return buildPostService(
        '/api/v1/study/consent_doc/',
        'POST',
        hydrateConsentDocData,
        _.identity,
        headers);
}
