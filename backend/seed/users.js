import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();
const users = [
    {
        id: 1,
        counter: 1,
        nameFirst: 'Man',
        nameLast: 'Dr',
        email: 'admin@admin.com',
        password: bcrypt.hashSync(process.env.ADMIN_PASSWORD, 10),
        isAdmin: true
    }
];

export default users;