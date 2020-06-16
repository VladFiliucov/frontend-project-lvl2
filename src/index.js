import commander from 'commander';

const { Command } = commander;

const program = new Command();

program.helpOption('-h, --help', 'output usage information');
program.version('0.0.1', '-v, --version', 'output the current version');

export default program;
