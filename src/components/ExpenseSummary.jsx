import React from "react";
import "../App.css";

const ExpenseSummary = ({ list }) => {
  const sectors = [
    "Food & Groceries",
    "Transportation",
    "Medical/Healthcare",
    "Entertainment",
    "Others",
  ];

  const totalAmount = list.reduce((acc, curr) => acc + Number(curr.expense), 0);

  const sectorTotals = sectors.map((sector) => ({
    name: sector,
    amount: list
      .filter((x) => x.sector === sector)
      .reduce((acc, curr) => acc + Number(curr.expense), 0),
  }));

  return (
    <div className="expense-summary-container">
      <div className="summary-card">
        <h3>Total Amount Spent</h3>
        <p className="amount">₹{totalAmount}</p>
      </div>

      {sectorTotals.map((sector) => (
        <div key={sector.name} className="summary-card">
          <h3>{sector.name}</h3>
          <p className="amount">₹{sector.amount}</p>
        </div>
      ))}
    </div>
  );
};

export default ExpenseSummary;
