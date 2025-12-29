import { useEffect, useState } from "react";
import api from "../api/api";
import { useParams, useNavigate } from "react-router-dom";

export default function CreatePO() {
  const { id } = useParams(); // rfqId
  const navigate = useNavigate();

  const [quotes, setQuotes] = useState([]);
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const res = await api.get(`/quotes/rfq/${id}/compare`);
      setQuotes(res.data.quotes);
    };

    fetchData();
  }, [id]);

  const chooseSupplier = (quote) => {
    setSelectedQuote(quote);
  };

  const createPO = async () => {
    const items = selectedQuote.items.map((i) => ({
      productId: i.rfqItemId.productId,
      quantity: i.rfqItemId.quantity,
      unit: i.rfqItemId.unit,
      price: i.price,
      total: i.price * i.rfqItemId.quantity,
    }));

    await api.post("/pos", {
      supplierId: selectedQuote.supplierId._id,
      rfqId: id,
      items,
      notes,
    });

    navigate("/pos");
  };

  // return (
  //   <div>
  //     <h3>Create Purchase Order</h3>

  //     <h5>Select Winning Supplier</h5>

  //     {quotes.map((q) => (
  //       <div className="card p-3 mb-2" key={q._id}>
  //         <h6>{q.supplierId.name}</h6>
  //         <button
  //           className="btn btn-primary mt-2"
  //           onClick={() => chooseSupplier(q)}
  //         >
  //           Select Supplier
  //         </button>
  //       </div>
  //     ))}

  //     {selectedQuote && (
  //       <div className="card p-3 mt-4 bg-light">
  //         <h5>Selected Supplier: {selectedQuote.supplierId.name}</h5>

  //         <h6 className="mt-3">PO Items</h6>
  //         <table className="table table-bordered">
  //           <thead>
  //             <tr>
  //               <th>Product</th>
  //               <th>Qty</th>
  //               <th>Unit</th>
  //               <th>Price</th>
  //               <th>Total</th>
  //             </tr>
  //           </thead>

  //           <tbody>
  //             {selectedQuote.items.map((i) => (
  //               <tr key={i._id}>
  //                 <td>{i.rfqItemId.productId.name}</td>
  //                 <td>{i.rfqItemId.quantity}</td>
  //                 <td>{i.rfqItemId.unit}</td>
  //                 <td>{i.price}</td>
  //                 <td>{i.price * i.rfqItemId.quantity}</td>
  //               </tr>
  //             ))}
  //           </tbody>
  //         </table>

  //         <textarea
  //           className="form-control mt-3"
  //           placeholder="Notes"
  //           value={notes}
  //           onChange={(e) => setNotes(e.target.value)}
  //         />

  //         <button className="btn btn-success mt-3" onClick={createPO}>
  //           Create PO
  //         </button>
  //       </div>
  //     )}
  //   </div>
  // );

  return (
    <div className="page-wrapper">
      <h3 className="page-title">Create Purchase Order</h3>

      {/* Supplier Selection */}
      <div className="settings-card mb-4">
        <h5 className="mb-3">Select Winning Supplier</h5>

        <div className="row g-3">
          {quotes.map((q) => (
            <div className="col-md-4" key={q._id}>
              <div
                className={`card h-100 ${
                  selectedQuote?._id === q._id ? "border-success" : ""
                }`}
              >
                <div className="card-body">
                  <h6 className="fw-semibold">{q.supplierId.name}</h6>
                  <button
                    className="btn btn-primary btn-sm mt-3"
                    onClick={() => chooseSupplier(q)}
                  >
                    Select Supplier
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Selected Supplier Details */}
      {selectedQuote && (
        <div className="settings-card">
          <h5 className="mb-3">
            Selected Supplier:{" "}
            <span className="fw-semibold">{selectedQuote.supplierId.name}</span>
          </h5>

          {/* PO Items */}
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th>Product</th>
                  <th>Qty</th>
                  <th>Unit</th>
                  <th>Price</th>
                  <th>Total</th>
                </tr>
              </thead>

              <tbody>
                {selectedQuote.items.map((i) => (
                  <tr key={i._id}>
                    <td>{i.rfqItemId.productId.name}</td>
                    <td>{i.rfqItemId.quantity}</td>
                    <td>{i.rfqItemId.unit}</td>
                    <td>{i.price}</td>
                    <td>{i.price * i.rfqItemId.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Notes */}
          <div className="mt-3">
            <label className="form-label">Notes</label>
            <textarea
              className="form-control"
              rows="3"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          {/* Action */}
          <div className="text-end mt-4">
            <button className="btn btn-success px-4" onClick={createPO}>
              Create PO
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
