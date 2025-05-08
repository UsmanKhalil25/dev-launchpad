import { ProjectType } from "../enums/index.js";
import { IProjectHandler } from "./interfaces/index.js";
import { NextJsProjectHandler } from "./handlers/nextjs/nextjs-project-handler.js";

export class ProjectHandlerRegistry {
  private static handlers: Map<ProjectType, IProjectHandler> = new Map();

  static initialize(): void {
    this.registerHandler(new NextJsProjectHandler());
  }

  static registerHandler(handler: IProjectHandler): void {
    this.handlers.set(handler.type, handler);
  }

  static getHandler(type: ProjectType): IProjectHandler | undefined {
    return this.handlers.get(type);
  }
}

ProjectHandlerRegistry.initialize();
