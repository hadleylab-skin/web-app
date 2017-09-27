import { updateDoctorService,
         getDoctorService,
         getDoctorResistrationRequestsService,
         handleDoctorRegistrationRequestService,
       } from './doctor';
import { getPatientMolesService,
         addMoleService,
         getMoleService,
         updateMoleService,
       } from './mole';
import { addMolePhotoService,
         getMolePhotoService,
         updateMolePhotoService,
       } from './photo';
import { addAnatomicalSitePhotoService, getAnatomicalSitesService } from './anatomical-site.js';
import { patientsService,
         getPatientService,
         createPatientService,
         updatePatientService,
         updatePatientConsentService,
       } from './patients';


export default {
    updateDoctorService,
    getDoctorService,
    getDoctorResistrationRequestsService,
    handleDoctorRegistrationRequestService,
    getPatientMolesService,
    addMoleService,
    getMoleService,
    updateMoleService,
    addMolePhotoService,
    getMolePhotoService,
    updateMolePhotoService,
    addAnatomicalSitePhotoService,
    getAnatomicalSitesService,
    patientsService,
    getPatientService,
    createPatientService,
    updatePatientService,
    updatePatientConsentService,
};
