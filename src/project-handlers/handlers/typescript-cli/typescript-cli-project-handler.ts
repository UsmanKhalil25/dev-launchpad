import fs from "fs";
import path from "path";

import { ProjectType } from "../../../enums/project-type.js";
import { IProjectHandler, IPostInstallationStep } from "../../interfaces/index.js";

import { executeCommand, Logger } from "../../../utils/index.js";

import {
  TS_CONFIG,
  SRC_INDEX,
  PACKAGE_JSON,
} from "../../../templates/typescript-cli/index.js";

export class TypescriptCliProjectHandler implements IProjectHandler {
  readonly type = ProjectType.TS_CLI;

  private projectPath = ""
  private logger = new Logger("TypescriptCliHandler");

  async create(projectName: string): Promise<boolean> {
    this.logger.info(`Creating TypeScript CLI project: ${projectName}`);

    try {
      fs.mkdirSync(projectName);
      process.chdir(projectName);

      this.logger.info("Creating package.json...");
      await this.createPackageJson(projectName);

      this.logger.success("TypeScript CLI project created successfully");
      return true;
    } catch (error) {
      this.logger.error("Failed to create TypeScript CLI project", error);
      return false;
    }
  }

  async postSetup(projectName: string): Promise<void> {
    this.projectPath = path.join(process.cwd(), projectName);
    this.logger.info(
      `Running post-setup for TypeScript CLI project at: ${this.projectPath}`
    );

    await this.installDependencies();
    await this.configureTypeScript();
    await this.createSourceFiles();

    this.logger.success(
      "TypeScript CLI project setup completed successfully"
    );

    this.logPostInstallationSteps();
  }

  private async createPackageJson(projectName: string): Promise<void> {
    const filePath = path.join("package.json");

    try {
      const packageJsonContent = PACKAGE_JSON.replace(/my-cli/g, projectName);
      await fs.promises.writeFile(filePath, packageJsonContent);
      this.logger.success(`Created '${filePath}'`);
    } catch (error) {
      this.logger.error(`Failed to create '${filePath}'`, error);
      throw error;
    }
  }

  private async installDependencies(): Promise<void> {
    try {
      this.logger.info("Installing dependencies...");

      const devDependencies = ["typescript", "ts-node", "@types/node"];

      const dependencies = ["commander"];

      await executeCommand(
        "npm",
        ["install", ...devDependencies, "--save-dev"],
        {
          stdio: "ignore",
        }
      );

      await executeCommand("npm", ["install", ...dependencies], {
        stdio: "ignore",
      });

      this.logger.success("Dependencies installed successfully");
    } catch (error) {
      this.logger.error("Failed to install dependencies", error);
      throw error;
    }
  }

  private async configureTypeScript(): Promise<void> {
    try {
      this.logger.info("Configuring TypeScript...");

      await executeCommand("npx", ["tsc", "--init"], {
        stdio: "ignore",
      });

      await this.updateTsConfigFile();

      this.logger.success("TypeScript configuration completed");
    } catch (error) {
      this.logger.error("Failed to configure TypeScript", error);
      throw error;
    }
  }

  private async updateTsConfigFile(): Promise<void> {
    const filePath = path.join("tsconfig.json");

    try {
      await fs.promises.writeFile(filePath, TS_CONFIG);
      this.logger.success(`Updated '${filePath}' with custom configuration`);
    } catch (error) {
      this.logger.error(`Failed to update '${filePath}'`, error);
      throw error;
    }
  }

  private async createSourceFiles(): Promise<void> {
    try {
      this.logger.info("Creating source files...");

      fs.mkdirSync("src", { recursive: true });

      await this.createIndexFile();

      this.logger.success("Source files created successfully");
    } catch (error) {
      this.logger.error("Failed to create source files", error);
      throw error;
    }
  }

  private async createIndexFile(): Promise<void> {
    const filePath = path.join("src", "index.ts");

    try {
      await fs.promises.writeFile(filePath, SRC_INDEX);
      this.logger.success(`Created '${filePath}'`);
    } catch (error) {
      this.logger.error(`Failed to create '${filePath}'`, error);
      throw error;
    }
  }
  private logPostInstallationSteps(): void {
    const postInstallationSteps: IPostInstallationStep[] = [
      {
        command: "npm",
        args: ["run", "build"],
        description: "Build the Typescript Cli",
      },
      {
        command: "npm",
        args: ["run", "start"],
        description: "Start the Typescript Cli",
      },
    ];

    this.logger.info("📌 Post-installation steps:");
    postInstallationSteps.forEach((step) => {
      const commandStr = [step.command, ...step.args].join(" ");
      this.logger.info(`  • ${commandStr} → ${step.description}`);
    });
  }
}

