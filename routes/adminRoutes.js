const express = require("express");
const { adminLoginController, adminPasswordUpateController, addNewVaccineByAdmin,
 deleteUserByIdController, allotVaccineController } = require("../conrollers/adminController");
const adminLoginMiddleware = require("../middleware/adminAuthenticationmiddleware");


const admin_router = express.Router();
admin_router.post("/loginAdmin",adminLoginController);
admin_router.put("/changePassword",adminLoginMiddleware,adminPasswordUpateController);
admin_router.put("/addVaccine",adminLoginMiddleware,addNewVaccineByAdmin)
admin_router.delete("/removeHospital/:id",adminLoginMiddleware,deleteUserByIdController)
admin_router.put("/allotVacine/:hospital_id",adminLoginMiddleware,allotVaccineController)

module.exports = admin_router;
