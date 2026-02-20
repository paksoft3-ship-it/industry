"use server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function createReview(data: {
  productId: string;
  rating: number;
  title?: string;
  comment?: string;
}) {
  const session = await auth();
  if (!session?.user) throw new Error("Not authenticated");

  const review = await prisma.review.create({
    data: {
      ...data,
      userId: session.user.id,
      isApproved: false, // Requires admin approval
    },
  });

  revalidatePath(`/urun`);
  return review;
}

export async function getProductReviews(productId: string) {
  return prisma.review.findMany({
    where: { productId, isApproved: true },
    include: { user: { select: { firstName: true, lastName: true } } },
    orderBy: { createdAt: "desc" },
  });
}

export async function approveReview(reviewId: string) {
  const session = await auth();
  if (!session?.user || !["ADMIN", "SUPER_ADMIN"].includes((session.user as { role: string }).role)) {
    throw new Error("Unauthorized");
  }

  const review = await prisma.review.update({
    where: { id: reviewId },
    data: { isApproved: true },
  });

  revalidatePath("/admin/urunler");
  return review;
}

export async function createQuestion(productId: string, question: string) {
  const session = await auth();
  if (!session?.user) throw new Error("Not authenticated");

  return prisma.productQuestion.create({
    data: { productId, userId: session.user.id, question },
  });
}

export async function answerQuestion(questionId: string, answer: string) {
  const session = await auth();
  if (!session?.user) throw new Error("Not authenticated");

  return prisma.productAnswer.create({
    data: { questionId, userId: session.user.id, answer },
  });
}
