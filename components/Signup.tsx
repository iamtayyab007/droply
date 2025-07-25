import { SignUp } from "@clerk/nextjs";
import { useForm, SubmitHandler } from "react-hook-form";
import React from "react";
import { signupSchema } from "@/validation/signupSchema";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

function Signup() {
  const {
    register,
    handleSubmit,

    formState: { errors },
  } = useForm({
    resolver: zodResolver(signupSchema),
  });
  const onSubmit = (data: z.infer<typeof signupSchema>) => console.log(data);
  return <div></div>;
}

export default Signup;
