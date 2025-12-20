import { useState } from "react";
// import api from "../api/api";
import { AuthContext } from "../context/AuthContext";

export default function Register() {
  // const { user } = useContext(AuthContext);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "manager",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const registerUser = async (e) => {
    e.preventDefault();

    try {
    //   const res = await api.post("/auth/register", form);
      alert("User created successfully");
    } catch (err) {
      alert(err?.response?.data?.message || "Error");
    }
  };

  // if (!user || user.role !== "admin") {
  //   return <h2>Only admin can create new users</h2>;
  // }

  return (
    <div style={{ padding: 20 }}>
      <h2>Create New User</h2>

      <form onSubmit={registerUser}>
        <input
          name="name"
          placeholder="Name"
          onChange={handleChange}
          value={form.name}
        /><br /><br />

        <input
          name="email"
          placeholder="Email"
          onChange={handleChange}
          value={form.email}
        /><br /><br />

        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
          value={form.password}
        /><br /><br />

        <select name="role" onChange={handleChange} value={form.role}>
          <option value="admin">Admin</option>
          <option value="manager">Manager</option>
          <option value="supplier">Supplier</option>
        </select>
        <br /><br />

        <button type="submit">Create User</button>
      </form>
    </div>
  );
}
