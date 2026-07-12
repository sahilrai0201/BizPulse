import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import Modal from "react-bootstrap/Modal";
import { BiCloudDownload } from "react-icons/bi";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const GenerateInvoice = (invoiceNumber) => {
  html2canvas(document.querySelector("#invoiceCapture"), {
    scale: 2, // High resolution capture
    useCORS: true
  }).then((canvas) => {
    const imgData = canvas.toDataURL("image/png", 1.0);
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "pt",
      format: [612, 792],
    });
    pdf.internal.scaleFactor = 1;
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`invoice-${invoiceNumber || "001"}.pdf`);
  });
};

const InvoiceModal = ({
  showModal,
  closeModal,
  info,
  currency,
  total,
  items,
  taxAmount,
  discountAmount,
  subTotal,
  onSaveInvoice,
  isSaving,
}) => {
  const brandColor = info.brandColor || "Indigo";
  const templateTheme = info.templateTheme || "Modern";

  // Map branding colors to CSS hex colors
  const accentColor = 
    brandColor === "Emerald" ? "#10B981" : 
    brandColor === "Ruby" ? "#EF4444" : 
    "#4F46E5"; // Default Indigo

  return (
    <div>
      <Modal show={showModal} onHide={closeModal} size="lg" centered>
        <div id="invoiceCapture" style={{ backgroundColor: "#ffffff" }}>
          
          {/* Header Banners based on selected theme */}
          {templateTheme === "Modern" ? (
            <div className="d-flex flex-row justify-content-between align-items-start w-100 p-4 text-white" style={{ backgroundColor: accentColor }}>
              <div className="w-100 text-left">
                <h4 className="fw-bold my-2 text-white">
                  {info.billFrom || "John Uberbacher"}
                </h4>
                <h6 className="mb-1" style={{ color: "#e0e7ff" }}>
                  Invoice Number: {info.invoiceNumber || ""}
                </h6>
              </div>
              <div className="text-end ms-4">
                <h6 className="mt-1 mb-2" style={{ color: "#e0e7ff" }}>Amount Due:</h6>
                <h4 className="fw-bold text-white">
                  {currency} {total}
                </h4>
              </div>
            </div>
          ) : templateTheme === "Classic" ? (
            <div className="d-flex flex-row justify-content-between align-items-start bg-light w-100 p-4" style={{ borderTop: `6px solid ${accentColor}` }}>
              <div className="w-100 text-left">
                <h4 className="fw-bold my-2 text-dark">
                  {info.billFrom || "John Uberbacher"}
                </h4>
                <h6 className="fw-bold text-secondary mb-1">
                  Invoice Number: {info.invoiceNumber || ""}
                </h6>
              </div>
              <div className="text-end ms-4">
                <h6 className="fw-bold mt-1 mb-2 text-secondary">Amount Due:</h6>
                <h4 className="fw-bold" style={{ color: accentColor }}>
                  {currency} {total}
                </h4>
              </div>
            </div>
          ) : (
            // Minimalist Layout
            <div className="d-flex flex-row justify-content-between align-items-start bg-white w-100 p-4 border-bottom border-2 border-dark">
              <div className="w-100 text-left">
                <h4 className="fw-bold my-2 text-dark">
                  {info.billFrom || "John Uberbacher"}
                </h4>
                <h6 className="text-secondary mb-1">
                  Invoice Ref: #{info.invoiceNumber || ""}
                </h6>
              </div>
              <div className="text-end ms-4">
                <h6 className="text-secondary mt-1 mb-2">Total Due:</h6>
                <h4 className="fw-bold text-dark">
                  {currency} {total}
                </h4>
              </div>
            </div>
          )}

          {/* Details & Body */}
          <div className="p-4 bg-white text-dark">
            <Row className="mb-4 text-left">
              <Col md={4}>
                <div className="fw-bold text-secondary text-uppercase mb-1" style={{ fontSize: "11px" }}>Billed From:</div>
                <div className="fw-bold text-dark">{info.billFrom || ""}</div>
                <div className="text-secondary small">{info.billFromAddress || ""}</div>
                <div className="text-secondary small">{info.billFromEmail || ""}</div>
              </Col>
              <Col md={4}>
                <div className="fw-bold text-secondary text-uppercase mb-1" style={{ fontSize: "11px" }}>Billed To:</div>
                <div className="fw-bold text-dark">{info.billTo || ""}</div>
                <div className="text-secondary small">{info.billToAddress || ""}</div>
                <div className="text-secondary small">{info.billToEmail || ""}</div>
              </Col>
              <Col md={4}>
                <div className="fw-bold text-secondary text-uppercase mb-1" style={{ fontSize: "11px" }}>Date Of Issue:</div>
                <div className="text-dark">{info.dateOfIssue || ""}</div>
              </Col>
            </Row>

            <Table className="mb-0 table-bordered">
              <thead>
                <tr>
                  <th style={{ backgroundColor: templateTheme === "Modern" ? accentColor : "#f3f4f6", color: templateTheme === "Modern" ? "white" : "#374151" }}>QTY</th>
                  <th style={{ backgroundColor: templateTheme === "Modern" ? accentColor : "#f3f4f6", color: templateTheme === "Modern" ? "white" : "#374151" }}>DESCRIPTION</th>
                  <th className="text-end" style={{ backgroundColor: templateTheme === "Modern" ? accentColor : "#f3f4f6", color: templateTheme === "Modern" ? "white" : "#374151", width: "120px" }}>PRICE</th>
                  <th className="text-end" style={{ backgroundColor: templateTheme === "Modern" ? accentColor : "#f3f4f6", color: templateTheme === "Modern" ? "white" : "#374151", width: "120px" }}>AMOUNT</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, i) => {
                  return (
                    <tr id={i} key={i}>
                      <td style={{ width: "70px" }} className="text-dark">{item.quantity}</td>
                      <td className="text-dark text-left">
                        {item.name} - {item.description}
                      </td>
                      <td className="text-end text-dark" style={{ width: "120px" }}>
                        {currency} {parseFloat(item.price || 0).toFixed(2)}
                      </td>
                      <td className="text-end text-dark fw-bold" style={{ width: "120px" }}>
                        {currency} {(parseFloat(item.price || 0) * parseInt(item.quantity || 0)).toFixed(2)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
            
            <Table className="border-0">
              <tbody>
                <tr className="text-end border-0">
                  <td className="border-0"></td>
                  <td className="fw-bold text-secondary border-0" style={{ width: "150px" }}>
                    SUBTOTAL
                  </td>
                  <td className="text-end text-dark border-0 fw-semibold" style={{ width: "120px" }}>
                    {currency} {subTotal}
                  </td>
                </tr>
                {parseFloat(taxAmount) > 0 && (
                  <tr className="text-end border-0">
                    <td className="border-0"></td>
                    <td className="fw-bold text-secondary border-0" style={{ width: "150px" }}>
                      TAX / GST
                    </td>
                    <td className="text-end text-dark border-0 fw-semibold" style={{ width: "120px" }}>
                      {currency} {taxAmount}
                    </td>
                  </tr>
                )}
                {parseFloat(discountAmount) > 0 && (
                  <tr className="text-end border-0">
                    <td className="border-0"></td>
                    <td className="fw-bold text-secondary border-0" style={{ width: "150px" }}>
                      DISCOUNT
                    </td>
                    <td className="text-end text-danger border-0 fw-semibold" style={{ width: "120px" }}>
                      -{currency} {discountAmount}
                    </td>
                  </tr>
                )}
                <tr className="text-end border-0">
                  <td className="border-0"></td>
                  <td className="fw-bold text-dark border-0" style={{ width: "150px", fontSize: "15px" }}>
                    TOTAL
                  </td>
                  <td className="text-end border-0 fw-bold" style={{ width: "120px", color: accentColor, fontSize: "17px" }}>
                    {currency} {total}
                  </td>
                </tr>
              </tbody>
            </Table>
            {info.notes && (
              <div className="bg-light py-3 px-4 rounded text-left text-secondary small" style={{ borderLeft: `4px solid ${accentColor}` }}>
                <span className="fw-bold text-dark d-block mb-1">Notes:</span>
                {info.notes}
              </div>
            )}
          </div>
        </div>
        
        {/* Modal Actions */}
        <div className="pb-4 px-4 bg-white rounded-bottom">
          <Row>
            <Col md={6}>
              <Button
                variant="success"
                className="d-block w-100 mt-3 mt-md-0"
                onClick={onSaveInvoice}
                disabled={isSaving}
                style={{ backgroundColor: accentColor, borderColor: accentColor }}
              >
                {isSaving ? "Saving..." : "Save to Database"}
              </Button>
            </Col>
            <Col md={6}>
              <Button
                variant="outline-secondary"
                className="d-block w-100 mt-3 mt-md-0"
                onClick={() => GenerateInvoice(info.invoiceNumber)}
              >
                <BiCloudDownload
                  style={{ width: "16px", height: "16px", marginTop: "-3px" }}
                  className="me-2"
                />
                Download Copy
              </Button>
            </Col>
          </Row>
        </div>
      </Modal>
    </div>
  );
};

export default InvoiceModal;
