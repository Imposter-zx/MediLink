import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MedplumClient } from '@medplum/core';

/**
 * FHIR Service - Wrapper around Medplum client
 * Handles all FHIR resource operations with proper error handling
 */
@Injectable()
export class FhirService {
  private client: MedplumClient;

  constructor(private configService: ConfigService) {
    this.client = new MedplumClient({
      baseUrl: this.configService.get('MEDPLUM_BASE_URL'),
      clientId: this.configService.get('MEDPLUM_CLIENT_ID'),
      clientSecret: this.configService.get('MEDPLUM_CLIENT_SECRET'),
    });

    // Initialize authentication
    this.initialize();
  }

  private async initialize() {
    try {
      await this.client.startClientLogin(
        this.configService.get('MEDPLUM_CLIENT_ID'),
        this.configService.get('MEDPLUM_CLIENT_SECRET'),
      );
      console.log('✅ Connected to Medplum FHIR server');
    } catch (error) {
      console.error('❌ Failed to connect to Medplum:', error.message);
    }
  }

  /**
   * Get Medplum client instance
   */
  getClient(): MedplumClient {
    return this.client;
  }

  /**
   * Create a FHIR resource
   */
  async createResource<T>(resource: T): Promise<T> {
    return this.client.createResource(resource);
  }

  /**
   * Read a FHIR resource
   */
  async readResource<T>(resourceType: string, id: string): Promise<T> {
    return this.client.readResource(resourceType, id);
  }

  /**
   * Update a FHIR resource
   */
  async updateResource<T>(resource: T): Promise<T> {
    return this.client.updateResource(resource);
  }

  /**
   * Search FHIR resources
   */
  async searchResources<T>(resourceType: string, query: any): Promise<T[]> {
    const bundle = await this.client.searchResources(resourceType, query);
    return bundle as T[];
  }

  /**
   * Delete a FHIR resource
   */
  async deleteResource(resourceType: string, id: string): Promise<void> {
    await this.client.deleteResource(resourceType, id);
  }
}
