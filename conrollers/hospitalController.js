const hospitalModel = require("../models/hospitalModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const adminModel = require("../models/adminModel");
const userModel = require("../models/userModel");

const registerHospital = async (req, res) => {
  const { hospital, email, password, Address, code } = req.body;

  if (!hospital || !email || !password || !Address || !code) {
    return res.status(400).send({
      success: false,
      message: "Invalid input",
    });
  }

  try {
    const existingHospital = await hospitalModel.findOne({ email });
    if (existingHospital) {
      return res.status(409).send({
        success: false,
        message: "User already exists",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const newHospital = await hospitalModel.create({
      hospital,
      email,
      password: hashPassword,
      Address,
      code,
    });

    return res.status(201).send({
      success: true,
      message: `New hospital '${hospital}' is created`,
      data: {
        hospital: newHospital.hospital,
        email: newHospital.email,
        Address: newHospital.Address,
        code: newHospital.code,
        // Do NOT include password here
      },
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "An error occurred during hospital registration",
      error: error.message,
    });
  }
};
const loginHospitalController = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(500).send({
        success: false,
        message: "Please provide valid credentials or email",
      });
    }
    const user = await hospitalModel.findOne({ email });
    if (!user) {
      return res.status(201).send({
        success: false,
        message: "No user found",
      });
    }
    const flag = await bcrypt.compare(password, user.password);
    if (!flag) {
      return res.status(404).send({
        success: false,
        message: "Incorrect password",
      });
    }
    const token = jwt.sign(
      {
        userId: user._id,
        emailId: user.email,
      },
      process.env.SECRET_KEY
    );
    return res.status(200).send({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.hospital,
        email: user.email,
      },
    });
  } catch (error) {
    return res.status(201).send({
      success: false,
      message: "No user found",
    });
  }
};

const getHospitalDetailedController = async (req, res) => {
  const hospitalId = req.params.hospitalid;
  //console.log(hospitalId);
  try {
    if (!hospitalId) {
      return res.status(201).send({
        success: false,
        message: "No user found",
      });
    }
    const hospital = await hospitalModel.findById(hospitalId);
    return res.status(200).send({
      success: true,
      message: "Hospital found",
      hospital,
    });
  } catch (error) {
    return res.status(201).send({
      success: false,
      message: "error occurs",
      error,
    });
  }
};

const updatehospitalDetailsController = async (req, res) => {
  try {
    const { hospital, email, Address } = req.body;
    //const hospitalId = req.params.id; // Assume you're passing the hospital ID via route params

    if (!hospital || !email || !Address) {
      return res.status(400).send({
        success: false,
        message: "Invalid input",
      });
    }

    // Update the hospital
    const hospitalUser1 = await hospitalModel.findOne({ email });
    if (hospitalUser1) {
      return res.status(404).send({
        success: false,
        message: "Hospital not found",
      });
    }
    const hospitalUser = await hospitalModel.findOne({
      email: req.user.emailId,
    });
    hospitalUser.hospital = hospital;
    hospitalUser.email = email;
    hospitalUser.Address = Address;

    await hospitalUser.save();

    return res.status(200).send({
      success: true,
      message: "Successfully updated",
    });
  } catch (error) {
    //console.error(error);
    return res.status(500).send({
      success: false,
      message: "An error occurred",
      error: error.message,
    });
  }
};
const updateChangePasswordController = async (req, res) => {
  try {
    const { oldpassword, newpassword } = req.body;

    if (!oldpassword || !newpassword) {
      return res.status(400).send({
        success: false,
        message: "Old and new passwords are required",
      });
    }

    const hospitalUser = await hospitalModel.findOne({
      email: req.user.emailId,
    });

    if (!hospitalUser) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(oldpassword, hospitalUser.password);
    if (!isMatch) {
      return res.status(401).send({
        success: false,
        message: "Old password is incorrect",
      });
    }

    const hashPassword = await bcrypt.hash(newpassword, 10);
    hospitalUser.password = hashPassword;
    await hospitalUser.save();

    return res.status(200).send({
      success: true,
      message: "Password successfully updated",
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "An error occurred",
      error: error.message,
    });
  }
};

const requestVacineToAdminController = async (req, res) => {
  try {
    const { number_vaccine } = req.body;

    if (!number_vaccine) {
      return res.status(400).send({
        success: false,
        message: "Invalid input: number of vaccines is required",
      });
    }

    const admin_user = await adminModel.findOne();
    if (!admin_user) {
      return res.status(404).send({
        success: false,
        message: "Admin user not found",
      });
    }

    // Push request with user ID and number of vaccines
    admin_user.hospital_id.push({
      id: req.user.userId,
      no_vac: number_vaccine,
    });

    await admin_user.save();

    return res.status(200).send({
      success: true,
      message: "Successfully requested vaccines",
      number_vaccine,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "An error occurred",
      error: error.message,
    });
  }
};

const allotVaccineToUserController = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).send({
        success: false,
        message: "Invalid userId",
      });
    }

    const hospital_id = req.user.userId; // Assuming JWT middleware sets this correctly
    console.log(hospital_id)
    const hospitalUser = await hospitalModel.findOne({ _id: hospital_id });
    if (!hospitalUser) {
      return res.status(404).send({
        success: false,
        message: "Hospital not found.",
      });
    }

    const index = hospitalUser.pending_list.findIndex(
      (user) => user._id.toString() === userId
    );

    if (index === -1) {
      return res.status(404).send({
        success: false,
        message: "user not found in pending list.",
      });
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }
    // check to validate the user vacination status and find the vacine availability in hospital
    if(user.no_vaccine>=2 || hospitalUser.no_vac_available<=0 )
    {
      return res.status(401).send({
        success:false,
        message:"Either vacinated fully or Unavailable vaccine",
        user_no_vaccine:user.no_vaccine,
        hospital_no_vac_available:hospitalUser.no_vac_available
      })
    }
    user.no_vaccine+=1
    hospitalUser.no_vac_available-=1;

    hospitalUser.pending_list.splice(index, 1);
    await user.save();
    await hospitalUser.save();

   
    return res.status(200).send({
      success: true,
      message: "Hospital user exists and can be processed.",
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports = {
  registerHospital,
  loginHospitalController,
  getHospitalDetailedController,
  updatehospitalDetailsController,
  updateChangePasswordController,
  requestVacineToAdminController,
  allotVaccineToUserController,
};
