import fs from "fs";
import path from "path";

import {
  ILibraryInstaller,
  IPostInstallationStep,
} from "../../../interfaces/index.js";

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
    this.logger.info("Setting up Prisma...");

    await this.installDependencies();
    await this.initializePrisma();
    await this.generatePrismaSchema();
    await this.generatePrismaSeeder();
    await this.updatePackageJson(projectPath);

    this.logger.success("Prisma setup completed");
  }

  private async installDependencies(): Promise<void> {
    try {
      this.logger.info("Installing Prisma dependencies...");
      await executeCommand("npm", ["install", "prisma", "--save-dev"], {
        stdio: "ignore",
      });
      await executeCommand("npm", ["install", "@prisma/extension-accelerate"], {
        stdio: "ignore",
      });
      this.logger.success("Prisma dependencies installed successfully");
    } catch (error) {
      this.logger.error("Failed to install Prisma dependencies", error);
      throw error;
    }
  }

  private async initializePrisma(): Promise<void> {
    const libraryName = "Prisma";
    try {
      this.logger.info(`Initializing ${libraryName} ...`);
      await executeCommand(
        "npx",
        ["prisma", "init", "--output", this.prismaOutputPath],
        { stdio: "ignore" }
      );
      this.logger.success(`${libraryName} initialized successfully`);
    } catch (error) {
      this.logger.error(`Failed to initialize ${libraryName}`, error);
      throw error;
    }
  }

  private async generatePrismaSchema(): Promise<void> {
    const filePath = path.join("prisma", "schema.prisma");
    try {
      await fs.promises.appendFile(filePath, PRISMA_SCHEMA_CONTENT);
      this.logger.success(`Created '${filePath}'`);
    } catch (error) {
      this.logger.error(`Failed to create '${filePath}'`, error);
      throw error;
    }
  }

  private async generatePrismaSeeder(): Promise<void> {
    const filePath = path.join("prisma", "seed.ts");
    try {
      await fs.promises.writeFile(
        filePath,
        PRISMA_SEEDER_CONTENT(this.prismaOutputPath)
      );
      this.logger.success(`Created '${filePath}'`);
    } catch (error) {
      this.logger.error(`Failed to create '${filePath}'`, error);
      throw error;
    }
  }

  private async updatePackageJson(projectPath: string): Promise<void> {
    const file = "package.json";
    try {
      const packageJsonPath = path.join(projectPath, file);
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

      this.logger.success(`Updated '${file}' with Prisma seed script`);
    } catch (error) {
      this.logger.error(`Failed to update '${file}'`, error);
      throw error;
    }
  }

  postInstallationSteps(): IPostInstallationStep[] {
    return [
      {
        command: "npx",
        args: ["prisma", "migrate", "dev", "--name", "init"],
        description: "Run the initial migration to set up your database schema",
      },
      {
        command: "npx",
        args: ["prisma", "db", "seed"],
        description:
          "Populate the database with seed data defined in 'prisma/seed.ts'",
      },
    ];
  }
}

export { PrismaInstaller };
