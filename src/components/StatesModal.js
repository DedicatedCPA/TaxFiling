import React from 'react';

const StatesModal = ({ show, onClose, title, states, onRemoveState, stateFilingData }) => {
  if (!show) return null;

  return (
    <div className="modal" style={{ display: 'block' }}>
      <div className="modal-content">
        <div className="modal-header">
          <h3>{title}</h3>
          <span className="close" onClick={onClose}>&times;</span>
        </div>
        <div className="modal-body">
          {states.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#6c757d', fontStyle: 'italic' }}>
              No states in this category
            </p>
          ) : (
            states.map(stateAbbr => {
              const stateData = stateFilingData[stateAbbr];
              return (
                <div key={stateAbbr} className="modal-state-item">
                  <span className="modal-state-name">
                    {stateData.name} ({stateAbbr})
                  </span>
                  <button 
                    className="modal-remove-btn" 
                    onClick={() => {
                      onRemoveState(stateAbbr);
                      onClose();
                    }}
                  >
                    Remove
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default StatesModal; 