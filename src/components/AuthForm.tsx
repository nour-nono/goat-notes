"use client";

import { useTransition } from "react";
import { CardContent, CardFooter } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { loginAction, signInWithGoogle, signInWithLinkedIn, signUpAction } from "@/actions/users";

type Props = {
  type: "login" | "signUp";
};
function AuthForm({ type }: Props) {
  const isLoginForm = type === "login";
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (formData: FormData) => {
    startTransition(async () => {
      const email = formData.get("email") as string;
      const password = formData.get("password") as string;
      let errorMessage;
      let title;
      let description;
      if (isLoginForm) {
        errorMessage = (await loginAction(email, password)).errorMessage;
        title = errorMessage ? "Login Failed" : "Login Successful";
        description = errorMessage
          ? "Please check your email and password"
          : "You have been logged in successfully";
      } else {
        errorMessage = (await signUpAction(email, password)).errorMessage;
        title = errorMessage ? "Sign Up Failed" : "Sign Up Successful";
        description = errorMessage
          ? "Please check your email and password"
          : "You have been signed up successfully";
      }
      if (errorMessage) {
        toast.error(title, { description });
      } else {
        toast.success(title, { description });
        router.replace("/");
      }
    });
  };
  const googleSignIn = async () => {
    const { url, errorMessage } = await signInWithGoogle();
    if (url) {
      router.replace(url);
    }
    if (errorMessage) {
      toast.error("Sign In Failed", {
        description: "An error occurred while signing in",
      });
    }
  };
  const linkedinSignIn = async () => {
    const { url, errorMessage } = await signInWithLinkedIn();
    if (url) {
      router.replace(url);
    }
    if (errorMessage) {
      toast.error("Sign In Failed", {
        description: "An error occurred while signing in",
      });
    }
  };

  return (
    <form action={handleSubmit}>
      <CardContent className="grid w-full items-center gap-4">
        <div className="flex flex-col space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            type="email"
            id="email"
            name="email"
            required
            placeholder="Enter your email"
            disabled={isPending}
          />
        </div>
        <div className="flex flex-col space-y-1.5">
          <Label htmlFor="password">Password</Label>
          <Input
            type="password"
            id="password"
            name="password"
            required
            placeholder="Enter your password"
            disabled={isPending}
          />
        </div>
      </CardContent>
      <CardFooter className="mt-4 flex flex-col gap-6">
        <Button className="w-full">
          {isPending ? (
            <Loader2 className="animate-spin" />
          ) : isLoginForm ? (
            "Login"
          ) : (
            "Sign Up"
          )}
        </Button>
        <p className="text-xs">
          {isLoginForm ? "Don't have an account?" : "Already have an account?"}{" "}
          <Link
            href={isLoginForm ? "/sign-up" : "/login"}
            className={`text-blue-500 underline ${isPending ? "pointer-events-none opacity-50" : ""}`}
          >
            {isLoginForm ? "Sign Up" : "Login"}
          </Link>
        </p>
      </CardFooter>
      <CardContent className="mt-4">
        <Button
          className="mt-4 flex w-full justify-center"
          type="button"
          onClick={googleSignIn}
        >
          Sign in with Google
        </Button>
        <Button
          className="mt-4 flex w-full justify-center"
          type="button"
          onClick={linkedinSignIn}
        >
          Sign in with LinkedIn
        </Button>
      </CardContent>
    </form>
  );
}

export default AuthForm;
