import { useEffect, useState } from "react";
import api from "../api/api";

export default function AdminSettings() {
  const [settings, setSettings] = useState({});
  const [companyName, setCompanyName] = useState("");
  const [companyAddress, setCompanyAddress] = useState("");
  const [companyEmail, setCompanyEmail] = useState("");
  const [terms, setTerms] = useState("");
  const [logo, setLogo] = useState(null);

  useEffect(() => {
    const loadSettings = async () => {
      const res = await api.get("/settings");
      if (res.data) {
        setSettings(res.data);
        setCompanyName(res.data.companyName || "");
        setCompanyAddress(res.data.companyAddress || "");
        setCompanyEmail(res.data.companyEmail || "");
        setTerms(res.data.terms || "");
      }
    };

    loadSettings();
  }, []); // ✅ No ESLint warnings now

  const saveSettings = async () => {
    const formData = new FormData();
    formData.append("companyName", companyName);
    formData.append("companyAddress", companyAddress);
    formData.append("companyEmail", companyEmail);
    formData.append("terms", terms);

    if (logo) {
      formData.append("logo", logo);
    }

    await api.put("/settings", formData);
    alert("Settings updated!");

    // Refresh settings after save
    const updated = await api.get("/settings");
    setSettings(updated.data);
  };

  // return (
  //   <div>
  //     <h3>Admin Settings</h3>

  //     <div className="card p-3 mt-3">
  //       <label>Company Name</label>
  //       <input
  //         className="form-control"
  //         value={companyName}
  //         onChange={(e) => setCompanyName(e.target.value)}
  //       />

  //       <label className="mt-3">Company Address</label>
  //       <textarea
  //         className="form-control"
  //         value={companyAddress}
  //         onChange={(e) => setCompanyAddress(e.target.value)}
  //       />

  //       <label className="mt-3">Company Email</label>
  //       <input
  //         className="form-control"
  //         value={companyEmail}
  //         onChange={(e) => setCompanyEmail(e.target.value)}
  //       />

  //       <label className="mt-3">Terms (for PO PDF)</label>
  //       <textarea
  //         className="form-control"
  //         value={terms}
  //         onChange={(e) => setTerms(e.target.value)}
  //       />

  //       <label className="mt-3">Company Logo</label>
  //       <input
  //         type="file"
  //         className="form-control"
  //         onChange={(e) => setLogo(e.target.files[0])}
  //       />

  //       {settings.logo && (
  //         <img
  //           src={`http://localhost:5000/${settings.logo}`}
  //           alt="Logo"
  //           style={{ width: "120px", marginTop: "10px" }}
  //         />
  //       )}

  //       <button className="btn btn-primary mt-3" onClick={saveSettings}>
  //         Save Settings
  //       </button>
  //     </div>
  //   </div>
  // );
  return (
    <div className="page-wrapper">
      <h3 className="page-title">Admin Settings</h3>

      <div className="settings-card mb-5">
        <div className="row g-4">
          {/* Company Name */}
          <div className="col-md-6">
            <label className="form-label">Company Name</label>
            <input
              className="form-control"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
            />
          </div>

          {/* Company Email */}
          <div className="col-md-6">
            <label className="form-label">Company Email</label>
            <input
              className="form-control"
              value={companyEmail}
              onChange={(e) => setCompanyEmail(e.target.value)}
            />
          </div>

          {/* Address */}
          <div className="col-md-12">
            <label className="form-label">Company Address</label>
            <textarea
              rows="3"
              className="form-control"
              value={companyAddress}
              onChange={(e) => setCompanyAddress(e.target.value)}
            />
          </div>

          {/* Terms */}
          <div className="col-md-12">
            <label className="form-label">Terms (for PO PDF)</label>
            <textarea
              rows="4"
              className="form-control"
              value={terms}
              onChange={(e) => setTerms(e.target.value)}
            />
          </div>

          {/* Logo Upload */}
          <div className="col-md-6">
            <label className="form-label">Company Logo</label>
            <input
              type="file"
              className="form-control"
              onChange={(e) => setLogo(e.target.files[0])}
            />
          </div>

          {/* Logo Preview */}
          <div className="col-md-6 d-flex align-items-end">
            {settings.logo && (
              <img
                src={`http://localhost:5000/${settings.logo}`}
                alt="Logo"
                className="logo-preview"
              />
            )}
          </div>
        </div>

        {/* Save Button */}
        <div className="text-end mt-4">
          <button className="btn btn-primary px-4" onClick={saveSettings}>
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}
