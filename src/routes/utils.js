import {
  InvalidInputError,
  InternalServerError,
  NotFoundError,
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  ERROR_TYPES,
} from "../utils/errors";
import logger from "../utils/logging";
import bcrypt from "bcryptjs";

export const generateError = (err, req, res, next, _) => {
  logger.error("request id: " + req.requestId + " error: " + err);
  if (err instanceof InvalidInputError || err instanceof ValidationError) {
    res.statusCode = 400;
    return next(err);
  } else if (err instanceof AuthenticationError) {
    res.statusCode = 403;
    return next(err);
  } else if (err instanceof AuthorizationError) {
    res.statusCode = 401;
    return next(err);
  } else if (err instanceof NotFoundError) {
    res.statusCode = 404;
    return next(err);
  } else {
    res.statusCode = 500;
    return next(new InternalServerError());
  }
};

export const comparePassword = async (newPassword, oldPassword) => {
  return await bcrypt.compare(newPassword, oldPassword);
};
export const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(Number(process.env.HASH_SALT_ROUNDS));
  return await bcrypt.hash(password, salt);
};

export const base64Signatures = {
  JVBERi0: "application/pdf",
  iVBORw0KGgo: "image/png",
  "/9j/": "image/jpg",
};

export const generateMetadata = (page, pageSize, totalResults) => ({
  page: page,
  pageSize: pageSize,
  total: totalResults,
  totalPage: Math.ceil(totalResults / pageSize),
});

export const generatePagination = (limit, page) => {
  const pageSize = limit ? parseInt(limit) : 10;
  const skip = page ? (parseInt(page) - 1) * parseInt(limit) : 0;
  validatePaginationInput(skip, pageSize);
  return { pageSize, skip };
};

const validatePaginationInput = (page, pageSize) => {
  // if (page < 1) {
  //   throw new InvalidInputError(ERROR_TYPES.PAGE_NUMBER_LESS_THAN_ONE);
  // }
  if (pageSize < 1) {
    throw new InvalidInputError(ERROR_TYPES.PAGE_SIZE_LESS_THAN_ONE);
  }
};

// export const getIpAndDeviceInfo = async (userAgent, ip) => {
//   try {
//     const ipAddress = ip;

//     const ipv4Regex = /::ffff:(\d+\.\d+\.\d+\.\d+)/;

//     const match = ipAddress.match(ipv4Regex);

//     let ipv4Address;
//     if (match) {
//       ipv4Address = match[1];
//     }
//     if (ipAddress === "::1") {
//       ipv4Address = ipAddress;
//     }
//     // const loc_res = await axios.get(
//     //   `https://ipinfo.io/${ip}?token=${process.env.IP_INFO_TOKEN}`
//     // );
//     // const loc_res = {};
//     const ipinfoWrapper = new IPinfoWrapper(`${process.env.IP_INFO_TOKEN}`);

//     const loc_res = await ipinfoWrapper.lookupIp(ipv4Address);
//     console.log(loc_res);
//     const parser = new UAParser();
//     const platform = parser.setUA(userAgent).getResult();

//     return { loc_res, platform };
//   } catch (err) {
//     throw new InvalidInputError("getIpAndDeviceInfo" + err);
//   }
// };
// function to generate a random 6-digit referral code
export const generateReferralCode = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
};

//6-digit OTP
export const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};
