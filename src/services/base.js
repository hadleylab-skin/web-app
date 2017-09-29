import _ from 'lodash';

export const defaultHeaders = {
    'Content-Type': 'application/json',
};

export const url = API_SERVER;

export function buildGetService(path,
                                dehydrate = _.identity,
                                headers = defaultHeaders) {
    return async (cursor) => {
        cursor.set('status', 'Loading');
        let result = {};

        try {
            let response = await fetch(`${url}${path}`, { headers });
            const data = await response.json();
            if (response.status >= 400) {
                result = {
                    status: 'Failure',
                    error: { data },
                };
            } else {
                result = {
                    status: 'Succeed',
                    data: dehydrate(data),
                };
            }
        } catch (error) {
            console.log(error);
            result = {
                error,
                status: 'Failure',
            };
        }
        cursor.set(result);
        return result;
    };
}

export function buildPostService(path,
                                 method = 'POST',
                                 hydrate = JSON.stringify,
                                 dehydrate = _.identity,
                                 headers = defaultHeaders) {
    return async (cursor, data) => {
        cursor.set('status', 'Loading');
        let result = {};

        const body = hydrate(data);
        const payload = {
            body,
            method,
            headers,
        };

        try {
            let response = await fetch(`${url}${path}`, payload);
            let respData;
            if (response.status === 204) {
                response = {
                    status: 'Succeed',
                    data: cursor.get(),
                };
            } else if (response.status >= 400) {
                respData = await response.json();
                result = {
                    status: 'Failure',
                    error: {
                        data: respData,
                    },
                };
            } else {
                respData = await response.json();
                result = {
                    status: 'Succeed',
                    data: dehydrate(respData),
                };
            }
        } catch (error) {
            console.log(error);
            result = {
                error,
                status: 'Failure',
            };
        }
        if (result.status === 'Failure') {
            cursor.set('error', result.error);
            cursor.set('status', result.status);
        } else {
            cursor.set(result);
        }
        return result;
    };
}

export function wrapItemsAsRemoteData(items) {
    return _.map(items, (data) => (
        {
            data,
            status: 'Succeed',
        })
    );
}

export function hydrateImage(uri) {
    const photo = {
        uri,
        type: 'image/jpeg',
        name: 'photo.jpg',
    };

    return photo;
}

export function convertListToDict(list) {
    return _.keyBy(list, (patient) => patient.data.pk);
}
