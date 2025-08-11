import PlacesAutocompleteTest from '@/components/GoogleMapsTest';

export default function TestPlacesAutocompletePage() {
  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Free Address Autocomplete Test
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            This page tests the free OpenStreetMap-based address autocomplete functionality. 
            No API keys or payments required!
          </p>
        </div>
        
        <PlacesAutocompleteTest />
        
        <div className="mt-8 max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
          <h2 className="text-xl font-bold text-gray-800 mb-4">About This Implementation</h2>
          <div className="text-sm text-gray-600 space-y-3">
            <div className="p-4 bg-green-50 rounded-lg">
              <h3 className="font-medium text-green-800 mb-2">✅ Free & Open Source</h3>
              <ul className="text-green-700 space-y-1">
                <li>• Uses OpenStreetMap's Nominatim API</li>
                <li>• No API key required</li>
                <li>• No usage limits or costs</li>
                <li>• Community-driven data</li>
              </ul>
            </div>
            
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="font-medium text-blue-800 mb-2">🔧 Technical Features</h3>
              <ul className="text-blue-700 space-y-1">
                <li>• Debounced search (300ms delay)</li>
                <li>• US address filtering</li>
                <li>• Keyboard navigation support</li>
                <li>• Responsive design</li>
                <li>• TypeScript support</li>
              </ul>
            </div>
            
            <div className="p-4 bg-yellow-50 rounded-lg">
              <h3 className="font-medium text-yellow-800 mb-2">⚠️ Usage Guidelines</h3>
              <ul className="text-yellow-700 space-y-1">
                <li>• Be respectful of the free service</li>
                <li>• Maximum 1 request per second</li>
                <li>• Include your application name in production</li>
                <li>• Consider caching for high-traffic sites</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 