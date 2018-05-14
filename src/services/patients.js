import _ from 'lodash';
import CryptoJS from 'crypto-js';
import {
    buildGetService, buildPostService,
    defaultHeaders, wrapItemsAsRemoteData,
    convertListToDict,
} from './base';
import { encryptAES, encryptRSA, decryptAES, decryptRSA } from './keypair';

function dehydrateConsent({ validConsent, ...item }) {
    return _.merge(
        item,
        {
            validConsent: {
                status: 'Succeed',
                data: validConsent,
            },
        }
    );
}

const needEncryption = ['firstName', 'lastName', 'mrn', 'dateOfBirth'];

function dehydratePatientData(data) {
    let dehydratedData = { ...dehydrateConsent(data) };
    const aesKey = decryptRSA(dehydratedData.encryptedKey);
    _.forEach(_.pickBy(dehydratedData), (value, key) => {
        if (_.includes(needEncryption, key) && value !== '') {
            try {
                dehydratedData[key] = decryptAES(value, aesKey);
            } catch (error) {
                throw 'patient_decryption_error';
            }
        }
    });
    if (dehydratedData.mrn === null) {
        dehydratedData.mrn = '';
    }
    return dehydratedData;
}

function dehydratePatients(patients) {
    const data = _.map(
        patients,
        dehydratePatientData);

    return convertListToDict(wrapItemsAsRemoteData(data));
}

export function patientsService({ token }) {
    const headers = {
        Authorization: `JWT ${token}`,
    };
    return (cursor, study = null) => {
        let url;
        if (study) {
            url = `/api/v1/patient/?study=${study}`;
        } else {
            url = '/api/v1/patient/';
        }

        const service = buildGetService(
            url,
            dehydratePatients,
            _.merge({}, defaultHeaders, headers));
        return service(cursor);
    };
}

function hydratePatientData(remoteDoctor) {
    const doctor = remoteDoctor.data;
    if (typeof doctor === 'undefined') {
        throw { message: 'System error, context is not loaded' };
    }
    return ({ doctors, ...patientData }) => {
        let data = {};
        const aesKey = Math.random().toString(36).substring(2);
        let encryptionKeys = {};
        encryptionKeys[`${doctor.pk}`] = encryptRSA(aesKey, doctor.publicKey);

        if (doctor.myCoordinatorId) {
            encryptionKeys[`${doctor.myCoordinatorId}`] = encryptRSA(aesKey, doctor.coordinatorPublicKey);
        }

        _.each(doctors, (doctorId) => {
            if (!encryptionKeys[`${doctorId}`]) {
                encryptionKeys[`${doctorId}`] = encryptRSA(
                    aesKey,
                    doctor.myDoctorsPublicKeys[`${doctorId}`]);
            }
        });

        data.encryptionKeys = JSON.stringify(encryptionKeys);

        _.forEach(_.pickBy(patientData), (value, key) => {
            if (value === '') {
                // skip empty data
                return;
            }

            if (_.includes(needEncryption, key)) {
                data[key] = encryptAES(value, aesKey);
            } else {
                data[key] = value;
            }

            if (key === 'mrn') {
                data.mrnHash = CryptoJS.MD5(value).toString();
            }
        });
        return JSON.stringify(data);
    };
}

export function getPatientService({ token }) {
    const headers = {
        Authorization: `JWT ${token}`,
    };

    return (patientPk, cursor) => {
        const service = buildGetService(`/api/v1/patient/${patientPk}/`,
            dehydratePatientData,
            _.merge({}, defaultHeaders, headers));

        return service(cursor);
    };
}

export function createPatientService({ token, doctor }) {
    const headers = {
        'Content-Type': 'multipart/form-data',
        Accept: 'application/json',
        Authorization: `JWT ${token}`,
    };

    return buildPostService(
        '/api/v1/patient/',
        'POST',
        hydratePatientData(doctor),
        dehydratePatientData,
        _.merge({}, defaultHeaders, headers)
    );
}

export function updatePatientService({ token }) {
    const headers = {
        Accept: 'application/json',
        Authorization: `JWT ${token}`,
    };

    return (patientPk, cursor, data, study, doctor) => {
        let url;
        if (study) {
            url = `/api/v1/patient/${patientPk}/?study=${study}`;
        } else {
            url = `/api/v1/patient/${patientPk}/`;
        }

        const _updatePatient = buildPostService(url,
            'PATCH',
            hydratePatientData(doctor),
            dehydratePatientData,
            _.merge({}, defaultHeaders, headers));
        return _updatePatient(cursor, data);
    };
}

function hydrateConsentData(base64IMage) {
    let data = new FormData();
    data.append('signature', base64IMage);
    return data;
}

export function updatePatientConsentService({ token }) {
    const headers = {
        'Content-Type': 'multipart/form-data',
        Accept: 'application/json',
        Authorization: `JWT ${token}`,
    };

    return (patientPk, cursor, data) => {
        const _updatePatient = buildPostService(`/api/v1/patient/${patientPk}/consent/`,
                                                'POST',
                                                hydrateConsentData,
                                                _.identity,
                                                _.merge({}, defaultHeaders, headers));
        return _updatePatient(cursor, data);
    };
}
