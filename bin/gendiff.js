#!/usr/bin/env node

import commander from 'commander';
import { readFileSync } from 'fs';
import path from 'path';
import gendiff from '../index.js';

const { Command } = commander;

const program = new Command();

program.version('0.0.1', '-v, --version', 'output the current version');
program.description('Compares two configuration files and shows the difference.');
program.helpOption('-h, --help', 'output usage information');
program.option('-f, --format [type]', 'output format');
program.arguments('<filepath1> <filepath2>').action((filepath1, filepath2) => {
  const firstFileContent = readFileSync(path.resolve(filepath1), 'utf8');
  const secondFileContent = readFileSync(path.resolve(filepath2), 'utf8');

  const firstFileData = JSON.parse(firstFileContent);
  const secondFileData = JSON.parse(secondFileContent);

  gendiff(firstFileData, secondFileData);
});

program.parse(process.argv);
