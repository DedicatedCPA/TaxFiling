import React, { useState, useMemo } from 'react';
import { stateFilingData } from '../data/stateFilingData';
import USMap from './USMap';
import StatesModal from './StatesModal';

const TaxFilingTool = () => {
  const [selectedStates, setSelectedStates] = useState([]);
  const [filingType, setFilingType] = useState('1120S');
  const [stateInput, setStateInput] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalStates, setModalStates] = useState([]);
  const [priceDetails, setPriceDetails] = useState(null);

  const basePrices = {
    '1120S': 500,
    '1065': 550,
    '1120': 700
  };

  // State name to abbreviation mapping
  const stateNameToAbbr = useMemo(() => {
    const mapping = {};
    Object.keys(stateFilingData).forEach(abbr => {
      mapping[stateFilingData[abbr].name.toLowerCase()] = abbr;
      mapping[abbr.toLowerCase()] = abbr;
    });
    return mapping;
  }, []);

  const addState = () => {
    const stateInputTrimmed = stateInput.trim();
    
    if (!stateInputTrimmed) return;
    
    let stateAbbr = null;
    
    // Check if it's an abbreviation
    if (stateNameToAbbr[stateInputTrimmed.toLowerCase()]) {
      stateAbbr = stateNameToAbbr[stateInputTrimmed.toLowerCase()];
    }
    
    if (stateAbbr && !selectedStates.includes(stateAbbr)) {
      setSelectedStates(prev => [...prev, stateAbbr]);
      setStateInput('');
    } else if (selectedStates.includes(stateAbbr)) {
      alert('State already selected!');
    } else {
      alert('Invalid state name or abbreviation!');
    }
  };

  const removeState = (stateAbbr) => {
    setSelectedStates(prev => prev.filter(s => s !== stateAbbr));
  };

  const selectAll = () => {
    setSelectedStates(Object.keys(stateFilingData));
  };

  const resetAll = () => {
    setSelectedStates([]);
  };

  const calculatePrice = () => {
    const basePrice = basePrices[filingType] || 0;
    const stateCount = selectedStates.length;
    const includedStates = filingType === '1120' ? 1 : 0;
    const statePrice = Math.max(0, (stateCount - includedStates) * 150);
    const total = basePrice + statePrice;
    setPriceDetails({ basePrice, stateCount, statePrice, total });
  };

  const showStatesModal = (bucketType) => {
    const titles = {
      'required': 'Filing Required States',
      'conditional': 'Conditional Filing States',
      'no-filing': 'No Filing Required States'
    };
    
    setModalTitle(titles[bucketType]);
    
    // Get states for this bucket
    const bucketStates = selectedStates.filter(stateAbbr => {
      const stateData = stateFilingData[stateAbbr];
      const filingStatus = stateData.forms[filingType];
      
      if (bucketType === 'required') return filingStatus === 'required';
      if (bucketType === 'conditional') return filingStatus === 'conditional';
      if (bucketType === 'no-filing') return filingStatus === 'not-required';
      return false;
    });
    
    setModalStates(bucketStates);
    setShowModal(true);
  };

  const closeStatesModal = () => {
    setShowModal(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addState();
    }
  };

  // Calculate counts for each bucket
  const getBucketCounts = () => {
    let requiredCount = 0;
    let conditionalCount = 0;
    let notRequiredCount = 0;
    
    selectedStates.forEach(stateAbbr => {
      const stateData = stateFilingData[stateAbbr];
      const filingStatus = stateData.forms[filingType];
      
      if (filingStatus === 'required') {
        requiredCount++;
      } else if (filingStatus === 'conditional') {
        conditionalCount++;
      } else if (filingStatus === 'not-required') {
        notRequiredCount++;
      }
    });
    
    return { requiredCount, conditionalCount, notRequiredCount };
  };

  const { requiredCount, conditionalCount, notRequiredCount } = getBucketCounts();

  // Get city returns information
  const getCityReturnsInfo = () => {
    let cityReturnsRequired = 0;
    let cityReturnsSpecific = 0;
    let cityReturnsCities = [];
    
    selectedStates.forEach(stateAbbr => {
      const stateData = stateFilingData[stateAbbr];
      
      if (stateData.cityReturns) {
        if (stateData.cityReturns.type === 'all') {
          cityReturnsRequired++;
        } else if (stateData.cityReturns.type === 'specific' && stateData.cityReturns.cities.length > 0) {
          cityReturnsSpecific++;
          cityReturnsCities.push(...stateData.cityReturns.cities.map(city => `${city}, ${stateAbbr}`));
        }
      }
    });
    
    return { cityReturnsRequired, cityReturnsSpecific, cityReturnsCities };
  };

  const { cityReturnsRequired, cityReturnsSpecific, cityReturnsCities } = getCityReturnsInfo();

  return (
    <div className="container">
      <h1>State Filing Requirements Tool</h1>
      
      <div className="form-section">
        <h3>Tax Filing Configuration</h3>
        <p>Configure your client's tax filing requirements and select the states where your client lives or has income. The map below will automatically update to show filing requirements for each selected state.</p>
        
        <div className="side-by-side-container">
          <div>
            <h4>Select Filing Type</h4>
            <p>Choose the type of tax filing to determine state requirements:</p>
            
            <div className="filing-type-selector">
              <label className="filing-type-option">
                <input 
                  type="radio" 
                  name="filingType" 
                  value="1120S" 
                  checked={filingType === '1120S'}
                  onChange={(e) => setFilingType(e.target.value)}
                />
                <span className="filing-type-label">1120S - S Corporation</span>
              </label>
              <label className="filing-type-option">
                <input 
                  type="radio" 
                  name="filingType" 
                  value="1065"
                  checked={filingType === '1065'}
                  onChange={(e) => setFilingType(e.target.value)}
                />
                <span className="filing-type-label">1065 - Partnership</span>
              </label>
              <label className="filing-type-option">
                <input 
                  type="radio" 
                  name="filingType" 
                  value="1120"
                  checked={filingType === '1120'}
                  onChange={(e) => setFilingType(e.target.value)}
                />
                <span className="filing-type-label">1120 - C Corporation</span>
              </label>
              <label className="filing-type-option">
                <input 
                  type="radio" 
                  name="filingType" 
                  value="1040"
                  checked={filingType === '1040'}
                  onChange={(e) => setFilingType(e.target.value)}
                />
                <span className="filing-type-label">1040 - Individual</span>
              </label>
            </div>
          </div>
          
          <div>
            <h4>Select Client States</h4>
            <p>Enter the states where your client lives or has income:</p>
            
            <div className="state-input">
              <input 
                type="text" 
                value={stateInput}
                onChange={(e) => setStateInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter state name or abbreviation (e.g., CA, California)"
              />
              <button onClick={addState}>Add State</button>
            </div>
          </div>
        </div>
        
          <div className="pricing-section">
            <h4>Federal Return Pricing Calculator</h4>
            <button className="calculate-price-btn" onClick={calculatePrice}>
              Calculate Return Fee
            </button>
            {filingType === '1120' && (
              <p className="state-pricing-note">First state return included.</p>
            )}
            {priceDetails && (
              <div className="price-details">
                <p>Federal Return Fee: ${priceDetails.basePrice}</p>
                <p>
                  State Returns ({priceDetails.stateCount}): ${priceDetails.statePrice}
                </p>
                <p><strong>Total Fee: ${priceDetails.total}</strong></p>
              </div>
            )}
          </div>

          <div className="action-buttons">
            <button
              className="action-button select-all-btn"
              onClick={selectAll}
            >
              Select All
          </button>
          <button 
            className="action-button reset-all-btn" 
            onClick={resetAll}
          >
            Reset All
          </button>
        </div>
      </div>

      <div className="map-container">
        <h3>State Filing Requirements Map</h3>
        <USMap
          selectedStates={selectedStates}
          filingType={filingType}
          onStateClick={(stateId) => {
            if (selectedStates.includes(stateId)) {
              removeState(stateId);
            } else {
              setSelectedStates(prev => [...prev, stateId]);
            }
          }}
        />
      </div>

      {selectedStates.length > 0 && (
        <div className="selected-states-section">
          <div className="selected-states-summary">
            <div className="total-count">
              <h5>Total States Selected: {selectedStates.length}</h5>
            </div>
            <div className="states-buckets">
              <div className="bucket filing-required-bucket">
                <div className="bucket-header">
                  <h5>Filing Required</h5>
                  <button className="view-states-btn" onClick={() => showStatesModal('required')}>
                    View States
                  </button>
                </div>
                <div className="bucket-content">
                  <span className="state-count">{requiredCount} states</span>
                </div>
              </div>
              <div className="bucket conditional-bucket">
                <div className="bucket-header">
                  <h5>Conditional Filing</h5>
                  <button className="view-states-btn" onClick={() => showStatesModal('conditional')}>
                    View States
                  </button>
                </div>
                <div className="bucket-content">
                  <span className="state-count">{conditionalCount} states</span>
                </div>
              </div>
              <div className="bucket no-filing-bucket">
                <div className="bucket-header">
                  <h5>No Filing Required</h5>
                  <button className="view-states-btn" onClick={() => showStatesModal('no-filing')}>
                    View States
                  </button>
                </div>
                <div className="bucket-content">
                  <span className="state-count">{notRequiredCount} states</span>
                </div>
              </div>
            </div>
            <div className="filing-summary">
              <h5>Additional Filing Information</h5>
              {(cityReturnsRequired > 0 || cityReturnsSpecific > 0) && (
                <div className="city-returns-info">
                  <strong>City Returns Required:</strong><br />
                  {cityReturnsRequired > 0 && `• ${cityReturnsRequired} states require ALL cities to file<br />`}
                  {cityReturnsSpecific > 0 && `• ${cityReturnsSpecific} states require specific cities to file: ${cityReturnsCities.slice(0, 5).join(', ')}${cityReturnsCities.length > 5 ? ' and more...' : ''}`}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="pricing-section">
        <h4>Federal Return Pricing Calculator</h4>
        <button className="calculate-price-btn" onClick={calculatePrice}>
          Calculate Return Fee
        </button>
        {filingType === '1120' && (
          <p className="state-pricing-note">First state return included.</p>
        )}
        {priceDetails && (
          <div className="price-details">
            <p>Federal Return Fee: ${priceDetails.basePrice}</p>
            <p>
              State Returns ({priceDetails.stateCount}): ${priceDetails.statePrice}
            </p>
            <p><strong>Total Fee: ${priceDetails.total}</strong></p>
          </div>
        )}
      </div>

      <StatesModal
        show={showModal}
        onClose={closeStatesModal}
        title={modalTitle}
        states={modalStates}
        onRemoveState={removeState}
        stateFilingData={stateFilingData}
      />
    </div>
  );
};

export default TaxFilingTool; 