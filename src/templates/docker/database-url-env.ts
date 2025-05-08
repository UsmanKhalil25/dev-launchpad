const postgresConnectionUrl =
  "postgresql://postgres:postgres@localhost:5432/dev";

const fileContent = `DATABASE_URL=${postgresConnectionUrl}`;

export { fileContent as DATABASE_URL_ENV };
