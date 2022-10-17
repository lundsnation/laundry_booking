# Next.js with TypeScript example

## How to use

Download the example [or clone the repo](https://github.com/mui/material-ui):

<!-- #default-branch-switch -->

```sh
curl https://codeload.github.com/mui/material-ui/tar.gz/master | tar -xz --strip=2  material-ui-master/examples/nextjs-with-typescript
cd nextjs-with-typescript
```

Install it and run:

```sh
npm install
npm run dev
```

or:

<!-- #default-branch-switch -->

[![Edit on StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/mui/material-ui/tree/master/examples/nextjs-with-typescript)

[![Edit on CodeSandbox](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/github/mui/material-ui/tree/master/examples/nextjs-with-typescript)

## The idea behind the example

The project uses [Next.js](https://github.com/vercel/next.js), which is a framework for server-rendered React apps.
It includes `@mui/material` and its peer dependencies, including `emotion`, the default style engine in MUI v5. If you prefer, you can [use styled-components instead](https://mui.com/guides/interoperability/#styled-components).

## The link component

Next.js has [a custom Link component](https://nextjs.org/docs/api-reference/next/link).
The example folder provides adapters for usage with MUI.
More information [in the documentation](https://mui.com/guides/routing/#next-js).

## Kanban Board
The kanban board is used to structure the work. There are **main categories**, which include category specific work. 
The main categories are:

*Frontend
*Backend
*Auth0
*Database
*Testing
*Other


The work for each category is divided into **subcategories**, which are:
*Backlog
*In progress
*Done

## Repository conventions
This heading and the following sub headings contain information regarding different types of naming conventions.

# Branch Conventions
There should be branches for each of the main categories listed in the 'Kanban Board' section above or in the projects section of the repository. When working on a feature,
one should create a sub branch of the main branch.

Example: mainCategory/feature -> backend/api, where the feature/task should be found in the project section of the repository.


# Git Commit Conventions
Git commits are allowed both in past and present tense.  
Example: Updated/Update README.md


## Good links and keywords for tutorials
https://mui.com/

Next js auth0
Next js mongoDB
React functional components