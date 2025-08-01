"use client";
import { useForm, SubmitHandler } from "react-hook-form";
import React, { useState } from "react";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { ClerkAPIError } from "@clerk/types";
import { isClerkAPIResponseError } from "@clerk/nextjs/errors";
import { signinSchema } from "@/validation/signinSchema";

function Signin() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const [authErrors, setAuthErrors] = useState<string | null>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,

    formState: { errors },
  } = useForm<z.infer<typeof signinSchema>>({
    resolver: zodResolver(signinSchema),
    defaultValues: { identifier: "", password: "" },
  });
  const onSubmit = async (data: z.infer<typeof signinSchema>) => {
    setAuthErrors(null);
    console.log(data);
    const { identifier, password } = data;

    if (!isLoaded) {
      return null;
    }

    try {
      const result = await signIn.create({
        identifier,
        password,
      });
      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.push("/");
      }

      console.log(result);
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling

      console.error("Error:", JSON.stringify(err, null, 2));
      if (isClerkAPIResponseError(err)) setAuthErrors(err.errors[0].message);
    }
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4 w-full flex flex-col"
      >
        <input
          type="email"
          placeholder="enter your email"
          {...register("identifier")}
        />
        <p>{errors.identifier?.message}</p>

        <input
          type="password"
          placeholder="enter password"
          {...register("password")}
        />
        <p>{errors.password?.message}</p>

        <button
          type="submit"
          className="bg-green-600 rounded-xl p-3 cursor-pointer"
        >
          Submit
        </button>
        {authErrors && <p>{authErrors}</p>}
      </form>
    </div>
  );
}

export default Signin;
