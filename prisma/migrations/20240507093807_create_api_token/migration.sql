-- CreateTable
CREATE TABLE "api_token" (
    "id" UUID NOT NULL,
    "username" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expiration_date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "api_token_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "api_token_token_key" ON "api_token"("token");
