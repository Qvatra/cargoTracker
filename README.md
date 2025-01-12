# Cargo Tracker

A web interface for customer service agents to manage shipments.

## Features

- Register new shipments with customer, vessel, and ETA
- View list of all registered shipments
- Check vessel ETAs against shipment ETAs
- Update shipment ETAs when discrepancies are found

## Technical Decisions

- Used Vue 3 with TypeScript for type safety and better developer experience
- Implemented Pinia for state management
- Split components for better maintainability
- Used Tailwind CSS for simplicity and fast styling
- Native fetch API for simplicity

## Project Setup

```bash
npm install
npm run dev
```

## Testing

```bash
npm run test:unit
```
