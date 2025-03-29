import { Note } from "@prisma/client";
import { columns } from "./columns";

import { DataTable } from "./dataTable";
import { getUser } from "../auth/server";
import { prisma } from "@/db/prisma";

export default async function DemoPage() {
  const user = await getUser();
  let data: Note[] = [];
  if (user) {
    data = await prisma.note.findMany({
      where: {
        authorId: user.id,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });
  }

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} />
    </div>
  );
}
