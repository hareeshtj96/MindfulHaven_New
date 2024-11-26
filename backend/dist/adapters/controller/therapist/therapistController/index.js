"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const therapistRegisterController_1 = __importDefault(require("./therapistRegisterController"));
const verifyOTP_1 = __importDefault(require("./verifyOTP"));
const therapistLoginController_1 = __importDefault(require("./therapistLoginController"));
const therapistDetailsController_1 = __importDefault(require("./therapistDetailsController"));
const getTherapistProfile_1 = __importDefault(require("./getTherapistProfile"));
const getBookingsController_1 = __importDefault(require("./getBookingsController"));
const therapistUpdateTimingsController_1 = __importDefault(require("./therapistUpdateTimingsController"));
const therapistVideoController_1 = __importDefault(require("./therapistVideoController"));
const cancelAppointmentTherapist_1 = __importDefault(require("./cancelAppointmentTherapist"));
const getAvailableDetails_1 = __importDefault(require("./getAvailableDetails"));
const cancelSlotController_1 = __importDefault(require("./cancelSlotController"));
const updatePhotoController_1 = __importDefault(require("./updatePhotoController"));
const fetchProfitTherapist_1 = __importDefault(require("./fetchProfitTherapist"));
const therapistNotificationController_1 = __importDefault(require("./therapistNotificationController"));
exports.default = (dependencies) => {
    return {
        therapistRegisterController: (0, therapistRegisterController_1.default)(dependencies),
        verifyOTP: (0, verifyOTP_1.default)(dependencies),
        therapistLogin: (0, therapistLoginController_1.default)(dependencies),
        therapistDetailsController: (0, therapistDetailsController_1.default)(dependencies),
        getTherapistProfile: (0, getTherapistProfile_1.default)(dependencies),
        getBookingsController: (0, getBookingsController_1.default)(dependencies),
        therapistUpdateTimingsController: (0, therapistUpdateTimingsController_1.default)(dependencies),
        therapistVideoController: (0, therapistVideoController_1.default)(dependencies),
        cancelAppointmentTherapist: (0, cancelAppointmentTherapist_1.default)(dependencies),
        getAvailableDetails: (0, getAvailableDetails_1.default)(dependencies),
        cancelSlotController: (0, cancelSlotController_1.default)(dependencies),
        updatePhotoController: (0, updatePhotoController_1.default)(dependencies),
        fetchProfitTherapist: (0, fetchProfitTherapist_1.default)(dependencies),
        therapistNotificationController: (0, therapistNotificationController_1.default)(dependencies),
    };
};
