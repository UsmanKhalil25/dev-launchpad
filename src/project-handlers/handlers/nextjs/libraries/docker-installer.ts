import fs from "fs";

import {
  ILibraryInstaller,
  IPostInstallationStep,
} from "../../../interfaces/index.js";

import { isFile, Logger } from "../../../../utils/index.js";

import {
  DOCKER_COMPOSE_CONTENT,
  DATABASE_URL_ENV,
} from "../../../../templates/docker/index.js";

class DockerInstaller implements ILibraryInstaller {
  private logger = new Logger("DockerInstaller");

  async install(): Promise<void> {
    this.logger.info("Setting up Docker");

    await this.setupDockerCompose();
    await this.updateEnv();

    this.logger.success("Docker setup completed");
  }

  private async setupDockerCompose(): Promise<void> {
    const file = "docker-compose.yml";
    try {
      if (isFile(file)) {
        this.logger.info(`'${file}' already exists. Skipping creation.`);
        return;
      }
      await fs.promises.writeFile(file, DOCKER_COMPOSE_CONTENT);
      this.logger.success(`Created '${file}'`);
    } catch (error) {
      this.logger.error(`Failed to create '${file}'`, error);
      throw error;
    }
  }

  private async updateEnv(): Promise<void> {
    const file = ".env";
    try {
      await fs.promises.writeFile(file, DATABASE_URL_ENV);
      this.logger.success(`Created '${file}' with DATABASE_URL`);
    } catch (error) {
      this.logger.error(`Failed to create '${file}'`, error);
      throw error;
    }
  }
  postInstallationSteps(): IPostInstallationStep[] {
    return [
      {
        command: "docker",
        args: ["compose", "up"],
        description: "Start the PostgreSQL container using Docker Compose",
      },
    ];
  }
}

export { DockerInstaller };
