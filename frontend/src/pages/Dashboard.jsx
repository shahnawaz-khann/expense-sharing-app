import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
const Dashboard = () => {
  const cards = [
    {
      title: "Groups",
      description: "Create and manage expense groups",
      link: "/groups",
      icon: "👥",
    },
    {
      title: "Expenses",
      description: "Track and split expenses",
      link: "/expenses",
      icon: "💰",
    },
    {
      title: "CSV Import",
      description: "Import expense spreadsheet",
      link: "/import",
      icon: "📂",
    },
    {
      title: "Import Issues",
      description: "Review detected CSV issues",
      link: "/issues",
      icon: "⚠️",
    },
  ];

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <>
        <Navbar/>
      <div className="min-h-screen bg-black text-white">

      {/* Navbar */}
      <div className="border-b border-gray-800 bg-gray-950">

        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

          <div>
            <h1 className="text-2xl font-bold">
              Expense Sharing App
            </h1>
            <p className="text-gray-400 text-sm">
              Shared Expense Management Dashboard
            </p>
          </div>

          <button
            onClick={logout}
            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg font-medium"
          >
            Logout
          </button>

        </div>

      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-6 py-8">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h3 className="text-gray-400 text-sm">
              Total Groups
            </h3>
            <p className="text-3xl font-bold mt-2">
              --
            </p>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h3 className="text-gray-400 text-sm">
              Total Expenses
            </h3>
            <p className="text-3xl font-bold mt-2">
              --
            </p>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h3 className="text-gray-400 text-sm">
              Import Issues
            </h3>
            <p className="text-3xl font-bold mt-2">
              --
            </p>
          </div>

        </div>

      </div>

      {/* Feature Cards */}
      <div className="max-w-7xl mx-auto px-6 pb-10">

        <h2 className="text-2xl font-bold mb-6">
          Quick Actions
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

          {cards.map((card) => (
            <Link
              key={card.title}
              to={card.link}
              className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-blue-500 hover:scale-105 transition"
            >

              <div className="text-4xl mb-4">
                {card.icon}
              </div>

              <h3 className="text-xl font-semibold mb-2">
                {card.title}
              </h3>

              <p className="text-gray-400">
                {card.description}
              </p>

            </Link>
          ))}

        </div>

      </div>

      {/* Assignment Features */}
      <div className="max-w-7xl mx-auto px-6 pb-12">

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">

          <h2 className="text-xl font-bold mb-4">
            Assignment Features
          </h2>

          <div className="grid md:grid-cols-2 gap-4">

            <div className="flex items-center gap-3">
              <span>✅</span>
              <span>User Authentication</span>
            </div>

            <div className="flex items-center gap-3">
              <span>✅</span>
              <span>Group Management</span>
            </div>

            <div className="flex items-center gap-3">
              <span>✅</span>
              <span>Expense Tracking</span>
            </div>

            <div className="flex items-center gap-3">
              <span>✅</span>
              <span>Balance Calculation</span>
            </div>

            <div className="flex items-center gap-3">
              <span>✅</span>
              <span>Settlement Suggestions</span>
            </div>

            <div className="flex items-center gap-3">
              <span>✅</span>
              <span>CSV Import Validation</span>
            </div>

            <div className="flex items-center gap-3">
              <span>✅</span>
              <span>Issue Detection</span>
            </div>

            <div className="flex items-center gap-3">
              <span>✅</span>
              <span>Approval Workflow</span>
            </div>

          </div>

        </div>

      </div>

    </div>
    </>
  );
};

export default Dashboard;