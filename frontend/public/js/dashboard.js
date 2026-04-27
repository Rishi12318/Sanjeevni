const API_BASE_URL = 'http://localhost:5050';

function setVisible(el, visible) {
  el.style.display = visible ? '' : 'none';
}

function normalizeSeverity(s) {
  const v = String(s || '').toLowerCase();
  if (v === 'high' || v === 'medium' || v === 'low') return v;
  return 'unknown';
}

async function runTriage() {
  const inputEl = document.getElementById('symptomsInput');
  const buttonEl = document.getElementById('triageBtn');
  const outEl = document.getElementById('triageOut');
  const errEl = document.getElementById('triageErr');

  setVisible(errEl, false);
  setVisible(outEl, false);

  const text = String(inputEl.value || '').trim();
  if (!text) {
    errEl.textContent = 'Please enter your symptoms.';
    setVisible(errEl, true);
    return;
  }

  buttonEl.disabled = true;
  buttonEl.textContent = 'Working...';

  try {
    const resp = await fetch(`${API_BASE_URL}/api/triage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    });

    const data = await resp.json().catch(() => ({}));
    if (!resp.ok) {
      throw new Error(data?.error || `Request failed (${resp.status})`);
    }

    const severity = normalizeSeverity(data.severity);
    document.getElementById('severityPill').textContent = `Severity: ${severity}`;
    document.getElementById('adviceText').textContent = String(data.advice || '');

    const list = document.getElementById('conditionsList');
    const items = Array.isArray(data.possible_conditions) ? data.possible_conditions : [];
    list.innerHTML = items.map((c) => `<li>${String(c)}</li>`).join('') || '<li>—</li>';

    setVisible(outEl, true);
  } catch (e) {
    errEl.textContent = e?.message || 'Something went wrong.';
    setVisible(errEl, true);
  } finally {
    buttonEl.disabled = false;
    buttonEl.textContent = 'Triage';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('triageBtn').addEventListener('click', runTriage);
});

