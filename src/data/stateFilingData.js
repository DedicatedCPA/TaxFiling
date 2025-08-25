export const stateFilingData = {
  'AL': { name: 'Alabama', forms: { '1120S': 'required', '1065': 'required', '1120': 'required', '1040': 'required' }},
  'AK': { name: 'Alaska', forms: { '1120S': 'not-required', '1065': 'not-required', '1120': 'required', '1040': 'not-required' }},
  'AZ': { name: 'Arizona', forms: { '1120S': 'required', '1065': 'required', '1120': 'required', '1040': 'required' }},
  'AR': { name: 'Arkansas', forms: { '1120S': 'required', '1065': 'required', '1120': 'required', '1040': 'required' }},
  'CA': { name: 'California', forms: { '1120S': 'required', '1065': 'required', '1120': 'required', '1040': 'required' }},
  'CO': { name: 'Colorado', forms: { '1120S': 'required', '1065': 'required', '1120': 'required', '1040': 'required' }},
  'CT': { name: 'Connecticut', forms: { '1120S': 'required', '1065': 'required', '1120': 'required', '1040': 'required' }},
  'DE': { name: 'Delaware', forms: { '1120S': 'required', '1065': 'required', '1120': 'required', '1040': 'required' }},
  'DC': { name: 'District of Columbia', forms: { '1120S': 'required', '1065': 'required', '1120': 'required', '1040': 'required' }},
  'FL': { name: 'Florida', forms: { '1120S': 'not-required', '1065': 'not-required', '1120': 'required', '1040': 'not-required' }},
  'GA': { name: 'Georgia', forms: { '1120S': 'required', '1065': 'required', '1120': 'required', '1040': 'required' }},
  'HI': { name: 'Hawaii', forms: { '1120S': 'required', '1065': 'required', '1120': 'required', '1040': 'required' }},
  'ID': { name: 'Idaho', forms: { '1120S': 'required', '1065': 'required', '1120': 'required', '1040': 'required' }},
  'IL': { name: 'Illinois', forms: { '1120S': 'required', '1065': 'required', '1120': 'required', '1040': 'required' }},
  'IN': { name: 'Indiana', forms: { '1120S': 'required', '1065': 'required', '1120': 'required', '1040': 'required' }},
  'IA': { name: 'Iowa', forms: { '1120S': 'required', '1065': 'required', '1120': 'required', '1040': 'required' }},
  'KS': { name: 'Kansas', forms: { '1120S': 'not-required', '1065': 'not-required', '1120': 'required', '1040': 'required' }},
  'KY': { name: 'Kentucky', forms: { '1120S': 'required', '1065': 'required', '1120': 'required', '1040': 'required' }, cityReturns: { type: 'specific', cities: ['Lexington', 'Louisville'] }},
  'LA': { name: 'Louisiana', forms: { '1120S': 'conditional', '1065': 'conditional', '1120': 'required', '1040': 'conditional' }},
  'ME': { name: 'Maine', forms: { '1120S': 'conditional', '1065': 'conditional', '1120': 'required', '1040': 'conditional' }},
  'MD': { name: 'Maryland', forms: { '1120S': 'required', '1065': 'required', '1120': 'required', '1040': 'required' }, cityReturns: { type: 'all', cities: [] }},
  'MA': { name: 'Massachusetts', forms: { '1120S': 'required', '1065': 'required', '1120': 'required', '1040': 'required' }},
  'MI': { name: 'Michigan', forms: { '1120S': 'not-required', '1065': 'not-required', '1120': 'required', '1040': 'required' }, cityReturns: { type: 'all', cities: [] }},
  'MN': { name: 'Minnesota', forms: { '1120S': 'required', '1065': 'required', '1120': 'required', '1040': 'required' }},
  'MS': { name: 'Mississippi', forms: { '1120S': 'required', '1065': 'required', '1120': 'required', '1040': 'required' }},
  'MO': { name: 'Missouri', forms: { '1120S': 'required', '1065': 'required', '1120': 'required', '1040': 'required' }, cityReturns: { type: 'specific', cities: ['Kansas City'] }},
  'MT': { name: 'Montana', forms: { '1120S': 'required', '1065': 'required', '1120': 'required', '1040': 'required' }},
  'NE': { name: 'Nebraska', forms: { '1120S': 'required', '1065': 'required', '1120': 'required', '1040': 'required' }},
  'NV': { name: 'Nevada', forms: { '1120S': 'not-required', '1065': 'not-required', '1120': 'required', '1040': 'not-required' }},
  'NH': { name: 'New Hampshire', forms: { '1120S': 'conditional', '1065': 'conditional', '1120': 'required', '1040': 'conditional' }},
  'NJ': { name: 'New Jersey', forms: { '1120S': 'required', '1065': 'required', '1120': 'required', '1040': 'required' }},
  'NM': { name: 'New Mexico', forms: { '1120S': 'required', '1065': 'required', '1120': 'required', '1040': 'required' }},
  'NY': { name: 'New York', forms: { '1120S': 'required', '1065': 'required', '1120': 'required', '1040': 'required' }, cityReturns: { type: 'specific', cities: ['New York City', 'Yonkers'] }},
  'NC': { name: 'North Carolina', forms: { '1120S': 'required', '1065': 'required', '1120': 'required', '1040': 'required' }},
  'ND': { name: 'North Dakota', forms: { '1120S': 'required', '1065': 'required', '1120': 'required', '1040': 'required' }},
  'OH': { name: 'Ohio', forms: { '1120S': 'conditional', '1065': 'conditional', '1120': 'required', '1040': 'conditional' }, cityReturns: { type: 'all', cities: [] }},
  'OK': { name: 'Oklahoma', forms: { '1120S': 'required', '1065': 'required', '1120': 'required', '1040': 'required' }},
  'OR': { name: 'Oregon', forms: { '1120S': 'required', '1065': 'required', '1120': 'required', '1040': 'required' }, cityReturns: { type: 'specific', cities: ['Portland'] }},
  'PA': { name: 'Pennsylvania', forms: { '1120S': 'required', '1065': 'required', '1120': 'required', '1040': 'required' }, cityReturns: { type: 'specific', cities: ['Philadelphia'] }},
  'RI': { name: 'Rhode Island', forms: { '1120S': 'required', '1065': 'required', '1120': 'required', '1040': 'required' }},
  'SC': { name: 'South Carolina', forms: { '1120S': 'required', '1065': 'required', '1120': 'required', '1040': 'required' }},
  'SD': { name: 'South Dakota', forms: { '1120S': 'not-required', '1065': 'not-required', '1120': 'required', '1040': 'not-required' }},
  'TN': { name: 'Tennessee', forms: { '1120S': 'required', '1065': 'required', '1120': 'required', '1040': 'not-required' }},
  'TX': { name: 'Texas', forms: { '1120S': 'required', '1065': 'required', '1120': 'required', '1040': 'not-required' }},
  'UT': { name: 'Utah', forms: { '1120S': 'conditional', '1065': 'conditional', '1120': 'required', '1040': 'conditional' }},
  'VT': { name: 'Vermont', forms: { '1120S': 'required', '1065': 'required', '1120': 'required', '1040': 'required' }},
  'VA': { name: 'Virginia', forms: { '1120S': 'required', '1065': 'required', '1120': 'required', '1040': 'required' }},
  'WA': { name: 'Washington', forms: { '1120S': 'not-required', '1065': 'not-required', '1120': 'required', '1040': 'not-required' }},
  'WV': { name: 'West Virginia', forms: { '1120S': 'required', '1065': 'required', '1120': 'required', '1040': 'required' }},
  'WI': { name: 'Wisconsin', forms: { '1120S': 'required', '1065': 'required', '1120': 'required', '1040': 'required' }},
  'WY': { name: 'Wyoming', forms: { '1120S': 'not-required', '1065': 'not-required', '1120': 'required', '1040': 'not-required' }}
};

export const getConditionalText = (stateId) => {
  switch (stateId) {
    case 'LA':
    case 'ME':
    case 'OH':
      return 'If partners are non-residents';
    case 'NH':
      return 'Over $50k income';
    case 'UT':
      return 'If partners are corporate or non-residents';
    default:
      return 'See detailed notes for specific criteria';
  }
}; 