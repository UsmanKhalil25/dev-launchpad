import fs from "fs";
import {
  ILibraryInstaller,
  IPostInstallationStep,
} from "../../../interfaces/index.js";

import { Logger } from "../../../../utils/logger.js";
class NextAuthInstaller implements ILibraryInstaller {
  private logger = new Logger("NextAuthInstaller");

  async install(projectPath?: string): Promise<void> {
    await this.setupAuthPages();
  }

  private async setupAuthPages(): Promise<void> {
    // TODO: make register and login form
    // make the see
  }

  postInstallationSteps(): IPostInstallationStep[] {
    return [];
  }
}
