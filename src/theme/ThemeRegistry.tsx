"use client";

import * as React from "react";
import { CacheProvider } from "@emotion/react";
import createCache, { Options as CacheOptions } from "@emotion/cache";
import { CssBaseline } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { useServerInsertedHTML } from "next/navigation";

interface ThemeRegistryProps {
  /**
   * Opções do Emotion cache. Você pode customizar a `key`, habilitar `prepend`,
   * layers, etc.
   */
  options?: CacheOptions;
  children: React.ReactNode;
}

/**
 * Componente responsável por integrar o Emotion/MUI ao fluxo de streaming
 * do App Router, evitando que tags <style> sejam renderizadas no body e
 * garantindo que o HTML do servidor bata com o do cliente.
 */
export default function ThemeRegistry({
  options,
  children,
}: ThemeRegistryProps) {
  /**
   * Cria um cache por request para que as marcas de estilo sejam isoladas
   * e recolhidas corretamente após o streaming.
   */
  const [{ cache, flush }] = React.useState(() => {
    const cache = createCache({ key: "mui", prepend: true, ...options });
    cache.compat = true;

    const prevInsert = cache.insert;
    let inserted: string[] = [];
    cache.insert = ((...args) => {
      const serialized = args[1];
      if (cache.inserted[serialized.name] === undefined) {
        inserted.push(serialized.name);
      }
      return prevInsert(...args);
    }) as typeof cache.insert;

    const flush = () => {
      const prev = inserted;
      inserted = [];
      return prev;
    };

    return { cache, flush };
  });

  /**
   * Essa API do Next é chamada após o stream em cada chunk para injetar
   * dinamicamente as tags de estilo recolhidas até o momento no <head>.
   */
  useServerInsertedHTML(() => {
    const names = flush();
    if (names.length === 0) {
      return null;
    }

    let styles = "";
    for (const name of names) {
      styles += cache.inserted[name];
    }

    return (
      <style
        key={cache.key}
        data-emotion={`${cache.key} ${names.join(" ")}`}
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: styles }}
      />
    );
  });

  const theme = React.useMemo(() => createTheme({}), []);

  return (
    <CacheProvider value={cache}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </CacheProvider>
  );
}
