import Signup from "@/components/Signup";
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
          <CardTitle>Sign up</CardTitle>
          <CardDescription>
            Enter your email and password below to signup
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Signup />
        </CardContent>
      </Card>
    </div>
  );
}

export default page;
