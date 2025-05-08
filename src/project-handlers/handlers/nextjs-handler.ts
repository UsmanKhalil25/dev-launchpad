import * as process from "process";
import fs from "fs";
import { inquireNextjsLibrary } from "../../inquirer/prompts/inquire-nextjs-library.js";

import { NextJsLibrary, ProjectType } from "../../enums/index.js";
import { IProjectHandler } from "../interfaces/index.js";

import {
  dockerComposeContent,
  databaseUrlEnv,
} from "../../templates/docker/index.js";

import { executeCommand } from "../../utils/index.js";
import { Logger } from "../../utils/index.js";

export class NextJsProjectHandler implements IProjectHandler {
  readonly type = ProjectType.NEXT_JS;

  private libraryChoices: NextJsLibrary[] = [];
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

    this.libraryChoices = await inquireNextjsLibrary();

    if (this.libraryChoices.length > 0) {
      await this.installLibraries();
    }
  }

  private async installLibraries() {
    if (
      this.isLibrarySelected(NextJsLibrary.PRISMA) ||
      this.isLibrarySelected(NextJsLibrary.PRISMA_DOCKER)
    ) {
      await this.installTsxDependency();
      await this.installPrismaDependencies();
      await this.initializePrisma();
    }

    if (this.isLibrarySelected(NextJsLibrary.PRISMA_DOCKER)) {
      await this.setupDockerCompose();
      await this.updateEnv();
    }
  }

  private isLibrarySelected(library: NextJsLibrary): boolean {
    return this.libraryChoices.includes(library);
  }

  private async installTsxDependency(): Promise<void> {
    try {
      this.logger.info("Installing tsx development dependency...");

      await executeCommand("npm", ["install", "tsx", "--save-dev"]);

      this.logger.success("tsx installed successfully");
    } catch (error) {
      this.logger.error("Failed to install tsx", error);
      throw error;
    }
  }

  private async installPrismaDependencies(): Promise<void> {
    try {
      this.logger.info("Installing Prisma dependencies...");

      await executeCommand("npm", ["install", "prisma", "--save-dev"]);
      await executeCommand("npm", ["install", "@prisma/extension-accelerate"]);

      this.logger.success("Prisma dependencies installed successfully");
    } catch (error) {
      this.logger.error("Failed to install Prisma dependencies", error);
      throw error;
    }
  }

  private async initializePrisma(): Promise<void> {
    try {
      this.logger.info("Initializing Prisma...");

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

  private async setupDockerCompose() {
    try {
      this.logger.info("Creating docker-compose file...");
      await fs.promises.writeFile("docker-compose.yml", dockerComposeContent);
      this.logger.success("docker-compose.yaml created successfully");
    } catch (error) {
      console.error("Failed to create docker-compose.yml:", error);
      throw error;
    }
  }

  private async updateEnv() {
    try {
      this.logger.info("Updating .env...");
      await fs.promises.writeFile(".env", databaseUrlEnv);
      this.logger.success(".env updated successfully");
    } catch (error) {
      console.error("Failed to create .env:", error);
      throw error;
    }
  }
}
