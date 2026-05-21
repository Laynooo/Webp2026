import React, { useEffect, useMemo, useState } from "react";
import RefreshIcon from "@mui/icons-material/Refresh";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { DataGrid } from "@mui/x-data-grid";

const API_URL =
  "https://cloud.culture.tw/frontsite/trans/SearchShowAction.do?method=doFindTypeJ&category=6";

const columns = [
  { field: "id", headerName: "ID", width: 80 },
  { field: "title", headerName: "名稱資訊", flex: 1.6, minWidth: 260 },
  { field: "location", headerName: "地點", flex: 1.3, minWidth: 240 },
  { field: "price", headerName: "票價", flex: 1, minWidth: 170 },
  { field: "startDate", headerName: "開始日期", width: 120 },
  { field: "endDate", headerName: "結束日期", width: 120 },
  { field: "showUnit", headerName: "主辦單位", flex: 1, minWidth: 180 }
];

export default function App() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const [keyword, setKeyword] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadShows() {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(API_URL, { signal: controller.signal });

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        const shows = await response.json();
        const nextRows = shows.map((show, index) => {
          const showInfo = show.showInfo?.[0] ?? {};

          return {
            id: index + 1,
            title: show.title ?? "",
            location: showInfo.location ?? "",
            price: showInfo.price || "免費或未提供",
            startDate: show.startDate ?? "",
            endDate: show.endDate ?? "",
            showUnit: show.showUnit ?? ""
          };
        });

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

    loadShows();

    return () => controller.abort();
  }, [reloadKey]);

  const filteredRows = useMemo(
    () =>
      rows.filter((row) =>
        row.title.toLowerCase().includes(keyword.trim().toLowerCase())
      ),
    [keyword, rows]
  );

  const totalLocations = useMemo(
    () => new Set(rows.map((row) => row.location).filter(Boolean)).size,
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
              基於 HW4 的展覽資料，useEffect 呼叫 API 並用 MUI DataGrid 呈現
            </Typography>
          </Box>

          <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
            <Chip label={`${filteredRows.length} 筆符合`} color="primary" variant="outlined" />
            <Chip label={`${totalLocations} 個地點`} color="success" variant="outlined" />
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

        <TextField
          className="search-field"
          label="名稱搜尋"
          value={keyword}
          onChange={(event) => setKeyword(event.target.value)}
          placeholder="輸入展覽名稱關鍵字"
          fullWidth
        />

        {error && (
          <Alert severity="error" className="alert">
            {error}
          </Alert>
        )}

        <Paper elevation={3} className="grid-paper">
          <DataGrid
            rows={filteredRows}
            columns={columns}
            loading={loading}
            pageSizeOptions={[10, 20, 50]}
            initialState={{
              pagination: {
                paginationModel: { pageSize: 10, page: 0 }
              }
            }}
            disableRowSelectionOnClick
          />
        </Paper>
      </Box>
    </main>
  );
}
