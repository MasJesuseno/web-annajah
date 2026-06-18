"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function addTeacher(formData: FormData) {
  const name = formData.get("name") as string;
  const position = formData.get("position") as string;
  const photo = formData.get("photo") as string;
  const order = parseInt(formData.get("order") as string) || 0;

  await prisma.teacher.create({
    data: {
      name,
      position,
      photo: photo || null,
      order,
    },
  });

  revalidatePath("/admin/teachers");
  revalidatePath("/dewan-guru");
}

export async function updateTeacher(id: number, formData: FormData) {
  const name = formData.get("name") as string;
  const position = formData.get("position") as string;
  const photo = formData.get("photo") as string;
  const order = parseInt(formData.get("order") as string) || 0;

  await prisma.teacher.update({
    where: { id },
    data: {
      name,
      position,
      photo: photo || null,
      order,
    },
  });

  revalidatePath("/admin/teachers");
  revalidatePath("/dewan-guru");
}

export async function deleteTeacher(id: number) {
  await prisma.teacher.delete({ where: { id } });
  revalidatePath("/admin/teachers");
  revalidatePath("/dewan-guru");
}
