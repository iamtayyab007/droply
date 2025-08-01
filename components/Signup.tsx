"use client";
import { useForm, SubmitHandler } from "react-hook-form";
import React, { useState } from "react";
import { signupSchema } from "@/validation/signupSchema";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSignUp } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { ClerkAPIError } from "@clerk/types";
import { isClerkAPIResponseError } from "@clerk/nextjs/errors";

function Signup() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const [verifying, setVerifying] = useState(false);
  const [emailOtp, setEmailOtp] = useState("");
  const [code, setCode] = useState("");
  const [authErrors, setAuthErrors] = useState<string | null>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,

    formState: { errors },
  } = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: { email: "", password: "", confirmPassword: "" },
  });
  const onSubmit = async (data: z.infer<typeof signupSchema>) => {
    setAuthErrors(null);
    console.log(data);
    const { email, password, confirmPassword } = data;

    if (!isLoaded) {
      return null;
    }

    //if (!isLoaded && !signUp) return null;

    try {
      const result = await signUp?.create({
        emailAddress: email,
        password: password,
      });
      console.log(result);
      // Use the code provided by the user and attempt verification
      const signUpAttempt = await signUp.prepareEmailAddressVerification({
        strategy: "email_code",
      });

      setVerifying(true);
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling

      console.error("Error:", JSON.stringify(err, null, 2));
      if (isClerkAPIResponseError(err)) setAuthErrors(err.errors[0].message);
    }
  };

  async function handleVerification(e: React.FormEvent) {
    e.preventDefault();

    if (!isLoaded && !signUp) return null;

    try {
      // Use the code provided by the user and attempt verification
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      });

      // If verification was completed, set the session to active
      // and redirect the user
      if (signUpAttempt.status === "complete") {
        await setActive({ session: signUpAttempt.createdSessionId });

        router.push("/sign-in");
      } else {
        // If the status is not complete, check why. User may need to
        // complete further steps.
        console.error(signUpAttempt);
      }
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error("Error:", JSON.stringify(err, null, 2));
    }
  }

  if (verifying) {
    return (
      <>
        <h1>Verify your Code</h1>
        <form onSubmit={handleVerification}>
          <label htmlFor="code">Enter your verification code</label>
          <input
            value={code}
            id="code"
            name="code"
            onChange={(e) => setCode(e.target.value)}
          />
          <button type="submit">Verify</button>
        </form>
      </>
    );
  }

  return (
    <>
      <div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 w-full flex flex-col"
        >
          <input
            type="email"
            placeholder="enter your email"
            {...register("email")}
          />
          <p>{errors.email?.message}</p>

          <input
            type="password"
            placeholder="enter password"
            {...register("password")}
          />
          <p>{errors.password?.message}</p>
          <input
            type="password"
            placeholder="confirm your password"
            {...register("confirmPassword")}
          />
          <p>{errors.confirmPassword?.message}</p>
          <div id="clerk-captcha"></div>

          <button
            type="submit"
            className="bg-green-600 rounded-xl p-3 cursor-pointer"
          >
            Submit
          </button>
          {authErrors && <p>{authErrors}</p>}
        </form>
      </div>
    </>
  );
}

export default Signup;
