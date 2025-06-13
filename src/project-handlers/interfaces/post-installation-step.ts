interface IPostInstallationStep {
  command: string;
  args: string[];
  description: string;
}

export { IPostInstallationStep };
