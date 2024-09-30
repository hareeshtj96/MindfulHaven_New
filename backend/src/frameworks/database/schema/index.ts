import { User } from "./userSchema";
import { Admin } from "./adminSchema";
import { Therapist } from "./therapistSchema";
import { Appointment } from "./appointmentSchema";
import { Payment } from "./paymentSchema";


interface DatabaseSchemaType {
    User: typeof User;
    Admin: typeof Admin;
    Therapist: typeof Therapist;
    Appointment: typeof Appointment;
    Payment: typeof Payment;
}

const databaseSchema: DatabaseSchemaType = {
    User,
    Admin,
    Therapist,
    Appointment,
    Payment,
}

export default databaseSchema;