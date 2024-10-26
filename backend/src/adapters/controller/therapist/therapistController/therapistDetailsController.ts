import { Request, Response } from "express";
import dotenv from "dotenv";
import { Therapist } from "../../../../frameworks/database/schema/therapistSchema";
import { RRule, RRuleSet } from "rrule";
import { create } from "domain";
import { Number } from "mongoose";
import { HttpStatusCode, ResponseMessages } from "../../../../utils/httpStatusCode";

dotenv.config();

interface Timing {
    dayOfWeek: number[];  
    startTime: string;    
    endTime: string;      
}


//Existing function to convert "HH:mm" to Date object
const timeToDate = (time: string, dayOffset: number) => {
    const [hours, minutes] = time.split(':').map(Number);
    const date = new Date();
    date.setHours(hours);
    date.setMinutes(minutes);
    date.setSeconds(0);
    date.setDate(date.getDate() + dayOffset);
    return date;
}

const createTherapistSlotRules = (timings: Timing[]) => {
    const ruleSet = new RRuleSet();

    timings.forEach((timing) => {
        const dayOfWeeks = timing.dayOfWeek;

        dayOfWeeks.forEach((dayOfWeek: number) => {
            const startTimeDate = timeToDate(timing.startTime, (dayOfWeek + 7 - new Date().getDay()) % 7);
            
            const rrule = new RRule({
                freq: RRule.WEEKLY,
                byweekday: [dayOfWeek - 1],
                dtstart: startTimeDate,
                count: 52, 
            });
            ruleSet.rrule(rrule);
        })
    })
    return ruleSet;
}



export default function therapistDetailsController(dependencies: any) {
    const { therapistRepository } = dependencies.repository;

    const submitTherapistDetails = async (req:Request, res: Response) => {
        try {
            if(!req.body.therapistData) {
                return res.status(HttpStatusCode.BAD_REQUEST).json({ message: ResponseMessages.THERAPIST_DATA_MISSING });
            }
            
            const therapistData = JSON.parse(req.body.therapistData);
    
            const {
                name,
                phone,
                specialization,
                gender,
                educationalQualifications,
                counsellingQualification,
                professionalExperience,
                establishment,
                location,
                timings,
                fees,
                therapistId,
            } = therapistData;

            //Generate slots using RRule
            const slotRules = createTherapistSlotRules(timings);
            const slots = slotRules.all();
            
            let photoUrl = "";

            let identityProofUrl = "";

            if(req.files) {
                const files = req.files as { [fieldname: string]: Express.Multer.File[] };

                if(files['photo']) {
                    photoUrl = files['photo'][0].filename;
                }

                if(files['identityProof']) {
                    identityProofUrl = files['identityProof'][0].filename;
                }

               
            }

            
            
            const newTherapist = {
                name,
                phone,
                specialization,
                gender,
                educationalQualifications: educationalQualifications.split(',').map((qual: string) => qual.trim()),
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
            }

            const saveResult = await therapistRepository.saveTherapist(newTherapist);

            if(!saveResult) {
                return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: ResponseMessages.FAILED_TO_SAVE_THERAPIST_DATA });
            }

            res.status(HttpStatusCode.OK).json({ status: true, message: ResponseMessages.THERAPIST_SAVED,  data: saveResult.data});
        } catch (error) {
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: "Internal Server Error"});
        }
    };

    return submitTherapistDetails;
}