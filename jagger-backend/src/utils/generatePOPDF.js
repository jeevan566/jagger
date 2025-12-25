const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

exports.generatePOPDF = (po) => {
  return new Promise((resolve, reject) => {
    try {
      const dir = path.join(__dirname, "../../generated");
      if (!fs.existsSync(dir)) fs.mkdirSync(dir);

      const pdfPath = path.join(dir, `PO_${po.poNumber}.pdf`);
      const doc = new PDFDocument({ margin: 50 });
      const stream = fs.createWriteStream(pdfPath);
      doc.pipe(stream);

      // // ================= HEADER =================
      // doc
      //   .image(path.join(__dirname, "../assets/logo.png"), 50, 40, {
      //     width: 80,
      //   })
      //   .fontSize(20)
      //   .text("PURCHASE ORDER", 150, 50, { align: "left" });

      doc
        .fontSize(10)
        .text("jeevan rai Pvt. Ltd.")
        .text("Procurement Department")
        .moveDown(2);

      // ================= PO DETAILS =================
      doc.fontSize(12);
      doc.text(`PO Number: ${po.poNumber}`);
      doc.text(`Date: ${new Date(po.createdAt).toLocaleDateString()}`);
      doc.moveDown(1.5);

      // ================= SUPPLIER =================
      doc.fontSize(14).text("Supplier Details", { underline: true });
      doc.moveDown(0.5);

      doc.fontSize(12);
      doc.text(`Name: ${po.supplierId?.name || "N/A"}`);
      doc.text(`Email: ${po.supplierId?.email || "N/A"}`);
      doc.moveDown(2);

      // ================= ITEMS TABLE =================
      doc.fontSize(14).text("Order Items", { underline: true });
      doc.moveDown(1);

      const tableTop = doc.y;
      const col = [50, 220, 280, 350, 430];

      doc.fontSize(11);
      doc.text("Product", col[0], tableTop);
      doc.text("Qty", col[1], tableTop);
      doc.text("Unit", col[2], tableTop);
      doc.text("Price", col[3], tableTop);
      doc.text("Total", col[4], tableTop);

      doc
        .moveTo(50, tableTop + 15)
        .lineTo(550, tableTop + 15)
        .stroke();

      let y = tableTop + 25;
      let grandTotal = 0;

      po.items.forEach((item) => {
        doc.text(item.productId?.name || "N/A", col[0], y);
        doc.text(item.quantity, col[1], y);
        doc.text(item.unit || "-", col[2], y);
        doc.text(item.price?.toFixed(2) || "0.00", col[3], y);
        doc.text(item.total?.toFixed(2) || "0.00", col[4], y);

        grandTotal += item.total || 0;
        y += 20;
      });

      doc.moveDown(2);
      doc.fontSize(12).text(`Grand Total: ₹${grandTotal.toFixed(2)}`, {
        align: "right",
      });

      // ================= NOTES =================
      doc.moveDown(2);
      doc.fontSize(14).text("Notes", { underline: true });
      doc.fontSize(11).text(po.notes || "N/A");

      // ================= SIGNATURE =================
      doc.moveDown(3);
      doc.text("Authorized Signature");
      doc.moveDown(1);
      doc.text("____________________________");

      doc.end();

      stream.on("finish", () => resolve(pdfPath));
      stream.on("error", reject);
    } catch (err) {
      reject(err);
    }
  });
};
