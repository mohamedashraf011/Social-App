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
        .regex(
          /^(?=.*[A-Za-z])(?=.*\d).{8,}$/,
          {
            message:
              "Password must be at least 8 characters and contain at least one letter and one number",
          }
        )
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
    //call api
    try {
      const { data } = await axios.post(
        "https://linked-posts.routemisr.com/users/signup",
        values
      );
      if (data.message == "success") {
        navigate('/login')
      }
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "Failed to register";
      setError('apiError' , { message: errorMessage })
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
      <div className="w-[50%] mx-auto shadow-xl p-5 rounded-2xl">
        <h1 className="text-3xl text-sky-800 text-semibold">Register Now</h1>
        <p></p>
        <form onSubmit={handleSubmit(onSubmit)} className="my-4">
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

        <button className="text-stone-200 bg-sky-700 px-6 py-3 rounded-xl cursor-pointer hover:bg-sky-900">
          {isSubmitting ? "Loading..." : "Sign Up"}
        </button>
        </form>
      </div>
    </div>
  );
}
