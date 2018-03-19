import { updateDoctorService,
         getDoctorService,
         getSiteJoinRequestsService,
         handleSiteJoinRequestService,
         getDoctorListService,
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
import { getStudiesService,
         addStudyService,
         addDoctorToStudyService
       } from './study';
import { addConsentDocService } from './consent-doc';


export default {
    updateDoctorService,
    getDoctorService,
    getDoctorListService,
    getSiteJoinRequestsService,
    handleSiteJoinRequestService,
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
    getStudiesService,
    addConsentDocService,
    addStudyService,
    addDoctorToStudyService,
};
