# Migration `20200623222646-init`

This migration has been generated at 6/23/2020, 10:26:46 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
PRAGMA foreign_keys=OFF;

CREATE TABLE "quaint"."User" (
"gameId" TEXT   ,"id" TEXT NOT NULL  ,"name" TEXT NOT NULL  ,
    PRIMARY KEY ("id"),FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE SET NULL ON UPDATE CASCADE)

CREATE TABLE "quaint"."Game" (
"id" TEXT NOT NULL  ,"name" TEXT NOT NULL  ,
    PRIMARY KEY ("id"))

PRAGMA "quaint".foreign_key_check;

PRAGMA foreign_keys=ON;
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration ..20200623222646-init
--- datamodel.dml
+++ datamodel.dml
@@ -1,0 +1,19 @@
+datasource db {
+  provider = "sqlite"
+  url      = env("DATABASE_URL")
+}
+
+generator client {
+  provider = "prisma-client-js"
+}
+
+model User {
+  id    String  @id @default(uuid())
+  name  String
+}
+
+model Game {
+  id    String  @id @default(uuid())
+  users User[]
+  name  String
+}
```


