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

  return (
    <div>
      <h3>Admin Settings</h3>

      <div className="card p-3 mt-3">
        <label>Company Name</label>
        <input
          className="form-control"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
        />

        <label className="mt-3">Company Address</label>
        <textarea
          className="form-control"
          value={companyAddress}
          onChange={(e) => setCompanyAddress(e.target.value)}
        />

        <label className="mt-3">Company Email</label>
        <input
          className="form-control"
          value={companyEmail}
          onChange={(e) => setCompanyEmail(e.target.value)}
        />

        <label className="mt-3">Terms (for PO PDF)</label>
        <textarea
          className="form-control"
          value={terms}
          onChange={(e) => setTerms(e.target.value)}
        />

        <label className="mt-3">Company Logo</label>
        <input
          type="file"
          className="form-control"
          onChange={(e) => setLogo(e.target.files[0])}
        />

        {settings.logo && (
          <img
            src={`http://localhost:5000/${settings.logo}`}
            alt="Logo"
            style={{ width: "120px", marginTop: "10px" }}
          />
        )}

        <button className="btn btn-primary mt-3" onClick={saveSettings}>
          Save Settings
        </button>
      </div>
    </div>
  );
}
