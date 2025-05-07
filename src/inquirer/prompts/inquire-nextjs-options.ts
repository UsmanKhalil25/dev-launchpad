import inquirer from "inquirer";
import { NextjsScaffoldOptions } from "../../enums/index.js";

async function inquireNextjsLibraryChoices() {
  const { selectedLibraries } = await inquirer.prompt({
    type: "checkbox",
    name: "selectedLibraries",
    message: "Select libraries to scaffold:",
    choices: [
      {
        name: "Prisma",
        value: NextjsScaffoldOptions.Prisma,
      },
      {
        name: "Prisma + Docker",
        value: NextjsScaffoldOptions.PrismaPlusDocker,
      },
      {
        name: "NextAuth",
        value: NextjsScaffoldOptions.NextAuth,
      },
      {
        name: "Tanstack Query",
        value: NextjsScaffoldOptions.TanstackQuery,
      },
    ],
  });

  console.log(selectedLibraries);
}

export { inquireNextjsLibraryChoices };
