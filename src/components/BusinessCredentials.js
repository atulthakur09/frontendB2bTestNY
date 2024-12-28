import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from "../context/AuthContext";
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from '@mui/material';
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const BusinessCredentials = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  
  const { user } = useAuth();

  const [businessDetails, setBusinessDetails] = useState({
    email: user ? user.email : '',
    contact: '',
    businessName: '',
    billingAddress: '',
    gstin: '',
  });
  const [errors, setErrors] = useState({});

  // Function to handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setBusinessDetails({
      ...businessDetails,
      [name]: value,
    });
  };

  // Validation function
  const validate = () => {
    const errors = {};
    if (!businessDetails.email.trim()) errors.email = "Email is required";
    if (!businessDetails.contact.trim()) {
      errors.contact = "Contact number is required";
    } else if (!/^[0-9]{10}$/.test(businessDetails.contact)) {
      errors.contact = "Contact number must be a valid 10-digit number";
    }
    if (!businessDetails.businessName.trim()) errors.businessName = "Business name is required";
    if (!businessDetails.billingAddress.trim()) errors.billingAddress = "Billing address is required";
    if (!businessDetails.gstin.trim()) {
      errors.gstin = "GSTIN is required";
    } else if (!/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[A-Z0-9]{1}[Z]{1}[A-Z0-9]{1}$/.test(businessDetails.gstin)) {
      errors.gstin = "Invalid GSTIN format";
    }
    return errors;
  };

  // Handle form submission
  const handleSubmit = async () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length === 0) {
      try {
        // API call to submit business details
        const response = await axios.post(`${API_BASE_URL}/b2b/fleetInfo`, businessDetails, {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.status === 201) {
          alert("Business details submitted successfully!");
          setDialogOpen(false);
          setBusinessDetails({
            email: '',
            contact: '',
            businessName: '',
            billingAddress: '',
            gstin: '',
          });
        }
      } catch (error) {
        console.error("Error submitting business details:", error);
        alert("Failed to submit business details. Please try again later.");
      }
    } else {
      setErrors(validationErrors);
    }
  };

  return (
    <div>
      {/* Button to open the dialog */}
      <Button variant="contained" color="primary" onClick={() => setDialogOpen(true)}>
        Add Business Details
      </Button>

      {/* Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Enter Business Details</DialogTitle>
        <DialogContent>
          {/* Email */}
          <TextField
            fullWidth
            label="Enter Email"
            name="email"
            readOnly
            value={businessDetails.email}
            onChange={handleChange}
            margin="normal"
            error={!!errors.email}
            helperText={errors.email}
          />

          {/* Contact */}
          <TextField
            fullWidth
            label="Enter Mobile Number"
            name="contact"
            value={businessDetails.contact}
            onChange={handleChange}
            margin="normal"
            error={!!errors.contact}
            helperText={errors.contact}
          />

          {/* Business Name */}
          <TextField
            fullWidth
            label="Business Name"
            name="businessName"
            value={businessDetails.businessName}
            // onChange={handleChange}
            onChange={(e) =>
              handleChange({
                target: {
                  name: e.target.name,
                  value: e.target.value.toUpperCase(), // Convert input to uppercase
                },
              })
            }
            margin="normal"
            error={!!errors.businessName}
            helperText={errors.businessName}
          />

          {/* Billing Address */}
          <TextField
            fullWidth
            label="Billing Address / Business Address"
            name="billingAddress"
            value={businessDetails.billingAddress}
            onChange={handleChange}
            margin="normal"
            multiline
            rows={3}
            error={!!errors.billingAddress}
            helperText={errors.billingAddress}
          />

          {/* GSTIN */}
          <TextField
  fullWidth
  label="GSTIN"
  name="gstin"
  value={businessDetails.gstin}
  onChange={(e) =>
    handleChange({
      target: {
        name: e.target.name,
        value: e.target.value.toUpperCase(), // Convert input to uppercase
      },
    })
  }
  margin="normal"
  error={!!errors.gstin}
  helperText={errors.gstin}
/>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary" variant="contained">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default BusinessCredentials;
