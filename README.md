# gathered

Gathered is a simple command line tool for organizing (and disorganizing) the files in a directory.

## Usage

Install the tool globally using

```
npm install -g gathered
```

Simply pass in the path to the folder to sort:

```
gather ./disorganized
```

The default strategy is to sort files according to extension. For other grouping strategies, peruse the [options](./docs/options.md).

You can also use the `ungather` command to unroll a set of subfolders into the main folder.

```
ungather ./nested
```

This will take files in the subfolders and move them to the main folder.

_NOTE_: By default, it will only unroll the first level of files. To return all the files nested deep, you can use the `--recursive=true` option.

The target folder can be changed with the `--target` option.
For more about the available command line options, peruse the [options](./docs/options.md).

## Development

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run source/index.ts
```

This project was created using `bun init` in bun v1.0.15. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.
