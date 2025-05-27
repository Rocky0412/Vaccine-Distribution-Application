const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const adminModel = require("../models/adminModel");
const hospitalModel = require("../models/hospitalModel");

const adminLoginController = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(500).send({
        success: false,
        message: "Please provide valid username or password",
      });
    }
    const user = await adminModel.findOne({ username: username });
    if (!user) {
      return res.status(500).send({
        success: false,
        message: "User name not found",
      });
    }
    const isMatched = await bcrypt.compare(password, user.password);
    if (!isMatched) {
      return res.status(404).send({
        success: false,
        message: "Incorrect password",
      });
    }
    const token = await jwt.sign(
      { username: user.username },
      process.env.SECRET_KEY,
      {
        expiresIn: "10d",
      }
    );
    return res.status(202).send({
      success: true,
      message: "user login successfull",
      token,
    });
  } catch (err) {
    return res.status(500).send({
      success: false,
      message: "Login failed",
      err,
    });
  }
};

const adminPasswordUpateController = async (req, res) => {
  try {
    const { password, newpassword } = req.body;
    //console.log(`Password ${password} ${newpassword}`)
    if (!password || !newpassword || password == newpassword) {
      return res.status(404).send({
        success: false,
        message: "Enter valid password or Provide different password",
      });
    }
    const user = await adminModel.findOne();
    const isMatched = await bcrypt.compare(password, user.password);
    if (!isMatched) {
      return res.status(404).send({
        success: false,
        message: "Provided password is not match",
      });
    }
    const hashedPassword = await bcrypt.hash(newpassword, 10);
    user.password = hashedPassword;

    await user.save();

    return res.status(200).send({
      success: true,
      message: "Password update successful",
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Error occur",
      error,
    });
  }
};

const addNewVaccineByAdmin = async (req, res) => {
  try {
    const { on_new_vaccine } = req.body;
    const isValidNumber = (value) => typeof value === "number" && !isNaN(value);
    if (!on_new_vaccine || !isValidNumber) {
      return res.status(201).send({
        success: false,
        message: "Please valid input",
      });
    }
    const user = await adminModel.findOne();
    user.no_available_vacine = user.no_available_vacine + on_new_vaccine;
    await user.save();
    return res.status(200).send({
      success: true,
      message: "Updated",
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Error occur",
      error,
    });
  }
};
const deleteUserByIdController = async (req, res) => {
  try {
    const userId = req.params.id;

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).send({
        success: false,
        message: "Invalid user ID format",
      });
    }

    const deletedUser = await hospitalModel.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).send({
      success: true,
      message: "User deleted successfully",
      data: deletedUser,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

const allotVaccineController = async (req, res) => {
  try {
    const { hospital_id } = req.params;

    if (!hospital_id) {
      return res.status(400).send({
        success: false,
        message: "Hospital ID is required.",
      });
    }

    const admin_user = await adminModel.findOne();

    if (!admin_user) {
      return res.status(404).send({
        success: false,
        message: "Admin user not found.",
      });
    }

    const index = await admin_user.hospital_id.findIndex(
      (user) => user.id === hospital_id
    );

    if (index === -1) {
      return res.status(404).send({
        success: false,
        message: "Hospital user not found.",
      });
    }

    const hospital_user = await hospitalModel.findOne({ _id: hospital_id });
    const needed_vacine = admin_user.hospital_id[index].no_vac;
    if (needed_vacine > admin_user.no_available_vacine) {
      return res.status(200).send({
        success: false,
        message: "Stock is not available",
      });
    }
    hospital_user.no_vac_available += needed_vacine;
    admin_user.no_available_vacine-=needed_vacine;
    admin_user.hospital_id.splice(index, 1);
    await hospital_user.save();
    await admin_user.save();

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
  adminLoginController,
  adminPasswordUpateController,
  addNewVaccineByAdmin,
  allotVaccineController,
  deleteUserByIdController,
};
