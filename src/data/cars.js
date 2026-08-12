// Vehicle catalog with attributes the recommendation engine actually scores against.
// Previously each car just had a hardcoded "match %" string with nothing behind it —
// this is the data the scoring in lib/recommend.js runs on instead.

export const MARUTI_CARS = [
  {
    id: 'alto', name: 'Alto K10', price: 500000, priceStr: '₹5,00,000',
    bodyType: 'hatchback', seats: 5, mileageKmpl: 24.9, fuelType: 'petrol',
    performance: 2, comfort: 2, features: 3, // 1-5 scale
    tags: ['city', 'first-car', 'budget'],
    img: 'https://images.unsplash.com/photo-1469285994282-454ceb49e63c?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: 'swift', name: 'Swift', price: 800000, priceStr: '₹8,00,000',
    bodyType: 'hatchback', seats: 5, mileageKmpl: 22.4, fuelType: 'petrol',
    performance: 4, comfort: 3, features: 4,
    tags: ['city', 'highway', 'enthusiast'],
    img: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: 'wagonr', name: 'Wagon R', price: 650000, priceStr: '₹6,50,000',
    bodyType: 'hatchback', seats: 5, mileageKmpl: 23.3, fuelType: 'cng',
    performance: 2, comfort: 4, features: 3,
    tags: ['city', 'family', 'economy'],
    img: 'https://images.unsplash.com/photo-1542282088-fe8426682b8f?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: 'brezza', name: 'Brezza', price: 1200000, priceStr: '₹12,00,000',
    bodyType: 'suv', seats: 5, mileageKmpl: 19.8, fuelType: 'petrol',
    performance: 4, comfort: 4, features: 5,
    tags: ['highway', 'family', 'suv-lifestyle'],
    img: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: 'baleno', name: 'Baleno', price: 1100000, priceStr: '₹11,00,000',
    bodyType: 'hatchback', seats: 5, mileageKmpl: 22.9, fuelType: 'petrol',
    performance: 4, comfort: 4, features: 5,
    tags: ['city', 'highway', 'tech-forward'],
    img: 'https://images.unsplash.com/photo-1518987048-93e29699e79a?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: 'grand-vitara', name: 'Grand Vitara', price: 1800000, priceStr: '₹18,00,000',
    bodyType: 'suv', seats: 5, mileageKmpl: 21.1, fuelType: 'hybrid',
    performance: 4, comfort: 5, features: 5,
    tags: ['highway', 'family', 'suv-lifestyle', 'eco'],
    img: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: 'xl6', name: 'XL6', price: 1600000, priceStr: '₹16,00,000',
    bodyType: 'mpv', seats: 6, mileageKmpl: 20.9, fuelType: 'petrol',
    performance: 3, comfort: 5, features: 4,
    tags: ['family', 'highway', 'large-family'],
    img: 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: 'invicto', name: 'Invicto', price: 2800000, priceStr: '₹28,00,000',
    bodyType: 'mpv', seats: 7, mileageKmpl: 23.2, fuelType: 'hybrid',
    performance: 4, comfort: 5, features: 5,
    tags: ['family', 'large-family', 'premium', 'eco'],
    img: 'https://images.unsplash.com/photo-1632733711679-529326f6db12?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: 'jimny', name: 'Jimny', price: 2100000, priceStr: '₹21,00,000',
    bodyType: 'suv', seats: 4, mileageKmpl: 16.4, fuelType: 'petrol',
    performance: 5, comfort: 3, features: 4,
    tags: ['offroad', 'enthusiast', 'weekend'],
    img: 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?q=80&w=600&auto=format&fit=crop',
  },
];

export const BUDGET_RANGES = {
  'under-10lakh': { min: 0, max: 1000000, label: 'Under ₹10 Lakhs' },
  '10lakh-15lakh': { min: 1000000, max: 1500000, label: '₹10L – ₹15L' },
  '15lakh-20lakh': { min: 1500000, max: 2000000, label: '₹15L – ₹20L' },
  'over-20lakh': { min: 2000000, max: Infinity, label: 'Above ₹20 Lakhs' },
};

export const USAGE_TYPES = {
  city: { label: 'Mostly city driving', favors: { mileageWeight: 1.2, performanceWeight: 0.6 } },
  highway: { label: 'Highway / long distance', favors: { mileageWeight: 0.7, performanceWeight: 1.3 } },
  mixed: { label: 'Mixed city & highway', favors: { mileageWeight: 1, performanceWeight: 1 } },
  offroad: { label: 'Off-road / adventure', favors: { mileageWeight: 0.5, performanceWeight: 1.4 } },
};

export const FUEL_PREFS = ['any', 'petrol', 'cng', 'hybrid'];

export const PRIORITIES = {
  economy: { label: 'Running cost', weights: { budget: 1.3, mileage: 1.4, comfort: 0.6, features: 0.6, performance: 0.6 } },
  space: { label: 'Space & comfort', weights: { budget: 1, mileage: 0.7, comfort: 1.5, features: 0.9, performance: 0.6 } },
  performance: { label: 'Performance', weights: { budget: 0.9, mileage: 0.6, comfort: 0.8, features: 0.8, performance: 1.6 } },
  features: { label: 'Tech & features', weights: { budget: 0.9, mileage: 0.7, comfort: 0.9, features: 1.6, performance: 0.7 } },
};
