-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "nim" TEXT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "password" TEXT NOT NULL,
    "plainPassword" TEXT,
    "role" TEXT NOT NULL DEFAULT 'POI',
    "hasVoted" BOOLEAN NOT NULL DEFAULT false,
    "votedForId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Candidate" (
    "id" TEXT NOT NULL,
    "candidateNumber" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "major" TEXT,
    "vision" TEXT NOT NULL,
    "mission" TEXT NOT NULL,
    "imageUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Candidate_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_nim_key" ON "User"("nim");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Candidate_candidateNumber_key" ON "Candidate"("candidateNumber");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_votedForId_fkey" FOREIGN KEY ("votedForId") REFERENCES "Candidate"("id") ON DELETE SET NULL ON UPDATE CASCADE;
