import { useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

const ImportPage = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file) {
      alert("Please select a CSV file");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("file", file);

      const response = await axios.post(
        "https://expense-sharing-app-b8cu.onrender.com/import/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setResult(response.data);

      alert("CSV Imported Successfully");
    } catch (error) {
      console.error(error);

      alert(
        error?.response?.data?.detail ||
        "Import Failed"
      );
    } finally {
      setLoading(false);
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
            CSV Import
          </h1>

          <p className="text-gray-400 mt-1">
            Upload and validate expense spreadsheets
          </p>

        </div>

      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">

        {/* Upload Card */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-8">

          <h2 className="text-xl font-semibold mb-6">
            Upload Expense CSV
          </h2>

          <form
            onSubmit={handleUpload}
            className="space-y-6"
          >

            <div>

              <label className="block text-gray-300 mb-2">
                Select CSV File
              </label>

              <input
                type="file"
                accept=".csv"
                onChange={(e) =>
                  setFile(e.target.files[0])
                }
                className="w-full bg-black border border-gray-700 rounded-lg p-3"
              />

            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold disabled:opacity-50"
            >
              {loading
                ? "Importing..."
                : "Import CSV"}
            </button>

          </form>

        </div>

        {/* Import Result */}
        {result && (

          <div className="mt-8 bg-gray-900 border border-gray-800 rounded-xl p-8">

            <h2 className="text-xl font-semibold mb-6">
              Import Summary
            </h2>

            <div className="grid md:grid-cols-3 gap-6">

              <div className="bg-black border border-gray-800 rounded-lg p-5">

                <h3 className="text-gray-400 text-sm">
                  Rows Processed
                </h3>

                <p className="text-3xl font-bold mt-2">
                  {result.rows_processed ||
                    result.rows ||
                    0}
                </p>

              </div>

              <div className="bg-black border border-gray-800 rounded-lg p-5">

                <h3 className="text-gray-400 text-sm">
                  Issues Found
                </h3>

                <p className="text-3xl font-bold text-yellow-400 mt-2">
                  {result.issues_found || 0}
                </p>

              </div>

              <div className="bg-black border border-gray-800 rounded-lg p-5">

                <h3 className="text-gray-400 text-sm">
                  Status
                </h3>

                <p className="text-3xl font-bold text-green-400 mt-2">
                  Success
                </p>

              </div>

            </div>

            {/* Raw Response */}
            <div className="mt-8">

              <h3 className="font-semibold mb-3">
                Response
              </h3>

              <pre className="bg-black border border-gray-800 rounded-lg p-4 overflow-auto text-sm">
                {JSON.stringify(
                  result,
                  null,
                  2
                )}
              </pre>

            </div>

          </div>

        )}

        {/* Feature Card */}
        <div className="mt-8 bg-gray-900 border border-gray-800 rounded-xl p-8">

          <h2 className="text-xl font-semibold mb-4">
            Import Validation
          </h2>

          <div className="grid md:grid-cols-2 gap-4">

            <div>✅ Missing Payer Detection</div>

            <div>✅ Duplicate Expense Detection</div>

            <div>✅ Invalid Date Detection</div>

            <div>✅ Unknown Member Detection</div>

            <div>✅ USD Expense Detection</div>

            <div>✅ Settlement Detection</div>

            <div>✅ Zero Amount Detection</div>

            <div>✅ Negative Amount Detection</div>

          </div>

        </div>

      </div>

    </div>
    </>
  );
};

export default ImportPage;