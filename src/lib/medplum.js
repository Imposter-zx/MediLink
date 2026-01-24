import { MedplumClient } from '@medplum/core';

// Initialize the MedplumClient
export const medplum = new MedplumClient({
  baseUrl: import.meta.env.VITE_MEDPLUM_BASE_URL || 'https://api.medplum.com/',
  projectId: import.meta.env.VITE_MEDPLUM_PROJECT_ID,
});
