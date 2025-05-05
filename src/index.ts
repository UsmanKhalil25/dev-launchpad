#!/usr/bin/env node

import { Command } from "commander";
import { initProject } from "./commander/actions/index.js";

const program = new Command();
program
  .argument("[project-name]", "Project name given by user")
  .action((projectName) => {
    initProject(projectName);
  });

program.parse(process.argv);
