import React, { useState } from 'react';
import { ChevronRight, Calendar, Info, Zap, ShieldCheck, DollarSign, Wrench, SlidersHorizontal, CheckCircle2, MapPin } from 'lucide-react';

const MARUTI_CARS = [
  // Under 10 Lakh
  { id: 'alto', name: 'Alto K10', price: 500000, priceStr: '₹5,00,000', budget: 'under-10lakh', match: '95%', img: 'https://images.unsplash.com/photo-1469285994282-454ceb49e63c?q=80&w=600&auto=format&fit=crop' },
  { id: 'swift', name: 'Swift', price: 800000, priceStr: '₹8,00,000', budget: 'under-10lakh', match: '98%', img: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=600&auto=format&fit=crop' },
  { id: 'wagonr', name: 'Wagon R', price: 650000, priceStr: '₹6,50,000', budget: 'under-10lakh', match: '90%', img: 'https://images.unsplash.com/photo-1542282088-fe8426682b8f?q=80&w=600&auto=format&fit=crop' },
  
  // 10L - 15L
  { id: 'brezza', name: 'Brezza', price: 1200000, priceStr: '₹12,00,000', budget: '10lakh-15lakh', match: '92%', img: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?q=80&w=600&auto=format&fit=crop' },
  { id: 'baleno', name: 'Baleno', price: 1100000, priceStr: '₹11,00,000', budget: '10lakh-15lakh', match: '96%', img: 'https://images.unsplash.com/photo-1518987048-93e29699e79a?q=80&w=600&auto=format&fit=crop' },
  
  // 15L - 20L
  { id: 'grand-vitara', name: 'Grand Vitara', price: 1800000, priceStr: '₹18,00,000', budget: '15lakh-20lakh', match: '90%', img: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=600&auto=format&fit=crop' },
  { id: 'xl6', name: 'XL6', price: 1600000, priceStr: '₹16,00,000', budget: '15lakh-20lakh', match: '88%', img: 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?q=80&w=600&auto=format&fit=crop' },
  
  // Above 20L
  { id: 'invicto', name: 'Invicto', price: 2800000, priceStr: '₹28,00,000', budget: 'over-20lakh', match: '85%', img: 'https://images.unsplash.com/photo-1632733711679-529326f6db12?q=80&w=600&auto=format&fit=crop' }, 
  { id: 'jimny', name: 'Jimny', price: 2100000, priceStr: '₹21,00,000', budget: 'over-20lakh', match: '82%', img: 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?q=80&w=600&auto=format&fit=crop' },
];

const DEALERS = [
  "Maruti Suzuki Arena, Connaught Place, New Delhi",
  "NEXA, Lower Parel, Mumbai",
  "Maruti Suzuki Arena, MG Road, Bengaluru",
  "NEXA, Jubilee Hills, Hyderabad"
];

export function CustomerDashboard() {
  const [budget, setBudget] = useState('10lakh-15lakh'); // Default 
  const [selectedCar, setSelectedCar] = useState(null);
  const [bookingState, setBookingState] = useState(null); // null -> 'booked'
  const [bookingDetails, setBookingDetails] = useState({ date: '', time: '', dealer: DEALERS[0] });

  const filteredCars = MARUTI_CARS.filter(car => car.budget === budget);

  // Helper to format currency
  const formatINR = (num) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(num);

  const handleSelectCar = (car) => {
    setSelectedCar(car);
    setBookingState(null); // reset booking if they change cars
  };

  const handleBookTestDrive = (e) => {
    e.preventDefault();
    if (bookingDetails.date && bookingDetails.time) {
      setBookingState('booked');
    }
  };

  return (
    <div className="dashboard-content animate-fade-in">
      
      {/* Budget & Filters */}
      <section className="dashboard-section flex flex-col sm:flex-row justify-between items-start sm:items-center bg-bg-tertiary p-4 rounded-xl border border-border-color">
         <div className="flex items-center gap-2 mb-3 sm:mb-0">
           <SlidersHorizontal size={20} className="text-accent-secondary" />
           <span className="font-semibold text-white">Your Vehicle Preferences</span>
         </div>
         
         <div className="flex items-center gap-3 w-full sm:w-auto">
            <label className="text-sm text-text-secondary whitespace-nowrap">Target Budget:</label>
            <select 
               value={budget}
               onChange={(e) => {
                 setBudget(e.target.value);
                 setSelectedCar(null); // Reset selection on budget change
               }}
               className="p-3 bg-bg-secondary border border-border-light rounded-md text-sm text-white focus:border-accent-primary outline-none w-full sm:w-auto transition cursor-pointer"
            >
               <option value="under-10lakh">Under ₹10 Lakhs</option>
               <option value="10lakh-15lakh">₹10 Lakhs - ₹15 Lakhs</option>
               <option value="15lakh-20lakh">₹15 Lakhs - ₹20 Lakhs</option>
               <option value="over-20lakh">Above ₹20 Lakhs</option>
            </select>
         </div>
      </section>

      {/* Personalized Recommendations */}
      <section className="dashboard-section">
        <h3 className="section-title"><Zap size={24} className="text-accent-primary" /> Maruti Suzuki Recommendations</h3>
        <p className="text-text-secondary text-sm mb-4">Select a vehicle below to view its ownership cost breakdown.</p>
        
        <div className="grid-3">
          {filteredCars.map((car) => {
            const isSelected = selectedCar?.id === car.id;
            return (
              <div 
                key={car.id} 
                className="car-card glass-panel cursor-pointer transition relative overflow-hidden"
                style={{
                  border: isSelected ? '2px solid var(--accent-primary)' : '1px solid var(--border-light)',
                  transform: isSelected ? 'translateY(-4px)' : 'none',
                  boxShadow: isSelected ? '0 12px 24px rgba(96,165,250,0.15)' : 'none'
                }}
                onClick={() => handleSelectCar(car)}
              >
                <div className="card-image-bg relative">
                  <img 
                    src={car.img} 
                    alt={car.name} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  {isSelected && (
                    <div className="absolute top-3 right-3 bg-accent-primary text-black rounded-full p-1 animate-fade-in shadow-lg">
                      <CheckCircle2 size={24} />
                    </div>
                  )}
                </div>
                <div className="card-body">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-lg">{car.name}</h4>
                    <span className="text-accent-primary font-bold text-lg">{car.priceStr}</span>
                  </div>
                  <p className="text-text-secondary text-sm mb-4">{car.match} match with your profile</p>
                  <div className="flex gap-2">
                    <button 
                      className={isSelected ? 'btn-primary flex-1 py-2' : 'btn-outline flex-1 py-2'}
                    >
                      {isSelected ? 'Selected' : 'Select Vehicle'}
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {selectedCar && (
        <div className="animate-fade-in">
          {/* EMI & Ownership Cost Breakdown */}
          <section className="dashboard-section mt-4">
            <h3 className="section-title"><DollarSign size={24} className="text-success" /> EMI & Ownership Cost: {selectedCar.name}</h3>
            <div className="grid-2">
              <div className="glass-panel p-6" style={{ padding: '1.5rem' }}>
                <h4 className="mb-4">Monthly Estimate</h4>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-text-secondary">Vehicle Price</span>
                  <span>{selectedCar.priceStr}</span>
                </div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-text-secondary">Down Payment (20%)</span>
                  <span className="text-success">-{formatINR(selectedCar.price * 0.2)}</span>
                </div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-text-secondary">Interest Rate (APR)</span>
                  <span>8.5%</span>
                </div>
                <div className="divider" style={{ width: '100%', height: '1px', marginBottom: '1rem' }}></div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold">Estimated EMI (60 mo)</span>
                  <span className="text-2xl text-accent-primary font-bold">
                    {formatINR((selectedCar.price * 0.8 * 1.42) / 60)}/mo
                  </span>
                </div>
              </div>
              
              <div className="glass-panel p-6" style={{ padding: '1.5rem' }}>
                <h4 className="mb-4">True Cost of Ownership</h4>
                <div className="flex items-center justify-between mb-4">
                  <span className="flex items-center gap-2 text-text-secondary"><ShieldCheck size={16} /> Insurance</span>
                  <span>₹3,500/mo</span>
                </div>
                <div className="flex items-center justify-between mb-4">
                  <span className="flex items-center gap-2 text-text-secondary"><Zap size={16} /> Fuel (Est.)</span>
                  <span>₹6,000/mo</span>
                </div>
                <div className="flex items-center justify-between mb-4">
                  <span className="flex items-center gap-2 text-text-secondary"><Wrench size={16} /> Maintenance</span>
                  <span>₹1,500/mo</span>
                </div>
                <div className="flex items-center justify-between mb-4 p-3 bg-bg-tertiary rounded" style={{ borderRadius: 'var(--radius-md)' }}>
                  <span>Extra Monthly Cost</span>
                  <span className="font-semibold text-lg">₹11,000/mo</span>
                </div>
              </div>
            </div>
          </section>

          {/* Service & Test Drive Row */}
          <div className="grid-2 mt-4">
            {/* Test Drive Booking */}
            <section className="dashboard-section">
              <h3 className="section-title"><Calendar size={24} className="text-accent-primary" /> Book a Test Drive</h3>
              <div className="glass-panel p-6" style={{ padding: '1.5rem', minHeight: '100%' }}>
                
                {bookingState === 'booked' ? (
                  <div className="flex flex-col items-center justify-center text-center h-full animate-fade-in py-4">
                    <CheckCircle2 size={48} className="text-success mb-3" />
                    <h4 className="text-xl font-bold mb-2">Test Drive Confirmed!</h4>
                    <p className="text-text-secondary mb-4">You have an appointment for the <span className="text-white font-semibold">{selectedCar.name}</span>.</p>
                    <div className="bg-bg-tertiary p-3 rounded-lg border border-border-light w-full text-left">
                      <p className="text-sm mb-1"><span className="text-text-secondary">Date:</span> {bookingDetails.date}</p>
                      <p className="text-sm mb-1"><span className="text-text-secondary">Time:</span> {bookingDetails.time}</p>
                      <p className="text-sm"><span className="text-text-secondary flex items-center gap-1 mt-2 mb-1"><MapPin size={14}/> Dealership:</span> {bookingDetails.dealer}</p>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleBookTestDrive} className="flex flex-col h-full animate-fade-in">
                    <p className="text-text-secondary mb-4">Experience the {selectedCar.name} firsthand. Select a preferred dealer and time.</p>
                    
                    <div className="mb-3">
                      <label className="block text-xs text-text-secondary mb-1">Select Dealership</label>
                      <select 
                        required
                        value={bookingDetails.dealer}
                        onChange={(e) => setBookingDetails({...bookingDetails, dealer: e.target.value})}
                        className="w-full p-3 bg-bg-tertiary border border-border-color rounded text-sm text-white outline-none focus:border-accent-primary transition appearance-none cursor-pointer"
                        style={{ borderRadius: 'var(--radius-sm)' }}
                      >
                        {DEALERS.map((d, i) => <option key={i} value={d}>{d}</option>)}
                      </select>
                    </div>

                    <div className="flex gap-2 mb-4">
                      <div className="flex-1">
                        <label className="block text-xs text-text-secondary mb-1">Date</label>
                        <input 
                          type="date" 
                          required
                          value={bookingDetails.date}
                          onChange={(e) => setBookingDetails({...bookingDetails, date: e.target.value})}
                          className="w-full p-3 bg-bg-tertiary border border-border-color rounded text-text-primary outline-none focus:border-accent-primary transition" style={{ borderRadius: 'var(--radius-sm)' }} 
                        />
                      </div>
                      <div className="flex-1">
                        <label className="block text-xs text-text-secondary mb-1">Time</label>
                        <input 
                          type="time" 
                          required
                          value={bookingDetails.time}
                          onChange={(e) => setBookingDetails({...bookingDetails, time: e.target.value})}
                          className="w-full p-3 bg-bg-tertiary border border-border-color rounded text-text-primary outline-none focus:border-accent-primary transition" style={{ borderRadius: 'var(--radius-sm)' }} 
                        />
                      </div>
                    </div>
                    
                    <div className="mt-auto pt-2">
                       <button type="submit" className="btn-primary w-full" style={{ padding: '0.875rem' }}>Confirm Booking</button>
                    </div>
                  </form>
                )}
              </div>
            </section>

            {/* Service Reminders */}
            <section className="dashboard-section">
              <h3 className="section-title"><Info size={24} className="text-warning" /> Service & Upgrades</h3>
              <div className="glass-panel p-6" style={{ padding: '1.5rem', minHeight: '100%' }}>
                <div className="flex items-center justify-between border-b pb-4 mb-4" style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <div>
                    <h4 className="flex items-center gap-2"><Wrench size={16} className="text-warning" /> Annual Inspection</h4>
                    <p className="text-text-secondary text-sm">Due in 15 days for your Current Vehicle</p>
                  </div>
                  <button className="btn-outline py-2 px-4" style={{ padding: '0.4rem 0.8rem' }}>Schedule</button>
                </div>
                
                <div className="bg-bg-tertiary p-4 rounded mt-4" style={{ borderRadius: 'var(--radius-md)' }}>
                  <h4 className="flex items-center gap-2 text-accent-secondary mb-1">🎁 Upgrade Opportunity</h4>
                  <p className="text-text-secondary text-sm mb-3">Your current vehicle retains high trade-in value. Upgrade to the {selectedCar.name} today!</p>
                  <button className="text-accent-primary text-sm font-semibold flex items-center gap-1 hover:text-white transition">Calculate Trade-in <ChevronRight size={14} /></button>
                </div>
              </div>
            </section>
          </div>
        </div>
      )}

    </div>
  );
}
