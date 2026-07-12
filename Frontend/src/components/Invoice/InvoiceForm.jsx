import React, { useState, useEffect, useCallback } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import InvoiceItem from "./InvoiceItem";
import InvoiceModal from "./InvoiceModal";
import InputGroup from "react-bootstrap/InputGroup";
import axios from "axios";

const InvoiceForm = ({ onInvoiceSaved }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currency, setCurrency] = useState("$");
  const [currentDate, setCurrentDate] = useState(
    new Date().toLocaleDateString()
  );
  const [invoiceNumber, setInvoiceNumber] = useState(1);
  const [dateOfIssue, setDateOfIssue] = useState("");
  const [billTo, setBillTo] = useState("");
  const [billToEmail, setBillToEmail] = useState("");
  const [billToAddress, setBillToAddress] = useState("");
  const [billToMobileNumber, setbillToMobileNumber] = useState("");
  const [gstNumber, setGstNumber] = useState("");
  
  const [billFrom, setBillFrom] = useState("Amazing Company");
  const [billFromEmail, setBillFromEmail] = useState("Amazing@gmail.com");
  const [billFromMobileNumber, setbillFromMobileNumber] = useState("756889898");
  const [billFromAddress, setBillFromAddress] = useState("Palo Alto, CA");
  const [notes, setNotes] = useState(
    "Thank you for doing business with us. Have a great day!"
  );
  const [total, setTotal] = useState("0.00");
  const [subTotal, setSubTotal] = useState("0.00");
  const [taxRate, setTaxRate] = useState("");
  const [taxAmount, setTaxAmount] = useState("0.00");
  const [discountRate, setDiscountRate] = useState("");
  const [discountAmount, setDiscountAmount] = useState("0.00");
  const [templateTheme, setTemplateTheme] = useState("Modern");
  const [brandColor, setBrandColor] = useState("Indigo");

  const [productsList, setProductsList] = useState([]);
  const [customersList, setCustomersList] = useState([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const [isNewCustomer, setIsNewCustomer] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [items, setItems] = useState([
    {
      id: (+new Date() + Math.floor(Math.random() * 999999)).toString(36),
      productId: "",
      name: "",
      description: "",
      price: "1.00",
      quantity: 1,
      gstRate: 0,
    },
  ]);

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const custRes = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/v1/customer/getall`);
        setCustomersList(custRes.data);
        
        const prodRes = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/v1/product/getall`);
        if (prodRes.status === 200) {
          setProductsList(prodRes.data.data);
        }
      } catch (err) {
        console.error("Error fetching customers/products:", err);
      }
    };
    fetchData();
  }, []);

  const handleCustomerChange = (e) => {
    const value = e.target.value;
    setSelectedCustomerId(value);
    
    if (value === "new") {
      setIsNewCustomer(true);
      setBillTo("");
      setBillToEmail("");
      setbillToMobileNumber("");
      setBillToAddress("");
      setGstNumber("");
    } else {
      setIsNewCustomer(false);
      const cust = customersList.find((c) => c._id === value);
      if (cust) {
        setBillTo(cust.BusinessName);
        setBillToEmail(cust.email);
        setbillToMobileNumber(cust.mobileNumber.toString());
        setBillToAddress(cust.BillingAddress);
        setGstNumber(cust.gstNumber.toString());
      } else {
        setBillTo("");
        setBillToEmail("");
        setbillToMobileNumber("");
        setBillToAddress("");
        setGstNumber("");
      }
    }
  };

  const onProductChange = (rowId, productId, productObj) => {
    const updatedItems = items.map((item) => {
      if (item.id === rowId) {
        const gstRate = productObj && productObj.category ? productObj.category.gstRate : 0;
        return {
          ...item,
          productId: productId,
          name: productObj ? productObj.ProductName : "",
          price: productObj ? productObj.cost.toString() : "1.00",
          description: productObj ? `${productObj.ProductName} (${productObj.unitOfMeasurement})` : "",
          gstRate: gstRate,
        };
      }
      return item;
    });
    setItems(updatedItems);
  };

  const handleCalculateTotal = useCallback(() => {
    let newSubTotal = items.reduce((acc, item) => {
      return acc + (parseFloat(item.price) || 0) * (parseInt(item.quantity) || 0);
    }, 0);

    let calculatedTaxAmount = items.reduce((acc, item) => {
      const price = parseFloat(item.price) || 0;
      const qty = parseInt(item.quantity) || 0;
      const rate = parseFloat(item.gstRate) || 0;
      return acc + (price * qty * (rate / 100));
    }, 0);

    let newdiscountAmount = (newSubTotal * (discountRate / 100));
    let newTotal = (
      newSubTotal -
      newdiscountAmount +
      calculatedTaxAmount
    ).toFixed(2);

    setSubTotal(newSubTotal.toFixed(2));
    setTaxAmount(calculatedTaxAmount.toFixed(2));
    setDiscountAmount(newdiscountAmount.toFixed(2));
    setTotal(newTotal);
  }, [items, discountRate]);

  useEffect(() => {
    handleCalculateTotal();
  }, [handleCalculateTotal]);

  const handleRowDel = (item) => {
    const updatedItems = items.filter((i) => i.id !== item.id);
    setItems(updatedItems);
  };

  const handleAddEvent = () => {
    const id = (+new Date() + Math.floor(Math.random() * 999999)).toString(36);
    const newItem = {
      id,
      productId: "",
      name: "",
      price: "1.00",
      description: "",
      quantity: 1,
      gstRate: 0,
    };
    setItems([...items, newItem]);
  };

  const onItemizedItemEdit = (evt) => {
    const { id, name, value } = evt.target;
    const updatedItems = items.map((item) =>
      item.id === id ? { ...item, [name]: value } : item
    );
    setItems(updatedItems);
  };

  const handleChange = (setter) => (event) => {
    setter(event.target.value);
    handleCalculateTotal();
  };

  const openModal = (event) => {
    event.preventDefault();
    handleCalculateTotal();
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const handleSaveInvoice = async () => {
    setIsSaving(true);
    try {
      let finalCustomerId = selectedCustomerId;

      // 1. If it's a new customer, save customer first
      if (isNewCustomer || !selectedCustomerId) {
        if (!billTo || !billToEmail || !billToMobileNumber || !gstNumber || !billToAddress) {
          alert("Please fill all billing customer details.");
          setIsSaving(false);
          return;
        }
        const custRes = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/v1/customer`, {
          BusinessName: billTo,
          email: billToEmail,
          mobileNumber: Number(billToMobileNumber),
          gstNumber: Number(gstNumber),
          BillingAddress: billToAddress,
        });
        finalCustomerId = custRes.data._id;
      }

      // 2. Map items to productDetails expected by backend
      const productDetails = items.map((item) => {
        if (!item.productId) {
          throw new Error("One or more items do not have a selected product.");
        }
        return {
          product: item.productId,
          ProductQuantity: Number(item.quantity),
        };
      });

      // 3. Register the Invoice
      const invoiceData = {
        InvoiceNumber: Number(invoiceNumber),
        productDetails,
        customerDetails: finalCustomerId,
        InvoiceAmount: Number(total),
        DateofIssue: dateOfIssue,
        subTotal: Number(subTotal),
      };

      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/v1/invoice/register`, invoiceData);
      if (response.status === 201) {
        alert("Invoice registered successfully!");
        setIsOpen(false);
        if (onInvoiceSaved) onInvoiceSaved();
      }
    } catch (err) {
      console.error("Error saving invoice:", err);
      alert(err.response?.data?.message || err.message || "Failed to save invoice.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Form onSubmit={openModal}>
      <Row>
        <Col md={8} lg={9}>
          <Card className="p-4 p-xl-5 my-3 my-xl-4 bg-gray-600">
            <div className="d-flex flex-row align-items-start justify-content-between mb-3 text-left">
              <div className="d-flex flex-column">
                <div className="d-flex flex-column">
                  <div className="mb-2">
                    <span className="fw-bold">Current&nbsp;Date:&nbsp;</span>
                    <span className="current-date">{currentDate}</span>
                  </div>
                </div>
                <div className="d-flex flex-row align-items-center">
                  <span className="fw-bold d-block me-2">Due&nbsp;Date:</span>
                  <Form.Control
                    type="date"
                    value={dateOfIssue}
                    name="dateOfIssue"
                    onChange={handleChange(setDateOfIssue)}
                    style={{ maxWidth: "150px" }}
                    required
                  />
                </div>
              </div>
              <div className="d-flex flex-row align-items-center">
                <span className="fw-bold me-2">Invoice&nbsp;Number:&nbsp;</span>
                <Form.Control
                  type="number"
                  value={invoiceNumber}
                  name="invoiceNumber"
                  onChange={handleChange(setInvoiceNumber)}
                  min="1"
                  style={{ maxWidth: "70px" }}
                  required
                />
              </div>
            </div>
            <hr className="my-4" />
            <Row className="mb-5 text-left">
              <Col>
                <Form.Label className="fw-bold">Bill from:</Form.Label>
                <div className="fw-bold">{billFrom}</div>
                <div className="fw-bold text-gray-300">{billFromEmail}</div>
                <div className="fw-bold text-gray-300">{billFromMobileNumber}</div>
                <div className="fw-bold text-gray-300">{billFromAddress}</div>
              </Col>
              <Col>
                <Form.Label className="fw-bold">Bill to:</Form.Label>
                <Form.Select
                  className="mb-3 bg-gray-800 text-white border-secondary"
                  value={selectedCustomerId}
                  onChange={handleCustomerChange}
                >
                  <option value="">-- Select Existing Customer --</option>
                  {customersList.map((cust) => (
                    <option key={cust._id} value={cust._id}>
                      {cust.BusinessName}
                    </option>
                  ))}
                  <option value="new">+ Add New Customer</option>
                </Form.Select>

                {(isNewCustomer || !selectedCustomerId) && (
                  <>
                    <Form.Control
                      placeholder="Who is this invoice to?"
                      value={billTo}
                      type="text"
                      name="billTo"
                      className="my-2 bg-gray-800 text-white border-secondary"
                      onChange={handleChange(setBillTo)}
                      required
                    />
                    <Form.Control
                      placeholder="Email address"
                      value={billToEmail}
                      type="email"
                      name="billToEmail"
                      className="my-2 bg-gray-800 text-white border-secondary"
                      onChange={handleChange(setBillToEmail)}
                      required
                    />
                    <Form.Control
                      placeholder="Mobile Number"
                      value={billToMobileNumber}
                      type="number"
                      name="billToMobileNumber"
                      className="my-2 bg-gray-800 text-white border-secondary"
                      onChange={handleChange(setbillToMobileNumber)}
                      required
                    />
                    <Form.Control
                      placeholder="GST Number"
                      value={gstNumber}
                      type="number"
                      name="gstNumber"
                      className="my-2 bg-gray-800 text-white border-secondary"
                      onChange={(e) => setGstNumber(e.target.value)}
                      required
                    />
                    <Form.Control
                      placeholder="Billing address"
                      value={billToAddress}
                      type="text"
                      name="billToAddress"
                      className="my-2 bg-gray-800 text-white border-secondary"
                      onChange={handleChange(setBillToAddress)}
                      required
                    />
                  </>
                )}

                {!isNewCustomer && selectedCustomerId && (
                  <div className="bg-gray-700 bg-opacity-50 p-3 rounded-lg border border-gray-600 text-sm text-gray-200">
                    <p className="font-semibold text-gray-100">{billTo}</p>
                    <p>Email: {billToEmail}</p>
                    <p>Mobile: {billToMobileNumber}</p>
                    <p>GSTIN: {gstNumber}</p>
                    <p>Address: {billToAddress}</p>
                  </div>
                )}
              </Col>
            </Row>
            <InvoiceItem
              onItemizedItemEdit={onItemizedItemEdit}
              onRowAdd={handleAddEvent}
              onRowDel={handleRowDel}
              currency={currency}
              items={items}
              productsList={productsList}
              onProductChange={onProductChange}
            />
            <Row className="mt-4 justify-content-end text-left">
              <Col lg={6}>
                <div className="d-flex flex-row align-items-start justify-content-between">
                  <span className="fw-bold">Subtotal:</span>
                  <span>
                    {currency}
                    {subTotal}
                  </span>
                </div>
                <div className="d-flex flex-row align-items-start justify-content-between mt-2">
                  <span className="fw-bold">Discount:</span>
                  <span>
                    <span className="small ">({discountRate || 0}%)</span>
                    {currency}
                    {discountAmount || 0}
                  </span>
                </div>
                <div className="d-flex flex-row align-items-start justify-content-between mt-2">
                  <span className="fw-bold">Tax:</span>
                  <span>
                    <span className="small ">({taxRate || 0}%)</span>
                    {currency}
                    {taxAmount || 0}
                  </span>
                </div>
                <hr />
                <div
                  className="d-flex flex-row align-items-start justify-content-between"
                  style={{ fontSize: "1.125rem" }}
                >
                  <span className="fw-bold">Total:</span>
                  <span className="fw-bold">
                    {currency}
                    {total || 0}
                  </span>
                </div>
              </Col>
            </Row>
            <hr className="my-4" />
            <Form.Label className="fw-bold">Notes:</Form.Label>
            <Form.Control
              placeholder="Thank you for doing business with us. Have a great day!"
              name="notes"
              value={notes}
              onChange={handleChange(setNotes)}
              as="textarea"
              className="my-2"
              rows={1}
            />
          </Card>
        </Col>
        <Col md={4} lg={3}>
          <div className="sticky-top pt-md-3 pt-xl-4 text-left">
            <InvoiceModal
              showModal={isOpen}
              closeModal={closeModal}
              info={{
                dateOfIssue,
                billTo,
                billToEmail,
                billToAddress,
                billToMobileNumber,
                gstNumber,
                billFrom,
                billFromEmail,
                billFromAddress,
                billFromMobileNumber,
                notes,
                invoiceNumber,
                templateTheme,
                brandColor,
              }}
              items={items}
              currency={currency}
              subTotal={subTotal}
              taxAmount={taxAmount}
              discountAmount={discountAmount}
              total={total}
              onSaveInvoice={handleSaveInvoice}
              isSaving={isSaving}
            />

            <Form.Group className="mb-3">
              <Form.Label className="fw-bold text-white">Currency:</Form.Label>
              <Form.Select
                onChange={(e) => {
                  setCurrency(e.target.value);
                }}
                className="btn btn-light my-1"
                aria-label="Change Currency"
              >
                <option value="$">USD (United States Dollar)</option>
                <option value="£">GBP (British Pound Sterling)</option>
                <option value="₹">INR (Indian Rupee)</option>
                <option value="¥">JPY (Japanese Yen)</option>
                <option value="$">CAD (Canadian Dollar)</option>
                <option value="$">AUD (Australian Dollar)</option>
                <option value="$">SGD (Singapore Dollar)</option>
                <option value="¥">CNY (Chinese Renminbi)</option>
                <option value="₿">BTC (Bitcoin)</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="my-3">
              <Form.Label className="fw-bold text-white">Tax (Auto-calculated GST):</Form.Label>
              <InputGroup className="my-1 flex-nowrap">
                <Form.Control
                  type="text"
                  value={`${currency}${taxAmount}`}
                  className="bg-gray-700 text-white border-0"
                  readOnly
                  disabled
                />
              </InputGroup>
            </Form.Group>
             <Form.Group className="my-3">
               <Form.Label className="fw-bold text-white">Discount rate:</Form.Label>
               <InputGroup className="my-1 flex-nowrap">
                 <Form.Control
                   name="discountRate"
                   type="number"
                   value={discountRate}
                   onChange={handleChange(setDiscountRate)}
                   className="bg-white border"
                   placeholder="0.0"
                   min="0.00"
                   step="0.01"
                   max="100.00"
                 />
                 <InputGroup.Text className="bg-light fw-bold text-secondary small">
                   %
                 </InputGroup.Text>
               </InputGroup>
             </Form.Group>
             <Form.Group className="my-3 text-left">
               <Form.Label className="fw-bold text-white">Invoice Template:</Form.Label>
               <Form.Select
                 value={templateTheme}
                 onChange={(e) => setTemplateTheme(e.target.value)}
                 className="btn btn-light my-1 w-100"
               >
                 <option value="Modern">Modern Theme (Solid Banner)</option>
                 <option value="Classic">Classic Theme (Border Header)</option>
                 <option value="Minimal">Minimal Theme (Plain Text)</option>
               </Form.Select>
             </Form.Group>
             <Form.Group className="my-3 text-left">
               <Form.Label className="fw-bold text-white">Brand Accent:</Form.Label>
               <Form.Select
                 value={brandColor}
                 onChange={(e) => setBrandColor(e.target.value)}
                 className="btn btn-light my-1 w-100"
               >
                 <option value="Indigo">Indigo Blue</option>
                 <option value="Emerald">Emerald Green</option>
                 <option value="Ruby">Ruby Red</option>
               </Form.Select>
             </Form.Group>
            <hr className="mt-4 mb-3" />
            <Button
              variant="primary"
              type="submit"
              className="d-block w-100 btn-secondary"
            >
              Review Invoice
            </Button>
          </div>
        </Col>
      </Row>
    </Form>
  );
};

export default InvoiceForm;
