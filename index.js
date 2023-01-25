#!/usr/bin/env node

import chalk from 'chalk';
import path from 'path';
import { execSync } from "child_process";
import yargs from 'yargs/yargs';
import { hideBin } from 'yargs/helpers';
import appMapping from "./appMapping.js";

const runCommand = (command, { cwd }) => {
    cwd = cwd || ".";
    try {
        execSync(command, { stdio: 'inherit', cwd });
    } catch (error) {
        console.log(`Failed to execute command  ${command} `, error);
        return false;
    }
    return true;
}

const createApp = ({ name, chain }) => {
    console.log("create move app <%s> on [%s]", chalk.blue(name), chalk.green(chain));
    if (appMapping[chain]) {
        let { url, cwd, cmds, start } = appMapping[chain];
        console.log(chalk.green("clone from ", url));
        runCommand(`git clone ${url} ${name} `, {});
        cwd = path.join(name, cwd);
        for (let cmd of cmds) {
            console.log(cwd);
            runCommand(cmd, { cwd });
        }
        console.log(
            chalk.green("\n You app has been sucessfully created. Run following command to start app. \n")
        );
        console.log("\n")
        console.log(`cd ${cwd}`);
        console.log(`${start} `);

    } else {
        console.error(chalk.red("Sorry, no support for chain ", chain));
    }
}

yargs(hideBin(process.argv))
    .command('* [name]', 'create move app', (yargs) => {
        return yargs
            .positional('name', {
                describe: 'name for move app',
                default: "hellomove"
            })
    }, (argv) => {
        createApp({ ...argv })
    })
    .option('chain', {
        alias: 'c',
        type: 'string',
        description: 'Blockchain you want to run.',
        default: "aptos",
    })
    .parse();

