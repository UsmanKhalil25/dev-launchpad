import fs from "fs";
import path from "path";

import { ILibraryInstaller } from "../../../interfaces/library-installer.js";

import {
  executeCommand,
  Logger,
  isDirectory,
} from "../../../../utils/index.js";

import {
  PRISMA_SCHEMA_CONTENT,
  PRISMA_SEEDER_CONTENT,
} from "../../../../templates/prisma/index.js";

class PrismaInstaller implements ILibraryInstaller {
  private logger = new Logger("PrismaInstaller");

  get prismaOutputPath(): string {
    const suffix = "app/generated/prisma";
    return isDirectory("src") ? `../src/${suffix}` : `../${suffix}`;
  }

  async install(projectPath: string): Promise<void> {
    try {
      this.logger.info("Setting up Prisma...");

      await this.installDependencies();
      await this.initializePrisma();
      await this.generatePrismaSchema();
      await this.generatePrismaSeeder();
      await this.updatePackageJson(projectPath);

      this.logger.success("Prisma setup completed");
    } catch (error) {
      this.logger.error("Failed to set up Prisma", error);
      throw error;
    }
  }

  private async installDependencies(): Promise<void> {
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
        this.prismaOutputPath,
      ]);
      this.logger.success("Prisma initialized successfully");
    } catch (error) {
      this.logger.error("Failed to initialize Prisma", error);
      throw error;
    }
  }

  private async generatePrismaSchema(): Promise<void> {
    try {
      await fs.promises.appendFile(
        "prisma/schema.prisma",
        PRISMA_SCHEMA_CONTENT
      );
      this.logger.success("Created 'prisma/schema.prisma'");
    } catch (error) {
      this.logger.error("Failed to create 'prisma/schema.prisma'", error);
      throw error;
    }
  }

  private async generatePrismaSeeder(): Promise<void> {
    try {
      await fs.promises.writeFile(
        "prisma/seed.ts",
        PRISMA_SEEDER_CONTENT(this.prismaOutputPath)
      );
      this.logger.success("Created 'prisma/seed.ts'");
    } catch (error) {
      this.logger.error("Failed to create 'prisma/seed.ts'", error);
      throw error;
    }
  }

  private async updatePackageJson(projectPath: string): Promise<void> {
    try {
      const packageJsonPath = path.join(projectPath, "package.json");
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
      this.logger.error("Failed to update 'package.json'", error);
      throw error;
    }
  }
}

export { PrismaInstaller };
