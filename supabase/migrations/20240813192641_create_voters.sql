CREATE TABLE IF NOT EXISTS "public"."voters" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "email" "text",
    "cc" "int8" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);

ALTER TABLE "public"."voters" OWNER TO "postgres";