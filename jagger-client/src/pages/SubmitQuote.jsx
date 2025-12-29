import { useEffect, useState } from "react";
import api from "../api/api";
import { useParams, useNavigate } from "react-router-dom";

export default function SubmitQuote() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [note, setNote] = useState("");

  useEffect(() => {
    const loadItems = async () => {
      const res = await api.get(`/quotes/${id}/items`);
      setItems(
        res.data.map((item) => ({
          ...item,
          price: 0,
        }))
      );
    };
    loadItems();
  }, [id]);

  const updatePrice = (index, value) => {
    const updated = [...items];
    updated[index].price = value;
    setItems(updated);
  };

  const submit = async () => {
    const payload = {
      notes: note,
      items: items.map((i) => ({
        rfqItemId: i._id,
        price: i.price,
      })),
    };

    await api.post(`/quotes/${id}/submit`, payload);

    alert("Quote submitted successfully!");
    navigate("/supplier-rfqs");
  };

  // return (
  //   <div>
  //     <h3>Submit Quote</h3>

  //     <table className="table table-bordered mt-3">
  //       <thead className="table-dark">
  //         <tr>
  //           <th>Product</th>
  //           <th>Qty</th>
  //           <th>Unit</th>
  //           <th>Your Price</th>
  //         </tr>
  //       </thead>

  //       <tbody>
  //         {items.map((i, idx) => (
  //           <tr key={i._id}>
  //             <td>{i.productId.name}</td>
  //             <td>{i.quantity}</td>
  //             <td>{i.unit}</td>
  //             <td>
  //               <input
  //                 type="number"
  //                 className="form-control"
  //                 onChange={(e) => updatePrice(idx, e.target.value)}
  //                 required
  //               />
  //             </td>
  //           </tr>
  //         ))}
  //       </tbody>
  //     </table>

  //     <textarea
  //       className="form-control mt-3"
  //       placeholder="Notes (optional)"
  //       value={note}
  //       onChange={(e) => setNote(e.target.value)}
  //     />

  //     <button className="btn btn-success mt-3" onClick={submit}>
  //       Submit Quote
  //     </button>
  //   </div>
  // );
  return (
    <div className="page-wrapper">
      <h3 className="page-title">Submit Quote</h3>

      <div className="settings-card">
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>Product</th>
                <th>Qty</th>
                <th>Unit</th>
                <th>Your Price</th>
              </tr>
            </thead>

            <tbody>
              {items.map((i, idx) => (
                <tr key={i._id}>
                  <td>{i.productId.name}</td>
                  <td>{i.quantity}</td>
                  <td>{i.unit}</td>
                  <td style={{ maxWidth: "160px" }}>
                    <input
                      type="number"
                      className="form-control"
                      onChange={(e) => updatePrice(idx, e.target.value)}
                      required
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-3">
          <label className="form-label">Notes (optional)</label>
          <textarea
            className="form-control"
            rows="3"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>

        <div className="text-end mt-4">
          <button className="btn btn-success px-4" onClick={submit}>
            Submit Quote
          </button>
        </div>
      </div>
    </div>
  );
}
