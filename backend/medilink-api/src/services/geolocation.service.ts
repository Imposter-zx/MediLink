import { Injectable } from '@nestjs/common';

/**
 * Location coordinates
 */
export interface Location {
  latitude: number;
  longitude: number;
  timestamp?: Date;
  accuracy?: number; // meters
}

/**
 * Delivery location history
 */
export interface DeliveryLocation {
  deliveryId: string;
  locations: Location[];
  estimatedArrival?: Date;
  currentLocation?: Location;
}

/**
 * Geolocation & Delivery Optimization Service
 * Handles location tracking, distance calculations, and route optimization
 */
@Injectable()
export class GeolocationService {
  private deliveryLocations: Map<string, DeliveryLocation> = new Map();

  /**
   * Calculate distance between two coordinates (Haversine formula)
   */
  calculateDistance(from: Location, to: Location): number {
    const earthRadiusKm = 6371; // km

    const dLat = this.degreesToRadians(to.latitude - from.latitude);
    const dLon = this.degreesToRadians(to.longitude - from.longitude);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.degreesToRadians(from.latitude)) *
        Math.cos(this.degreesToRadians(to.latitude)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distanceKm = earthRadiusKm * c;

    return distanceKm; // Return in km
  }

  /**
   * Convert degrees to radians
   */
  private degreesToRadians(degrees: number): number {
    return (degrees * Math.PI) / 180;
  }

  /**
   * Calculate ETA based on distance and average speed
   */
  calculateETA(distance: number, averageSpeedKmh: number = 40): Date {
    const travelTimeMinutes = (distance / averageSpeedKmh) * 60;
    const eta = new Date();
    eta.setMinutes(eta.getMinutes() + Math.ceil(travelTimeMinutes));
    return eta;
  }

  /**
   * Start tracking delivery
   */
  async startTracking(deliveryId: string, currentLocation: Location): Promise<DeliveryLocation> {
    const tracking: DeliveryLocation = {
      deliveryId,
      locations: [currentLocation],
      currentLocation,
    };

    this.deliveryLocations.set(deliveryId, tracking);
    console.log(`📍 Started tracking delivery: ${deliveryId}`);

    return tracking;
  }

  /**
   * Update delivery location (real-time tracking)
   */
  async updateLocation(deliveryId: string, location: Location): Promise<DeliveryLocation> {
    let tracking = this.deliveryLocations.get(deliveryId);

    if (!tracking) {
      tracking = {
        deliveryId,
        locations: [],
      };
    }

    location.timestamp = new Date();
    tracking.locations.push(location);
    tracking.currentLocation = location;

    this.deliveryLocations.set(deliveryId, tracking);
    console.log(`📍 Updated location for delivery: ${deliveryId}`);

    return tracking;
  }

  /**
   * Get current delivery location
   */
  async getCurrentLocation(deliveryId: string): Promise<Location | null> {
    const tracking = this.deliveryLocations.get(deliveryId);
    return tracking?.currentLocation || null;
  }

  /**
   * Get delivery route history
   */
  async getRouteHistory(deliveryId: string): Promise<Location[]> {
    const tracking = this.deliveryLocations.get(deliveryId);
    return tracking?.locations || [];
  }

  /**
   * Calculate total distance traveled
   */
  async getTotalDistanceTraveled(deliveryId: string): Promise<number> {
    const tracking = this.deliveryLocations.get(deliveryId);
    if (!tracking || tracking.locations.length < 2) return 0;

    let totalDistance = 0;
    for (let i = 0; i < tracking.locations.length - 1; i++) {
      totalDistance += this.calculateDistance(tracking.locations[i], tracking.locations[i + 1]);
    }

    return totalDistance;
  }

  /**
   * Estimate delivery time based on current location and destination
   */
  async estimateDeliveryTime(currentLocation: Location, destination: Location, averageSpeedKmh?: number): Promise<{
    distanceKm: number;
    estimatedTimeMinutes: number;
    eta: Date;
  }> {
    const distance = this.calculateDistance(currentLocation, destination);
    const speed = averageSpeedKmh || 40; // Default 40 km/h
    const timeMinutes = (distance / speed) * 60;
    const eta = new Date();
    eta.setMinutes(eta.getMinutes() + Math.ceil(timeMinutes));

    return {
      distanceKm: distance,
      estimatedTimeMinutes: Math.ceil(timeMinutes),
      eta,
    };
  }

  /**
   * Find optimal route between multiple locations (simplified)
   * In production, use Google Maps API or similar
   */
  async optimizeRoute(locations: Location[]): Promise<Location[]> {
    if (locations.length <= 2) return locations;

    // Simple nearest-neighbor algorithm for route optimization
    const optimized: Location[] = [locations[0]];
    const remaining = locations.slice(1);

    while (remaining.length > 0) {
      const currentLocation = optimized[optimized.length - 1];
      let nearestIndex = 0;
      let nearestDistance = Infinity;

      for (let i = 0; i < remaining.length; i++) {
        const distance = this.calculateDistance(currentLocation, remaining[i]);
        if (distance < nearestDistance) {
          nearestDistance = distance;
          nearestIndex = i;
        }
      }

      optimized.push(remaining[nearestIndex]);
      remaining.splice(nearestIndex, 1);
    }

    return optimized;
  }

  /**
   * Check if delivery is within service area
   */
  async isWithinServiceArea(location: Location, centerLocation: Location, radiusKm: number = 25): Promise<boolean> {
    const distance = this.calculateDistance(location, centerLocation);
    return distance <= radiusKm;
  }

  /**
   * Get nearby delivery personnel (simplified - would use actual location data)
   */
  async getNearbyDrivers(location: Location, radiusKm: number = 5): Promise<Array<{ driverId: string; distance: number }>> {
    // This is a simplified example
    // In production, query database of active drivers
    return [];
  }

  /**
   * Calculate delivery fee based on distance
   */
  calculateDeliveryFee(distanceKm: number, baseFeeDollars: number = 5, perKmRate: number = 0.5): number {
    return baseFeeDollars + distanceKm * perKmRate;
  }

  /**
   * Estimate delivery window (time range)
   */
  async estimateDeliveryWindow(
    currentLocation: Location,
    destination: Location,
  ): Promise<{ earliest: Date; latest: Date }> {
    const { eta } = await this.estimateDeliveryTime(currentLocation, destination);

    const earliest = new Date(eta);
    earliest.setMinutes(earliest.getMinutes() - 10); // 10 min early

    const latest = new Date(eta);
    latest.setMinutes(latest.getMinutes() + 10); // 10 min late

    return { earliest, latest };
  }

  /**
   * Get delivery statistics
   */
  async getDeliveryStats(deliveryId: string): Promise<{
    totalDistance: number;
    averageSpeed: number;
    routePoints: number;
    duration: number;
  }> {
    const tracking = this.deliveryLocations.get(deliveryId);
    if (!tracking || tracking.locations.length < 2) {
      return { totalDistance: 0, averageSpeed: 0, routePoints: 0, duration: 0 };
    }

    const totalDistance = await this.getTotalDistanceTraveled(deliveryId);
    const firstLocation = tracking.locations[0];
    const lastLocation = tracking.locations[tracking.locations.length - 1];

    const durationMinutes =
      (lastLocation.timestamp!.getTime() - firstLocation.timestamp!.getTime()) / (1000 * 60);
    const durationHours = durationMinutes / 60;
    const averageSpeed = totalDistance / durationHours;

    return {
      totalDistance,
      averageSpeed,
      routePoints: tracking.locations.length,
      duration: Math.round(durationMinutes),
    };
  }
}
