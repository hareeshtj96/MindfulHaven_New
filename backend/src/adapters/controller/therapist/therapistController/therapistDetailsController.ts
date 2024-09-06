import { Request, Response } from "express";
import dotenv from "dotenv";
import { Therapist } from "../../../../frameworks/database/schema/therapistSchema";
import multer, { StorageEngine } from "multer";
import path from "path";
import fs from "fs";



dotenv.config();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname,"../../../../uploads");
        if(!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
})

const upload = multer({ storage });

export default function therapistDetailsController(dependencies: any) {
    const { therapistRepository } = dependencies.repository;

    const submitTherapistDetails = async (req:Request, res: Response) => {
        console.log("Entered therapist details submission controller:");

        try {
            console.log("req.body", req.body);

            if(!req.body.therapistData) {
                return res.status(400).json({ message: "Therapist data is missing"});
            }
            
            const therapistData = JSON.parse(req.body.therapistData);
            console.log(" parsed therapist data:", therapistData);
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

            let photoUrl = "";

            let identityProofUrl = "";

            if(req.files) {
                const files = req.files as { [fieldname: string]: Express.Multer.File[] };

                if(files['photo']) {
                    photoUrl = files['photo'][0].path;
                }

                if(files['identityProof']) {
                    identityProofUrl = files['identityProof'][0].path;
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
                photo: photoUrl
            }

            const saveResult = await therapistRepository.saveTherapist(newTherapist);

            if(!saveResult) {
                return res.status(500).json({ message: "Failed to save therapist data"});
            }

            res.status(201).json({ status: true, message: "Therapist details saved successfully"})
        } catch (error) {
            console.error("Error in therapistDetailsController:", error);
            res.status(500).json({ message: "Internal Server Error"});
        }
    };

    return submitTherapistDetails;
}