import React, { useEffect, useMemo, useState } from "react";
import RefreshIcon from "@mui/icons-material/Refresh";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { DataGrid } from "@mui/x-data-grid";

const API_URL = "https://jsonplaceholder.typicode.com/users";

const columns = [
  { field: "id", headerName: "ID", width: 80 },
  { field: "name", headerName: "Name", flex: 1, minWidth: 170 },
  { field: "username", headerName: "Username", flex: 1, minWidth: 130 },
  { field: "email", headerName: "Email", flex: 1.3, minWidth: 220 },
  { field: "phone", headerName: "Phone", flex: 1, minWidth: 170 },
  { field: "company", headerName: "Company", flex: 1, minWidth: 190 },
  { field: "city", headerName: "City", flex: 0.8, minWidth: 130 }
];

export default function App() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    async function loadUsers() {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(API_URL, { signal: controller.signal });

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        const users = await response.json();
        const nextRows = users.map((user) => ({
          id: user.id,
          name: user.name,
          username: user.username,
          email: user.email,
          phone: user.phone,
          company: user.company?.name ?? "",
          city: user.address?.city ?? ""
        }));

        setRows(nextRows);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError("資料載入失敗，請檢查網路或稍後再試。");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadUsers();

    return () => controller.abort();
  }, [reloadKey]);

  const totalCompanies = useMemo(
    () => new Set(rows.map((row) => row.company)).size,
    [rows]
  );

  return (
    <main className="app-shell">
      <Box className="content">
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          alignItems={{ xs: "flex-start", sm: "center" }}
          justifyContent="space-between"
          className="header"
        >
          <Box>
            <Typography variant="h4" component="h1" fontWeight={700}>
              HW5 React DataGrid
            </Typography>
            <Typography color="text.secondary">
              useEffect 呼叫 API，並用 MUI DataGrid 呈現資料
            </Typography>
          </Box>

          <Stack direction="row" spacing={1} alignItems="center">
            <Chip label={`${rows.length} 筆資料`} color="primary" variant="outlined" />
            <Chip label={`${totalCompanies} 間公司`} color="success" variant="outlined" />
            <Button
              variant="contained"
              startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <RefreshIcon />}
              onClick={() => setReloadKey((key) => key + 1)}
              disabled={loading}
            >
              重新載入
            </Button>
          </Stack>
        </Stack>

        {error && (
          <Alert severity="error" className="alert">
            {error}
          </Alert>
        )}

        <Paper elevation={3} className="grid-paper">
          <DataGrid
            rows={rows}
            columns={columns}
            loading={loading}
            pageSizeOptions={[5, 10]}
            initialState={{
              pagination: {
                paginationModel: { pageSize: 5, page: 0 }
              }
            }}
            disableRowSelectionOnClick
          />
        </Paper>
      </Box>
    </main>
  );
}
