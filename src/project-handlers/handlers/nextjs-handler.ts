import * as process from "process";
import { ProjectType } from "../../enums/index.js";
import { IProjectHandler } from "../interfaces/index.js";
import { executeCommand } from "../../utils/index.js";
import { Logger } from "../../utils/index.js";

export class NextJsProjectHandler implements IProjectHandler {
  readonly type = ProjectType.NextJs;

  private logger = new Logger("NextJsHandler");

  async create(projectName: string): Promise<boolean> {
    this.logger.info(`Creating Next.js project: ${projectName}`);

    const code = await executeCommand("npx", [
      "create-next-app@latest",
      projectName,
    ]);

    if (code !== 0) {
      this.logger.error("There was an error while creating Next.js project");
      return false;
    }

    this.logger.success(`Next.js project created successfully`);
    return true;
  }

  async postSetup(projectPath: string): Promise<void> {
    this.logger.info(
      `Running post-setup for Next.js project at: ${projectPath}`
    );
    process.chdir(projectPath);

    await this.installDependencies();
    await this.initializePrisma();

    this.logger.success(`Successfully set up prisma at: ${projectPath}`);
  }

  private async installDependencies(): Promise<void> {
    this.logger.info("Installing dependencies...");

    try {
      await executeCommand("npm", ["install", "prisma", "--save-dev"]);
      await executeCommand("npm", ["install", "tsx", "--save-dev"]);
      await executeCommand("npm", ["install", "@prisma/extension-accelerate"]);
      this.logger.success("Dependencies installed successfully");
    } catch (error) {
      this.logger.error("Failed to install dependencies", error);
      throw error;
    }
  }

  private async initializePrisma(): Promise<void> {
    this.logger.info("Initializing Prisma...");

    try {
      await executeCommand("npx", [
        "prisma",
        "init",
        "--output",
        "../src/app/generated/prisma",
      ]);
      this.logger.success("Prisma initialized successfully");
    } catch (error) {
      this.logger.error("Failed to initialize Prisma", error);
      throw error;
    }
  }
}
