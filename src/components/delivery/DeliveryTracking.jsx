import React, { useState, useEffect } from 'react';

/**
 * Real-Time Delivery Tracking Component
 * Shows live driver location, ETA, and delivery status
 */
function DeliveryTracking() {
  const [deliveries, setDeliveries] = useState([]);
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [deliveryDetails, setDeliveryDetails] = useState(null);
  const [mapCenter, setMapCenter] = useState({ lat: 37.7749, lng: -122.4194 }); // San Francisco default
  const [loading, setLoading] = useState(false);

  // Load deliveries on mount
  useEffect(() => {
    loadDeliveries();
    // Refresh every 10 seconds
    const interval = setInterval(loadDeliveries, 10000);
    return () => clearInterval(interval);
  }, []);

  // Load delivery details when selected
  useEffect(() => {
    if (selectedDelivery) {
      loadDeliveryDetails(selectedDelivery);
    }
  }, [selectedDelivery]);

  /**
   * Load all deliveries
   */
  const loadDeliveries = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/delivery/my-deliveries');
      const data = await response.json();
      setDeliveries(data.sort((a, b) => {
        // Sort by status: in-transit first, then pending
        if (a.status === 'in_transit' && b.status !== 'in_transit') return -1;
        if (a.status !== 'in_transit' && b.status === 'in_transit') return 1;
        return 0;
      }));
    } catch (error) {
      console.error('Failed to load deliveries:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Load delivery details including location
   */
  const loadDeliveryDetails = async (deliveryId) => {
    try {
      const response = await fetch(`/api/delivery/${deliveryId}`);
      const data = await response.json();
      setDeliveryDetails(data);

      // Update map center to delivery location
      if (data.currentLocation) {
        setMapCenter({
          lat: data.currentLocation.latitude,
          lng: data.currentLocation.longitude,
        });
      }
    } catch (error) {
      console.error('Failed to load delivery details:', error);
    }
  };

  /**
   * Get status color and icon
   */
  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return { icon: '⏳', color: 'text-yellow-600', bg: 'bg-yellow-50' };
      case 'in_transit':
        return { icon: '🚚', color: 'text-blue-600', bg: 'bg-blue-50' };
      case 'delivered':
        return { icon: '✅', color: 'text-green-600', bg: 'bg-green-50' };
      case 'failed':
        return { icon: '❌', color: 'text-red-600', bg: 'bg-red-50' };
      default:
        return { icon: '📦', color: 'text-gray-600', bg: 'bg-gray-50' };
    }
  };

  /**
   * Calculate time difference
   */
  const getTimeUntilDelivery = (eta) => {
    if (!eta) return 'Unknown';
    const now = new Date();
    const etaDate = new Date(eta);
    const diff = Math.ceil((etaDate.getTime() - now.getTime()) / (1000 * 60)); // minutes

    if (diff < 0) return 'Should arrive soon';
    if (diff < 60) return `${diff} minutes`;
    const hours = Math.ceil(diff / 60);
    return `${hours} hour${hours > 1 ? 's' : ''}`;
  };

  const status = deliveryDetails ? getStatusIcon(deliveryDetails.status) : null;

   return (
     <div className="max-w-7xl mx-auto p-6">
       <h2 className="text-3xl font-bold mb-6">Prescription Deliveries</h2>
       {loading && (
         <div className="text-center py-8">
           <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
           <p className="text-gray-600">Loading deliveries...</p>
         </div>
       )}

      <div className="grid grid-cols-3 gap-6">
        {/* Deliveries List */}
        <div className="col-span-1">
          <h3 className="text-lg font-semibold mb-4">Your Deliveries</h3>

          {deliveries.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <p className="text-gray-600">No deliveries scheduled</p>
            </div>
          ) : (
            <div className="space-y-2">
              {deliveries.map(delivery => {
                const { icon, color } = getStatusIcon(delivery.status);
                const isSelected = selectedDelivery === delivery.id;

                return (
                  <div
                    key={delivery.id}
                    onClick={() => setSelectedDelivery(delivery.id)}
                    className={`p-4 rounded-lg border cursor-pointer transition ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50 shadow'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">{icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold truncate">{delivery.medicationName}</p>
                        <p className="text-sm text-gray-600">{delivery.pharmacy}</p>
                        <p className={`text-xs font-semibold mt-1 ${color}`}>
                          {delivery.status.replace('_', ' ').toUpperCase()}
                        </p>

                        {delivery.estimatedDelivery && (
                          <p className="text-xs text-gray-500 mt-1">
                            ETA: {new Date(delivery.estimatedDelivery).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Map and Details */}
        <div className="col-span-2">
          {selectedDelivery && deliveryDetails ? (
            <div className="space-y-4">
              {/* Map */}
              <div className="bg-white border rounded-lg overflow-hidden shadow">
                <div className="w-full h-64 bg-gray-100 flex items-center justify-center relative">
                  {/* Simple map representation */}
                  <div className="w-full h-full bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-4xl">🗺️</p>
                      <p className="text-sm text-gray-600 mt-2">
                        Map integration requires Google Maps/Mapbox API
                      </p>
                      <div className="mt-4 text-sm bg-white rounded p-3 text-gray-700">
                        <p>📍 {mapCenter.lat.toFixed(4)}, {mapCenter.lng.toFixed(4)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Delivery Details */}
              <div className={`border rounded-lg p-6 shadow ${status?.bg}`}>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-bold mb-2">{deliveryDetails.medicationName}</h3>
                    <p className="text-gray-600">Order #{deliveryDetails.id}</p>
                  </div>
                  <span className={`text-4xl ${status?.color}`}>{status?.icon}</span>
                </div>

                {/* Status Timeline */}
                <div className="mb-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-green-600"></div>
                      <div>
                        <p className="font-semibold">Confirmed</p>
                        <p className="text-sm text-gray-600">
                          {new Date(deliveryDetails.confirmedAt).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    {deliveryDetails.status === 'in_transit' && (
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-blue-600 animate-pulse"></div>
                        <div>
                          <p className="font-semibold">Out for Delivery</p>
                          <p className="text-sm text-gray-600">Driver is on the way</p>
                        </div>
                      </div>
                    )}

                    {deliveryDetails.status === 'delivered' && (
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-green-600"></div>
                        <div>
                          <p className="font-semibold">Delivered</p>
                          <p className="text-sm text-gray-600">
                            {new Date(deliveryDetails.deliveredAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Key Info */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-white rounded p-3 bg-opacity-60">
                    <p className="text-sm text-gray-600">Distance to You</p>
                    <p className="text-lg font-semibold">{deliveryDetails.distanceKm?.toFixed(1)} km</p>
                  </div>

                  <div className="bg-white rounded p-3 bg-opacity-60">
                    <p className="text-sm text-gray-600">Estimated Time</p>
                    <p className="text-lg font-semibold">{getTimeUntilDelivery(deliveryDetails.estimatedDelivery)}</p>
                  </div>

                  <div className="bg-white rounded p-3 bg-opacity-60">
                    <p className="text-sm text-gray-600">Delivery Fee</p>
                    <p className="text-lg font-semibold">${deliveryDetails.deliveryFee.toFixed(2)}</p>
                  </div>

                  <div className="bg-white rounded p-3 bg-opacity-60">
                    <p className="text-sm text-gray-600">Pharmacy</p>
                    <p className="text-lg font-semibold text-blue-600">{deliveryDetails.pharmacy}</p>
                  </div>
                </div>

                {/* Driver Info */}
                {deliveryDetails.status === 'in_transit' && deliveryDetails.driver && (
                  <div className="bg-white rounded-lg p-4 mb-6">
                    <h4 className="font-semibold mb-3">Your Driver</h4>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center text-xl">
                        👤
                      </div>
                      <div>
                        <p className="font-semibold">{deliveryDetails.driver.name}</p>
                        <p className="text-sm text-gray-600">Vehicle: {deliveryDetails.driver.vehicle}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Delivery Window */}
                <div className="bg-white rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Delivery Window</h4>
                  <p className="text-lg">
                    {new Date(deliveryDetails.deliveryWindowStart).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -{' '}
                    {new Date(deliveryDetails.deliveryWindowEnd).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 border rounded-lg p-12 text-center">
              <p className="text-gray-600 text-lg">Select a delivery to view tracking details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
export default DeliveryTracking;
