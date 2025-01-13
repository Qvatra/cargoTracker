# Cargo Tracker

A Vue.js application for tracking cargo shipments and managing ETAs.

## Features
- Create new shipments
- View registered shipments
- Check vessel ETAs
- Update shipment ETAs when discrepancies are found

## Technical Decisions

### API Layer
For this project, I chose to use the native Fetch API for simplicity and minimal dependencies. However, for larger, more complex projects, Axios would be more appropriate due to:
- Automatic request/response transformation
- Better error handling
- Request/response interceptors
- Request cancellation

### Vessel list
For simplicity, valid vessels are stored in a static TypeScript file (`vessels.ts`). In a production environment, this should be fetched from a backend API and paginated

### Possible Future Improvements
For production use, the following features should be implemented:
- Pagination for large shipment lists
- Filtering and sorting capabilities
- Batch ETA checking functionality to identify all discrepancies at once
- Automated periodic ETA checks
- Notification system for ETA discrepancies
- Export functionality for reports

### UI Framework
For this project, I chose to use only Tailwind CSS without a UI component framework like Vuetify. This decision was made for:
- Simplicity
- Quick prototyping capabilities
- Direct control over styling and components

However, for larger projects, a UI framework like Vuetify would be more appropriate due to:
- Pre-built accessible components
- Consistent design language
- Built-in responsive layouts
- Rich ecosystem of components
- Better maintainability at scale

### Testing
For this project's scope, I chose:
- Vitest for unit testing
- Cypress for end-to-end testing

For larger UI-rich projects, I would additionally recommend:
- Storybook for component development and documentation
- Chromatic for visual regression testing and UI review workflows

### Validation
For this project's scope and time constraints I use native HTML5 form validation instead of a more robust solution like Vuelidate. While Vuelidate would be more appropriate for larger projects due to its:
- More complex validation rules
- Custom error messages
- Cross-field validation
- Async validation support
- Better i18n support

### State Management
- Uses Pinia for state management as recommended by Vue developers

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
