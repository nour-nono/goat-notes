import { prisma } from "@/db/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId") || "";
  const email = searchParams.get("email") || "";
  // console.log(`##################\n create-user ${userId} \n##################\n`);
  // console.log(`##################\n create-user ${email} \n##################\n`);
  
  const result = await prisma.user.findFirst({
    where: {
      email
    },
    select: {
      id: true,
    },
  });
  // console.log(`##################\n result ${JSON.stringify(result)} \n##################\n`);
  if (!result) {
    await prisma.user.create({
      data: {
        id: userId,
        email: email,
      },
    });
  }
  return NextResponse.json({ success: !!result?.id });
}
