const express = require("express");
const {registerHospital,loginHospitalController, getHospitalDetailedController, updatehospitalDetailsController, updateChangePasswordController, requestVacineToAdminController, allotVaccineToUserController} = require("../conrollers/hospitalController");
const userLoginMiddleware = require("../middleware/userAuthenticationMiddleware");


const hospital_router = express.Router();

hospital_router.post("/addNewHospital",registerHospital);
hospital_router.post("/loginHospital",loginHospitalController)
hospital_router.get("/:hospitalid",userLoginMiddleware,getHospitalDetailedController)
hospital_router.put("/updatehosDetails",userLoginMiddleware,updatehospitalDetailsController)

hospital_router.put("/updatehosPassword",userLoginMiddleware,updateChangePasswordController)
hospital_router.put("/requestVacineToAdmin",userLoginMiddleware,requestVacineToAdminController)
hospital_router.put('/allotVaccineTouser/:userId',userLoginMiddleware,allotVaccineToUserController)


module.exports = hospital_router;
