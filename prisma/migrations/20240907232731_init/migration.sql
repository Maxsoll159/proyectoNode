-- CreateTable
CREATE TABLE "project" (
    "id" SERIAL NOT NULL,
    "projectName" VARCHAR NOT NULL,
    "clientName" VARCHAR NOT NULL,
    "description" VARCHAR NOT NULL,

    CONSTRAINT "project_pkey" PRIMARY KEY ("id")
);
