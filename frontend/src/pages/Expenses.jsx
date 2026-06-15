import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);

  const [formData, setFormData] = useState({
    group_id: "",
    paid_by: "",
    description: "",
    amount: "",
    split_between: "",
  });

  const fetchExpenses = async () => {
    try {
      const res = await axios.get(
        "https://expense-sharing-app-b8cu.onrender.com/expenses"
      );

      setExpenses(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const createExpense = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        "https://expense-sharing-app-b8cu.onrender.com/expenses",
        {
          group_id: Number(formData.group_id),
          description: formData.description,
          amount: Number(formData.amount),

          currency: "INR",
          exchange_rate: 1,
          expense_date: new Date().toISOString().split("T")[0],

          paid_by: Number(formData.paid_by),
          split_type: "EQUAL",

          splits: formData.split_between
            .split(",")
            .map((id) => ({
              user_id: Number(id.trim()),
              share_amount:
                Number(formData.amount) /
                formData.split_between.split(",").length,
            })),
        }
      );

      alert("Expense Added");

      setFormData({
        group_id: "",
        paid_by: "",
        description: "",
        amount: "",
        split_between: "",
      });

      fetchExpenses();
    } catch (error) {
      console.error(error);

      const detail = error?.response?.data?.detail;

      if (Array.isArray(detail)) {
        alert(detail.map(err => err.msg).join("\n"));
      } else {
        alert(detail || "Failed to add expense");
      }
    }
  };

  return (
    <>
    <Navbar/>
    <div className="min-h-screen bg-black text-white">

      {/* Header */}
      <div className="border-b border-gray-800 bg-gray-950">

        <div className="max-w-7xl mx-auto px-6 py-5">

          <h1 className="text-3xl font-bold">
            Expense Management
          </h1>

          <p className="text-gray-400 mt-1">
            Create and track shared expenses
          </p>

        </div>

      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* Create Expense */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-8">

          <h2 className="text-xl font-semibold mb-5">
            Add Expense
          </h2>

          <form
            onSubmit={createExpense}
            className="grid md:grid-cols-2 gap-4"
          >

            <input
              type="number"
              name="group_id"
              placeholder="Group ID"
              value={formData.group_id}
              onChange={handleChange}
              className="bg-black border border-gray-700 rounded-lg px-4 py-3"
              required
            />

            <input
              type="number"
              name="paid_by"
              placeholder="Paid By (User ID)"
              value={formData.paid_by}
              onChange={handleChange}
              className="bg-black border border-gray-700 rounded-lg px-4 py-3"
              required
            />

            <input
              type="text"
              name="description"
              placeholder="Expense Description"
              value={formData.description}
              onChange={handleChange}
              className="bg-black border border-gray-700 rounded-lg px-4 py-3"
              required
            />

            <input
              type="number"
              step="0.01"
              name="amount"
              placeholder="Amount"
              value={formData.amount}
              onChange={handleChange}
              className="bg-black border border-gray-700 rounded-lg px-4 py-3"
              required
            />

            <input
              type="text"
              name="split_between"
              placeholder="Split Between User IDs (1,2,3)"
              value={formData.split_between}
              onChange={handleChange}
              className="bg-black border border-gray-700 rounded-lg px-4 py-3 md:col-span-2"
              required
            />

            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 rounded-lg px-4 py-3 font-semibold md:col-span-2"
            >
              Add Expense
            </button>

          </form>

        </div>

        {/* Expense List */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">

          <div className="p-6 border-b border-gray-800">

            <h2 className="text-xl font-semibold">
              Expense History
            </h2>

          </div>

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead>

                <tr className="bg-gray-950">

                  <th className="px-6 py-4 text-left">
                    ID
                  </th>

                  <th className="px-6 py-4 text-left">
                    Description
                  </th>

                  <th className="px-6 py-4 text-left">
                    Amount
                  </th>

                  <th className="px-6 py-4 text-left">
                    Group
                  </th>

                  <th className="px-6 py-4 text-left">
                    Paid By
                  </th>

                  <th className="px-6 py-4 text-left">
                    Split Details
                  </th>

                </tr>

              </thead>

              <tbody>

                {expenses.length > 0 ? (
                  expenses.map((expense) => (
                    <tr
                      key={expense.id}
                      className="border-t border-gray-800"
                    >

                      <td className="px-6 py-4">
                        {expense.id}
                      </td>

                      <td className="px-6 py-4">
                        {expense.description}
                      </td>

                      <td className="px-6 py-4">
                        ₹{expense.amount}
                      </td>

                      <td className="px-6 py-4">
                        {expense.group_id}
                      </td>

                      <td className="px-6 py-4">
                        {expense.paid_by}
                      </td>
                      <td className="px-6 py-4">
                        {expense.splits?.length > 0 ? (
                          expense.splits.map((split, index) => (
                            <div key={index}>
                              User {split.user_id}: ₹{split.share_amount}
                            </div>
                          ))
                        ) : (
                          <span className="text-gray-400">
                            No Splits
                          </span>
                        )}
                      </td>

                    </tr>
                  ))
                ) : (
                  <tr>

                    <td
                      colSpan="6"
                      className="text-center py-10 text-gray-400"
                    >
                      No Expenses Found
                    </td>

                  </tr>
                )}

              </tbody>

            </table>

          </div>

        </div>

      </div>

    </div>
    </>
  );
};

export default Expenses;