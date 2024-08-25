import { User } from "./userSchema";
import { Admin } from "./adminSchema";
import { Therapist } from "./therapistSchema";


interface DatabaseSchemaType {
    User: typeof User;
    Admin: typeof Admin;
    Therapist: typeof Therapist;
}

const databaseSchema: DatabaseSchemaType = {
    User,
    Admin,
    Therapist
}

export default databaseSchema;