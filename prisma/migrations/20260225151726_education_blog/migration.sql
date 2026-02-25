/*
  Warnings:

  - You are about to drop the column `sortOrder` on the `FileLibrary` table. All the data in the column will be lost.
  - You are about to drop the column `sortOrder` on the `ProductImage` table. All the data in the column will be lost.
  - You are about to drop the `BlogCategory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `BlogPost` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "BlogPost" DROP CONSTRAINT "BlogPost_categoryId_fkey";

-- AlterTable
ALTER TABLE "FileLibrary" DROP COLUMN "sortOrder",
ADD COLUMN     "order" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "ProductImage" DROP COLUMN "sortOrder",
ADD COLUMN     "order" INTEGER NOT NULL DEFAULT 0;

-- DropTable
DROP TABLE "BlogCategory";

-- DropTable
DROP TABLE "BlogPost";

-- CreateTable
CREATE TABLE "EducationCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EducationCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EducationPost" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "excerpt" TEXT,
    "content" TEXT NOT NULL,
    "coverImageUrl" TEXT,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "publishedAt" TIMESTAMP(3),
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "categoryId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EducationPost_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EducationCategory_slug_key" ON "EducationCategory"("slug");

-- CreateIndex
CREATE INDEX "EducationCategory_slug_idx" ON "EducationCategory"("slug");

-- CreateIndex
CREATE INDEX "EducationPost_categoryId_isPublished_publishedAt_idx" ON "EducationPost"("categoryId", "isPublished", "publishedAt");

-- CreateIndex
CREATE UNIQUE INDEX "EducationPost_categoryId_slug_key" ON "EducationPost"("categoryId", "slug");

-- AddForeignKey
ALTER TABLE "EducationPost" ADD CONSTRAINT "EducationPost_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "EducationCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;
