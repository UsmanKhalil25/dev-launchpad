import { inquireNextjsLibrary } from "../../../inquirer/prompts/inquire-nextjs-library.js";

import { NextJsLibrary, ProjectType } from "../../../enums/index.js";
import { ILibraryInstaller, IProjectHandler } from "../../interfaces/index.js";

import { PrismaInstaller, DockerInstaller } from "./libraries/index.js";

import { executeCommand } from "../../../utils/index.js";
import { Logger } from "../../../utils/index.js";

export class NextJsProjectHandler implements IProjectHandler {
  readonly type = ProjectType.NEXT_JS;

  private projectPath = "";
  private libraryChoices: NextJsLibrary[] = [];
  private logger = new Logger("NextJsHandler");
  private libraryInstallers: Map<NextJsLibrary, ILibraryInstaller[]> =
    new Map();

  constructor() {
    this.registerInstallers();
  }

  private registerInstallers(): void {
    this.libraryInstallers.set(NextJsLibrary.PRISMA, [new PrismaInstaller()]);
    this.libraryInstallers.set(NextJsLibrary.PRISMA_DOCKER, [
      new PrismaInstaller(),
      new DockerInstaller(),
    ]);
  }

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

  private async installLibraries(): Promise<void> {
    // Install base dependencies that might be needed by multiple libraries
    await this.installBaseDependencies();

    // Install selected libraries
    for (const library of this.libraryChoices) {
      const installers = this.libraryInstallers.get(library) ?? [];
      for (const installer of installers) {
        await installer.install(this.projectPath);
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
      await executeCommand("npm", ["install", "tsx", "--save-dev"]);
      this.logger.success("tsx installed successfully");
    } catch (error) {
      this.logger.error("Failed to install tsx", error);
      throw error;
    }
  }
}
