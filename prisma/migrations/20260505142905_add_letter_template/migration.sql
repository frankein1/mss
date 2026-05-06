-- CreateTable
CREATE TABLE "public"."letter_template" (
    "id" UUID NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "s3_key" TEXT,
    "structure_id" UUID NOT NULL,
    "created_by_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "letter_template_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."letter_template_content" (
    "id" UUID NOT NULL,
    "letter_template_id" UUID NOT NULL,
    "content" BYTEA NOT NULL,

    CONSTRAINT "letter_template_content_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "letter_template_content_letter_template_id_key" ON "public"."letter_template_content"("letter_template_id");

-- AddForeignKey
ALTER TABLE "public"."letter_template" ADD CONSTRAINT "letter_template_structure_id_fkey" FOREIGN KEY ("structure_id") REFERENCES "public"."structure"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."letter_template" ADD CONSTRAINT "letter_template_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "public"."user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."letter_template_content" ADD CONSTRAINT "letter_template_content_letter_template_id_fkey" FOREIGN KEY ("letter_template_id") REFERENCES "public"."letter_template"("id") ON DELETE CASCADE ON UPDATE CASCADE;
