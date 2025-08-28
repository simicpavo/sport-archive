/*
  Warnings:

  - You are about to drop the column `created_at` on the `Club` table. All the data in the column will be lost.
  - You are about to drop the column `sport_id` on the `Club` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `Club` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `Competition` table. All the data in the column will be lost.
  - You are about to drop the column `end_date` on the `Competition` table. All the data in the column will be lost.
  - You are about to drop the column `sport_id` on the `Competition` table. All the data in the column will be lost.
  - You are about to drop the column `start_date` on the `Competition` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `Competition` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `ContentType` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `ContentType` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `NationalTeam` table. All the data in the column will be lost.
  - You are about to drop the column `sport_id` on the `NationalTeam` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `NationalTeam` table. All the data in the column will be lost.
  - You are about to drop the column `birth_date` on the `Person` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `Person` table. All the data in the column will be lost.
  - You are about to drop the column `first_name` on the `Person` table. All the data in the column will be lost.
  - You are about to drop the column `last_name` on the `Person` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `Person` table. All the data in the column will be lost.
  - You are about to drop the column `competition_id` on the `Record` table. All the data in the column will be lost.
  - You are about to drop the column `content_type_id` on the `Record` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `Record` table. All the data in the column will be lost.
  - You are about to drop the column `national_team_id` on the `Record` table. All the data in the column will be lost.
  - You are about to drop the column `sport_id` on the `Record` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `Record` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `Sport` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `Sport` table. All the data in the column will be lost.
  - Added the required column `sportId` to the `Club` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Club` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sportId` to the `Competition` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Competition` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `ContentType` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sportId` to the `NationalTeam` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `NationalTeam` table without a default value. This is not possible if the table is not empty.
  - Added the required column `birthDate` to the `Person` table without a default value. This is not possible if the table is not empty.
  - Added the required column `firstName` to the `Person` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `Person` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Person` table without a default value. This is not possible if the table is not empty.
  - Added the required column `contentTypeId` to the `Record` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sportId` to the `Record` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Record` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Sport` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Club" DROP CONSTRAINT "Club_sport_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."Competition" DROP CONSTRAINT "Competition_sport_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."NationalTeam" DROP CONSTRAINT "NationalTeam_sport_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."Record" DROP CONSTRAINT "Record_competition_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."Record" DROP CONSTRAINT "Record_content_type_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."Record" DROP CONSTRAINT "Record_national_team_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."Record" DROP CONSTRAINT "Record_sport_id_fkey";

-- AlterTable
ALTER TABLE "public"."Club"
  RENAME COLUMN "created_at" TO "createdAt";
ALTER TABLE "public"."Club"
  RENAME COLUMN "sport_id" TO "sportId";
ALTER TABLE "public"."Club"
  RENAME COLUMN "updated_at" TO "updatedAt";

-- AlterTable
ALTER TABLE "public"."Competition"
  RENAME COLUMN "created_at" TO "createdAt";
ALTER TABLE "public"."Competition"
  RENAME COLUMN "end_date" TO "endDate";
ALTER TABLE "public"."Competition"
  RENAME COLUMN "sport_id" TO "sportId";
ALTER TABLE "public"."Competition"
  RENAME COLUMN "start_date" TO "startDate";
ALTER TABLE "public"."Competition"
  RENAME COLUMN "updated_at" TO "updatedAt";

-- AlterTable
ALTER TABLE "public"."ContentType"
  RENAME COLUMN "created_at" TO "createdAt";
ALTER TABLE "public"."ContentType"
  RENAME COLUMN "updated_at" TO "updatedAt";

-- AlterTable
ALTER TABLE "public"."NationalTeam"
  RENAME COLUMN "created_at" TO "createdAt";
ALTER TABLE "public"."NationalTeam"
  RENAME COLUMN "sport_id" TO "sportId";
ALTER TABLE "public"."NationalTeam"
  RENAME COLUMN "updated_at" TO "updatedAt";

-- AlterTable
ALTER TABLE "public"."Person"
  RENAME COLUMN "birth_date" TO "birthDate";
ALTER TABLE "public"."Person"
  RENAME COLUMN "created_at" TO "createdAt";
ALTER TABLE "public"."Person"
  RENAME COLUMN "first_name" TO "firstName";
ALTER TABLE "public"."Person"
  RENAME COLUMN "last_name" TO "lastName";
ALTER TABLE "public"."Person"
  RENAME COLUMN "updated_at" TO "updatedAt";

-- AlterTable
ALTER TABLE "public"."Record"
  RENAME COLUMN "competition_id" TO "competitionId";
ALTER TABLE "public"."Record"
  RENAME COLUMN "content_type_id" TO "contentTypeId";
ALTER TABLE "public"."Record"
  RENAME COLUMN "created_at" TO "createdAt";
ALTER TABLE "public"."Record"
  RENAME COLUMN "national_team_id" TO "nationalTeamId";
ALTER TABLE "public"."Record"
  RENAME COLUMN "sport_id" TO "sportId";
ALTER TABLE "public"."Record"
  RENAME COLUMN "updated_at" TO "updatedAt";

-- AlterTable
ALTER TABLE "public"."Sport"
  RENAME COLUMN "created_at" TO "createdAt";
ALTER TABLE "public"."Sport"
  RENAME COLUMN "updated_at" TO "updatedAt";

-- AddForeignKey
ALTER TABLE "public"."Club" ADD CONSTRAINT "Club_sportId_fkey" FOREIGN KEY ("sportId") REFERENCES "public"."Sport"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."NationalTeam" ADD CONSTRAINT "NationalTeam_sportId_fkey" FOREIGN KEY ("sportId") REFERENCES "public"."Sport"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Competition" ADD CONSTRAINT "Competition_sportId_fkey" FOREIGN KEY ("sportId") REFERENCES "public"."Sport"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Record" ADD CONSTRAINT "Record_sportId_fkey" FOREIGN KEY ("sportId") REFERENCES "public"."Sport"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Record" ADD CONSTRAINT "Record_contentTypeId_fkey" FOREIGN KEY ("contentTypeId") REFERENCES "public"."ContentType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Record" ADD CONSTRAINT "Record_competitionId_fkey" FOREIGN KEY ("competitionId") REFERENCES "public"."Competition"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Record" ADD CONSTRAINT "Record_nationalTeamId_fkey" FOREIGN KEY ("nationalTeamId") REFERENCES "public"."NationalTeam"("id") ON DELETE SET NULL ON UPDATE CASCADE;
