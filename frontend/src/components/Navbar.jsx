import { Link, useLocation, useNavigate } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const navLinks = [
    {
      name: "Dashboard",
      path: "/dashboard",
    },
    {
      name: "Groups",
      path: "/groups",
    },
    {
      name: "Expenses",
      path: "/expenses",
    },
    {
      name: "CSV Import",
      path: "/import",
    },
    {
      name: "Issues",
      path: "/issues",
    },
  ];

  return (
    <nav className="bg-gray-950 border-b border-gray-800 sticky top-0 z-50">

      <div className="max-w-7xl mx-auto px-6">

        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link
            to="/dashboard"
            className="text-xl font-bold text-white"
          >
            Expense Tracker
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-2">

            {navLinks.map((link) => (

              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-lg transition ${
                  location.pathname === link.path
                    ? "bg-blue-600 text-white"
                    : "text-gray-300 hover:bg-gray-800 hover:text-white"
                }`}
              >
                {link.name}
              </Link>

            ))}

          </div>

          {/* Logout */}
          <button
            onClick={logout}
            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-white font-medium transition"
          >
            Logout
          </button>

        </div>

      </div>

    </nav>
  );
};

export default Navbar;