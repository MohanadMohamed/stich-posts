import * as z from 'zod';


const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[#?!@$%^&*-]).{8,}$/;

export const registerSchema = z.object({
    name: z
        .string()
        .nonempty("Name is required")
        .min(3, "Min length is 3 characters")
        .max(10, "Max length is 10 characters"),

    username: z
        .string()
        .min(3, "Min length is 3 characters")
        .max(30, "Max length is 30 characters")
        .regex(
            /^[a-z0-9_]{3,30}$/,
            "Username must be lowercase letters, numbers, or underscores — no spaces"
        ),

    email: z.string().email("Invalid email"),

    dateOfBirth: z.coerce
        .date()
        .refine(
            (val) => new Date().getFullYear() - val.getFullYear() > 16,
            "Age must be above 16 years old"
        )
        .transform((val) => {
            const yyyy = val.getFullYear();
            const mm = String(val.getMonth() + 1).padStart(2, '0');
            const dd = String(val.getDate()).padStart(2, '0');
            return `${yyyy}-${mm}-${dd}`;
        }),

    gender: z.enum(['male', 'female'], {
        message: 'Gender must be male or female',
    }),

    password: z
        .string()
        .regex(
            passwordRegex,
            "Password must be at least 8 characters and include uppercase, lowercase, number, and special character"
        ),

    rePassword: z.string(),
})
    .refine((data) => data.password === data.rePassword, {
        message: "Passwords do not match",
        path: ["rePassword"],
    });
