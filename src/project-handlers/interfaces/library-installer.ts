import { IPostInstallationStep } from "./post-installation-step.js";

interface ILibraryInstaller {
  install(projectPath?: string): Promise<void>;
  postInstallationSteps(): IPostInstallationStep[];
}

export { ILibraryInstaller };
