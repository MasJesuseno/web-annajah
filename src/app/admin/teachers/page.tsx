import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { TeacherManager } from "./teacher-manager";

export default async function TeachersPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const teachers = await prisma.teacher.findMany({
    orderBy: { order: "asc" },
  });

  return <TeacherManager items={teachers} />;
}
