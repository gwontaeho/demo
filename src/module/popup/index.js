import { useEffect, useRef } from "react";

const usePopup = () => {
  const _usePopup = useRef({ popups: {} }).current;

  const deleteClosedPopups = () => {
    Object.entries(_usePopup.popups).forEach(([key, item]) => {
      if (item.window.closed) {
        if (item.handleMessage) {
          window.removeEventListener("message", item.handleMessage);
        }
        delete _usePopup.popups[key];
      }
    });
  };

  const openPopup = ({ id, url, onMessage } = {}) => {
    deleteClosedPopups();
    if (!url) return;
    id ??= crypto.randomUUID();

    // 기존 팝업 닫기, 이벤트 리스너 제거
    if (_usePopup.popups[id]) {
      if (!_usePopup.popups[id].window.closed) {
        _usePopup.popups[id].window.close();
      }
      if (_usePopup.popups[id].handleMessage) {
        window.removeEventListener(
          "message",
          _usePopup.popups[id].handleMessage
        );
      }
    }

    _usePopup.popups[id] = {};
    _usePopup.popups[id].window = window.open(url, undefined, "popup");
    if (onMessage) {
      _usePopup.popups[id].handleMessage = (event) => {
        if (event.source === _usePopup.popups[id].window) {
          onMessage(event.data);
        }
      };
      window.addEventListener("message", _usePopup.popups[id].handleMessage);
    }
  };

  const closePopup = (id) => {
    if (id === undefined) {
      // 모든 팝업 닫기
      Object.entries(_usePopup.popups).forEach(([, item]) => {
        if (!item.window.closed) item.window.close();
      });
    } else if (_usePopup.popups[id]) {
      // 해당 팝업 닫기
      if (!_usePopup.popups[id].window.closed) {
        _usePopup.popups[id].window.close();
      }
    }
    // 팝업 삭제
    deleteClosedPopups();
  };

  const postMessageToOpener = (message) => {
    if (window.opener) {
      window.opener.postMessage(message);
    }
  };

  useEffect(() => {
    return () => {
      // 모든 팝업 닫기, 이벤트 리스너 제거
      Object.entries(_usePopup.popups).forEach(([, item]) => {
        if (!item.window.closed) {
          item.window.close();
        }
        if (item.handleMessage) {
          window.removeEventListener("message", item.handleMessage);
        }
      });
    };
  }, []);

  return { openPopup, closePopup, postMessageToOpener };
};

export { usePopup };
