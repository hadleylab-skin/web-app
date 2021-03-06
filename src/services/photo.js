import _ from 'lodash';
import { buildGetService, buildPostService, defaultHeaders, hydrateImage } from './base';

function hydrateMolePhotoData(uri) {
    let data = new FormData();

    data.append('photo', hydrateImage(uri));

    return data;
}

function dehydrateMolePhotoData(data) {
    const { approved, biopsy, biopsyData, clinicalDiagnosis, pathDiagnosis } = data;
    let newData = _.omit(data, ['biopsy', 'biopsyData', 'clinicalDiagnosis', 'pathDiagnosis', 'approved']);

    newData.info = {
        data: {
            approved,
            biopsy,
            biopsyData,
            clinicalDiagnosis,
            pathDiagnosis,
        },
        status: 'Succeed',
    };

    return newData;
}

export function addMolePhotoService({ token }) {
    const headers = {
        'Content-Type': 'multipart/form-data',
        Accept: 'application/json',
        Authorization: `JWT ${token}`,
    };

    return (patientPk, molePk, cursor, data) => {
        const _service = buildPostService(
            `/api/v1/patient/${patientPk}/mole/${molePk}/image/`,
            'POST',
            hydrateMolePhotoData,
            _.identity,
            _.merge({}, defaultHeaders, headers));
        return _service(cursor, data);
    };
}

export function getMolePhotoService({ token }) {
    const headers = {
        Authorization: `JWT ${token}`,
    };

    return (patientPk, molePk, imagePk, cursor) => {
        const _service = buildGetService(
            `/api/v1/patient/${patientPk}/mole/${molePk}/image/${imagePk}/`,
            dehydrateMolePhotoData,
            _.merge({}, defaultHeaders, headers));

        return _service(cursor);
    };
}

export function updateMolePhotoService({ token }) {
    const headers = {
        Accept: 'application/json',
        Authorization: `JWT ${token}`,
    };

    return (patientPk, molePk, imagePk, cursor, data) => {
        const _service = buildPostService(
            `/api/v1/patient/${patientPk}/mole/${molePk}/image/${imagePk}/`,
            'PATCH',
            JSON.stringify,
            _.identity,
            _.merge({}, defaultHeaders, headers));
        return _service(cursor, data);
    };
}
