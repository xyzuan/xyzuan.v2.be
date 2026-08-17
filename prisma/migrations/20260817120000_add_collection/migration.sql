-- CreateEnum
CREATE TYPE "CollectionStore" AS ENUM ('SHOPEE', 'TOKOPEDIA');

-- CreateEnum
CREATE TYPE "CollectionCategory" AS ENUM ('GADGETS', 'BOOKS', 'TOOLS', 'WORKSPACE', 'SOFTWARE');

-- CreateTable
CREATE TABLE "Collection" (
    "id" SERIAL NOT NULL,
    "image" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "affiliateLink" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "storeName" "CollectionStore" NOT NULL,
    "category" "CollectionCategory" NOT NULL,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Collection_pkey" PRIMARY KEY ("id")
);
