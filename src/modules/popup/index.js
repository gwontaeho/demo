import { useRef } from "react";

const uuid = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (char) => {
    const random = (Math.random() * 16) | 0;
    const value = char === "x" ? random : (random & 0x3) | 0x8;
    return value.toString(16);
  });
};

const usePopup = () => {
  const $ = useRef({ popups: {} }).current;

  const deleteClosedPopups = () => {
    Object.entries($.popups).forEach(([key, item]) => {
      if (item.closed) delete $.popups[key];
    });
  };

  const openPopup = ({ id, url } = {}) => {
    deleteClosedPopups();
    if (!url) return;

    id ??= uuid();
    const popup = window.open(url, id, "popup");
    $.popups[id] = popup;
  };

  const closePopup = (id) => {
    if (id === undefined) {
      Object.entries($.popups).forEach(([key, item]) => {
        if (!item.closed) $.popups[key].close();
      });
    } else if ($.popups[id]) {
      if (!$.popups[id].closed) {
        $.popups[id].close();
      }
    }

    deleteClosedPopups();
  };

  return { openPopup, closePopup };
};

export { usePopup };
