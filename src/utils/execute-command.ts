import { spawn, SpawnOptions } from "child_process";

function executeCommand(
  command: string,
  args: string[],
  options: SpawnOptions = {}
): Promise<number> {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      shell: true,
      ...options,
    });

    child.on("close", (code) => {
      resolve(code ?? 0);
    });

    child.on("error", (error) => {
      reject(error);
    });
  });
}

export { executeCommand };
