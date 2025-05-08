const postgresConnectionUrl =
  "postgresql://postgres:postgres@localhost:5432/dev";
const databaseUrlEnv = `DATABASE_URL=${postgresConnectionUrl}`;

export { databaseUrlEnv };
