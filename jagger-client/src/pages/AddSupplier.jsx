import { useState } from "react";
import api from "../api/api";

export default function AddSupplier() {
  const [form, setForm] = useState({
    name: "",
    companyName: "",
    email: "",
    password: "",
    phone: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/suppliers", form);
      alert("✅ Supplier added successfully");

      setForm({
        name: "",
        companyName: "",
        email: "",
        password: "",
        phone: "",
      });
    } catch (err) {
      alert(err.response?.data?.message || "Error adding supplier");
    }
  };

  // return (
  //   <div className="container mt-4">
  //     <div className="row justify-content-center">
  //       <div className="col-md-6">
  //         <div className="card shadow">
  //           <div className="card-header bg-dark text-white">
  //             <h5 className="mb-0">Add Supplier</h5>
  //           </div>

  //           <div className="card-body">
  //             <form onSubmit={submit}>
  //               <div className="mb-3">
  //                 <label className="form-label">Supplier Name</label>
  //                 <input
  //                   type="text"
  //                   className="form-control"
  //                   name="name"
  //                   value={form.name}
  //                   onChange={handleChange}
  //                   required
  //                 />
  //               </div>

  //               <div className="mb-3">
  //                 <label className="form-label">Company Name</label>
  //                 <input
  //                   type="text"
  //                   className="form-control"
  //                   name="companyName"
  //                   value={form.companyName}
  //                   onChange={handleChange}
  //                   required
  //                 />
  //               </div>

  //               <div className="mb-3">
  //                 <label className="form-label">Email</label>
  //                 <input
  //                   type="email"
  //                   className="form-control"
  //                   name="email"
  //                   value={form.email}
  //                   onChange={handleChange}
  //                   required
  //                 />
  //               </div>

  //               <div className="mb-3">
  //                 <label className="form-label">Password</label>
  //                 <input
  //                   type="password"
  //                   className="form-control"
  //                   name="password"
  //                   value={form.password}
  //                   onChange={handleChange}
  //                   required
  //                 />
  //               </div>

  //               <div className="mb-3">
  //                 <label className="form-label">Phone</label>
  //                 <input
  //                   type="text"
  //                   className="form-control"
  //                   name="phone"
  //                   value={form.phone}
  //                   onChange={handleChange}
  //                 />
  //               </div>

  //               <button type="submit" className="btn btn-primary w-100">
  //                 Add Supplier
  //               </button>
  //             </form>
  //           </div>
  //         </div>

  //         <p className="text-muted text-center mt-3">
  //           Supplier will be able to login using the provided email & password.
  //         </p>
  //       </div>
  //     </div>
  //   </div>
  // );
  return (
    <div className="page-wrapper">
      <h3 className="page-title">Add Supplier</h3>

      <div
        className="settings-card"
        style={{ maxWidth: "700px", margin: "0 auto" }}
      >
        <form onSubmit={submit}>
          <div className="row g-3">
            {/* Supplier Name */}
            <div className="col-md-6">
              <label className="form-label">Supplier Name</label>
              <input
                type="text"
                className="form-control"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>

            {/* Company Name */}
            <div className="col-md-6">
              <label className="form-label">Company Name</label>
              <input
                type="text"
                className="form-control"
                name="companyName"
                value={form.companyName}
                onChange={handleChange}
                required
              />
            </div>

            {/* Email */}
            <div className="col-md-6">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            {/* Phone */}
            <div className="col-md-6">
              <label className="form-label">Phone</label>
              <input
                type="text"
                className="form-control"
                name="phone"
                value={form.phone}
                onChange={handleChange}
              />
            </div>

            {/* Password */}
            <div className="col-md-12">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
              />
              <small className="text-muted">
                Supplier will use this password for first login.
              </small>
            </div>
          </div>

          {/* Submit */}
          <div className="text-end mt-4">
            <button type="submit" className="btn btn-primary px-4">
              Add Supplier
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
