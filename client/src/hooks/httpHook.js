import { useState, useCallback, useRef, useEffect } from "react";

export const useHttpHook = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const activeHttpRequest = useRef([]);

  //Funktio, joka lähettää HTTP-pyynnön eli hoitaa API-kutsut
  const sendRequest = useCallback(
    async (url, method = "GET", body = null, headers = {}) => {
      setIsLoading(true);

      // AbortController mahdollistaa pyynnön keskeyttämisen
      const httpAbortCtrl = new AbortController();
      activeHttpRequest.current.push(httpAbortCtrl);

      try {
        const response = await fetch(url, {
          method,
          body,
          headers,
          signal: httpAbortCtrl.signal,
        });

        const responseData = await response.json();

        if (!response.ok) {
          throw new Error(responseData.message || "Request failed");
        }

        // Palautetaan onnistunut vastaus kutsuvalle komponentille
        return responseData;
      } catch (err) {
        if (err.name === "AbortError") {
          return;
        }

        // Tallennetaan virhetila sovelluksen tilaan
        setError(err.message || "Jotain meni vikaan");
        throw err;
      } finally {
        activeHttpRequest.current = activeHttpRequest.current.filter(
          (reqCtrl) => reqCtrl !== httpAbortCtrl,
        );

        setIsLoading(false);
      }
    },
    [],
  );

  //Tyhjentää virhetilan, esim. virheilmoituksen sulkemisen yhteydessä.
  const clearError = () => setError(null);

  //Keskeyttää avoimet pyynnöt komponentin poistuessa
  useEffect(() => {
    return () => {
      activeHttpRequest.current.forEach((abortCtrl) => abortCtrl.abort());
    };
  }, []);

  return { isLoading, error, sendRequest, clearError };
};
