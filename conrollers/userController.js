const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");
const hospitalModel = require("../models/hospitalModel");
const dotenv = require("dotenv");

const getUserController = async (req, res) => {
  try {
    const user = await userModel.findOne({ _id: req.user.userId });
    return res.status(200).send(user);
  } catch (error) {
    return res.status(200).send({
      message: "error occur",
      error,
    });
  }
};

const postUserController = async (req, res) => {
  //console.log(req.body)

  try {
    const { Name, Surname, email, password, Address, DOB } = req.body;
    if (!Name || !Surname || !email || !password) {
      return res.status(201).send({
        success: false,
        message: "Invalid imput",
      });
    }
    const user = await userModel.findOne({ email: email });
    if (user) {
      return res.status(202).send({
        success: false,
        message: "User Already exits",
      });
    }
    //generate salt
    const salt = await bcrypt.genSalt(10);
    const hashpassword = await bcrypt.hash(password, salt);
    await userModel.create({
      Name,
      Surname,
      email,
      password: hashpassword,
      Address,
      DOB,
    });
    return res.status(200).send({
      success: true,
      message: "User is created",
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "API registration failed",
      error,
    });
  }
};

const loginUserController = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(500).send({
        success: false,
        message: "Please provide valid credentials or email",
      });
    }
    const user = await userModel.findOne({ email });
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
      process.env.SECRET_KEY,
      
    );
    return res.status(200).send({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.Name,
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

const updateUserController = async (req, res) => {
  try {
    const { Name, Surname, email, Address, DOB } = req.body;
    const { userId, eamailId } = req.user;
    console.log(req.user);
    const user = await userModel.findOne({ _id: req.user.userId });
    //console.log(user)

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    if (email) {
      const isAnyUser = await userModel.findOne({ email });
      if (isAnyUser) {
        return res.status(202).send({
          success: false,
          message: "email already exit",
          user: user,
          authEmail: req.user,
        });
      }
    }

    if (Name) user.Name = Name;
    if (Surname) user.Surname = Surname;
    if (email) user.email = email;
    if (Address) user.Address = Address;
    if (DOB) user.DOB = DOB;
    await user.save();
    return res.status(202).send({
      success: true,
      message: "update Successful",
      user: user,
    });
  } catch (error) {
    return res.status(201).send({
      success: false,
      error,
    });
  }
};

const changePassWordController = async (req, res) => {
  try {
    const { newPassword } = req.body;
    const { emailId } = req.user;

    const user = await userModel.findOne({ email: emailId });
    if (!user || !newPassword) {
      return res.status(500).send({
        success: false,
        message: "Invalid  user or Newpassword Donot exits",
      });
    }
     const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
      return res.status(400).send({
        success: false,
        message: "Please provide a different password",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    return res.status(200).send({
      success: true,
      message: "Password changed successfully",
    });

  

  } catch (error) {
	return res.status(500).send({
        success: false,
	error
      });

  }

  return res.status(200).send("Update controller");
};

const requestForVacineController = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.user;
    if (!id || !userId) {
      return res.status(201).send({
        success: false,
        message: "Undefine id or user_id",
      });
    }

    const hospitalUser = await hospitalModel.findOne({ _id: id });
    if (!hospitalUser) {
      return res.status(201).send({
        success: false,
        message: "Hospital Not Found",
      });
    }

    if (!hospitalUser.pending_list.includes(userId)) {
      hospitalUser.pending_list.push(userId);
      await hospitalUser.save();
    }

    return res.status(200).send({
      success: true,
      message: "Request submitted successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

module.exports = {
  getUserController,
  postUserController,
  loginUserController,
  updateUserController,
  changePassWordController,
  requestForVacineController,
};
