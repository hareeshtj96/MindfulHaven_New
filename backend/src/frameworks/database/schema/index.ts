import { User } from "./userSchema";
import { Admin } from "./adminSchema";
import { Therapist } from "./therapistSchema";
import { Appointment } from "./appointmentSchema";
import { Payment } from "./paymentSchema";
import { Wallet } from "./walletSchema";
import { Issue } from "./issueSchema";


interface DatabaseSchemaType {
    User: typeof User;
    Admin: typeof Admin;
    Therapist: typeof Therapist;
    Appointment: typeof Appointment;
    Payment: typeof Payment;
    Wallet: typeof Wallet;
    Issue: typeof Issue;
}

const databaseSchema: DatabaseSchemaType = {
    User,
    Admin,
    Therapist,
    Appointment,
    Payment,
    Wallet,
    Issue
}

export default databaseSchema;