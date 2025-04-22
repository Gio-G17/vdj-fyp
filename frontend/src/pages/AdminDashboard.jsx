import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/adminDashboard.css";

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [message, setMessage] = useState("");

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get("http://localhost:5001/api/admin/users", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setUsers(res.data);
        } catch (err) {
            console.error("Error fetching users:", err);
            setMessage("Access denied or server error.");
        }
    };

    const promoteToDJ = async (email) => {
        try {
            const token = localStorage.getItem("token");
            await axios.post(
                "http://localhost:5001/api/admin/promote",
                { email },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            setMessage(`${email} promoted to DJ.`);
            fetchUsers(); // refresh list
        } catch (err) {
            console.error("Promotion error:", err);
            setMessage("Failed to promote user.");
        }
    };

    const demoteToClient = async (email) => {
        try {
          const token = localStorage.getItem("token");
          await axios.post(
            "http://localhost:5001/api/admin/demote",
            { email },
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );
          setMessage(`${email} demoted to Client.`);
          fetchUsers(); // refresh
        } catch (err) {
          console.error("Demotion error:", err);
          setMessage("Failed to demote user.");
        }
      };
      

    useEffect(() => {
        fetchUsers();
    }, []);

    return (
        <div className="admin-dashboard">
            <h2>Admin Dashboard</h2>
            {message && <p className="message">{message}</p>}
            <table>
                <thead>
                    <tr>
                        <th>Name</th><th>Email</th><th>Role</th><th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user._id}>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>{user.role}</td>
                            <td>
                                {user.role === "client" ? (
                                    <button onClick={() => promoteToDJ(user.email)}>
                                        Promote to DJ
                                    </button>
                                ) : user.role === "dj" ? (
                                    <button onClick={() => demoteToClient(user.email)}>
                                        Demote to Client
                                    </button>
                                ) : null}

                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminDashboard;
