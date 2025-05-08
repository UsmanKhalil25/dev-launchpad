import inquirer from "inquirer";
import { ProjectType } from "../../enums/index.js";

async function inquireProjectType(): Promise<ProjectType> {
  const { projectType } = await inquirer.prompt([
    {
      type: "list",
      name: "projectType",
      message: "Which type of project would you like to create?",
      choices: [
        {
          name: "Next.js",
          value: ProjectType.NEXT_JS,
        },
        {
          name: "TypeScript CLI",
          value: ProjectType.TS_CLI,
        },
      ],
    },
  ]);

  return projectType;
}

export { inquireProjectType };
