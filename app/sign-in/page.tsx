import Signin from "@/components/sign-in";
import React from "react";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function page() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Signin</CardTitle>
          <CardDescription>
            Enter your email and password below to login
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Signin />
        </CardContent>
      </Card>
    </div>
  );
}

export default page;
