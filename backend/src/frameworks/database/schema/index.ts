import { User } from "./userSchema";
import { Admin } from "./adminSchema";
import { Therapist } from "./therapistSchema";
import { Appointment } from "./appointmentSchema";


interface DatabaseSchemaType {
    User: typeof User;
    Admin: typeof Admin;
    Therapist: typeof Therapist;
    Appointment: typeof Appointment;
}

const databaseSchema: DatabaseSchemaType = {
    User,
    Admin,
    Therapist,
    Appointment,
}

export default databaseSchema;