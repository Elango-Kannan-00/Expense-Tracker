import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  BarChart,
  Bar,
} from "recharts";

import "../App.css";
import ExpenseDetails from "../components/ExpenseDetails";
import ExpenseSummary from "../components/ExpenseSummary";
import {
  addExpense as createExpense,
  deleteExpense as removeExpense,
  getCurrentUser,
  getExpenses,
  logout,
} from "../services/api";

const CustomXAxisTick = (props) => {
  const { x, y, payload, index } = props;
  const colors = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];
  const color = colors[index % 5];

  return (
    <g transform={`translate(${x},${y})`}>
      <text
        x={0}
        y={0}
        dy={4}
        textAnchor="end"
        fill={color}
        fontSize={12}
        fontWeight="bold"
        angle={-45}
        style={{ transform: "rotate(-45deg)" }}
      >
        {payload.value}
      </text>
    </g>
  );
};

const Home = () => {
  const [userName, setUserName] = useState("");
  const [item, setItem] = useState("");
  const [amount, setAmount] = useState("");
  const [sector, setSector] = useState("");
  const [list, setList] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [user, expenses] = await Promise.all([
          getCurrentUser(),
          getExpenses(),
        ]);
        setUserName(user.name);
        setList(expenses);
      } catch (error) {
        if (error.message === "Please log in.") {
          navigate("/login", { replace: true });
          return;
        }
        setErrorMessage(error.message);
      }
    };

    loadDashboard();
  }, [navigate]);

  const addItem = async () => {
    if (item.trim() === "" || amount.trim() === "" || sector.trim() === "")
      return;
    try {
      const created = await createExpense({
        text: item.trim(),
        expense: Number(amount),
        sector,
      });
      setList((currentList) => [...currentList, created]);
      setItem("");
      setAmount("");
      setSector("");
      setErrorMessage("");
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const deleteItem = async (id) => {
    try {
      await removeExpense(id);
      setList((currentList) =>
        currentList.filter((expense) => expense.id !== id),
      );
      setErrorMessage("");
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const cancelItem = () => {
    setItem("");
    setAmount("");
    setSector("");
  };

  const pieData = [
    {
      name: "Food & Groceries",
      value: list
        .filter((x) => x.sector === "Food & Groceries")
        .reduce((acc, curr) => acc + Number(curr.expense), 0),
    },
    {
      name: "Transportation",
      value: list
        .filter((x) => x.sector === "Transportation")
        .reduce((acc, curr) => acc + Number(curr.expense), 0),
    },
    {
      name: "Medical/Healthcare",
      value: list
        .filter((x) => x.sector === "Medical/Healthcare")
        .reduce((acc, curr) => acc + Number(curr.expense), 0),
    },
    {
      name: "Entertainment",
      value: list
        .filter((x) => x.sector === "Entertainment")
        .reduce((acc, curr) => acc + Number(curr.expense), 0),
    },
    {
      name: "Others",
      value: list
        .filter((x) => x.sector === "Others")
        .reduce((acc, curr) => acc + Number(curr.expense), 0),
    },
  ];

  const lineData = [];
  let totals = {
    "Food & Groceries": 0,
    Transportation: 0,
    "Medical/Healthcare": 0,
    Entertainment: 0,
    Others: 0,
  };

  list.forEach((x, index) => {
    totals[x.sector] += Number(x.expense);
    lineData.push({
      step: index + 1,
      "Food & Groceries": totals["Food & Groceries"],
      Transportation: totals["Transportation"],
      "Medical/Healthcare": totals["Medical/Healthcare"],
      Entertainment: totals["Entertainment"],
      Others: totals["Others"],
    });
  });

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login", { replace: true });
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <div className="expense-container">
      <div className="dashboard-heading">
        <h1>Welcome, {userName}!</h1>
        <button className="btn" onClick={handleLogout}>Logout</button>
      </div>

      {errorMessage && <p className="error">{errorMessage}</p>}

      <ExpenseDetails
        list={list}
        onDelete={deleteItem}
        onAddExpense={() => setShowAddForm(true)}
      />

      <ExpenseSummary list={list} />

      {showAddForm && (
        <div className="modal-overlay">
          <div className="add-expensebox">
            <h3>Add Expense</h3>

            <input
              className="input-box"
              type="text"
              value={item}
              placeholder="Add any expenses..."
              onChange={(e) => setItem(e.target.value)}
            />

            <input
              className="input-box"
              type="number"
              value={amount}
              placeholder="Enter expense amount..."
              onChange={(e) => setAmount(e.target.value)}
            />

            <select
              className="input-box"
              value={sector}
              onChange={(e) => setSector(e.target.value)}
            >
              <option value="">Select sector...</option>
              <option value="Food & Groceries">Food & Groceries</option>
              <option value="Transportation">Transportation</option>
              <option value="Medical/Healthcare">Medical/Healthcare</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Others">Others</option>
            </select>

            <div className="button-group">
              <button
                className="btn"
                onClick={() => {
                  addItem().then(() => setShowAddForm(false));
                }}
              >
                Add
              </button>

              <button
                className="btn"
                onClick={() => {
                  cancelItem();
                  setShowAddForm(false);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="charts-row">
        <div className="piechart">
          <h3>Analysis - 1</h3>
          <PieChart width={400} height={400}>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={120}
              fill="#8884d8"
              label
            >
              {pieData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={["#0088FE", "#00C49F", "#FFBB28", "#FF8042"][index % 4]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>

        <div className="barchart">
          <h3>Analysis - 2</h3>
          <BarChart width={400} height={400} data={pieData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="name"
              angle={-45}
              textAnchor="end"
              height={100}
              tick={<CustomXAxisTick />}
            />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" radius={[8, 8, 0, 0]}>
              {pieData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={
                    ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"][
                      index % 5
                    ]
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </div>
      </div>

      <div className="line-chart-container">
        <h3>Analysis - 3</h3>
        <LineChart width={600} height={300} data={lineData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="step" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="Food & Groceries" stroke="#0088FE" />
          <Line type="monotone" dataKey="Transportation" stroke="#00C49F" />
          <Line type="monotone" dataKey="Medical/Healthcare" stroke="#FFBB28" />
          <Line type="monotone" dataKey="Entertainment" stroke="#FF8042" />
          <Line type="monotone" dataKey="Others" stroke="#8884d8" />
        </LineChart>
      </div>
    </div>
  );
};

export default Home;
