// script.js

// DOM elements
const balanceEl = document.getElementById("balance");
const transactionForm = document.getElementById("transactionForm");
const transactionNameEl = document.getElementById("transactionName");
const transactionAmountEl = document.getElementById("transactionAmount");
const transactionTypeEl = document.getElementById("transactionType");
const transactionListEl = document.getElementById("transactionList");
const errorEl = document.getElementById("error");

// Load transactions from localStorage or start empty
let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

// Update balance and render list
function updateUI() {
  transactionListEl.innerHTML = "";

  let income = 0;
  let expense = 0;

  transactions.forEach((t, index) => {
    const li = document.createElement("li");
    li.classList.add("transaction-item", t.type);
    li.innerHTML = `
      <span>${t.name} (${t.type})</span>
      <span>$${t.amount.toFixed(2)}</span>
      <button class="delete-btn" onclick="deleteTransaction(${index})">X</button>
    `;
    transactionListEl.appendChild(li);

    if (t.type === "income") income += t.amount;
    else expense += t.amount;
  });

  const balance = income - expense;
  balanceEl.textContent = balance.toFixed(2);

  // Save to localStorage
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

// Add new transaction
transactionForm.addEventListener("submit", (e) => {
  e.preventDefault();
  errorEl.textContent = "";

  const name = transactionNameEl.value.trim();
  let amount = parseFloat(transactionAmountEl.value);
  const type = transactionTypeEl.value;

  if (!name || isNaN(amount) || amount <= 0) {
    errorEl.textContent = "Please enter a valid name and positive amount.";
    return;
  }

  if (type === "expense" && amount < 0) {
    amount = Math.abs(amount);
  }

  const newTransaction = { name, amount, type };
  transactions.push(newTransaction);

  transactionNameEl.value = "";
  transactionAmountEl.value = "";
  transactionTypeEl.value = "income";

  updateUI();
});

// Delete a transaction
function deleteTransaction(index) {
  transactions.splice(index, 1);
  updateUI();
}

// Initial render
updateUI();
