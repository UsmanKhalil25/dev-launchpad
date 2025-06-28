import { ProjectType } from "../../enums/index.js";

interface IProjectHandler {
  readonly type: ProjectType;
  create(projectName: string): Promise<boolean>;
  postSetup?(projectName: string): Promise<void>;
}

export { IProjectHandler };
