interface ILibraryInstaller {
  install(projectPath: string): Promise<void>;
}

export { ILibraryInstaller };
