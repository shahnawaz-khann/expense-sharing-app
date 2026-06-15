import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

const Groups = () => {
  const [groups, setGroups] = useState([]);
  const [groupName, setGroupName] = useState("");
  const [createdBy, setCreatedBy] = useState("");

  const fetchGroups = async () => {
    try {
      const res = await axios.get(
        "https://expense-sharing-app-b8cu.onrender.com/groups"
      );

      setGroups(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  const createGroup = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        "https://expense-sharing-app-b8cu.onrender.com/groups",
        {
          name: groupName,
          created_by: Number(createdBy),
        }
      );

      alert("Group Created");

      setGroupName("");
      setCreatedBy("");

      fetchGroups();
    } catch (error) {
      console.error(error);

      alert(
        error?.response?.data?.detail ||
          "Failed to create group"
      );
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
            Group Management
          </h1>

          <p className="text-gray-400 mt-1">
            Create and manage expense groups
          </p>

        </div>

      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* Create Group */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-8">

          <h2 className="text-xl font-semibold mb-5">
            Create New Group
          </h2>

          <form
            onSubmit={createGroup}
            className="grid md:grid-cols-3 gap-4"
          >

            <input
              type="text"
              placeholder="Group Name"
              value={groupName}
              onChange={(e) =>
                setGroupName(e.target.value)
              }
              className="bg-black border border-gray-700 rounded-lg px-4 py-3"
              required
            />

            <input
              type="number"
              placeholder="Created By (User ID)"
              value={createdBy}
              onChange={(e) =>
                setCreatedBy(e.target.value)
              }
              className="bg-black border border-gray-700 rounded-lg px-4 py-3"
              required
            />

            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 rounded-lg px-4 py-3 font-semibold"
            >
              Create Group
            </button>

          </form>

        </div>

        {/* Groups Table */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">

          <div className="p-6 border-b border-gray-800">

            <h2 className="text-xl font-semibold">
              Existing Groups
            </h2>

          </div>

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead>

                <tr className="bg-gray-950">

                  <th className="text-left px-6 py-4">
                    ID
                  </th>

                  <th className="text-left px-6 py-4">
                    Name
                  </th>

                  <th className="text-left px-6 py-4">
                    Created By
                  </th>

                </tr>

              </thead>

              <tbody>

                {groups.length > 0 ? (
                  groups.map((group) => (
                    <tr
                      key={group.id}
                      className="border-t border-gray-800"
                    >

                      <td className="px-6 py-4">
                        {group.id}
                      </td>

                      <td className="px-6 py-4">
                        {group.name}
                      </td>

                      <td className="px-6 py-4">
                        {group.created_by}
                      </td>

                    </tr>
                  ))
                ) : (
                  <tr>

                    <td
                      colSpan="3"
                      className="text-center py-10 text-gray-400"
                    >
                      No Groups Found
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

export default Groups;