import path from "path"

import { inquireNextjsLibrary } from "../../../inquirer/prompts/inquire-nextjs-library.js";

import { NextJsLibrary, ProjectType } from "../../../enums/index.js";
import {
  ILibraryInstaller,
  IProjectHandler,
  IPostInstallationStep,
} from "../../interfaces/index.js";

import { PrismaInstaller, DockerInstaller } from "./libraries/index.js";

import { executeCommand, Logger } from "../../../utils/index.js";

export class NextJsProjectHandler implements IProjectHandler {
  readonly type = ProjectType.NEXT_JS;

  private projectPath = "";
  private libraryChoices: NextJsLibrary[] = [];
  private postInstallationSteps: IPostInstallationStep[] = [];
  private logger = new Logger("NextJsHandler");
  private libraryInstallers: Map<NextJsLibrary, ILibraryInstaller[]> =
    new Map();

  constructor() {
    this.registerInstallers();
  }

  async create(projectName: string): Promise<boolean> {
    const FLAGS = [
      "--ts",
      "--tailwind",
      "--eslint",
      "--app",
      "--api",
      "--src-dir",
      "--turbopack",
      "--import-alias", "@/*",
    ];

    const commandArgs = ["create-next-app@latest", projectName, ...FLAGS];

    try {
      this.logger.info(`Creating Next.js project: ${projectName}`);

      const exitCode = await executeCommand("npx", commandArgs, {
        stdio: "inherit",
      });

      if (exitCode !== 0) {
        this.logger.error("Failed to create Next.js project");
        return false;
      }

      this.logger.success("Next.js project created successfully");
      return true;
    } catch (error) {
      this.logger.error("An error occurred while creating the project:", error);
      return false;
    }
  }

  async postSetup(projectName: string): Promise<void> {

    this.projectPath = path.join(process.cwd(), projectName);
    process.chdir(this.projectPath);

    this.logger.info(
      `Running post-setup for Next.js project at: ${this.projectPath}`
    );
    this.libraryChoices = await inquireNextjsLibrary();

    if (this.libraryChoices.length > 0) {
      await this.installLibraries();
      this.logPostInstallationSteps();
    }
  }

  private registerInstallers(): void {
    this.libraryInstallers.set(NextJsLibrary.PRISMA, [new PrismaInstaller()]);
    this.libraryInstallers.set(NextJsLibrary.PRISMA_DOCKER, [
      new PrismaInstaller(),
      new DockerInstaller(),
    ]);
  }

  private async installLibraries(): Promise<void> {
    await this.installBaseDependencies();

    for (const library of this.libraryChoices) {
      const installers = this.libraryInstallers.get(library) ?? [];
      for (const installer of installers) {
        await installer.install(this.projectPath);

        if (typeof installer.postInstallationSteps === "function") {
          const steps = installer.postInstallationSteps();
          this.postInstallationSteps.push(...steps);
        }
      }
    }
  }

  private async installBaseDependencies(): Promise<void> {
    try {
      if (
        this.libraryChoices.some(
          (lib) =>
            lib === NextJsLibrary.PRISMA || lib === NextJsLibrary.PRISMA_DOCKER
        )
      ) {
        await this.installTsxDependency();
      }
    } catch (error) {
      this.logger.error("Failed to install base dependencies", error);
      throw error;
    }
  }

  private async installTsxDependency(): Promise<void> {
    try {
      this.logger.info("Installing tsx development dependency...");
      await executeCommand("npm", ["install", "tsx", "--save-dev"], {
        stdio: "ignore",
      });
      this.logger.success("tsx installed successfully");
    } catch (error) {
      this.logger.error("Failed to install tsx", error);
      throw error;
    }
  }

  private logPostInstallationSteps(): void {
    if (this.postInstallationSteps.length === 0) return;

    this.logger.info("📌 Post-installation steps:");

    this.postInstallationSteps.forEach((step) => {
      const commandStr = [step.command, ...step.args].join(" ");
      this.logger.info(`  • ${commandStr} → ${step.description}`);
    });
  }
}
