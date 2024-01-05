// PhoneCatalog.js
import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Include Bootstrap CSS
import './PhoneCatalog.css';

const ENDPOINT = 'http://localhost:8080'; // Update with your API server URL

const PhoneCatalog = () => {
  const [phones, setPhones] = useState([]);
  const [phoneModel, setPhoneModel] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    fetchPhoneData();
    fetchBrands();
  }, []);

  const fetchPhoneData = async () => {
    try {
      const response = await fetch(`${ENDPOINT}/phonesandbrands`);

      if (!response.ok) {
        throw new Error('Failed to fetch phones');
      }

      const data = await response.json();
      setPhones(data);
    } catch (error) {
      console.error('Error fetching phones:', error);
    }
  };

  const fetchBrands = async () => {
    try {
      const response = await fetch(`${ENDPOINT}/brands`);

      if (!response.ok) {
        throw new Error('Failed to fetch brands');
      }

      const data = await response.json();
      setBrands(data);
    } catch (error) {
      console.error('Error fetching brands:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${ENDPOINT}/api/phones`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone_model: phoneModel,
          brand_id: selectedBrand,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add phone');
      }

      // Refresh the phone data after adding a new phone
      fetchPhoneData();
      // Reset the form fields
      setPhoneModel('');
      setSelectedBrand('');
    } catch (error) {
      console.error('Error adding phone:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${ENDPOINT}/api/phones/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete phone');
      }

      // Refresh the phone data after deleting a phone
      fetchPhoneData();
    } catch (error) {
      console.error('Error deleting phone:', error);
    }
  };

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Phone Catalogs</h1>
      <form onSubmit={handleSubmit} className="row g-3">
    <div className="col-md-4 mb-3">
      <label htmlFor="phoneModel" className="form-label">
        Phone Model:
      </label>
      <input
        type="text"
        className="form-control"
        id="phoneModel"
        value={phoneModel}
        onChange={(e) => setPhoneModel(e.target.value)}
        required
      />
    </div>
    <div className="col-md-6 mb-3">
      <label htmlFor="brand" className="form-label">
        Brand:
      </label>
      <select
        className="form-select"
        id="brand"
        value={selectedBrand}
        onChange={(e) => setSelectedBrand(e.target.value)}
        required
      >
        <option value="" disabled>
          Select Brand
        </option>
        {brands.map((brand) => (
          <option key={brand.id} value={brand.id}>
            {brand.brand_name}
          </option>
        ))}
      </select>
    </div>
    <div className="col-12">
      <button type="submit" className="btn btn-primary">
        Add Phone
      </button>
    </div>
  </form>
  <div className="mt-4">
        <table className="table table-bordered">
          <thead className="thead-dark">
            <tr>
              <th>Phone Model</th>
              <th>Brand</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {phones.map((phone) => (
              <tr key={phone.id}>
                <td>{phone.phone_model}</td>
                <td>{phone.brand_name}</td>
                <td id="Del" className="delete-button" onClick={() => handleDelete(phone.id)}>
                  <span>Delete</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PhoneCatalog;
