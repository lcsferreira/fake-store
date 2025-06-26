import { CircularProgress, Typography, Box } from "@mui/material";

export default function ListFallback() {
  return (
    <Box mt={4} display="flex" alignItems="center" flexDirection="column">
      <CircularProgress color="primary" />
      <Typography mt={2} color="primary">
        Carregando lista de produtos...
      </Typography>
    </Box>
  );
}
