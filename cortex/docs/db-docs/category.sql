CREATE TABLE "categories" (
  "id" INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  "uuid" UUID NOT NULL DEFAULT gen_random_uuid(),
  "slug" varchar UNIQUE NOT NULL,
  "label" varchar NOT NULL,
  "description" text,
  "created_by" integer NOT NULL,
  "approved_by" integer,
  "updated_by" integer,
  "deleted_by" integer,
  "created_at" timestamp NOT NULL DEFAULT (now()),
  "updated_at" timestamp NOT NULL DEFAULT (now()),
  "approved_at" timestamp,
  "deleted_at" timestamp,
  "status" varchar DEFAULT ('pending'),
  "meta" jsonb
);

CREATE TABLE "sub_categories" (
  "id" INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  "uuid" UUID NOT NULL DEFAULT gen_random_uuid(),
  "slug" varchar UNIQUE NOT NULL,
  "category_id" integer NOT NULL,
  "label" varchar NOT NULL,
  "description" text,
  "maintainer" varchar,
  "created_by" integer NOT NULL,
  "approved_by" integer,
  "updated_by" integer,
  "deleted_by" integer,
  "created_at" timestamp NOT NULL DEFAULT (now()),
  "updated_at" timestamp NOT NULL DEFAULT (now()),
  "approved_at" timestamp,
  "deleted_at" timestamp,
  "status" varchar DEFAULT ('pending'),
  "meta" jsonb
);