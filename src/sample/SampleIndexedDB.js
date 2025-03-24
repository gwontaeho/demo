const getIDB = (name, storeName, keyPath, key) => {
  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open(name);
    request.onupgradeneeded = () => {
      request.result.createObjectStore(storeName, { keyPath });
    };
    request.onsuccess = () => {
      const transaction = request.result.transaction([storeName]);
      const objectStore = transaction.objectStore(storeName);
      const requestGet = objectStore.get(key);
      requestGet.onsuccess = () => {
        resolve(requestGet.result);
      };
      requestGet.onerror = () => {
        reject();
      };
    };
  });
};

const insertIDB = (name, storeName, keyPath, data) => {
  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open(name);
    request.onupgradeneeded = () => {
      request.result.createObjectStore(storeName, { keyPath });
    };
    request.onsuccess = () => {
      const transaction = request.result.transaction([storeName], "readwrite");
      const objectStore = transaction.objectStore(storeName);
      const requestAdd = objectStore.add(data);
      requestAdd.onsuccess = () => {
        resolve();
      };
      requestAdd.onerror = (event) => {
        reject(event.target.error);
      };
    };
  });
};

const updateIDB = (name, storeName, keyPath, data) => {
  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open(name);
    request.onupgradeneeded = () => {
      request.result.createObjectStore(storeName, { keyPath });
    };
    request.onsuccess = () => {
      const transaction = request.result.transaction([storeName], "readwrite");
      const objectStore = transaction.objectStore(storeName);
      const requestUpdate = objectStore.put(data);
      requestUpdate.onsuccess = () => {
        resolve();
      };
      requestUpdate.onerror = (event) => {
        reject(event.target.error);
      };
    };
  });
};

export const SampleIndexedDB = () => {
  return (
    <div className="flex flex-col gap-4">
      <button onClick={() => getIDB("test", "test1", "key1", "ff")}>
        open idb
      </button>
      <button
        onClick={() =>
          insertIDB("test", "test1", "key1", { a: "a", key1: "ff" })
        }
      >
        insert idb
      </button>
      <button
        onClick={() =>
          updateIDB("test", "test1", "key1", { a: "b", key1: "ff" })
        }
      >
        update idb
      </button>
    </div>
  );
};
