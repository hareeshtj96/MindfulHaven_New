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
exports.default = therapistDetailsController;
const dotenv_1 = __importDefault(require("dotenv"));
const rrule_1 = require("rrule");
const httpStatusCode_1 = require("../../../../utils/httpStatusCode");
dotenv_1.default.config();
//Existing function to convert "HH:mm" to Date object
const timeToDate = (time, dayOffset) => {
    const [hours, minutes] = time.split(':').map(Number);
    const date = new Date();
    date.setHours(hours);
    date.setMinutes(minutes);
    date.setSeconds(0);
    date.setDate(date.getDate() + dayOffset);
    return date;
};
const createTherapistSlotRules = (timings) => {
    const ruleSet = new rrule_1.RRuleSet();
    timings.forEach((timing) => {
        const dayOfWeeks = timing.dayOfWeek;
        dayOfWeeks.forEach((dayOfWeek) => {
            const startTimeDate = timeToDate(timing.startTime, (dayOfWeek + 7 - new Date().getDay()) % 7);
            const rrule = new rrule_1.RRule({
                freq: rrule_1.RRule.WEEKLY,
                byweekday: [dayOfWeek - 1],
                dtstart: startTimeDate,
                count: 52,
            });
            ruleSet.rrule(rrule);
        });
    });
    return ruleSet;
};
function therapistDetailsController(dependencies) {
    const { therapistRepository } = dependencies.repository;
    const submitTherapistDetails = (req, res) => __awaiter(this, void 0, void 0, function* () {
        try {
            if (!req.body.therapistData) {
                return res.status(httpStatusCode_1.HttpStatusCode.BAD_REQUEST).json({ message: httpStatusCode_1.ResponseMessages.THERAPIST_DATA_MISSING });
            }
            const therapistData = JSON.parse(req.body.therapistData);
            const { name, phone, specialization, gender, educationalQualifications, counsellingQualification, professionalExperience, establishment, location, timings, fees, therapistId, } = therapistData;
            //Generate slots using RRule
            const slotRules = createTherapistSlotRules(timings);
            const slots = slotRules.all();
            let photoUrl = "";
            let identityProofUrl = "";
            if (req.files) {
                const files = req.files;
                if (files['photo']) {
                    photoUrl = files['photo'][0].filename;
                }
                if (files['identityProof']) {
                    identityProofUrl = files['identityProof'][0].filename;
                }
            }
            const newTherapist = {
                name,
                phone,
                specialization,
                gender,
                educationalQualifications: educationalQualifications.split(',').map((qual) => qual.trim()),
                identityProof: identityProofUrl,
                counsellingQualification,
                professionalExperience,
                establishment,
                location,
                timings,
                fees,
                therapistId,
                photo: photoUrl,
                availableSlots: slots
            };
            const saveResult = yield therapistRepository.saveTherapist(newTherapist);
            if (!saveResult) {
                return res.status(httpStatusCode_1.HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: httpStatusCode_1.ResponseMessages.FAILED_TO_SAVE_THERAPIST_DATA });
            }
            res.status(httpStatusCode_1.HttpStatusCode.OK).json({ status: true, message: httpStatusCode_1.ResponseMessages.THERAPIST_SAVED, data: saveResult.data });
        }
        catch (error) {
            res.status(httpStatusCode_1.HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: "Internal Server Error" });
        }
    });
    return submitTherapistDetails;
}
