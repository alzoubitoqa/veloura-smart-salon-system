import { useEffect, useState } from "react";
import API from "../services/api";

function Inventory() {
  const [items, setItems] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [newItem, setNewItem] = useState({
    name: "",
    category: "",
    quantity: "",
    minLevel: "",
    unit: "",
  });

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      const res = await API.get("/inventory");
      setItems(res.data);
    } catch (error) {
      console.error("Error fetching inventory", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewItem((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddItem = async (e) => {
    e.preventDefault();

    if (
      !newItem.name ||
      !newItem.category ||
      !newItem.quantity ||
      !newItem.minLevel ||
      !newItem.unit
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      await API.post("/inventory", {
        ...newItem,
        quantity: Number(newItem.quantity),
        minLevel: Number(newItem.minLevel),
      });

      setNewItem({
        name: "",
        category: "",
        quantity: "",
        minLevel: "",
        unit: "",
      });

      setShowForm(false);
      fetchInventory();
    } catch (error) {
      console.error("Error adding inventory item", error);
    }
  };

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStockStatus = (quantity, minLevel) => {
    return Number(quantity) <= Number(minLevel) ? "Low Stock" : "In Stock";
  };

  return (
    <div className="inventory-page">
      <div className="page-header">
        <div>
          <h2>Inventory Management</h2>
          <p>Track salon materials and stock alerts.</p>
        </div>

        <button className="primary-btn" onClick={() => setShowForm(!showForm)}>
          {showForm ? "Close Form" : "+ Add Item"}
        </button>
      </div>

      <div className="toolbar">
        <input
          type="text"
          placeholder="Search item..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      {showForm && (
        <form className="client-form" onSubmit={handleAddItem}>
          <div className="form-grid">
            <input
              type="text"
              name="name"
              placeholder="Item Name"
              value={newItem.name}
              onChange={handleChange}
            />

            <input
              type="text"
              name="category"
              placeholder="Category"
              value={newItem.category}
              onChange={handleChange}
            />

            <input
              type="number"
              name="quantity"
              placeholder="Quantity"
              value={newItem.quantity}
              onChange={handleChange}
            />

            <input
              type="number"
              name="minLevel"
              placeholder="Minimum Level"
              value={newItem.minLevel}
              onChange={handleChange}
            />

            <input
              type="text"
              name="unit"
              placeholder="Unit"
              value={newItem.unit}
              onChange={handleChange}
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="primary-btn">
              Save Item
            </button>
          </div>
        </form>
      )}

      <div className="table-card">
        <table className="clients-table">
          <thead>
            <tr>
              <th>Item</th>
              <th>Category</th>
              <th>Quantity</th>
              <th>Minimum Level</th>
              <th>Unit</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => {
                const status = getStockStatus(item.quantity, item.minLevel);

                return (
                  <tr key={item.id}>
                    <td>{item.name}</td>
                    <td>{item.category}</td>
                    <td>{item.quantity}</td>
                    <td>{item.minLevel}</td>
                    <td>{item.unit}</td>
                    <td>
                      <span
                        className={`status-badge ${
                          status === "Low Stock" ? "cancelled" : "completed"
                        }`}
                      >
                        {status}
                      </span>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="6" className="empty-state">
                  No inventory items found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Inventory;