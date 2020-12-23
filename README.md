[![Maintainability](https://api.codeclimate.com/v1/badges/a99a88d28ad37a79dbf6/maintainability)](https://codeclimate.com/github/VladFiliucov/frontend-project-lvl2)
[![Test Coverage](https://api.codeclimate.com/v1/badges/9342f5e640a6c0131db4/test_coverage)](https://codeclimate.com/github/VladFiliucov/frontend-project-lvl2/test_coverage)
[![](https://github.com/vladfiliucov/frontend-project-lvl2/workflows/CI/badge.svg)](https://github.com/VladFiliucov/frontend-project-lvl2/actions)

## Description:

`gendiff` is a CLI tool to compare `json` and `yaml` files. Primarily intended to be used with configuration files.

## Installation:

Make sure you are running on node 14.

```
git clone git@github.com:VladFiliucov/frontend-project-lvl2.git
cd frontend-project-lvl2
make install

# And to install globaly after
make install_global
```

## Usage:

```
gendiff [options] <filepath1> <filepath2>
```

### Options:

```
  -v, --version        output the current version
  -f, --format [type]  output format
  -h, --help           output usage information
```

### Examples:

Basic:
```

gendiff path/to/config.yml path/to/updated_config.yml

```

Plain format:
```

gendiff path/to/config.json path/to/updated_config.json --format=plain

```

### More visual examples

JSON support:

[![asciicast](https://asciinema.org/a/iBIbLaQWo33WiSNAvLS3xxbvd.svg)](https://asciinema.org/a/iBIbLaQWo33WiSNAvLS3xxbvd?autoplay=1&theme=solarized-light)

YAML support:

[![asciicast](https://asciinema.org/a/5yeHN4PlmPlxbsnnciW4TvWrm.svg)](https://asciinema.org/a/5yeHN4PlmPlxbsnnciW4TvWrm?autoplay=1&theme=solarized-light)

Supports nested objects

[![asciicast](https://asciinema.org/a/hSqEVGxKA0n8YEpafgQfRKi25.svg)](https://asciinema.org/a/hSqEVGxKA0n8YEpafgQfRKi25?autoplay=1&theme=solarized-light)

Plain format:

[![asciicast](https://asciinema.org/a/euVAg6g9aojnnTAVqJxMuMmtC.svg)](https://asciinema.org/a/euVAg6g9aojnnTAVqJxMuMmtC?autoplay=1&theme=solarized-light)

Raw JSON format (usefull for debugging purposes)

[![asciicast](https://asciinema.org/a/o7dlexZZ8pp3ftLUAoQJmy4aw.svg)](https://asciinema.org/a/o7dlexZZ8pp3ftLUAoQJmy4aw)
