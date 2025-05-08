import * as process from "process";
import fs from "fs";
import { inquireNextjsLibrary } from "../../inquirer/prompts/inquire-nextjs-library.js";

import { NextJsLibrary, ProjectType } from "../../enums/index.js";
import { IProjectHandler } from "../interfaces/index.js";

import {
  DOCKER_COMPOSE_CONTENT,
  DATABASE_URL_ENV,
} from "../../templates/docker/index.js";

import {
  PRISMA_SCHEMA_CONTENT,
  PRISMA_SEEDER_CONTENT,
  PRISMA_CLIENT_CONTENT,
} from "../../templates/prisma/index.js";

import { executeCommand } from "../../utils/index.js";
import { Logger } from "../../utils/index.js";
import path from "path";

export class NextJsProjectHandler implements IProjectHandler {
  readonly type = ProjectType.NEXT_JS;

  private projectPath = "";
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
    this.projectPath = projectPath;
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
      await this.generatePrismaSchema();
      await this.generatePrismaSeeder();
      await this.generatePrismaClient();
      await this.updatePackageJson();
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

  private async generatePrismaSchema() {
    try {
      await fs.promises.writeFile(
        "prisma/schema.prisma",
        PRISMA_SCHEMA_CONTENT
      );
      this.logger.success("Created 'prisma/schema.prisma'");
    } catch (error) {
      console.error("Failed to create 'prisma/schema.prisma':", error);
      throw error;
    }
  }

  private async generatePrismaSeeder() {
    try {
      await fs.promises.writeFile("prisma/seed.ts", PRISMA_SEEDER_CONTENT);
      this.logger.success("Created 'prisma/seed.ts'");
    } catch (error) {
      console.error("Failed to create 'prisma/seed.ts':", error);
      throw error;
    }
  }

  private async generatePrismaClient() {
    try {
      await executeCommand("mkdir", ["src/lib"]);
      await fs.promises.writeFile("src/lib/prisma.ts", PRISMA_CLIENT_CONTENT);
      this.logger.success(
        "Created 'src/lib/prisma.ts' (Prisma client wrapper)"
      );
    } catch (error) {
      console.error("Failed to create 'lib/prisma.ts':", error);
      throw error;
    }
  }

  private async updatePackageJson() {
    try {
      const packageJsonPath = path.join(this.projectPath, "package.json");

      const raw = await fs.promises.readFile(packageJsonPath, "utf-8");
      const pkg = JSON.parse(raw);

      pkg.prisma = {
        ...(pkg.prisma || {}),
        seed: "tsx prisma/seed.ts",
      };

      await fs.promises.writeFile(
        packageJsonPath,
        JSON.stringify(pkg, null, 2) + "\n"
      );

      this.logger.success("Updated 'package.json' with Prisma seed script");
    } catch (error) {
      console.error("Failed to update 'package.json':", error);
      throw error;
    }
  }

  private async setupDockerCompose() {
    try {
      await fs.promises.writeFile("docker-compose.yml", DOCKER_COMPOSE_CONTENT);
      this.logger.success("Created 'docker-compose.yml'");
    } catch (error) {
      console.error("Failed to create 'docker-compose.yml':", error);
      throw error;
    }
  }

  private async updateEnv() {
    try {
      await fs.promises.writeFile(".env", DATABASE_URL_ENV);
      this.logger.success("Created '.env' with DATABASE_URL");
    } catch (error) {
      console.error("Failed to create '.env':", error);
      throw error;
    }
  }
}
