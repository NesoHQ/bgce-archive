CREATE TABLE "categories" (
  "id" INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  "uuid" UUID NOT NULL DEFAULT gen_random_uuid(),
  "parent_id" INTEGER REFERENCES categories(id) ON DELETE CASCADE,
  "slug" VARCHAR UNIQUE NOT NULL,
  "label" VARCHAR NOT NULL,
  "description" TEXT,
  "maintainer" VARCHAR,
  "created_by" INTEGER NOT NULL,
  "approved_by" INTEGER,
  "updated_by" INTEGER,
  "deleted_by" INTEGER,
  "created_at" TIMESTAMP NOT NULL DEFAULT now(),
  "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
  "approved_at" TIMESTAMP,
  "deleted_at" TIMESTAMP,
  "status" VARCHAR DEFAULT 'pending',
  "meta" JSONB
);
