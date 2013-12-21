# code-sanity

Sanity check of a code directory, crossing project directories with GitHub
repositories. Displays a table summarizing the status of each project: local
directory, local Git repository, GitHub repository.

## Usage

Installation:

    $ npm install git+https://github.com/Roman2K/code-sanity -g

Configuration (use `examples/sources.json` as an example):

    $ vim ~/.code-sanity.json

Run with:

    $ code-sanity ~/.code-sanity.json

## Example output

![Example output](https://raw.github.com/Roman2K/code-sanity/master/examples/output.png)
