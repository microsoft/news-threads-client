## Available Commands

Commands are available through `yarn slurp <command>`.

```sh
> yarn slurp --help

Usage: index [options] [command]

Options:
  -V, --version                             output the version number
  -h, --help                                display help for command

Commands:
  buildSearchIndex [options] <dataset>
  cleanup [options] <dataset>               removes a specified file's records from the dataset
  dedupe [options] <file>                   eliminate row duplication in a file
  ingest [options] <dataset>                ingests a dataset
  precompute [options] <dataset>
  zip [options] <destination> <sources...>
  help [command]                            display help for command
```

> **Note:** Run `yarn build` once before running `yarn slurp` commands.

## Working with News-Threads Data

The rest of this document assumes one is working with data output from [News-Threads](https://github.com/microsoft/News-Threads) located in `~/news-data/<dataset>`. Specifically the following files

- documents.csv
- fragment_summaries.csv
- joined_cluster_labels.csv
- sentence_id_lookup.csv

## Precompute

Some metrics are precomputed using scripts from this package. Precomputes may move to the [News-Threads](https://github.com/microsoft/News-Threads) pipeline once the precompute metrics are locked in. The precompute command generates CSV files compatible with the ingest command.

With dataset files located in `~/news-data/<dataset>`, run the following precompute command.

```sh
> yarn slurp precompute <dataset> --stats terms,sentences
```

> **Note:** Use `--dataroot <directory>` option to specify a data directory other than the default location of `~/news-data/`. Run `yarn slurp <command> -- --help` for a full list of options.

## Ingest

`yarn slurp ingest <dataset>` uploads dataset files (`~/news-data/<dataset>`) to a [MongoDB](https://www.mongodb.com/) instance according to a schema. Schema files map CSV filenames and their columns to MongoDB document properties and indexes. See [config.python.json](config.python.json) for the default schema that works with [News-Threads](https://github.com/microsoft/News-Threads) datasets.

Run the following ingest command to upload `~/news-data/<dataset>` to a local MongoDB instance (mongodb://localhost:27017/).

```sh
> yarn slurp ingest <dataset> --schema ./config.python.json
```

> **Note:** Use `--dbUrl <dbUrl>` option to specify a MongoDB instance other than the default location of mongodb://localhost:27017/.
