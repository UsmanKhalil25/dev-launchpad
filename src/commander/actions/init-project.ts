import * as path from "path";
import * as process from "process";

import { ProjectType } from "../../enums/index.js";
import {
  inquireProjectName,
  inquireProjectType,
} from "../../inquirer/prompts/index.js";
import { ProjectHandlerRegistry } from "../../project-handlers/registery.js";

async function initProject(projectName: string) {
  if (!projectName) {
    projectName = await inquireProjectName();
  }

  const projectType: ProjectType = await inquireProjectType();

  try {
    const handler = ProjectHandlerRegistry.getHandler(projectType);

    if (!handler) {
      throw new Error(`No handler registered for project type: ${projectType}`);
    }

    const success = await handler.create(projectName);

    if (success && handler.postSetup) {
      const projectPath = path.join(process.cwd(), projectName);
      await handler.postSetup(projectPath);
    }
  } catch (error) {
    console.error(`Failed to initialize project:`, error);
    process.exit(1);
  }
}

export { initProject };
