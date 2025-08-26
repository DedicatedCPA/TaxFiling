import React, { useEffect, useRef, useState, useCallback } from 'react';
import { stateFilingData } from '../data/stateFilingData';
import { getConditionalText } from '../data/stateFilingData';

const USMap = ({ selectedStates, filingType, onStateClick }) => {
  const svgContainerRef = useRef(null);
  const [svgLoaded, setSvgLoaded] = useState(false);
  // Use a ref instead of state for tooltip to avoid stale closures
  const tooltipRef = useRef(null);

  // Helper functions defined first
  const isStateSuitableForText = useCallback((stateElement) => {
    const stateId = stateElement.id;
    
    // Explicitly exclude Hawaii, Maryland, and Massachusetts
    if (stateId === 'HI' || stateId === 'MD' || stateId === 'MA') {
      return false;
    }
    
    const bbox = stateElement.getBBox();
    
    // Check if state is too small
    if (bbox.width < 30 || bbox.height < 30) {
      return false;
    }
    
    // Check if state has reasonable aspect ratio
    const aspectRatio = bbox.width / bbox.height;
    if (aspectRatio < 0.3 || aspectRatio > 3.5) {
      return false;
    }
    
    // Check if the bounding box area is reasonable
    const area = bbox.width * bbox.height;
    if (area < 500) {
      return false;
    }
    
    return true;
  }, []);

  const findOptimalTextPosition = useCallback((stateElement, bbox) => {
    // Check if state is too small for text
    if (bbox.width < 28 || bbox.height < 20) {
      return null;
    }
    
    // Use bounding box center
    return { 
      x: bbox.x + bbox.width / 2, 
      y: bbox.y + bbox.height / 2 
    };
  }, []);

  const getCustomStatePosition = useCallback((stateId, bbox) => {
    // Custom positioning for specific problematic states
    switch (stateId) {
      case 'FL':
        return {
          x: bbox.x + bbox.width * 0.78,
          y: bbox.y + bbox.height * 0.45
        };
      case 'LA':
        return {
          x: bbox.x + bbox.width * 0.35,
          y: bbox.y + bbox.height * 0.6
        };
      case 'WV':
        return {
          x: bbox.x + bbox.width * 0.45,
          y: bbox.y + bbox.height * 0.55
        };
      case 'MD':
      case 'MA':
        return null; // Don't show labels for these states
      case 'MI':
        return {
          x: bbox.x + bbox.width * 0.7,
          y: bbox.y + bbox.height * 0.7
        };
      case 'MN':
        return {
          x: bbox.x + bbox.width * 0.45,
          y: bbox.y + bbox.height * 0.6
        };
      case 'KY':
        return {
          x: bbox.x + bbox.width * 0.55,
          y: bbox.y + bbox.height * 0.5
        };
      case 'CA':
        return {
          x: bbox.x + bbox.width * 0.5,
          y: bbox.y + bbox.height * 0.6
        };
      case 'WA':
        return {
          x: bbox.x + bbox.width * 0.6,
          y: bbox.y + bbox.height * 0.5
        };
      case 'ID':
        return {
          x: bbox.x + bbox.width * 0.5,
          y: bbox.y + bbox.height * 0.7
        };
      case 'WI':
        return {
          x: bbox.x + bbox.width * 0.5,
          y: bbox.y + bbox.height * 0.55
        };
      case 'TN':
        return {
          x: bbox.x + bbox.width * 0.5,
          y: bbox.y + bbox.height * 0.55
        };
      case 'AK':
        const akX = bbox.x + bbox.width * 0.7;
        const akY = bbox.y + bbox.height * 0.44;
        const finalAkX = Math.max(bbox.x + 30, Math.min(akX, bbox.x + bbox.width - 30));
        const finalAkY = Math.max(bbox.y + 30, Math.min(akY, bbox.y + bbox.height - 30));
        return { x: finalAkX, y: finalAkY };
      case 'HI':
        return null; // Don't show label for Hawaii
      default:
        return null; // Use general algorithm for other states
    }
  }, []);

  const addStateLabel = useCallback((stateElement) => {
    const stateId = stateElement.id;
    
    if (stateId && stateFilingData[stateId]) {
      // Check if state is suitable for text display
      if (!isStateSuitableForText(stateElement)) {
        return false;
      }
      
      const bbox = stateElement.getBBox();
      
      // Create text element for state abbreviation
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('dominant-baseline', 'middle');
      text.setAttribute('font-size', '12');
      text.setAttribute('font-weight', 'bold');
      text.setAttribute('fill', '#000000');
      text.setAttribute('data-state-id', stateId);
      text.textContent = stateId;
      
      // Check for custom positioning for problematic states
      const customPosition = getCustomStatePosition(stateId, bbox);
      
      if (customPosition) {
        text.setAttribute('x', customPosition.x);
        text.setAttribute('y', customPosition.y);
        
        // Add the text to the SVG
        stateElement.parentNode.appendChild(text);
        return true;
      }
      
      // Find the best position for the text using the general algorithm
      const bestPosition = findOptimalTextPosition(stateElement, bbox);
      if (bestPosition) {
        text.setAttribute('x', bestPosition.x);
        text.setAttribute('y', bestPosition.y);
        
        // Add the text to the SVG
        stateElement.parentNode.appendChild(text);
        return true;
      }
    }
    return false;
  }, [isStateSuitableForText, getCustomStatePosition, findOptimalTextPosition]);

  const addStateTooltip = useCallback((stateElement) => {
    const stateId = stateElement.id;
    if (stateId && stateFilingData[stateId]) {
      const stateData = stateFilingData[stateId];

      stateElement.addEventListener('mouseenter', (e) => {
        // Hover styling for interactivity
        stateElement.style.transform = 'scale(1.03)';
        stateElement.style.stroke = '#333';
        stateElement.style.strokeWidth = '2';
        stateElement.style.filter = 'drop-shadow(0 0 6px rgba(0,0,0,0.2))';

        // Remove any existing tooltip before creating a new one
        if (tooltipRef.current) {
          document.body.removeChild(tooltipRef.current);
          tooltipRef.current = null;
        }

        // Create comprehensive tooltip content
        let tooltipContent = `<div class="tooltip-header">${stateData.name} (${stateId})</div>`;

        // Add warnings and advisories
        let hasWarnings = false;
        let warningsContent = '';

        if (stateData.cityReturns) {
          hasWarnings = true;
          if (stateData.cityReturns.type === 'all') {
            warningsContent += `
              <div class="city-returns-warning" style="margin: 0; font-size: 11px;">
                <strong>⚠️ All Cities Must File</strong>
              </div>
            `;
          } else if (stateData.cityReturns.type === 'specific' && stateData.cityReturns.cities.length > 0) {
            warningsContent += `
              <div class="city-returns-advisory" style="margin: 0; font-size: 11px;">
                <strong>ℹ️ City Returns: ${stateData.cityReturns.cities.join(', ')}</strong>
              </div>
            `;
          }
        }

        // Add conditional filing note if applicable
        const hasConditional = Object.values(stateData.forms).some(status => status === 'conditional');
        if (hasConditional) {
          hasWarnings = true;
          if (warningsContent) {
            warningsContent = `
              <div style="display: flex; gap: 10px; margin-bottom: 20px;">
                <div style="flex: 1;">${warningsContent}</div>
                <div style="flex: 1;">
                  <div class="tooltip-note" style="margin: 0; font-size: 11px;">
                    <strong>Conditional: ${getConditionalText(stateId)}</strong>
                  </div>
                </div>
              </div>
            `;
          } else {
            warningsContent = `
              <div class="tooltip-note" style="margin: 0 0 20px 0; font-size: 11px;">
                <strong>Conditional: ${getConditionalText(stateId)}</strong>
              </div>
            `;
          }
        } else if (warningsContent) {
          warningsContent = `<div style="margin-bottom: 20px;">${warningsContent}</div>`;
        }

        if (hasWarnings) {
          tooltipContent += warningsContent;
        }

        // Add filing requirements with status indicators
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
            </div>
          `;
        });

        // Create tooltip element
        const tooltipElement = document.createElement('div');
        tooltipElement.className = 'state-tooltip';
        tooltipElement.innerHTML = tooltipContent;
        tooltipElement.style.position = 'absolute';
        tooltipElement.style.left = e.pageX + 15 + 'px';
        tooltipElement.style.top = e.pageY - 15 + 'px';
        tooltipElement.style.background = 'white';
        tooltipElement.style.color = '#495057';
        tooltipElement.style.padding = '25px';
        tooltipElement.style.borderRadius = '12px';
        tooltipElement.style.fontSize = '14px';
        tooltipElement.style.zIndex = '1000';
        tooltipElement.style.pointerEvents = 'none';
        tooltipElement.style.boxShadow = '0 8px 32px rgba(0,0,0,0.15)';
        tooltipElement.style.border = '1px solid #e9ecef';
        tooltipElement.style.minWidth = '400px';
        tooltipElement.style.maxWidth = '450px';
        tooltipElement.style.lineHeight = '1.6';
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
      });

      stateElement.addEventListener('mousemove', (e) => {
        const tooltip = tooltipRef.current;
        if (tooltip) {
          const tooltipRect = tooltip.getBoundingClientRect();
          const viewportWidth = window.innerWidth;
          const viewportHeight = window.innerHeight;

          let left = e.pageX + 15;
          let top = e.pageY - 15;

          // Adjust horizontal position if tooltip would go off-screen
          if (left + tooltipRect.width > viewportWidth - 20) {
            left = e.pageX - tooltipRect.width - 15;
          }

          // Adjust vertical position if tooltip would go off-screen
          if (top + tooltipRect.height > viewportHeight - 20) {
            top = e.pageY - tooltipRect.height - 15;
          }

          tooltip.style.left = left + 'px';
          tooltip.style.top = top + 'px';
        }
      });

      stateElement.addEventListener('mouseleave', () => {
        if (tooltipRef.current) {
          document.body.removeChild(tooltipRef.current);
          tooltipRef.current = null;
        }
        stateElement.style.transform = '';
        stateElement.style.stroke = '';
        stateElement.style.strokeWidth = '';
        stateElement.style.filter = '';
      });
    }
  }, []);

  const addStateClickHandler = useCallback((stateElement) => {
    const stateId = stateElement.id;

    stateElement.addEventListener('click', () => {
      // Prevent tooltip from interfering with click
      if (tooltipRef.current) {
        document.body.removeChild(tooltipRef.current);
        tooltipRef.current = null;
      }

      // Clear any hover styles that might be persisting
      stateElement.style.strokeWidth = '';
      stateElement.style.stroke = '';

      // Call the parent component's click handler
      onStateClick(stateId);
    });
  }, [onStateClick]);

  const addLegendOverlay = useCallback(() => {
    if (!svgContainerRef.current) return;
    
    const legendOverlay = document.createElement('div');
    legendOverlay.className = 'legend-overlay';
    legendOverlay.innerHTML = `
      <div class="legend-item">
        <div class="legend-color" style="background: #8dd39e;"></div>
        <span>Filing Required</span>
      </div>
      <div class="legend-item">
        <div class="legend-color" style="background: #b0bec5;"></div>
        <span>No Filing Required</span>
      </div>
      <div class="legend-item">
        <div class="legend-color" style="background: #ffe58a;"></div>
        <span>Conditional Filing</span>
      </div>
      <div class="legend-item">
        <div class="legend-color" style="background: #ffffff; border: 1px solid #333;"></div>
        <span>Not Selected</span>
      </div>
    `;
    
    // Insert legend overlay at the beginning of the SVG container
    svgContainerRef.current.insertBefore(legendOverlay, svgContainerRef.current.firstChild);
  }, []);

  const updateTextColors = useCallback(() => {
    if (!svgContainerRef.current) return;
    
    const textElements = svgContainerRef.current.querySelectorAll('text[data-state-id]');
    
    textElements.forEach(textElement => {
      const stateId = textElement.getAttribute('data-state-id');
      if (stateId && stateId.length === 2) {
        const stateElement = svgContainerRef.current.querySelector(`#${stateId}`);
        
        if (stateElement) {
          let textColor = '#000000'; // Default to black

          if (stateElement.classList.contains('filing-required') || stateElement.style.fill === '#8dd39e') {
            textColor = '#ffffff'; // White for green
          } else if (stateElement.classList.contains('no-filing') || stateElement.style.fill === '#b0bec5') {
            textColor = '#000000'; // Dark text for light grey
          } else if (stateElement.classList.contains('conditional-filing') || stateElement.style.fill === '#ffe58a') {
            textColor = '#000000'; // Black for yellow
          }

          textElement.style.setProperty('fill', textColor, 'important');
          textElement.setAttribute('fill', textColor);
        }
      }
    });
  }, []);

  const updateMap = useCallback(() => {
    if (!svgContainerRef.current) return;
    
    // Reset all states to default light grey
    const stateElements = svgContainerRef.current.querySelectorAll('.state');
    stateElements.forEach(stateElement => {
      stateElement.classList.remove('filing-required', 'no-filing', 'conditional-filing');
      stateElement.style.setProperty('fill', '#f9fafb', 'important');
    });
    
    // Color selected states based on filing requirements
    selectedStates.forEach(stateAbbr => {
      const stateElement = svgContainerRef.current.querySelector(`#${stateAbbr}`);
      if (stateElement) {
        const stateData = stateFilingData[stateAbbr];
        const filingStatus = stateData.forms[filingType];

        if (filingStatus === 'required') {
          stateElement.classList.add('filing-required');
          stateElement.style.setProperty('fill', '#8dd39e', 'important');
        } else if (filingStatus === 'conditional') {
          stateElement.classList.add('conditional-filing');
          stateElement.style.setProperty('fill', '#ffe58a', 'important');
        } else if (filingStatus === 'not-required') {
          stateElement.classList.add('no-filing');
          stateElement.style.setProperty('fill', '#b0bec5', 'important');
        }
      }
    });
    
    // Update text colors
    updateTextColors();
  }, [selectedStates, filingType, updateTextColors]);

  const loadSVGMap = useCallback(async () => {
    try {
      const response = await fetch('/us.svg');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const svgContent = await response.text();
      
      if (svgContainerRef.current) {
        svgContainerRef.current.innerHTML = svgContent;
        
        const svg = svgContainerRef.current.querySelector('svg');
        if (svg) {
          svg.classList.add('usa-map');
          svg.setAttribute('viewBox', '0 0 1200 700');
          svg.style.width = '115%';
          svg.style.height = 'auto';
          svg.style.minHeight = '920px';
          svg.style.margin = '0 auto';
          
          // Add state classes and event listeners
          const states = svg.querySelectorAll('path[id]');

          states.forEach(state => {
            // Remove any existing fill colors and styles from SVG
            state.removeAttribute('style');
            state.removeAttribute('fill');
            
            // Set default styling
            state.style.setProperty('fill', '#f9fafb', 'important');
            state.style.cursor = 'pointer';
            state.style.transition = 'fill 0.3s, stroke-width 0.3s, transform 0.2s';
            state.style.position = 'relative';
            state.style.transformBox = 'fill-box';
            state.style.transformOrigin = 'center';
          
            // Add state class
            state.classList.add('state', 'clickable');
            
            // Add state abbreviation labels
            addStateLabel(state);

            // Add hover tooltip
            addStateTooltip(state);

            // Add click functionality
            addStateClickHandler(state);
          });
        }
        
        // Add legend overlay
        addLegendOverlay();
        
        setSvgLoaded(true);
      }
    } catch (error) {
      console.error('Error loading SVG:', error);
      if (svgContainerRef.current) {
        svgContainerRef.current.innerHTML = `
          <div style="text-align: center; padding: 30px; color: #721c24; background: #f8d7da; border: 1px solid #f5c6cb; border-radius: 8px; max-width: 600px; margin: 0 auto;">
            <h4 style="margin-top: 0; color: #721c24;">Error Loading Map</h4>
            <p style="margin-bottom: 20px;">Unable to load the US map.</p>
            <p><strong>Error:</strong> ${error.message}</p>
            <p>Please try refreshing the page or check the browser console for more details.</p>
          </div>
        `;
      }
    }
  }, [addStateLabel, addStateTooltip, addStateClickHandler, addLegendOverlay]);

  useEffect(() => {
    loadSVGMap();
  }, [loadSVGMap]);

  useEffect(() => {
    if (svgLoaded) {
      updateMap();
    }
  }, [svgLoaded, updateMap]);

  return (
    <div id="svgContainer" ref={svgContainerRef}>
      {/* SVG will be loaded here */}
    </div>
  );
};

export default USMap; 