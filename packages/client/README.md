This package contains the client portion of the News Threads application.

## Available Scripts

In the project directory, you can run:

### `pnpm start`

Runs the app in the development mode.<br>
Open [http://localhost:8080](http://localhost:8080) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

The running application expects a GraphQL API as defined in [config.json](./config/default.json).

### `pnpm bundle`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

## Deployment

The following section describes hosting the built output in Azure.

### Prerequisites

Setup Azure Storage for hosting static websites as described in [this article](https://docs.microsoft.com/en-us/azure/storage/blobs/storage-blob-static-website-how-to?tabs=azure-portal).

### Deploy

Run `pnpm deploy --storage-account '<storage-account-name>' --storage-account-key '<storage-account-key>'`

> **Note:** Need to run `pnpm bundle` before deploying.

#### Environment variables

Set the following system environment variables in order to deploy using environment variables.

- `AZURE_STORAGE_ACCOUNT` : The Azure Storage account name.
- `AZURE_STORAGE_ACCOUNT_KEY` : An access key to the Azure Storage account.

Run `pnpm deploy`.
