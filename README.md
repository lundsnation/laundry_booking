# Laundry Booking Project - Lunds Nation

This is a spare-time project to develop a fully functional web-service, where tenants at lund nation can book laundry
times reliably. It is a full-stack project, utilizing next.js and mongoDB. Project aims to finnish in late 2022.

## How to download

Download the example [or clone the repo](https://github.com/adicreson/laundry_booking.git):

cd into directory:

```sh
cd laundry_booking
```

Install it and run:

```sh
npm install
npm run dev
```

This will start a development server on your machine. Specifying mongoDB URI and AUTH0 tokens in .env file.

## The idea behind the example

The project uses [Next.js](https://github.com/vercel/next.js), which is a framework for server-rendered React apps.
It includes `@mui/material` and its peer dependencies, including `emotion`, the default style engine in MUI v5. If you
prefer, you can [use styled-components instead](https://mui.com/guides/interoperability/#styled-components).

# Ways of development

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

### Branch Conventions

There should be branches for each of the main categories listed in the 'Kanban Board' section above or in the projects
section of the repository. When working on a feature,
one should create a sub branch of the main branch.

Example: mainCategory/feature -> backend/api, where the feature/task should be found in the project section of the
repository.

### Git Commit Conventions

Git commits are allowed both in past and present tense.  
Example: Updated/Update README.md

## Good links and keywords for tutorials

https://mui.com/

Next js auth0
Next js mongoDB
React functional components
