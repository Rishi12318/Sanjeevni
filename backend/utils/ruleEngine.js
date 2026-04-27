function normalize(text) {
  return String(text || '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}

function buildRuleMatch(severity, possible_conditions, advice, matched_rule) {
  return {
    severity,
    possible_conditions,
    advice,
    matched_rule
  };
}

function evaluateSymptoms(inputText) {
  const text = normalize(inputText);
  if (!text) return null;

  if (text.includes('chest pain')) {
    return buildRuleMatch(
      'high',
      ['cardiac event', 'acid reflux', 'musculoskeletal pain'],
      'Seek urgent medical care immediately. If severe or with sweating/nausea, call emergency services.',
      'chest pain'
    );
  }

  if (text.includes('breathing difficulty') || text.includes('difficulty breathing') || text.includes('shortness of breath')) {
    return buildRuleMatch(
      'high',
      ['asthma exacerbation', 'infection', 'allergic reaction'],
      'Seek urgent medical care immediately, especially if symptoms are worsening or you have bluish lips/face.',
      'breathing difficulty'
    );
  }

  if (text.includes('fever')) {
    return buildRuleMatch(
      'medium',
      ['viral infection', 'flu', 'common cold'],
      'Rest, hydrate, and monitor temperature. Seek care if fever is high/persistent or you have severe symptoms.',
      'fever'
    );
  }

  return null;
}

module.exports = {
  evaluateSymptoms
};

