import fs from "fs";

import { Logger } from "../../../../utils/index.js";

import {
  DOCKER_COMPOSE_CONTENT,
  DATABASE_URL_ENV,
} from "../../../../templates/docker/index.js";
import { PrismaInstaller } from "./prisma-installer.js";

class DockerInstaller extends PrismaInstaller {
  constructor() {
    super();
    this.logger = new Logger("DockerInstaller");
  }

  async install(projectPath: string): Promise<void> {
    try {
      this.logger.info("Setting up Docker for Prisma...");

      await super.install(projectPath);

      await this.setupDockerCompose();
      await this.updateEnv();

      this.logger.success("Docker setup completed");
    } catch (error) {
      this.logger.error("Failed to set up Docker", error);
      throw error;
    }
  }

  private async setupDockerCompose(): Promise<void> {
    try {
      await fs.promises.writeFile("docker-compose.yml", DOCKER_COMPOSE_CONTENT);
      this.logger.success("Created 'docker-compose.yml'");
    } catch (error) {
      this.logger.error("Failed to create 'docker-compose.yml'", error);
      throw error;
    }
  }

  private async updateEnv(): Promise<void> {
    try {
      await fs.promises.writeFile(".env", DATABASE_URL_ENV);
      this.logger.success("Created '.env' with DATABASE_URL");
    } catch (error) {
      this.logger.error("Failed to create '.env'", error);
      throw error;
    }
  }
}

export { DockerInstaller };
