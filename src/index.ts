import { Command } from "commander";
import readline from "readline";

const program = new Command();

program
  .name("starter-cli")
  .description("A simple CLI using Commander.js")
  .version("1.0.0");

program
  .command("greet")
  .description("Greet the user")
  .action(() => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    rl.question("What is your name? ", (name) => {
      console.log(`Hello, ${name}!`);
      rl.close();
    });
  });

program.parse(process.argv);
