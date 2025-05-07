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
          value: ProjectType.NextJs,
        },
        {
          name: "TypeScript CLI",
          value: ProjectType.TypeScriptCli,
        },
      ],
    },
  ]);

  return projectType;
}

export { inquireProjectType };
