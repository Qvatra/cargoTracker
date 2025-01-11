/**
 * Valid vessel names
 * Hardcoded here as per assignment specification for demonstration purposes.
 */
export const VALID_VESSELS = [
  'CMA-CGM-CONCORDE',
  'CMA-CGM-JEAN-MERMOZ', 
  'COSCO-SHIPPING-GALAXY',
  'COSCO-SHIPPING-GEMINI',
  'EVER-GENIUS',
  'EVER-GENTLE',
  'HMM-COPENHAGEN',
  'HMM-DUBLIN',
  'MARSEILLE-MAERSK',
  'MONACO-MAERSK',
  'OOCL-GERMANY',
  'OOCL-INDONESIA'
] as const 

// Type for valid vessel names
export type ValidVessel = typeof VALID_VESSELS[number] 