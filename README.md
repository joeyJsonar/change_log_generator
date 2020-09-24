# change_log_generator
`change_log_generator` automates the generation of change log.

# Requirements
Install `yarn` via this [instruction](https://classic.yarnpkg.com/en/docs/install/#centos-rc).

# How To Use
1. Generate a token [here](https://github.com/settings/tokens).
2. In the `config/default.json`, set `authorizationToken` with generated token.

## Setting Up Label
To categorized issues properly. We need to configure/list the labels associated with a category.
1. In `config/default.json`, set/change `labels.bug.labels` to the label you use in your repository. For us (SonarK), we use `bug :beetle:`.
2. In `labels.bug.displayName`, this determines the category section header that will be displayed for this category.

Repeat this for other category.

If you don't need the category, just have an empty `labels.<cat>.labels`.

## Running
To finally run,

```bash
yarn # Installs deps.
yarn build # Builds typescript to javascript.
yarn run generate-change-log
``` 
