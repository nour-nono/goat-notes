"use server";

import { getUser } from "@/app/auth/server";
import { prisma } from "@/db/prisma";
import { handleError } from "@/lib/utils";

export const updateNoteAction = async (noteId: string, text: string) => {
  try {
    const user = await getUser();
    if (!user) throw new Error("User not found");
    await prisma.note.update({
      where: {id: noteId},
      data: {text},
    });
    return { errorMessage: null };
  } catch (error) {
    return handleError(error);
  }
};
