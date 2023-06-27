-- CreateTable
CREATE TABLE "cgu_history" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "version" TEXT NOT NULL,

    CONSTRAINT "cgu_history_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "cgu_history" ADD CONSTRAINT "cgu_history_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
