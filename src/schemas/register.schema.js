import * as z from 'zod';


const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[#?!@$%^&*-]).{8,}$/;

export const registerSchema = z.object({
    name: z
        .string()
        .trim()
        .nonempty("Name is required")
        .min(3, "Min length is 3 characters"),

    username: z
        .string()
        .trim()
        .min(3, "Min length is 3 characters")
        .max(30, "Max length is 30 characters")
        .regex(
            /^[a-zA-Z0-9_]{3,30}$/,
            "Username must contain letters, numbers, or underscores — no spaces"
        ),

    email: z.string().trim().email("Invalid email"),

    // Keep the API's YYYY-MM-DD string; Date coercion can change calendar dates
    // across timezones or normalize impossible dates such as February 30.
    dateOfBirth: z.iso.date({ message: 'Enter a valid date of birth' })
        .refine(value => value <= new Date().toLocaleDateString('en-CA'), 'Date of birth cannot be in the future'),

    gender: z.enum(['male', 'female'], {
        message: 'Gender must be male or female',
    }),

    password: z
        .string()
        .regex(
            passwordRegex,
            "Password must be at least 8 characters and include uppercase, lowercase, number, and special character"
        ),

    rePassword: z.string().min(1, 'Please confirm your password'),
})
    .refine((data) => data.password === data.rePassword, {
        message: "Passwords do not match",
        path: ["rePassword"],
    });
