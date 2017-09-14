import React from 'react';
import moment from 'moment';
import { Label } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

export function PatientMolesInfo({ patient }) {
    if (patient.molesCount === 0) {
        return (
            <Label basic>
                Patient have no Moles
            </Label>
        );
    }
    return (
        <Link to={`/patient/${patient.pk}/moles`}>
            {
                patient.moleImagesWithDiagnoseRequired
                ?
                (
                    <div><Label color="red" basic>
                        Diagnose Required for {patient.moleImagesWithDiagnoseRequired}/{patient.molesImagesCount}
                    </Label><br /></div>
                )
                : null
            }
            {
                patient.moleImagesApproveRequired
                ?
                (
                    <div><Label color="red" basic>
                        Approve required for {patient.moleImagesApproveRequired}/{patient.molesImagesCount}
                    </Label><br /></div>
                )
                :
                null
            }
            <Label basic>
                Total: {patient.molesImagesCount}
            </Label>
        </Link>);
}
