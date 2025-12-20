const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

exports.generatePOPDF = (po) => {
  return new Promise((resolve, reject) => {
    try {
      const pdfPath = path.join(
        __dirname,
        `../../generated/PO_${po.poNumber}.pdf`
      );

      if (!fs.existsSync(path.join(__dirname, "../../generated"))) {
        fs.mkdirSync(path.join(__dirname, "../../generated"));
      }

      const doc = new PDFDocument({ margin: 50 });
      const stream = fs.createWriteStream(pdfPath);
      doc.pipe(stream);

      // ===========================
      // HEADER SECTION
      // ===========================
      doc
        .image(path.join(__dirname, "../assets/logo.png"), 50, 40, { width: 80 })
        .fontSize(20)
        .text("PURCHASE ORDER", 150, 50, { align: "left" });

      doc
        .fontSize(10)
        .text("Your Company Name Pvt. Ltd.", 150, 80)
        .text("123 Business Street", 150, 95)
        .text("City, Country, ZIP", 150, 110)
        .moveDown(2);

      // ===========================
      // PO DETAILS SECTION
      // ===========================
      doc.fontSize(12).text(`PO Number: ${po.poNumber}`);
      doc.text(`Date: ${new Date(po.createdAt).toLocaleDateString()}`).moveDown();

      // ===========================
      // SUPPLIER DETAILS SECTION
      // ===========================
      doc.fontSize(14).text("Supplier Details", { underline: true });
      doc
        .fontSize(12)
        .text(`Name: ${po.supplierId.name}`)
        .text(`Email: ${po.supplierId.email}`)
        .moveDown(2);

      // ===========================
      // ITEMS TABLE HEADER
      // ===========================
      doc.fontSize(13).text("Order Items", { underline: true }).moveDown(0.5);

      const tableTop = doc.y;
      const col1 = 50;
      const col2 = 220;
      const col3 = 280;
      const col4 = 340;
      const col5 = 410;

      doc.fontSize(10);
      doc.text("Product", col1, tableTop);
      doc.text("Qty", col2, tableTop);
      doc.text("Unit", col3, tableTop);
      doc.text("Price", col4, tableTop);
      doc.text("Total", col5, tableTop);

      doc.moveTo(col1, tableTop + 15)
        .lineTo(550, tableTop + 15)
        .stroke();

      // ===========================
      // TABLE ROWS
      // ===========================
      let yPos = tableTop + 25;
      let grandTotal = 0;

      po.items.forEach((item) => {
        doc.text(item.productId.name, col1, yPos);
        doc.text(item.quantity.toString(), col2, yPos);
        doc.text(item.unit, col3, yPos);
        doc.text(item.price.toFixed(2), col4, yPos);
        doc.text(item.total.toFixed(2), col5, yPos);

        grandTotal += item.total;
        yPos += 20;
      });

      // ===========================
      // TOTAL AMOUNT
      // ===========================
      doc.moveTo(50, yPos + 5).lineTo(550, yPos + 5).stroke();

      doc.fontSize(12).text(`Grand Total: ₹${grandTotal.toFixed(2)}`, {
        align: "right",
      });

      // ===========================
      // NOTES SECTION
      // ===========================
      doc.moveDown(2);
      doc.fontSize(14).text("Notes", { underline: true });
      doc.fontSize(11).text(po.notes || "N/A", { indent: 20 });

      // ===========================
      // SIGNATURE SECTION
      // ===========================
      doc.moveDown(3);
      doc.fontSize(12).text("Authorized Signature:", 50);
      doc.moveDown(1);
      doc.text("______________________________", 50);

      doc.end();

      stream.on("finish", () => resolve(pdfPath));
      stream.on("error", reject);
    } catch (err) {
      reject(err);
    }
  });
};
