import { generateToken04 } from "./zegoServerAssistant";

const SECRET_KEY = process.env.ZEGOCLOUD_SECRET_KEY || "Your secret key";
const APP_ID = Number(process.env.ZEGOCLOUD_APP_ID)
const effectiveTimeInSeconds = 3600;


export const generateZegoToken = (userId: string, roomId: string): string => {
    console.log('userid:', userId)
    console.log("room id:", roomId)
    const payloadObject = {
        room_id: roomId,
        privilege: {
            1: 1,  // loginRoom: 1 pass, 0 not pass
            2: 0  //  publishStream: 1 pass, o not pass
        },
        stream_id_list: null
    };
    const payload = JSON.stringify(payloadObject);

    const token = generateToken04(APP_ID, userId, SECRET_KEY, effectiveTimeInSeconds, payload);

    return token;
};