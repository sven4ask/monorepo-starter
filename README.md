# NestJS Monorepo starter (with turborepo)

This is a starter project for a NestJS based backend. It's setup as a monorepo where packages can be shared over multiple services, which in turn can also be setup within the mono repo.

The starter includes:
- MongoDB connection
- JWT authentication
- GraphQL APIs
- Configuration using convict
- Logging using winston
- Testing using jest

## Getting started

Copy this repository to your own repository and start building your own backend. Replace the `@monorepo-starter` with your own project name.

Build all the packages and apps in the by running: `pnpm run build`

Now head of to the backend app and you can run: `pnpm run start`

## Roadmap

- Initialization script, to set your project name in the packages and apps
- Setup 2 seperate services, which are leveraging GraphQL federation
- Add Docker files and a kubernetes configuration to run the all the services.
