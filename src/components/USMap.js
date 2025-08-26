import React, { useMemo, useState } from 'react';
import { ReactComponent as USSVG } from '../public/us.svg';
import { stateFilingData } from '../data/stateFilingData';

const getStatusClass = (stateId, selectedStates, filingType) => {
  if (!selectedStates.includes(stateId)) return '';
  const data = stateFilingData[stateId];
  if (!data) return '';
  const status = data.forms[filingType];
  if (status === 'required') return 'filing-required';
  if (status === 'conditional') return 'conditional-filing';
  if (status === 'not-required') return 'no-filing';
  return '';
};

const USMap = ({ selectedStates, filingType, onStateClick }) => {
  const [hoveredState, setHoveredState] = useState(null);

  const handlers = useMemo(() => {
    const map = {};
    Object.keys(stateFilingData).forEach((id) => {
      map[id] = {
        onClick: () => onStateClick(id),
        onMouseEnter: () => setHoveredState(id),
        onMouseLeave: () => setHoveredState(null),
      };
    });
    return map;
  }, [onStateClick]);

  const renderedMap = useMemo(() => {
    const element = <USSVG className="usa-map" />;

    const children = React.Children.map(element.props.children, (child) => {
      if (React.isValidElement(child) && child.props.id) {
        const id = child.props.id;
        const statusClass = getStatusClass(id, selectedStates, filingType);
        const hoverStyle = hoveredState === id ? { strokeWidth: 2, stroke: '#007bff' } : {};
        return React.cloneElement(child, {
          ...handlers[id],
          className: ['state', statusClass].filter(Boolean).join(' '),
          style: { ...child.props.style, ...hoverStyle, cursor: 'pointer', transition: 'all 0.3s ease' },
        });
      }
      return child;
    });

    return React.cloneElement(element, {}, children);
  }, [selectedStates, filingType, handlers, hoveredState]);

  return (
    <div id="svgContainer">
      {renderedMap}
      <div className="legend-overlay">
        <div className="legend-item">
          <div className="legend-color" style={{ background: '#28a745' }} />
          <span>Filing Required</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ background: '#6c757d' }} />
          <span>No Filing Required</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ background: '#ffc107' }} />
          <span>Conditional Filing</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ background: '#ffffff', border: '1px solid #333' }} />
          <span>Not Selected</span>
        </div>
      </div>
    </div>
  );
};

export default USMap;

