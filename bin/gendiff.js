#!/usr/bin/env node

import commander from 'commander';
import gendiff from '../src/index.js';

const { Command } = commander;

const program = new Command();

program.version('0.0.1', '-v, --version', 'output the current version');
program.description('Compares two configuration files and shows the difference.');
program.helpOption('-h, --help', 'output usage information');
program.option('-f, --format [type]', 'output format');
program.arguments('<filepath1> <filepath2>').action((filepath1, filepath2) => {
  console.log(gendiff(filepath1, filepath2));
});

program.parse(process.argv);
