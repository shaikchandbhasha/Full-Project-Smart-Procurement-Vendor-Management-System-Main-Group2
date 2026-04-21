import React, { useEffect, useState } from "react";
import API from "../../api/axios";

import {
  Box, Typography, Paper, TextField, Button, Grid,
  Container, MenuItem, Snackbar, Alert, FormControl,
  InputLabel, Select, Autocomplete
} from "@mui/material";

import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';

export default function ProcessPayment() {
  const [invoiceId, setInvoiceId] = useState("");
  const [paidAmount, setPaidAmount] = useState("");
  const [paymentDate, setPaymentDate] = useState("");
  const [paymentMode, setPaymentMode] = useState("");
  const [status, setStatus] = useState("");
  const [invoices, setInvoices] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  useEffect(() => {
    API.get("/invoice").then(res => setInvoices(res.data)).catch(() => {});
  }, []);

  const showMsg = (message, severity = "success") => setSnackbar({ open: true, message, severity });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!invoiceId || !paidAmount || !paymentDate || !paymentMode || !status) {
      showMsg("Please fill in all fields", "warning");
      return;
    }
    try {
      await API.post("/payment", {
        invoiceId: Number(invoiceId),
        paidAmount: Number(paidAmount),
        paymentDate,
        paymentMode,
        status,
      });
      showMsg("Payment Processed Successfully!");
      setInvoiceId(""); setPaidAmount(""); setPaymentDate(""); setPaymentMode(""); setStatus("");
    } catch (error) {
      console.error(error);
      const msg = error.response?.data?.message || "Failed to process payment — check Invoice ID";
      showMsg(msg, "error");
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 2 }}>
      <Box sx={{ mb: 4, textAlign: 'left' }}>
        <Typography variant="h4" sx={{ fontWeight: 800, color: "#333", display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: 2 }}>
          <AccountBalanceWalletIcon sx={{ fontSize: 40, color: "#1976d2" }} />
          Process Payment
        </Typography>
        <Typography variant="body1" color="text.secondary">Record a new payment transaction against an invoice</Typography>
      </Box>

      <Paper
  elevation={0}
  sx={{
    p: 4,
    borderRadius: "12px",
    border: "1px solid #e0e0e0",
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)"
  }}
>
  <form onSubmit={handleSubmit}>
    <Grid container spacing={3}>

      <Grid item xs={12} sm={6}>
        {/* Invoice Dropdown */}
        <TextField
          fullWidth
          label="Select Invoice"
          select
          required
          value={invoiceId}
          onChange={e => setInvoiceId(e.target.value)}
          InputLabelProps={{ shrink: true }}
        >
          {invoices.length > 0 ? (
            invoices.map(inv => (
              <MenuItem key={inv.id} value={inv.id}>
                #{inv.id} — {inv.invoiceNumber} (₹{inv.amount})
              </MenuItem>
            ))
          ) : (
            <MenuItem disabled>No invoices found</MenuItem>
          )}
        </TextField>

        {/* Manual Input */}
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ mt: 1, display: "block" }}
        >
          Or type Invoice ID manually:
        </Typography>

        <TextField
          fullWidth
          label="Invoice ID"
          type="number"
          value={invoiceId}
          onChange={e => setInvoiceId(e.target.value)}  // ✅ FIXED
          sx={{ mt: 1 }}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Paid Amount"
          type="number"
          required
          value={paidAmount}
          onChange={e => setPaidAmount(e.target.value)}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Payment Date"
          type="date"
          required
          InputLabelProps={{ shrink: true }}
          value={paymentDate}
          onChange={e => setPaymentDate(e.target.value)}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Payment Mode"
          select
          required
          SelectProps={{ native: true }}
          value={paymentMode}
          onChange={e => setPaymentMode(e.target.value)}
          InputLabelProps={{ shrink: true }}
        >
          <option value="" disabled>Select Payment Mode</option>
          <option value="CASH_TRANSFER">Cash Transfer</option>
          <option value="BANK_TRANSFER">Bank Transfer</option>
          <option value="UPI">UPI</option>
        </TextField>
      </Grid>

      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Status"
          select
          required
          SelectProps={{ native: true }}
          value={status}
          onChange={e => setStatus(e.target.value)}
          InputLabelProps={{ shrink: true }}
        >
          <option value="" disabled>Select Status</option>
          <option value="COMPLETED">Completed</option>
          <option value="PENDING">Pending</option>
        </TextField>
      </Grid>

      <Grid item xs={12}>
        <Button
          fullWidth
          variant="contained"
          type="submit"
          size="large"
          sx={{ bgcolor: "#1976d2", fontWeight: "bold", mt: 2 }}
        >
          PROCESS PAYMENT
        </Button>
      </Grid>

    </Grid>
  </form>
</Paper>
      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert severity={snackbar.severity} variant="filled">{snackbar.message}</Alert>
      </Snackbar>
    </Container>
  );
}
