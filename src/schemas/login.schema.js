import * as z from 'zod';


const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[#?!@$%^&*-]).{8,}$/;

export const loginSchema = z.object({

    email: z.string().email("Invalid email"),

    password: z
        .string()
        .regex(
            passwordRegex,
            "Password must be at least 8 characters and include uppercase, lowercase, number, and special character"
        ),

})

