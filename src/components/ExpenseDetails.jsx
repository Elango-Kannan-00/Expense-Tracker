import React from "react";
import "../App.css";

const ExpenseDetails = ({ list, onDelete, onAddExpense }) => {
  return (
    <div className="expense-details">
      <h2>Here is the expenses made by you</h2>

      {list.length === 0 ? (
        <p>No Records available. Add any expense(s)</p>
      ) : (
        <div className="expensedetails-info">
          {list.map((value, index) => (
            <div key={value.id} className="expense-item">
              <p className="item1">{index + 1}.</p>
              <p className="items">{value.text}</p>
              <p className="items">₹{value.expense}</p>
              <p className="items">{value.sector}</p>
              <button
                className="delete-btn"
                onClick={() => onDelete(value.id)}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="add-expense-btn-container">
        <button className="addexpense-btn" onClick={onAddExpense}>
          Add Expense
        </button>
      </div>
    </div>
  );
};

export default ExpenseDetails;
