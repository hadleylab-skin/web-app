import { buildPostService, defaultHeaders } from './base';

function dehydrateData(data) {
    let newData = {};

    newData.token = data.token;
    newData.doctor = {
        data: { ...data.doctor },
        status: 'Succeed',
    };

    return newData;
}

export const loginService = buildPostService(
    '/api/v1/auth/login/',
    'POST',
    JSON.stringify,
    dehydrateData,
    defaultHeaders);

export const activateService = buildPostService('/api/v1/auth/activate/');
export const resetPasswordService = buildPostService('/api/v1/auth/password/reset/confirm/');
