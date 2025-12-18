import axios from "axios";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const schema = z
    .object({
      name: z
        .string()
        .min(3, { message: "Name must be at least 3 characters" })
        .nonempty({ message: "Name is required" }),
      email: z
        .string()
        .email({ message: "Email is not valid" })
        .nonempty({ message: "Email is required" }),
      password: z
        .string()
        .regex(/^(?=.*[A-Za-z])(?=.*\d).{8,}$/, {
          message:
            "Password must be at least 8 characters and contain at least one letter and one number",
        })
        .nonempty({ message: "Password is required" }),
      rePassword: z
        .string()
        .nonempty({ message: "Please confirm your password" }),
      dateOfBirth: z
        .string()
        .nonempty({ message: "Date of birth is required" }),
      gender: z.enum(["male", "female"], { required_error: "Gender is required" }),
    })
    .refine((data) => data.password === data.rePassword, {
      message: "Passwords don't match",
      path: ["rePassword"],
    });

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const navigate = useNavigate();

  async function onSubmit(values) {
    try {
      const { data } = await axios.post(
        "https://linked-posts.routemisr.com/users/signup",
        values
      );
      if (data.message === "success") {
        navigate('/login');
      }
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "Failed to register";
      setError('apiError', { message: errorMessage });
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-2 sm:px-4">
      <div className="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl p-4 sm:p-6 md:p-8 rounded-3xl shadow-2xl">
        <h1 className="text-3xl text-sky-800 font-semibold text-center mb-6">
          Register Now
        </h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input
            {...register("name")}
            type="text"
            className="input w-full mb-5"
            placeholder="Enter your name"
          />
          {errors.name && (
            <p className="text-red-600 mb-4">{errors.name.message}</p>
          )}

          <input
            {...register("email")}
            type="email"
            className="input w-full mb-5"
            placeholder="Enter your email"
          />
          {errors.email && (
            <p className="text-red-600 mb-4">{errors.email.message}</p>
          )}

          <input
            {...register("password")}
            type="password"
            className="input w-full mb-5"
            placeholder="Enter your password"
          />
          {errors.password && (
            <p className="text-red-600 mb-4">{errors.password.message}</p>
          )}

          <input
            {...register("rePassword")}
            type="password"
            className="input w-full mb-5"
            placeholder="Confirm your password"
          />
          {errors.rePassword && (
            <p className="text-red-600 mb-4">{errors.rePassword.message}</p>
          )}

          <input
            {...register("dateOfBirth")}
            type="date"
            className="input w-full mb-5"
            placeholder="Enter your date of birth"
          />
          {errors.dateOfBirth && (
            <p className="text-red-600 mb-4">{errors.dateOfBirth.message}</p>
          )}

          <div className="mb-4">
            <input
              {...register("gender")}
              type="radio"
              id="ma"
              value="male"
              name="gender"
              className="radio radio-primary"
            />
            <label htmlFor="ma" className="mx-2">
              Male
            </label>
            <input
              {...register("gender")}
              type="radio"
              id="fe"
              value="female"
              name="gender"
              className="radio radio-primary"
            />
            <label htmlFor="fe" className="mx-2">
              Female
            </label>
          </div>
          {errors.gender && (
            <p className="text-red-600 mb-4">{errors.gender.message}</p>
          )}

          {errors.apiError && (
            <div className="text-red-600 mb-4 text-center">
              {errors.apiError.message}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-sky-700 text-stone-200 px-6 py-2 rounded-2xl hover:bg-sky-900 transition-colors duration-300 cursor-pointer"
          >
            {isSubmitting ? "Loading..." : "Sign Up"}
          </button>
        </form>
      </div>
    </div>
  );
}
