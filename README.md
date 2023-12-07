# gathered

Gathered is a simple command line tool for organizing the files in a directory.

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
