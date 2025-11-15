# Tripdashboard

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.3.5.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

```
Tripdashboard
├─ .angular
├─ .editorconfig
├─ angular.json
├─ package-lock.json
├─ package.json
├─ public
│  └─ favicon.ico
├─ README.md
├─ src
│  ├─ app
│  │  ├─ app.config.server.ts
│  │  ├─ app.config.ts
│  │  ├─ app.css
│  │  ├─ app.html
│  │  ├─ app.routes.server.ts
│  │  ├─ app.routes.ts
│  │  ├─ app.spec.ts
│  │  ├─ app.ts
│  │  ├─ comp
│  │  │  ├─ dashborad.comp
│  │  │  │  ├─ dashboard.comp.css
│  │  │  │  ├─ dashboard.comp.html
│  │  │  │  ├─ dashboard.comp.spec.ts
│  │  │  │  └─ dashboard.comp.ts
│  │  │  ├─ driver.comp
│  │  │  │  ├─ driver.comp.css
│  │  │  │  ├─ driver.comp.html
│  │  │  │  ├─ driver.comp.spec.ts
│  │  │  │  └─ driver.comp.ts
│  │  │  ├─ login
│  │  │  ├─ login.comp
│  │  │  │  ├─ login.comp.css
│  │  │  │  ├─ login.comp.html
│  │  │  │  ├─ login.comp.spec.ts
│  │  │  │  └─ login.comp.ts
│  │  │  ├─ logincomp
│  │  │  ├─ trip.comp
│  │  │  │  ├─ trip.comp.css
│  │  │  │  ├─ trip.comp.html
│  │  │  │  ├─ trip.comp.spec.ts
│  │  │  │  └─ trip.comp.ts
│  │  │  └─ vehicle.comp
│  │  │     ├─ vehicle.comp.css
│  │  │     ├─ vehicle.comp.html
│  │  │     ├─ vehicle.comp.spec.ts
│  │  │     └─ vehicle.comp.ts
│  │  ├─ gaurds
│  │  │  ├─ dispatcherguard.ts
│  │  │  └─ driverguard.ts
│  │  ├─ interceptors
│  │  │  └─ authinterceptor.ts
│  │  ├─ models
│  │  │  ├─ drivermodels.ts
│  │  │  ├─ tripmodel.ts
│  │  │  └─ vehiclemodel.ts
│  │  ├─ services
│  │  │  ├─ authservice.spec.ts
│  │  │  ├─ authservice.ts
│  │  │  ├─ driverservice.spec.ts
│  │  │  ├─ driverservice.ts
│  │  │  ├─ tripservice.spec.ts
│  │  │  ├─ tripservice.ts
│  │  │  ├─ vehicleservice.spec.ts
│  │  │  └─ vehicleservice.ts
│  │  ├─ trips.spec.ts
│  │  └─ trips.ts
│  ├─ index.html
│  ├─ main.server.ts
│  ├─ main.ts
│  ├─ server.ts
│  └─ styles.css
├─ tsconfig.app.json
├─ tsconfig.json
└─ tsconfig.spec.json

```