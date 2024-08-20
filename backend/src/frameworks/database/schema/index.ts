import { User } from "./userSchema";


interface DatabaseSchemaType {
    User: typeof User;
}

const databaseSchema: DatabaseSchemaType = {
    User,
}

export default databaseSchema;