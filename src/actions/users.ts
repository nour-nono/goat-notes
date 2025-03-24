"use server";

import { createClient } from "@/app/auth/server";
import { prisma } from "@/db/prisma";
import { handleError } from "@/lib/utils";
import { Provider } from "@supabase/supabase-js";
import { redirect } from "next/navigation";

export const loginAction = async (email: string, password: string) => {
  try {
    const { auth } = await createClient();
    const { error } = await auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return { errorMessage: null };
  } catch (error) {
    return handleError(error);
  }
};

export const logOutAction = async () => {
  try {
    const { auth } = await createClient();
    const { error } = await auth.signOut();
    if (error) throw error;
    return { errorMessage: null };
  } catch (error) {
    return handleError(error);
  }
};

export const signUpAction = async (email: string, password: string) => {
  try {
    const { auth } = await createClient();
    const { data, error } = await auth.signUp({
      email,
      password,
    });
    if (error) throw error;
    const userId = data?.user?.id;
    if (!userId) throw new Error("An error occurred while signing up");
    await prisma.user.create({
      data: {
        id: userId,
        email,
      },
    });
    return { errorMessage: null };
  } catch (error) {
    return handleError(error);
  }
};


const signInWithProvider: (provider:Provider) => () => Promise<{ errorMessage: string | null, url?: string }> = provider => async () => {
  try {
    const { auth } = await createClient();
    const auth_callback_url = `${process.env.NEXT_PUBLIC_BASE_URL}/auth/callback`;
    const { data, error } = await auth.signInWithOAuth({
      provider: provider,
      options: {
        redirectTo: auth_callback_url,
        queryParams: {
          access_type: "offline",
          prompt: "consent",
        },
      },
    });
    if (error) throw error;
    if (data.url) {
      return { errorMessage: null, url: data.url };
    }
    // data.url;
    // const userId = data?
    // if (!userId) throw new Error("An error occurred while signing up");
    // await prisma.user.create({
    //   data: {
    //     id: userId,
    //     email,
    //   },
    // });
    return { errorMessage: null };
  } catch (error) {
    return handleError(error);
  }
};

export const signInWithGoogle = signInWithProvider('google');
export const signInWithLinkedIn = signInWithProvider('linkedin_oidc');
