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

  return (
    <div>
      <h3>Submit Quote</h3>

      <table className="table table-bordered mt-3">
        <thead className="table-dark">
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
              <td>
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

      <textarea
        className="form-control mt-3"
        placeholder="Notes (optional)"
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />

      <button className="btn btn-success mt-3" onClick={submit}>
        Submit Quote
      </button>
    </div>
  );
}
