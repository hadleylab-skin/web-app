import _ from 'lodash';
import { buildGetService, buildPostService, defaultHeaders, wrapItemsAsRemoteData, hydrateImage } from './base';

function convertListToDict(list) {
    return _.keyBy(list, (item) => item.data.pk);
}

function dehydratePatientMoles(moles) {
    const data = _.map(moles);

    return convertListToDict(wrapItemsAsRemoteData(data));
}

export function getPatientMolesService({ token }) {
    const headers = {
        Authorization: `JWT ${token}`,
    };

    return (patientPk, cursor, study = null) => {
        let url;
        if (study) {
            url = `/api/v1/patient/${patientPk}/mole/?study=${study}`;
        } else {
            url = `/api/v1/patient/${patientPk}/mole/`;
        }

        const _service = buildGetService(
            url,
            dehydratePatientMoles,
            _.merge({}, defaultHeaders, headers));

        return _service(cursor);
    };
}

function dehydrateMoleData(data) {
    let newData = _.omit(data, ['anatomicalSites']);

    const images = _.map(data.images, (image) => {
        const { approved, biopsy, biopsyData, clinicalDiagnosis, pathDiagnosis } = image;
        let newImage = _.omit(image, ['approved', 'biopsy', 'biopsyData', 'clinicalDiagnosis', 'pathDiagnosis']);

        newImage.info = {
            data: {
                approved,
                biopsy,
                biopsyData,
                clinicalDiagnosis,
                pathDiagnosis,
            },
            status: 'Succeed',
        };

        return newImage;
    });

    newData.images = convertListToDict(wrapItemsAsRemoteData(images));

    const anatomicalSite = data.anatomicalSites[data.anatomicalSites.length - 1];

    newData.anatomicalSite = {
        data: { ...anatomicalSite },
        status: 'Succeed',
    };

    return newData;
}

export function getMoleService({ token }) {
    const headers = {
        Authorization: `JWT ${token}`,
    };

    return (patientPk, molePk, cursor, study = null) => {
        let url;
        if (study) {
            url = `/api/v1/patient/${patientPk}/mole/${molePk}/?study=${study}`;
        } else {
            url = `/api/v1/patient/${patientPk}/mole/${molePk}/`;
        }

        const _service = buildGetService(
            url,
            dehydrateMoleData,
            _.merge({}, defaultHeaders, headers));

        return _service(cursor);
    };
}

function hydrateMoleData(mole) {
    let data = new FormData();

    data.append('anatomicalSite', mole.anatomicalSite);
    data.append('positionX', mole.positionX);
    data.append('positionY', mole.positionY);
    data.append('photo', hydrateImage(mole.uri));

    return data;
}

export function addMoleService({ token }) {
    const headers = {
        'Content-Type': 'multipart/form-data',
        Accept: 'application/json',
        Authorization: `JWT ${token}`,
    };

    return (patientPk, cursor, data) => {
        const _service = buildPostService(
            `/api/v1/patient/${patientPk}/mole/`,
            'POST',
            hydrateMoleData,
            _.identity,
            _.merge({}, defaultHeaders, headers));
        return _service(cursor, data);
    };
}

function hydrateUpdateMoleData(moleData) {
    let data = new FormData();

    _.forEach(_.pickBy(moleData), (value, key) => {
        data.append(key, value);
    });

    return data;
}

function dehydrateUpdateMoleData(mole) {
    let data = {
        pk: mole.anatomicalSite,
        name: _.capitalize(_.lowerCase(mole.anatomicalSite)),
    };

    return data;
}

export function updateMoleService({ token }) {
    const headers = {
        'Content-Type': 'multipart/form-data',
        Accept: 'application/json',
        Authorization: `JWT ${token}`,
    };

    return (patientPk, molePk, cursor, data) => {
        const _service = buildPostService(
            `/api/v1/patient/${patientPk}/mole/${molePk}/`,
            'PATCH',
            hydrateUpdateMoleData,
            dehydrateUpdateMoleData,
            _.merge({}, defaultHeaders, headers));
        return _service(cursor, data);
    };
}
