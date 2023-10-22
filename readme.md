# GOTO Task - Phone Book
By: [Najim Rizky](https://najimr-izky.com)
## Project Overview
This project is a simple phone book application that can be used to store and retrieve contact information. This app is built using CRA (Create React App) PWA template and use apollo client as graphql client. This app use the combination of localsorage and graphql as the data source. If the data is not available in the localstorage, it will fetch the data from the graphql server. If the data is available in the localstorage, it will use the data from the localstorage and sync the data to the graphql server.
## How to run
1. Clone this repository
2. Run`npm install`
3. - Run`npm start` to run the app in development mode
   - Run`npm run build` to build the app for production
   - Run`npm run test` to run the test

## Tech Stack
- React
- Typescript
- Apollo Client
- Emotion
- Jest

## Folder Structure (src)
```
src
├── components (all components are placed here)
│   ├── atoms (basic components)
│   ├── molecules (components that consist of atoms)
│   ├── organisms (components that consist of molecules and atoms)
│   └── templates (components that consist of organisms, molecules, and atoms)
├── hooks (custom hooks)
├── icons (icons)
├── layouts (layout components)
├── pages (pages)
├── providers (context providers / HOC)
├── services (services)
├── styles (global styles)
├── tests (test files)
└── utils (utility functions)
```
## Preview URL
https://test-goto-najimrizky.vercel.app/