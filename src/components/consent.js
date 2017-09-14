import React from 'react';
import moment from 'moment';
import { Label, Image, Loader } from 'semantic-ui-react';

export function Consent({ consent, noPhoto }) {
    if (typeof consent === 'undefined') {
        return (
            <Loader />
        );
    }
    if (consent.data) {
        return (
            <div>
                <p>Consent valid till {moment(consent.data.dateExpired).format('DD/MMM/YYYY')}</p>
                { noPhoto ? null : <Image src={consent.data.signature} size="large" /> }
            </div>
        );
    }
    return (
        <Label color="red">Consent Expired</Label>
    );
}
