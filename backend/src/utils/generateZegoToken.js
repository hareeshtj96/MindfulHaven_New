"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateZegoToken = void 0;
const zegoServerAssistant_1 = require("./zegoServerAssistant");
const SECRET_KEY = process.env.ZEGOCLOUD_SECRET_KEY || "Your secret key";
const APP_ID = Number(process.env.ZEGOCLOUD_APP_ID);
const effectiveTimeInSeconds = 3600;
const generateZegoToken = (userId, roomId) => {
    console.log('userid:', userId);
    console.log("room id:", roomId);
    const payloadObject = {
        room_id: roomId,
        privilege: {
            1: 1, // loginRoom: 1 pass, 0 not pass
            2: 0 //  publishStream: 1 pass, o not pass
        },
        stream_id_list: null
    };
    const payload = JSON.stringify(payloadObject);
    const token = (0, zegoServerAssistant_1.generateToken04)(APP_ID, userId, SECRET_KEY, effectiveTimeInSeconds, payload);
    return token;
};
exports.generateZegoToken = generateZegoToken;
