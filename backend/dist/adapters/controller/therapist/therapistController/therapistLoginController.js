"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = therapistLogin;
const httpStatusCode_1 = require("../../../../utils/httpStatusCode");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const SECRET_KEY = process.env.JWT_SECRET || "your-secret-key";
function therapistLogin(dependencies) {
    const { therapistRepository } = dependencies.repository;
    const therapistloginController = (req, res) => __awaiter(this, void 0, void 0, function* () {
        try {
            const { email, password, role } = req.body;
            // Find the therapist by email
            const therapist = yield therapistRepository.getTherapistByEmail(email);
            if (!therapist.status) {
                return res.status(httpStatusCode_1.HttpStatusCode.BAD_REQUEST).json({ message: httpStatusCode_1.ResponseMessages.ACCOUNT_NOT_FOUND });
            }
            // Compare provided password with the stored hashed password
            const validPassword = yield bcryptjs_1.default.compare(password, therapist.user.password);
            if (!validPassword) {
                return res.status(httpStatusCode_1.HttpStatusCode.BAD_REQUEST).json({ message: httpStatusCode_1.ResponseMessages.INVALID_PASSWORD });
            }
            // Generate JWT token upon successful login
            const token = jsonwebtoken_1.default.sign({ therapistId: therapist.user._id, email: therapist.user.email, name: therapist.user.name, role: therapist.user.role }, SECRET_KEY, { expiresIn: "1h" });
            // Exclude the password from the response
            const therapistDetails = {
                therapistId: therapist.user._id,
                name: therapist.user.name,
                email: therapist.user.email,
                phone: therapist.user.phone,
                specialization: therapist.user.specialization,
                gender: therapist.user.gender,
                educationalQualifications: therapist.user.educationalQualifications,
                identityProof: therapist.user.identityProof,
                counsellingQualification: therapist.user.counsellingQualification,
                professionalExperience: therapist.user.professionalExperience,
                establishment: therapist.user.establishment,
                location: therapist.user.location,
                timings: therapist.user.timings,
                fees: therapist.user.fees,
                photo: therapist.user.photo,
                role: therapist.user.role
            };
            // Send response
            res.json({ status: true, token, therapist: therapistDetails });
        }
        catch (error) {
            res.status(httpStatusCode_1.HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: httpStatusCode_1.ResponseMessages.INTERNAL_SERVER_ERROR });
        }
    });
    return therapistloginController;
}
;
