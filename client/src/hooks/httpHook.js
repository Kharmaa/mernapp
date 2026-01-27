import { useState, useCallback, useRef, useEffect } from "react";

/**
 * useHttpHook
 *
 * Custom hook HTTP-pyyntöjen käsittelyyn.
 * Vastaa lataustilasta, virheiden hallinnasta sekä
 * keskitetystä fetch-logiikasta koko sovelluksessa.
 */
export const useHttpHook = () => {
  // Kertoo, onko pyyntö käynnissä
  const [isLoading, setIsLoading] = useState(false);

  // Tallentaa mahdollisen virheviestin
  const [error, setError] = useState(null);

  // Säilyttää aktiiviset pyynnöt,
  // jotta ne voidaan tarvittaessa keskeyttää
  const activeHttpRequest = useRef([]);

  /**
   * sendRequest
   *
   * Lähettää HTTP-pyynnön annetulla URL:lla ja asetuksilla.
   */
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

        // Parsitaan vastaus JSON-muotoon
        const responseData = await response.json();

        // Jos vastaus ei ole onnistunut, heitetään virhe
        if (!response.ok) {
          throw new Error(responseData.message || "Request failed");
        }

        // Palautetaan onnistunut vastaus kutsuvalle komponentille
        return responseData;
      } catch (err) {
        // Jos pyyntö keskeytettiin tarkoituksella, ei käsitellä virheenä
        if (err.name === "AbortError") {
          return;
        }

        // Tallennetaan virhetila sovelluksen tilaan
        setError(err.message || "Jotain meni vikaan");
        throw err;
      } finally {
        // Poistetaan valmistunut pyyntö aktiivisten listasta
        activeHttpRequest.current = activeHttpRequest.current.filter(
          (reqCtrl) => reqCtrl !== httpAbortCtrl,
        );

        // Päivitetään lataustila
        setIsLoading(false);
      }
    },
    [],
  );

  /**
   * clearError
   *
   * Tyhjentää virhetilan, esim. virheilmoituksen sulkemisen yhteydessä.
   */
  const clearError = () => setError(null);

  /**
   * Cleanup
   *
   * Keskeyttää kaikki aktiiviset HTTP-pyynnöt,
   * jos komponentti, joka käyttää hookia, unmountataan.
   * Tämä estää muistivuodot ja virhetilanteet.
   */
  useEffect(() => {
    return () => {
      activeHttpRequest.current.forEach((abortCtrl) => abortCtrl.abort());
    };
  }, []);

  // Palautetaan hookin tarjoamat arvot ja funktiot
  return { isLoading, error, sendRequest, clearError };
};
