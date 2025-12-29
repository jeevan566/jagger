import { useEffect, useState } from "react";
import api from "../api/api";
import { useParams, useNavigate } from "react-router-dom";

export default function CompareQuotes() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [rfqItems, setRfqItems] = useState([]);
  const [quotes, setQuotes] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      const res = await api.get(`/quotes/rfq/${id}/compare`);
      setQuotes(res.data.quotes);
      setRfqItems(res.data.rfqItems);
    };

    loadData();
  }, [id]);

  const getLowestPrice = (rfqItemId) => {
    const prices = quotes.map(
      (q) =>
        q.items.find((i) => i.rfqItemId._id === rfqItemId)?.price || Infinity
    );
    return Math.min(...prices);
  };

  const getSupplierTotal = (supplierQuote) => {
    return supplierQuote.items.reduce(
      (sum, item) => sum + (item.price || 0),
      0
    );
  };

  // return (
  //   <div>
  //     <h3>Quote Comparison</h3>

  //     <table className="table table-bordered mt-4">
  //       <thead className="table-dark">
  //         <tr>
  //           <th>Item</th>
  //           <th>Qty</th>

  //           {quotes.map((q) => (
  //             <th key={q._id}>{q.supplierId.name}</th>
  //           ))}
  //         </tr>
  //       </thead>

  //       <tbody>
  //         {rfqItems.map((item) => {
  //           const lowest = getLowestPrice(item._id);

  //           return (
  //             <tr key={item._id}>
  //               <td>{item.productId.name}</td>
  //               <td>{item.quantity}</td>

  //               {quotes.map((q) => {
  //                 const obj = q.items.find((i) => i.rfqItemId._id === item._id);
  //                 const price = obj?.price ?? "-";

  //                 return (
  //                   <td
  //                     key={q._id}
  //                     className={price == lowest ? "bg-success text-white" : ""}
  //                   >
  //                     {price}
  //                   </td>
  //                 );
  //               })}
  //             </tr>
  //           );
  //         })}
  //       </tbody>

  //       <tfoot>
  //         <tr className="table-secondary">
  //           <td colSpan="2">
  //             <strong>Total</strong>
  //           </td>

  //           {quotes.map((q) => (
  //             <td key={q._id}>
  //               <strong>{getSupplierTotal(q)}</strong>
  //             </td>
  //           ))}
  //         </tr>
  //       </tfoot>
  //     </table>
  //     <button
  //       className="btn btn-success mt-4"
  //       onClick={() => navigate(`/create-po/${id}`)}
  //     >
  //       Create Purchase Order
  //     </button>
  //   </div>
  // );

  return (
    <div className="page-wrapper">
      <h3 className="page-title">Quote Comparison</h3>

      <div className="settings-card">
        <div className="table-responsive">
          <table className="table table-hover align-middle text-center">
            <thead className="table-light">
              <tr>
                <th className="text-start">Item</th>
                <th>Qty</th>
                {quotes.map((q) => (
                  <th key={q._id}>{q.supplierId.name}</th>
                ))}
              </tr>
            </thead>

            <tbody>
              {rfqItems.length === 0 ? (
                <tr>
                  <td colSpan={quotes.length + 2} className="text-muted py-4">
                    No RFQ items available
                  </td>
                </tr>
              ) : (
                rfqItems.map((item) => {
                  const lowest = getLowestPrice(item._id);

                  return (
                    <tr key={item._id}>
                      <td className="text-start">{item.productId.name}</td>
                      <td>{item.quantity}</td>

                      {quotes.map((q) => {
                        const obj = q.items.find(
                          (i) => i.rfqItemId._id === item._id
                        );
                        const price = obj?.price ?? "-";

                        const isLowest = price !== "-" && price === lowest;

                        return (
                          <td
                            key={q._id}
                            className={
                              isLowest
                                ? "bg-success text-white fw-semibold"
                                : ""
                            }
                          >
                            {price}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })
              )}
            </tbody>

            <tfoot>
              <tr className="table-secondary">
                <td colSpan="2" className="text-end fw-bold">
                  Total
                </td>
                {quotes.map((q) => (
                  <td key={q._id} className="fw-bold">
                    {getSupplierTotal(q)}
                  </td>
                ))}
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Action */}
        <div className="text-end mt-4">
          <button
            className="btn btn-success px-4"
            onClick={() => navigate(`/create-po/${id}`)}
          >
            Create Purchase Order
          </button>
        </div>
      </div>
    </div>
  );
}
