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
      .regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/, {
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
        localStorage.setItem("token" , data.token);
        navigate("/");
      }
    } catch (error) {
      if (error.response) {
        setError("apiError", { message: error.response.data.error });
      } else {
        setError("apiError", { message: "Error to conect server" });
      }
    }
  }

  return (
    <div className="w-[50%] mx-auto shadow-xl p-5 my-6 rounded-2xl">
      <h1 className="text-3xl text-sky-800 text-semibold">Login Now</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="my-6">
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
        <button className="text-stone-200 bg-sky-700 px-6 py-3 rounded-xl cursor-pointer hover:bg-sky-900">
          {isSubmitting ? "Loading..." : "Sign In"}
        </button>
      </form>
    </div>
  );
}
