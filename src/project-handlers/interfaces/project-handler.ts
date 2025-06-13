import { ProjectType } from "../../enums/index.js";

interface IProjectHandler {
  readonly type: ProjectType;
  create(projectName: string): Promise<boolean>;
  postSetup?(projectPath: string): Promise<void>;
}

export { IProjectHandler };
