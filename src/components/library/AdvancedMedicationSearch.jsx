import React, { useState, useEffect } from 'react';

/**
 * Advanced Medication Search Component
 * Full-text search with filtering for conditions, side effects, price, ratings
 */
function AdvancedMedicationSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [medications, setMedications] = useState([]);
  const [filteredMedications, setFilteredMedications] = useState([]);
  const [loading, setLoading] = useState(false);

  // Filters
  const [filters, setFilters] = useState({
    condition: '',
    minRating: 0,
    maxPrice: 100,
    prescriptionRequired: null,
    genericAvailable: null,
    excludeSideEffects: [] as string[],
  });

  const [showFilters, setShowFilters] = useState(false);

  // Load medications on mount
  useEffect(() => {
    loadMedications();
  }, []);

  // Apply filters when search or filters change
  useEffect(() => {
    applyFilters();
  }, [searchQuery, filters, medications]);

  /**
   * Load all medications
   */
  const loadMedications = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/medications');
      const data = await response.json();
      setMedications(data);
    } catch (error) {
      console.error('Failed to load medications:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Apply search and filter logic
   */
  const applyFilters = () => {
    let results = [...medications];

    // Search by name
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter(
        m =>
          m.name.toLowerCase().includes(query) ||
          m.genericName.toLowerCase().includes(query) ||
          m.indication.toLowerCase().includes(query),
      );
    }

    // Filter by condition
    if (filters.condition) {
      results = results.filter(m => m.indication.toLowerCase().includes(filters.condition.toLowerCase()));
    }

    // Filter by rating
    if (filters.minRating > 0) {
      results = results.filter(m => m.rating >= filters.minRating);
    }

    // Filter by price
    results = results.filter(m => m.price <= filters.maxPrice);

    // Filter by prescription requirement
    if (filters.prescriptionRequired !== null) {
      results = results.filter(m => m.prescriptionRequired === filters.prescriptionRequired);
    }

    // Filter by generic availability
    if (filters.genericAvailable !== null) {
      results = results.filter(m => m.genericAvailable === filters.genericAvailable);
    }

    // Exclude medications with selected side effects
    if (filters.excludeSideEffects.length > 0) {
      results = results.filter(m => !m.sideEffects.some(se => filters.excludeSideEffects.includes(se)));
    }

    setFilteredMedications(results);
  };

  /**
   * Check for drug interactions
   */
  const checkInteractions = async (medicationIds: string[]) => {
    try {
      const response = await fetch('/api/medications/check-interactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ medicationIds }),
      });

      const data = await response.json();
      if (data.safe) {
        alert('✅ No interactions found between selected medications');
      } else {
        alert(`⚠️ Potential interactions found:\n${data.interactions.map((i: any) => `${i.medication1} + ${i.medication2}`).join('\n')}`);
      }
    } catch (error) {
      console.error('Failed to check interactions:', error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6">Medication Search</h2>

      {/* Search Bar */}
      <div className="mb-6 flex gap-2">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Search medications by name, condition, or indication..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
        >
          🔍 Filters {filters.condition || filters.minRating > 0 ? '✓' : ''}
        </button>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-gray-50 border rounded-lg p-6 mb-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {/* Condition */}
            <div>
              <label className="block text-sm font-semibold mb-2">Search by Condition</label>
              <input
                type="text"
                placeholder="e.g., Hypertension, Diabetes"
                value={filters.condition}
                onChange={e => setFilters({ ...filters, condition: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            {/* Price Range */}
            <div>
              <label className="block text-sm font-semibold mb-2">Max Price: ${filters.maxPrice.toFixed(2)}</label>
              <input
                type="range"
                min="0"
                max="500"
                value={filters.maxPrice}
                onChange={e => setFilters({ ...filters, maxPrice: parseFloat(e.target.value) })}
                className="w-full"
              />
            </div>

            {/* Rating */}
            <div>
              <label className="block text-sm font-semibold mb-2">Minimum Rating: {filters.minRating.toFixed(1)}</label>
              <input
                type="range"
                min="0"
                max="5"
                step="0.1"
                value={filters.minRating}
                onChange={e => setFilters({ ...filters, minRating: parseFloat(e.target.value) })}
                className="w-full"
              />
            </div>

            {/* Options */}
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.prescriptionRequired === false}
                  onChange={e =>
                    setFilters({
                      ...filters,
                      prescriptionRequired: e.target.checked ? false : null,
                    })
                  }
                  className="mr-2"
                />
                <span className="text-sm">Over-the-counter only</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.genericAvailable === true}
                  onChange={e =>
                    setFilters({
                      ...filters,
                      genericAvailable: e.target.checked ? true : null,
                    })
                  }
                  className="mr-2"
                />
                <span className="text-sm">Generic available</span>
              </label>
            </div>
          </div>

          <button
            onClick={() =>
              setFilters({
                condition: '',
                minRating: 0,
                maxPrice: 100,
                prescriptionRequired: null,
                genericAvailable: null,
                excludeSideEffects: [],
              })
            }
            className="text-sm text-blue-600 hover:underline"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Results */}
      <div className="space-y-4">
        <p className="text-gray-600">
          Found <strong>{filteredMedications.length}</strong> medications
        </p>

        {filteredMedications.map(medication => (
          <div key={medication.id} className="bg-white border rounded-lg p-4 shadow hover:shadow-lg transition">
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <h3 className="text-xl font-semibold">{medication.name}</h3>
                <p className="text-gray-600 text-sm">Generic: {medication.genericName}</p>
                <p className="text-gray-500 text-sm">Manufacturer: {medication.manufacturer}</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">${medication.price.toFixed(2)}</div>
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-yellow-500">★</span>
                  <span className="text-sm font-semibold">{medication.rating.toFixed(1)}</span>
                  <span className="text-gray-500 text-xs">({medication.reviews})</span>
                </div>
              </div>
            </div>

            {/* Info */}
            <div className="grid grid-cols-2 gap-3 text-sm mb-3">
              <div>
                <p className="text-gray-600">Indication:</p>
                <p className="font-semibold">{medication.indication}</p>
              </div>
              <div>
                <p className="text-gray-600">Drug Class:</p>
                <p className="font-semibold">{medication.drugClass}</p>
              </div>
            </div>

            {/* Side Effects */}
            {medication.sideEffects.length > 0 && (
              <div className="mb-3">
                <p className="text-gray-600 text-sm mb-1">Common Side Effects:</p>
                <div className="flex flex-wrap gap-1">
                  {medication.sideEffects.map(effect => (
                    <span key={effect} className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded">
                      {effect}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Warnings */}
            {medication.warnings.length > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded p-2 mb-3">
                <p className="text-amber-900 text-sm">
                  <strong>⚠️ Warnings:</strong> {medication.warnings.join(', ')}
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2">
              <button className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
                View Details
              </button>
              <button className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300">
                Compare Price
              </button>
            </div>
          </div>
        ))}

        {filteredMedications.length === 0 && !loading && (
          <div className="bg-gray-50 border rounded-lg p-8 text-center">
            <p className="text-gray-600 text-lg">No medications found matching your search.</p>
            <p className="text-gray-500 text-sm mt-2">Try different keywords or adjust your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdvancedMedicationSearch;
