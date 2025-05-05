import inquirer from "inquirer";

async function inquireProjectName() {
  const { name } = await inquirer.prompt([
    {
      type: "input",
      name: "name",
      message: "Enter project name",
      validate: (input: string) =>
        input.trim() !== "" ? true : "Project name cannot be empty",
    },
  ]);
  return name;
}

export { inquireProjectName };
