import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

const Issues = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchIssues = async () => {
    try {
      const response = await axios.get(
        "https://expense-sharing-app-b8cu.onrender.com/import/issues"
      );

      setIssues(response.data.issues || []);
    } catch (error) {
      console.error(error);
      alert("Failed to load issues");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIssues();
  }, []);

  const approveIssue = async (id) => {
    try {
      await axios.post(
        `https://expense-sharing-app-b8cu.onrender.com/import/issues/${id}/approve`
      );

      alert("Issue Approved");

      fetchIssues();
    } catch (error) {
      console.error(error);
      alert("Approval Failed");
    }
  };

  const rejectIssue = async (id) => {
    try {
      await axios.post(
        `https://expense-sharing-app-b8cu.onrender.com/import/issues/${id}/reject`
      );

      alert("Issue Rejected");

      fetchIssues();
    } catch (error) {
      console.error(error);
      alert("Rejection Failed");
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "HIGH":
        return "bg-red-500/20 text-red-400";
      case "MEDIUM":
        return "bg-yellow-500/20 text-yellow-400";
      case "LOW":
        return "bg-green-500/20 text-green-400";
      default:
        return "bg-gray-700 text-gray-300";
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
            Import Issues
          </h1>

          <p className="text-gray-400 mt-1">
            Review and manage detected CSV issues
          </p>

        </div>

      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* Summary */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h3 className="text-gray-400 text-sm">
              Total Issues
            </h3>

            <p className="text-3xl font-bold mt-2">
              {issues.length}
            </p>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h3 className="text-gray-400 text-sm">
              Pending
            </h3>

            <p className="text-3xl font-bold text-yellow-400 mt-2">
              {
                issues.filter(
                  (issue) => issue.status === "PENDING"
                ).length
              }
            </p>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h3 className="text-gray-400 text-sm">
              Reviewed
            </h3>

            <p className="text-3xl font-bold text-green-400 mt-2">
              {
                issues.filter(
                  (issue) => issue.status !== "PENDING"
                ).length
              }
            </p>
          </div>

        </div>

        {/* Issues Table */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">

          <div className="p-6 border-b border-gray-800">

            <h2 className="text-xl font-semibold">
              Detected Issues
            </h2>

          </div>

          {loading ? (
            <div className="p-10 text-center">
              Loading...
            </div>
          ) : (
            <div className="overflow-x-auto">

              <table className="w-full">

                <thead>

                  <tr className="bg-gray-950">

                    <th className="px-6 py-4 text-left">
                      Row
                    </th>

                    <th className="px-6 py-4 text-left">
                      Type
                    </th>

                    <th className="px-6 py-4 text-left">
                      Description
                    </th>

                    <th className="px-6 py-4 text-left">
                      Severity
                    </th>

                    <th className="px-6 py-4 text-left">
                      Status
                    </th>

                    <th className="px-6 py-4 text-center">
                      Actions
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {issues.length > 0 ? (
                    issues.map((issue) => (
                      <tr
                        key={issue.id}
                        className="border-t border-gray-800"
                      >

                        <td className="px-6 py-4">
                          {issue.row_number}
                        </td>

                        <td className="px-6 py-4 font-medium">
                          {issue.issue_type}
                        </td>

                        <td className="px-6 py-4 text-gray-300">
                          {issue.description}
                        </td>

                        <td className="px-6 py-4">

                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${getSeverityColor(
                              issue.severity
                            )}`}
                          >
                            {issue.severity}
                          </span>

                        </td>

                        <td className="px-6 py-4">
                          {issue.status}
                        </td>

                        <td className="px-6 py-4">

                          {issue.status === "PENDING" ? (

                            <div className="flex justify-center gap-2">

                              <button
                                onClick={() =>
                                  approveIssue(issue.id)
                                }
                                className="bg-green-600 hover:bg-green-700 px-3 py-2 rounded-lg text-sm"
                              >
                                Approve
                              </button>

                              <button
                                onClick={() =>
                                  rejectIssue(issue.id)
                                }
                                className="bg-red-600 hover:bg-red-700 px-3 py-2 rounded-lg text-sm"
                              >
                                Reject
                              </button>

                            </div>

                          ) : (

                            <span className="text-gray-400">
                              Reviewed
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
                        No Issues Found
                      </td>

                    </tr>
                  )}

                </tbody>

              </table>

            </div>
          )}

        </div>

      </div>

    </div>
    </>
  );
};

export default Issues;