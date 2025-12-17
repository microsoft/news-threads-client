**This repository is the result of research efforts that are no longer active. It has been marked read-only on GitHub to preserve the public code, but is no longer maintained or accepting contributions.** 

![CI](https://github.com/microsoft/news-threads-client/workflows/CI/badge.svg)

# Introduction

News Threads Client is a web application for exploring and tracing news provenance across time over a collection of documents. This project can ingest and analyze data produced by the [News-Threads](https://github.com/microsoft/News-Threads) data pipeline.

[News Provenance research](https://www.microsoft.com/en-us/research/publication/news-provenance-revealing-news-text-reuse-at-web-scale-in-an-augmented-news-search-experience/)

# Getting Started

## Prerequisites

- [**Node**](https://nodejs.org) (check `package.json::engines` for version details)
- [**Yarn**](https://yarnpkg.com)
- [**MongoDB**](https://mongodb.com)
- [**Azure CLI**](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli?view=azure-cli-latest)
- [**Azure Functions Core**](https://github.com/Azure/azure-functions-core-tools)

## Data Ingestion

The scripts package provides commands for ingesting data produced by [News-Threads](https://github.com/microsoft/News-Threads). See [packages/scripts](packages/scripts/README.md) for more information and instructions.

## Configuration

By default, the Azure Function API will run on port `7071` and connect to a local MongoDB instance, `mongodb://localhost:27017/`. Default configuration settings can be changed by updating `packages/<package>/config/default.json`. Alternatively, default configuration settings can be overwritten by adding `local-<NODE_ENV>.json` configuration files to the corresponding config directory.

## Startup

```sh
> yarn # --ignore-engines (if azure has an issue with node version)
> yarn start
```

The webapp will be available at http://localhost:8080

# Contributing

This project welcomes contributions and suggestions. Most contributions require you to agree to a
Contributor License Agreement (CLA) declaring that you have the right to, and actually do, grant us
the rights to use your contribution. For details, visit https://cla.opensource.microsoft.com.

When you submit a pull request, a CLA bot will automatically determine whether you need to provide
a CLA and decorate the PR appropriately (e.g., status check, comment). Follow the instructions
provided by the bot. You will only need to do this once across all repos using our CLA.

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/).
For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or
contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.
