import path from "path";

function createProject(projectName: string):void {
    const projectPath = path.resolve(process.cwd(), projectName);
    console.log(`Project path ${projectPath}`);
    console.log("current working dir: ", process.cwd())
    console.log(`Creating project ${projectName}`);
}

export { createProject };
