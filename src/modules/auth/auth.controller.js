import bcrypt from "bcrypt";
import { Cart, User } from "../../../db/index.js";
import { AppError } from "../../utils/appError.js";
import { messages } from "../../utils/constant/messages.js";
import { sendEmail } from "../../utils/email.js";
import { generateToken, verifyToken } from "../../utils/token.js";

export const signup = async (req, res, next) => {
  // get data from req
  let { name, email, password, phone } = req.body;
  // check existence
  const userExist = await User.findOne({ $or: [{ email }, { phone }] }); // {},null
  if (userExist) {
    return next(new AppError(messages.user.alreadyExist, 409));
  }
  // prepare data
  password = bcrypt.hashSync(password, 8);
  const user = new User({
    name,
    email,
    password,
    phone,
  });
  // add to db
  const createdUser = await user.save();
  if (!createdUser) {
    // return next(new AppError(messages.user.failToCreate, 500))
    throw new Error("fail to create user",{cause:500});
  }
  // generate token
  const token = generateToken({ payload: { email, _id: createdUser._id } });
  // send email
  await sendEmail({
    to: email,
    subject: "verify your account",
    html: `<p>click on link to verify account <a href="${req.protocol}://${req.headers.host}/auth/verify/${token}">link</a></p>`,
  });
  // send response
  return res.status(201).json({
    message: messages.user.createSuccessfully,
    success: true,
    data: createdUser,
  });
};

export const verifyAccount = async (req, res, next) => {
  // get date from req
  const { token } = req.params;
  const payload = verifyToken({ token });
  await User.findOneAndUpdate(
    { email: payload.email, status: "pending" },
    { status: "verified" }
  );
  await Cart.create({ user: payload._id, products: [] });
  return res
    .status(200)
    .json({ message: messages.user.verified, success: true });
};

export const login = async (req, res, next) => {
  // get data from req
  const { email, phone, password } = req.body;
  // check existence
  const userExist = await User.findOne({
    $or: [{ email }, { phone }],
    status: "verified",
  }); // {}, null
  if (!userExist) {
    return next(new AppError(messages.user.invalidCredentials, 400));
  }
  // check password
  const match = bcrypt.compareSync(password, userExist.password);
  if (!match) {
    return next(new AppError(messages.user.invalidCredentials, 400));
  }

  // generate token
  const token = generateToken({ payload: { _id: userExist._id, email } });

  // send response
  return res.status(200).json({
    message: "login successfully",
    success: true,
    token,
  });
};
