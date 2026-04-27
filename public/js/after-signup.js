// Personalize the after-signup experience and wire primary actions
(function(){
  const user = JSON.parse(localStorage.getItem('userData') || '{}');
  const role = (localStorage.getItem('userRole') || 'user');
  const name = user.name || 'there';

  const welcomeHead = document.getElementById('welcomeHead');
  const pill = document.getElementById('userPill');
  const year = document.getElementById('year');

  welcomeHead.textContent = `Welcome, ${name}! 🎉`;
  pill.textContent = `${role.charAt(0).toUpperCase()+role.slice(1)} • ${user.email || 'no-email'}`;
  year.textContent = new Date().getFullYear();

  // Primary actions
  document.getElementById('goDashboard').addEventListener('click', ()=>{
    window.location.href = '/dashboard.html';
  });
  document.getElementById('completeProfile').addEventListener('click', ()=>{
    // For now route to dashboard profile area if exists; fallback to dashboard root
    window.location.href = '/dashboard.html#profile';
  });
})();
