// import { useEffect, useState } from "react";
// import api from "../api/api";
// import { useParams, useNavigate } from "react-router-dom";

// export default function SubmitQuote() {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const [items, setItems] = useState([]);
//   const [note, setNote] = useState("");
//   const [hasSubmitted, setHasSubmitted] = useState(false); // ✅ NEW
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const loadData = async () => {
//       try {
//         // 🔒 Check if supplier already submitted quote
//         const check = await api.get(`/quotes/${id}/check`);
//         if (check.data.submitted) {
//           setHasSubmitted(true);
//           setLoading(false);
//           return;
//         }

//         // Load RFQ items only if not submitted
//         const res = await api.get(`/quotes/${id}/items`);
//         setItems(
//           res.data.map((item) => ({
//             ...item,
//             price: 0,
//           }))
//         );
//       } catch (err) {
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadData();
//   }, [id]);

//   const updatePrice = (index, value) => {
//     const updated = [...items];
//     updated[index].price = value;
//     setItems(updated);
//   };

//   const submit = async () => {
//     try {
//       const payload = {
//         notes: note,
//         items: items.map((i) => ({
//           rfqItemId: i._id,
//           price: i.price,
//         })),
//       };

//       await api.post(`/quotes/${id}/submit`, payload);

//       alert("Quote submitted successfully!");
//       navigate("/supplier-rfqs");
//     } catch (err) {
//       if (err.response?.status === 400) {
//         alert(err.response.data.message);
//         setHasSubmitted(true);
//       } else {
//         alert("Something went wrong");
//       }
//     }
//   };

//   if (loading) {
//     return <p className="text-muted">Loading...</p>;
//   }

//   return (
//     <div className="page-wrapper">
//       <h3 className="page-title">Submit Quote</h3>

//       <div className="settings-card">
//         {hasSubmitted ? (
//           // ✅ ALREADY SUBMITTED MESSAGE
//           <div className="alert alert-success">
//             ✅ You have already submitted a quote for this RFQ.
//           </div>
//         ) : (
//           <>
//             <div className="table-responsive">
//               <table className="table table-hover align-middle">
//                 <thead className="table-light">
//                   <tr>
//                     <th>Product</th>
//                     <th>Qty</th>
//                     <th>Unit</th>
//                     <th>Your Price</th>
//                   </tr>
//                 </thead>

//                 <tbody>
//                   {items.map((i, idx) => (
//                     <tr key={i._id}>
//                       <td>{i.productId?.name}</td>
//                       <td>{i.quantity}</td>
//                       <td>{i.unit}</td>
//                       <td style={{ maxWidth: "160px" }}>
//                         <input
//                           type="number"
//                           className="form-control"
//                           onChange={(e) =>
//                             updatePrice(idx, e.target.value)
//                           }
//                           required
//                         />
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>

//             <div className="mt-3">
//               <label className="form-label">Notes (optional)</label>
//               <textarea
//                 className="form-control"
//                 rows="3"
//                 value={note}
//                 onChange={(e) => setNote(e.target.value)}
//               />
//             </div>

//             <div className="text-end mt-4">
//               <button
//                 className="btn btn-success px-4"
//                 onClick={submit}
//               >
//                 Submit Quote
//               </button>
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   );
// }
import { useEffect, useState } from "react";
import api from "../api/api";
import { useParams, useNavigate } from "react-router-dom";

export default function SubmitQuote() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [note, setNote] = useState("");
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        // 🔒 STEP 1: check if quote already submitted
        const check = await api.get(`/quotes/${id}/check`);

        if (check.data.submitted) {
          setHasSubmitted(true);
          setLoading(false);
          return; // ❌ Do not load items
        }

        // 🔹 STEP 2: load RFQ items only if not submitted
        const res = await api.get(`/quotes/${id}/items`);
        setItems(
          res.data.map((item) => ({
            ...item,
            price: 0,
          }))
        );
      } catch (err) {
        console.error(err);
        alert("Failed to load quote data");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  const updatePrice = (index, value) => {
    const updated = [...items];
    updated[index].price = value;
    setItems(updated);
  };

  const submit = async () => {
    try {
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
    } catch (err) {
      if (err.response?.status === 400) {
        alert(err.response.data.message);
        setHasSubmitted(true);
      } else {
        alert("Something went wrong while submitting quote");
      }
    }
  };

  if (loading) {
    return (
      <div className="page-wrapper">
        <p className="text-muted">Loading...</p>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <h3 className="page-title">Submit Quote</h3>

      <div className="settings-card">
        {hasSubmitted ? (
          // ✅ Already submitted message
          <div className="alert alert-success">
            ✅ You have already submitted a quote for this RFQ.
          </div>
        ) : (
          <>
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
                      <td>{i.productId?.name}</td>
                      <td>{i.quantity}</td>
                      <td>{i.unit}</td>
                      <td style={{ maxWidth: "160px" }}>
                        <input
                          type="number"
                          className="form-control"
                          onChange={(e) =>
                            updatePrice(idx, e.target.value)
                          }
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
              <button
                className="btn btn-success px-4"
                onClick={submit}
              >
                Submit Quote
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
