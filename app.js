// app.js - Demo bank logic (localStorage)
// NOTE: demo only. Do NOT use real credentials or PII.

const STORAGE_KEY = 'wellsgo_users';
const SESSION_KEY = 'wellsgo_current';

/* -- Storage helpers -- */
function loadUsers(){
  try{
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch(e){ return []; }
}
function saveUsers(u){
  localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
}
function setCurrent(username){
  localStorage.setItem(SESSION_KEY, username);
}
function getCurrentUsername(){ return localStorage.getItem(SESSION_KEY); }
function clearCurrent(){ localStorage.removeItem(SESSION_KEY); }

/* -- Auth helpers -- */
function findUserByUsername(u){
  const users = loadUsers();
  return users.find(x => x.username.toLowerCase() === (u||'').toLowerCase());
}
function findUserByEmail(e){
  const users = loadUsers();
  return users.find(x => x.email && x.email.toLowerCase() === (e||'').toLowerCase());
}
function registerUser(user){
  // user: {username, email, password, fullName, avatar, phone}
  const users = loadUsers();
  if (findUserByUsername(user.username) || findUserByEmail(user.email)) return false;
  users.push(user);
  saveUsers(users);
  setCurrent(user.username);
  return true;
}
function loginUser(id, password){
  const users = loadUsers();
  const u = users.find(x => (x.username.toLowerCase() === id.toLowerCase() || (x.email && x.email.toLowerCase() === id.toLowerCase())) && x.password === password);
  if (u) { setCurrent(u.username); return true; }
  return false;
}
function logout(){ clearCurrent(); }

function getCurrentUser(){
  const un = getCurrentUsername();
  if (!un) return null;
  const users = loadUsers();
  return users.find(x => x.username === un) || null;
}
function ensureSignedIn(){ return !!getCurrentUser(); }

/* -- Account operations -- */
function addTransaction(username, tx){
  const users = loadUsers();
  const idx = users.findIndex(u => u.username === username);
  if (idx === -1) return false;
  users[idx].transactions = users[idx].transactions || [];
  users[idx].transactions.push(tx);
  users[idx].balance = Number(users[idx].balance || 0) + Number(tx.amount);
  saveUsers(users);
  return true;
}

function addMoney(amount, note){
  const cur = getCurrentUser();
  if (!cur) return false;
  const tx = { type: 'Credit', amount: +amount, note: note || 'Add funds', date: new Date().toISOString(), party: null };
  return addTransaction(cur.username, tx);
}

function withdrawMoney(amount, note){
  const cur = getCurrentUser();
  if (!cur) return false;
  amount = +amount;
  if ((cur.balance || 0) < amount) return false;
  const tx = { type: 'Debit', amount: -amount, note: note || 'Withdraw', date: new Date().toISOString(), party: null };
  return addTransaction(cur.username, tx);
}

function sendMoney(toUsername, amount, note){
  const users = loadUsers();
  const cur = getCurrentUser();
  if (!cur) return false;
  const recipient = users.find(u => u.username.toLowerCase() === toUsername.toLowerCase());
  amount = +amount;
  if (!recipient) return false;
  if ((cur.balance || 0) < amount) return false;

  // debit current
  const debit = { type: 'Transfer sent', amount: -amount, note: note || 'Transfer', date: new Date().toISOString(), party: recipient.username };
  const credit = { type: 'Transfer received', amount: +amount, note: note || 'Transfer', date: new Date().toISOString(), party: cur.username };

  addTransaction(cur.username, debit);
  addTransaction(recipient.username, credit);
  return true;
}

function deleteCurrentAccount(){
  const cur = getCurrentUser();
  if (!cur) return false;
  let users = loadUsers();
  users = users.filter(u => u.username !== cur.username);
  saveUsers(users);
  clearCurrent();
  return true;
}

/* -- Utilities for export to dashboard script (for UI) -- */
window.registerUser = registerUser;
window.loginUser = loginUser;
window.logout = logout;
window.getCurrentUser = getCurrentUser;
window.ensureSignedIn = ensureSignedIn;
window.addMoney = addMoney;
window.withdrawMoney = withdrawMoney;
window.sendMoney = sendMoney;
window.deleteCurrentAccount = deleteCurrentAccount;