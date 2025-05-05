import * as path from "path";
import * as process from "process";
import { ProjectType } from "../../types/project-type.js";
import { executeCommand } from "../../utils/execute-command.js";
import {
  inquireProjectName,
  inquireProjectType,
} from "../../inquirer/prompts/index.js";

interface ProjectHandler {
  create(projectName: string): Promise<boolean>;
  postSetup?(projectPath: string): Promise<void>;
}

class NextJsProjectHandler implements ProjectHandler {
  async create(projectName: string): Promise<boolean> {
    const code = await executeCommand("npx", [
      "create-next-app@latest",
      projectName,
    ]);

    if (code !== 0) {
      console.error("There was an error while creating Next.js project");
      return false;
    }

    return true;
  }

  async postSetup(projectPath: string): Promise<void> {
    process.chdir(projectPath);

    await this.installDependencies();
    await this.initializePrisma();

    console.log(`Successfully set up Next.js project at: ${projectPath}`);
  }

  private async installDependencies(): Promise<void> {
    console.log("Installing dependencies...");
    await executeCommand("npm", ["install", "prisma", "--save-dev"]);
    await executeCommand("npm", ["install", "tsx", "--save-dev"]);
    await executeCommand("npm", ["install", "@prisma/extension-accelerate"]);
  }

  private async initializePrisma(): Promise<void> {
    console.log("Initializing Prisma...");
    await executeCommand("npx", [
      "prisma",
      "init",
      "--output",
      "../src/app/generated/prisma",
    ]);
  }
}

class TypeScriptCliProjectHandler implements ProjectHandler {
  async create(projectName: string): Promise<boolean> {
    console.log(`Creating a TypeScript CLI project: ${projectName}`);
    return true;
  }

  async postSetup(projectPath: string): Promise<void> {
    console.log(
      `Successfully set up TypeScript CLI project at: ${projectPath}`
    );
  }
}

function getProjectHandler(projectType: ProjectType): ProjectHandler {
  switch (projectType) {
    case ProjectType.NextJs:
      return new NextJsProjectHandler();
    case ProjectType.TypeScriptCli:
      return new TypeScriptCliProjectHandler();
    default:
      throw new Error(`Unsupported project type: ${projectType}`);
  }
}

async function initProject(projectName: string) {
  if (!projectName) {
    projectName = await inquireProjectName();
  }

  const projectType: ProjectType = await inquireProjectType();

  try {
    const handler = getProjectHandler(projectType);

    const success = await handler.create(projectName);

    if (success && handler.postSetup) {
      const projectPath = path.join(process.cwd(), projectName);
      await handler.postSetup(projectPath);
    }
  } catch (error) {
    console.error(`Failed to initialize project: ${error}`);
  }
}

export { initProject };
