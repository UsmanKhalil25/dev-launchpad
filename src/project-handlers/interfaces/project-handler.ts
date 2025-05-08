import { ProjectType } from "../../enums/index.js";
import { Logger } from "../../utils/logger.js";

interface IProjectHandler {
  readonly type: ProjectType;
  create(projectName: string): Promise<boolean>;
  postSetup?(projectPath: string): Promise<void>;
}

export { IProjectHandler };
