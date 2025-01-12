# Cargo Tracker

A Vue.js application for tracking cargo shipments and managing ETAs.

## Features
- Create new shipments
- View registered shipments
- Check vessel ETAs
- Update shipment ETAs when discrepancies are found

## Technical Decisions

### Form Validation
For this project's scope and time constraints, we chose to use native HTML5 form validation instead of a more robust solution like Vuelidate. While Vuelidate would be more appropriate for larger projects due to its:
- More complex validation rules
- Custom error messages
- Cross-field validation
- Async validation support
- Better i18n support

The native validation sufficiently handles our basic needs:
- Required fields
- Date validation (preventing past dates)
- Simple error messages

### State Management
- Uses Pinia for state management
- Follows Options API pattern for better maintainability
- Clear separation of concerns between components and store

## Project Setup

```sh
npm install
```

### Development Server

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
npm run test:unit
```

### Run End-to-End Tests with [Cypress](https://www.cypress.io/)

```sh
npm run test:e2e:dev
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```
