//Palauttaa päivän päivämäärän muodossa YYYY-MM-DD
export const dateToday = () => new Date().toLocaleDateString("sv-SE");

//Formatoidaan suomalaiseen muotoon-->
export const formatDateFI = (isoDate) => {
  if (!isoDate) return "";
  return new Date(isoDate).toLocaleDateString("fi-FI");
};

//Tarkistetaan ettei päivä ole tulevaisuudessa
export const futureDate = (isoDate) => {
  if (!isoDate) return false;
  const today = dateToday();
  const d = toISODateLocal(isoDate); // pakota YYYY-MM-DD
  return d > today;
};

export const toISODateLocal = (d) => {
  // luotettava YYYY-MM-DD paikallisessa ajassa
  return new Date(d).toLocaleDateString("sv-SE");
};

export const fromISODateLocal = (iso) => {
  // iso = YYYY-MM-DD -> Date paikallisena (klo 00:00)
  const [y, m, dd] = iso.split("-").map(Number);
  return new Date(y, m - 1, dd);
};

export const startOfISOWeek = (date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const day = d.getDay(); // 0=Su .. 6=La
  const diff = (day === 0 ? -6 : 1) - day; // maanantai alku
  d.setDate(d.getDate() + diff);
  return d;
};

export const getISOWeekNumber = (date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 3 - ((d.getDay() + 6) % 7));
  const week1 = new Date(d.getFullYear(), 0, 4);
  return (
    1 +
    Math.round(((d - week1) / 86400000 - 3 + ((week1.getDay() + 6) % 7)) / 7)
  );
};
