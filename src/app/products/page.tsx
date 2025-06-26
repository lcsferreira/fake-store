import { Box } from "@mui/material";
import { Suspense } from "react";
import ListFallback from "./ListFallback";
import ListWrapper from "./ListWrapper";

export default function ProductsPage() {
  return (
    <Box className="p-4">
      <Suspense fallback={<ListFallback />}>
        <ListWrapper />
      </Suspense>
    </Box>
  );
}
