import inquirer from "inquirer";
import { NextJsLibrary } from "../../enums/index.js";

async function inquireNextjsLibrary(): Promise<NextJsLibrary[]> {
  const { selectedLibraries } = await inquirer.prompt({
    type: "checkbox",
    name: "selectedLibraries",
    message: "Select libraries to scaffold:",
    required: true,
    choices: [
      {
        name: "Prisma",
        value: NextJsLibrary.PRISMA,
      },
      {
        name: "Prisma + Docker",
        value: NextJsLibrary.PRISMA_DOCKER,
      },
    ],
  });

  return selectedLibraries;
}

export { inquireNextjsLibrary };
