import React from 'react';
import { Label } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

export function PatientMolesInfo({ patient }) {
    if (patient.molesCount === 0) {
        return (
            <Label basic>
                Patient has no moles
            </Label>
        );
    }
    return (
        <Link to={`/patient/${patient.pk}/moles`}>
            {
                patient.molesImagesWithClinicalDiagnosisRequired
                ?
                (
                    <div><Label color="red" basic>
                        Clinical Diagnose Required for {patient.molesImagesWithClinicalDiagnosisRequired}/{patient.molesImagesCount} images
                    </Label><br /><br /></div>
                )
                : null
            }
            {
                patient.molesImagesWithPathologicalDiagnosisRequired
                ?
                (
                    <div><Label color="red" basic>
                        Pathological Diagnose Required for {patient.molesImagesWithPathologicalDiagnosisRequired}/{patient.molesImagesBiopsyCount} images
                    </Label><br /><br /></div>
                )
                :
                null
            }
            {
                patient.molesImagesApproveRequired
                ?
                (
                    <div><Label color="red" basic>
                        Approve required for {patient.molesImagesApproveRequired}/{patient.molesImagesCount} images
                    </Label><br /><br /></div>
                )
                :
                null
            }
            <Label basic>
                Total: {patient.molesCount} moles
            </Label>
        </Link>);
}
