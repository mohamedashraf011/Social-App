import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { TokenContext } from "../Context/TokenContext";

export default function Login() {
  const schema = z.object({
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
  const { setToken } = useContext(TokenContext);

  async function onSubmit(values) {
    try {
      const { data } = await axios.post(
        "https://linked-posts.routemisr.com/users/signin",
        values
      );
      if (data.message === "success") {
        setToken(data.token);
        localStorage.setItem("token", data.token);
        navigate("/");
      }
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "Failed to connect to server";
      setError("apiError", { message: errorMessage });
    }
  }

  return (
  <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
    <div className="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl p-6 sm:p-8 md:p-10 rounded-3xl shadow-2xl">
      <h1 className="text-3xl text-sky-800 font-semibold text-center mb-6">
        Login Now
      </h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input
          {...register("email")}
          type="email"
          placeholder="Type Your Email"
          className="input w-full mb-5"
        />
        {errors.email && (
          <p className="text-red-600 mb-4">{errors.email.message}</p>
        )}

        <input
          {...register("password")}
          type="password"
          placeholder="Type Your Password"
          className="input w-full mb-5"
        />
        {errors.password && (
          <p className="text-red-600 mb-4">{errors.password.message}</p>
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
          {isSubmitting ? "Loading..." : "Sign In"}
        </button>
      </form>
    </div>
  </div>
  );
}
