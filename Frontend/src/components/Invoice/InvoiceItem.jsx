import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import { BiTrash } from "react-icons/bi";
import EditableField from "./EditableField";

const InvoiceItem = ({
  items,
  onItemizedItemEdit,
  currency,
  onRowDel,
  onRowAdd,
  productsList,
  onProductChange,
}) => {
  return (
    <div>
      <Table>
        <thead>
          <tr>
            <th>ITEM</th>
            <th>QTY</th>
            <th>PRICE/RATE</th>
            <th className="text-center">ACTION</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <ItemRow
              key={item.id}
              item={item}
              onItemizedItemEdit={onItemizedItemEdit}
              onDelEvent={onRowDel}
              currency={currency}
              productsList={productsList}
              onProductChange={onProductChange}
            />
          ))}
        </tbody>
      </Table>
      <Button className="fw-bold btn-secondary" onClick={onRowAdd}>
        Add Item
      </Button>
    </div>
  );
};

const ItemRow = ({
  item,
  onItemizedItemEdit,
  onDelEvent,
  currency,
  productsList = [],
  onProductChange,
}) => {
  const handleDelete = () => {
    onDelEvent(item);
  };

  return (
    <tr>
      <td style={{ width: "100%" }}>
        {/* Product Dropdown Select */}
        <select
          className="form-select bg-gray-800 text-white border border-gray-600 my-1"
          style={{ padding: "0.375rem 2.25rem 0.375rem 0.75rem", fontSize: "0.875rem" }}
          value={item.productId || ""}
          onChange={(e) => {
            const selectedId = e.target.value;
            const selectedProd = productsList.find((p) => p._id === selectedId);
            onProductChange(item.id, selectedId, selectedProd);
          }}
        >
          <option value="">-- Select Product from Inventory --</option>
          {productsList.map((prod) => (
            <option key={prod._id} value={prod._id} className="text-black bg-white">
              {prod.ProductName} (Stock: {prod.quantity} {prod.unitOfMeasurement})
            </option>
          ))}
        </select>

        {/* Display Item Name */}
        <input
          type="text"
          className="form-control bg-transparent text-white border-0 py-1 px-2 font-semibold"
          placeholder="Item Name (Auto-filled)"
          value={item.name}
          readOnly
          style={{ pointerEvents: "none" }}
        />

        {/* Editable Item Description */}
        <EditableField
          onItemizedItemEdit={onItemizedItemEdit}
          cellData={{
            type: "text",
            name: "description",
            placeholder: "Additional notes or description",
            value: item.description,
            id: item.id,
          }}
        />
      </td>
      <td style={{ minWidth: "70px" }}>
        <EditableField
          onItemizedItemEdit={onItemizedItemEdit}
          cellData={{
            type: "number",
            name: "quantity",
            min: 1,
            step: "1",
            value: item.quantity,
            id: item.id,
          }}
        />
      </td>
      <td style={{ minWidth: "130px" }}>
        <EditableField
          onItemizedItemEdit={onItemizedItemEdit}
          cellData={{
            leading: currency,
            type: "number",
            name: "price",
            min: 1,
            step: "0.01",
            presicion: 2,
            textAlign: "text-end",
            value: item.price,
            id: item.id,
          }}
        />
      </td>
      <td className="text-center" style={{ minWidth: "50px" }}>
        <BiTrash
          onClick={handleDelete}
          style={{ height: "33px", width: "33px", padding: "7.5px" }}
          className="text-white mt-1 btn btn-danger"
        />
      </td>
    </tr>
  );
};

export default InvoiceItem;
