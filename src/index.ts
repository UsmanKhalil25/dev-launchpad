#!/usr/bin/env node

import { Command } from "commander";
import { createProject } from './commands/create';

const program = new Command();

program
    .name("dev-launchpad")
    .description("CLI that scaffolds a new project with best practices")
    .version("0.1.0");

program
    .command("create <project-name>")
    .description("Create a new project")
    .action((projectName) => {
        createProject(projectName);
    });

program.parse(process.argv);
