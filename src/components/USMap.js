import React, { useEffect, useRef, useCallback, useMemo } from 'react';
import { stateFilingData } from '../data/stateFilingData';
import { getConditionalText } from '../data/stateFilingData';
import { ReactComponent as USSVG } from '../assets/us.svg';

const USMap = ({ selectedStates, filingType, onStateClick }) => {
  const svgContainerRef = useRef(null);
  const svgRef = useRef(null);
  const initializedRef = useRef(false);
  const tooltipRef = useRef(null);

  // Helper: check if state is suitable for displaying text
  const isStateSuitableForText = useCallback((stateElement) => {
    const stateId = stateElement.id;

    if (['HI', 'MD', 'MA'].includes(stateId)) return false;

    const bbox = stateElement.getBBox();
    if (bbox.width < 30 || bbox.height < 30) return false;

    const aspectRatio = bbox.width / bbox.height;
    if (aspectRatio < 0.3 || aspectRatio > 3.5) return false;

    const area = bbox.width * bbox.height;
    return area >= 500;
  }, []);

  // Helper: find optimal position for abbreviation text
  const findOptimalTextPosition = useCallback((stateElement, bbox) => {
    if (bbox.width < 28 || bbox.height < 20) return null;
    return {
      x: bbox.x + bbox.width / 2,
      y: bbox.y + bbox.height / 2
    };
  }, []);

  // Custom text positions for problematic states
  const getCustomStatePosition = useCallback((stateId, bbox) => {
    const custom = {
      FL: [0.78, 0.45],
      LA: [0.35, 0.6],
      WV: [0.45, 0.55],
      MI: [0.7, 0.7],
      MN: [0.45, 0.6],
      KY: [0.55, 0.5],
      CA: [0.5, 0.6],
      WA: [0.6, 0.5],
      ID: [0.5, 0.7],
      WI: [0.5, 0.55],
      TN: [0.5, 0.55]
    };

    if (['MD', 'MA', 'HI'].includes(stateId)) return null;

    if (stateId === 'AK') {
      const akX = bbox.x + bbox.width * 0.7;
      const akY = bbox.y + bbox.height * 0.44;
      return {
        x: Math.max(bbox.x + 30, Math.min(akX, bbox.x + bbox.width - 30)),
        y: Math.max(bbox.y + 30, Math.min(akY, bbox.y + bbox.height - 30))
      };
    }

    if (custom[stateId]) {
      const [xRatio, yRatio] = custom[stateId];
      return { x: bbox.x + bbox.width * xRatio, y: bbox.y + bbox.height * yRatio };
    }

    return null;
  }, []);

  // Add state abbreviation labels
  const addStateLabel = useCallback((stateElement) => {
    const stateId = stateElement.id;
    if (!stateId || !stateFilingData[stateId]) return false;
    if (!isStateSuitableForText(stateElement)) return false;

    const bbox = stateElement.getBBox();
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('dominant-baseline', 'middle');
    text.setAttribute('font-size', '12');
    text.setAttribute('font-weight', 'bold');
    text.setAttribute('fill', '#000000');
    text.setAttribute('data-state-id', stateId);
    text.textContent = stateId;

    const customPosition = getCustomStatePosition(stateId, bbox);
    if (customPosition) {
      text.setAttribute('x', customPosition.x);
      text.setAttribute('y', customPosition.y);
      stateElement.parentNode.appendChild(text);
      return true;
    }

    const bestPosition = findOptimalTextPosition(stateElement, bbox);
    if (bestPosition) {
      text.setAttribute('x', bestPosition.x);
      text.setAttribute('y', bestPosition.y);
      stateElement.parentNode.appendChild(text);
      return true;
    }

    return false;
  }, [isStateSuitableForText, getCustomStatePosition, findOptimalTextPosition]);

  // Tooltip mouse enter
  const handleMouseEnter = useCallback((e) => {
    const stateElement = e.currentTarget;
    const stateId = stateElement.id;
    const stateData = stateFilingData[stateId];
    if (!stateData) return;

    stateElement.style.transform = 'scale(1.03)';
    stateElement.style.stroke = '#333';
    stateElement.style.strokeWidth = '2';
    stateElement.style.filter = 'drop-shadow(0 0 6px rgba(0,0,0,0.2))';

    if (tooltipRef.current) {
      document.body.removeChild(tooltipRef.current);
      tooltipRef.current = null;
    }

    let tooltipContent = `<div class="tooltip-header">${stateData.name} (${stateId})</div>`;
    let hasWarnings = false;
    let warningsContent = '';

    if (stateData.cityReturns) {
      hasWarnings = true;
      if (stateData.cityReturns.type === 'all') {
        warningsContent += `<div class="city-returns-warning" style="margin:0;font-size:11px;"><strong>⚠️ All Cities Must File</strong></div>`;
      } else if (stateData.cityReturns.type === 'specific' && stateData.cityReturns.cities.length > 0) {
        warningsContent += `<div class="city-returns-advisory" style="margin:0;font-size:11px;"><strong>ℹ️ City Returns: ${stateData.cityReturns.cities.join(', ')}</strong></div>`;
      }
    }

    const hasConditional = Object.values(stateData.forms).some(status => status === 'conditional');
    if (hasConditional) {
      hasWarnings = true;
      if (warningsContent) {
        warningsContent = `
          <div style="display:flex;gap:10px;margin-bottom:20px;">
            <div style="flex:1;">${warningsContent}</div>
            <div style="flex:1;">
              <div class="tooltip-note" style="margin:0;font-size:11px;">
                <strong>Conditional: ${getConditionalText(stateId)}</strong>
              </div>
            </div>
          </div>`;
      } else {
        warningsContent = `<div class="tooltip-note" style="margin:0 0 20px 0;font-size:11px;"><strong>Conditional: ${getConditionalText(stateId)}</strong></div>`;
      }
    } else if (warningsContent) {
      warningsContent = `<div style="margin-bottom:20px;">${warningsContent}</div>`;
    }

    if (hasWarnings) tooltipContent += warningsContent;

    const formTypes = [
      { key: '1120S', name: 'S Corporation (1120S)' },
      { key: '1065', name: 'Partnership (1065)' },
      { key: '1120', name: 'C Corporation (1120)' },
      { key: '1040', name: 'Individual (1040)' }
    ];
    formTypes.forEach(form => {
      const status = stateData.forms[form.key];
      const statusClass = status === 'required' ? 'status-required' :
        status === 'conditional' ? 'status-conditional' : 'status-not-required';
      const statusText = status === 'required' ? 'Required' :
        status === 'conditional' ? 'Conditional' : 'Not Required';

      tooltipContent += `
        <div class="tooltip-row">
          <span class="form-name">${form.name}:</span>
          <span class="status ${statusClass}">${statusText}</span>
        </div>`;
    });

    const tooltipElement = document.createElement('div');
    tooltipElement.className = 'state-tooltip';
    tooltipElement.innerHTML = tooltipContent;
    Object.assign(tooltipElement.style, {
      position: 'absolute',
      left: `${e.pageX + 15}px`,
      top: `${e.pageY - 15}px`,
      background: 'white',
      color: '#495057',
      padding: '25px',
      borderRadius: '12px',
      fontSize: '14px',
      zIndex: '1000',
      pointerEvents: 'none',
      boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
      border: '1px solid #e9ecef',
      minWidth: '400px',
      maxWidth: '450px',
      lineHeight: '1.6'
    });

    document.body.appendChild(tooltipElement);
    tooltipRef.current = tooltipElement;
  }, []);

  // Tooltip repositioning
  const handleMouseMove = useCallback((e) => {
    const tooltip = tooltipRef.current;
    if (tooltip) {
      const rect = tooltip.getBoundingClientRect();
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      let left = e.pageX + 15;
      let top = e.pageY - 15;
      if (left + rect.width > vw - 20) left = e.pageX - rect.width - 15;
      if (top + rect.height > vh - 20) top = e.pageY - rect.height - 15;
      tooltip.style.left = `${left}px`;
      tooltip.style.top = `${top}px`;
    }
  }, []);

  const handleMouseLeave = useCallback((e) => {
    if (tooltipRef.current) {
      document.body.removeChild(tooltipRef.current);
      tooltipRef.current = null;
    }
    const stateElement = e.currentTarget;
    stateElement.style.transform = '';
    stateElement.style.stroke = '';
    stateElement.style.strokeWidth = '';
    stateElement.style.filter = '';
  }, []);

  const handleClick = useCallback((e) => {
    const stateElement = e.currentTarget;
    const stateId = stateElement.id;
    if (tooltipRef.current) {
      document.body.removeChild(tooltipRef.current);
      tooltipRef.current = null;
    }
    stateElement.style.strokeWidth = '';
    stateElement.style.stroke = '';
    onStateClick(stateId);
  }, [onStateClick]);

  const enhanceSvg = useCallback((element) => {
    if (!React.isValidElement(element)) return element;
    const newProps = {};
    if (element.type === 'svg') {
      newProps.ref = svgRef;
      newProps.className = 'usa-map';
    }
    if (element.props.id) {
      newProps.onMouseEnter = handleMouseEnter;
      newProps.onMouseMove = handleMouseMove;
      newProps.onMouseLeave = handleMouseLeave;
      newProps.onClick = handleClick;
    }
    const children = element.props.children
      ? React.Children.map(element.props.children, enhanceSvg)
      : null;
    return React.cloneElement(element, newProps, children);
  }, [handleMouseEnter, handleMouseMove, handleMouseLeave, handleClick]);

  const svgElement = useMemo(() => enhanceSvg(<USSVG />), [enhanceSvg]);

  const addLegendOverlay = useCallback(() => {
    if (!svgContainerRef.current) return;
    const legendOverlay = document.createElement('div');
    legendOverlay.className = 'legend-overlay';
    legendOverlay.innerHTML = `
      <div class="legend-item"><div class="legend-color" style="background:#8dd39e;"></div><span>Filing Required</span></div>
      <div class="legend-item"><div class="legend-color" style="background:#b0bec5;"></div><span>No Filing Required</span></div>
      <div class="legend-item"><div class="legend-color" style="background:#ffe58a;"></div><span>Conditional Filing</span></div>
      <div class="legend-item"><div class="legend-color" style="background:#ffffff;border:1px solid #333;"></div><span>Not Selected</span></div>
    `;
    svgContainerRef.current.insertBefore(legendOverlay, svgContainerRef.current.firstChild);
  }, []);

  const updateTextColors = useCallback(() => {
    if (!svgRef.current) return;
    const textElements = svgRef.current.querySelectorAll('text[data-state-id]');
    textElements.forEach(textElement => {
      const stateId = textElement.getAttribute('data-state-id');
      if (stateId && stateId.length === 2) {
        const stateElement = svgRef.current.querySelector(`#${stateId}`);
        if (stateElement) {
          let textColor = '#000000';
          if (stateElement.classList.contains('filing-required') || stateElement.style.fill === '#8dd39e') {
            textColor = '#ffffff';
          } else if (stateElement.classList.contains('no-filing') || stateElement.style.fill === '#b0bec5') {
            textColor = '#000000';
          } else if (stateElement.classList.contains('conditional-filing') || stateElement.style.fill === '#ffe58a') {
            textColor = '#000000';
          }
          textElement.style.setProperty('fill', textColor, 'important');
          textElement.setAttribute('fill', textColor);
        }
      }
    });
  }, []);

  const resetStateStyles = useCallback(() => {
    if (!svgRef.current) return;
    const stateElements = svgRef.current.querySelectorAll('.state');
    stateElements.forEach(stateElement => {
      stateElement.classList.remove('filing-required', 'no-filing', 'conditional-filing');
      stateElement.style.setProperty('fill', '#f9fafb', 'important');
      stateElement.setAttribute('fill', '#f9fafb');
    });
  }, []);

  const applySelectedStateStyles = useCallback(() => {
    if (!svgRef.current) return;
    selectedStates.forEach(stateAbbr => {
      const stateElement = svgRef.current.querySelector(`#${stateAbbr}`);
      if (!stateElement) return;
      const stateData = stateFilingData[stateAbbr];
      const filingStatus = stateData.forms[filingType];

      if (filingStatus === 'required') {
        stateElement.classList.add('filing-required');
        stateElement.style.setProperty('fill', '#8dd39e', 'important');
        stateElement.setAttribute('fill', '#8dd39e');
      } else if (filingStatus === 'conditional') {
        stateElement.classList.add('conditional-filing');
        stateElement.style.setProperty('fill', '#ffe58a', 'important');
        stateElement.setAttribute('fill', '#ffe58a');
      } else if (filingStatus === 'not-required') {
        stateElement.classList.add('no-filing');
        stateElement.style.setProperty('fill', '#b0bec5', 'important');
        stateElement.setAttribute('fill', '#b0bec5');
      }
    });
  }, [selectedStates, filingType]);

  const updateMap = useCallback(() => {
    resetStateStyles();
    applySelectedStateStyles();
    updateTextColors();
  }, [resetStateStyles, applySelectedStateStyles, updateTextColors]);

  const setupStateElement = useCallback((state) => {
    state.removeAttribute('style');
    state.removeAttribute('fill');
    state.style.setProperty('fill', '#f9fafb', 'important');
    state.setAttribute('fill', '#f9fafb');
    state.style.cursor = 'pointer';
    state.style.transition = 'fill 0.3s, stroke-width 0.3s, transform 0.2s';
    state.style.position = 'relative';
    state.style.transformBox = 'fill-box';
    state.style.transformOrigin = 'center';
    state.classList.add('state', 'clickable');
    addStateLabel(state);
  }, [addStateLabel]);

  useEffect(() => {
    if (svgRef.current && !initializedRef.current) {
      const states = svgRef.current.querySelectorAll('path[id]');
      states.forEach(state => setupStateElement(state));
      addLegendOverlay();
      updateMap();
      initializedRef.current = true;
    }
  }, [setupStateElement, addLegendOverlay, updateMap]);

  useEffect(() => {
    if (initializedRef.current) {
      updateMap();
    }
  }, [selectedStates, filingType, updateMap]);

  useEffect(() => {
    return () => {
      if (tooltipRef.current) {
        document.body.removeChild(tooltipRef.current);
        tooltipRef.current = null;
      }
    };
  }, []);

  return (
    <div id="svgContainer" ref={svgContainerRef}>
      {svgElement}
    </div>
  );
};

export default USMap;