const mock = (num) => {
  const random = (max) => Math.floor(Math.random() * (max + 1));

  return Array(num || 100)
    .fill(null)
    .map((_, index) => {
      return {
        index,
        text: [
          "example",
          "random",
          "program",
          "python",
          "library",
          // "context",
          // "variable",
          // "function",
          // "immutable",
          // "abstract",
        ][random(4)],
        number: Math.random() * 1000,
      };
    });
};

const uuid = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (char) => {
    const random = (Math.random() * 16) | 0;
    const value = char === "x" ? random : (random & 0x3) | 0x8;
    return value.toString(16);
  });
};

const cloneDeep = (item) => {
  if (item === null || typeof item !== "object") {
    return item;
  }
  if (Array.isArray(item)) {
    return item.map(cloneDeep);
  }
  const obj = {};
  for (let key in item) {
    if (item.hasOwnProperty(key)) {
      obj[key] = cloneDeep(item[key]);
    }
  }
  return obj;
};

const debounce = (func, delay) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func(...args);
    }, delay);
  };
};

const throttle = (func, delay) => {
  let timer;
  return (...args) => {
    if (!timer) {
      timer = setTimeout(() => {
        func(...args);
        timer = undefined;
      }, delay);
    }
  };
};

const classNames = (...args) => {
  const className = args
    .reduce((prev, curr) => {
      if (!!curr && typeof curr === "string") {
        prev += ` ${curr}`;
      }
      return prev;
    }, "")
    .trim();
  return className;
};

const cookie = {
  getAll() {
    if (!document.cookie) return;
    const cookies = document.cookie.split("; ").reduce((prev, curr) => {
      const [name, value] = curr.split("=");
      prev[name] = value;
      return prev;
    }, {});
    return cookies;
  },
  get(name) {
    if (!name) throw new Error();
    if (!document.cookie) return;
    return this.getAll()[name];
  },
  set(name, value, options) {
    if (!name || !value) throw Error();
    document.cookie = `${name}=${value}`;
  },
  remove(name, options) {
    if (!name) throw Error();
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  },
};

const date = (value) => {
  // YYYY-MM-DDTHH:mm:ss.sssZ
  const object = {
    value: value ? new Date(value) : new Date(),
    get time() {
      return this.value.getTime();
    },
    get year() {
      return this.value.getFullYear();
    },
    get month() {
      return this.value.getMonth() + 1;
    },
    get date() {
      return this.value.getDate();
    },
    get hour() {
      return this.value.getHours();
    },
    get minute() {
      return this.value.getMinutes();
    },
    get second() {
      return this.value.getSeconds();
    },
    get millisecond() {
      return this.value.getMilliseconds();
    },
    setValue(value) {
      this.value = value ? new Date(value) : new Date();
      return this;
    },
    setDate(date) {
      this.value = new Date(this.value.setDate(date));
      return this;
    },
    setMonth(month, date) {
      let value = new Date(this.value.setMonth(month - 1));
      if (date) value = new Date(value.setDate(date));
      this.value = value;
      return this;
    },
    setYear(year, month, date) {
      let value = new Date(this.value.setFullYear(year));
      if (month) value = new Date(value.setMonth(month - 1));
      if (date) value = new Date(value.setDate(date));
      this.value = value;
      return this;
    },
    add(key, amount) {
      switch (key) {
        case "day":
        case "D":
          this.value = new Date(this.value.setDate(this.value.getDate() + amount));
          break;
        case "week":
        case "w":
          this.value = new Date(this.value.setDate(this.value.getDate() + 7 * amount));
          break;
        case "month":
        case "M":
          this.value = new Date(this.value.setMonth(this.value.getMonth() + amount));
          break;
        case "year":
        case "Y":
          this.value = new Date(this.value.setFullYear(this.value.getFullYear() + amount));
          break;
        case "hour":
        case "H":
          this.value = new Date(this.value.setHours(this.value.getHours() + amount));
          break;
        case "minute":
        case "m":
          this.value = new Date(this.value.setMinutes(this.value.getMinutes() + amount));
          break;
        case "second":
        case "s":
          this.value = new Date(this.value.setSeconds(this.value.getSeconds() + amount));
          break;
      }
      return this;
    },
    subtract(key, amount) {
      this.add(key, -amount);
      return this;
    },
    format(form) {
      if (typeof form !== "string") throw new Error();
      const formatMap = {};
      if (form.indexOf("YYYY") === form.indexOf("YY")) {
        formatMap.YYYY = this.year.toString();
      } else if (form.indexOf("YY") !== -1) {
        formatMap.YY = this.year.toString().slice(-2);
      }
      if (form.indexOf("MM") === form.indexOf("M")) {
        formatMap.MM = this.month.toString().padStart(2, "0");
      } else if (form.indexOf("M") !== -1) {
        formatMap.M = this.month.toString();
      }
      if (form.indexOf("DD") === form.indexOf("D")) {
        formatMap.DD = this.date.toString().padStart(2, "0");
      } else if (form.indexOf("D") !== -1) {
        formatMap.D = this.date.toString();
      }
      if (form.indexOf("HH") === form.indexOf("H")) {
        formatMap.HH = this.hour.toString().padStart(2, "0");
      } else if (form.indexOf("H") !== -1) {
        formatMap.H = this.hour.toString();
      }
      if (form.indexOf("mm") === form.indexOf("m")) {
        formatMap.mm = this.minute.toString().padStart(2, "0");
      } else if (form.indexOf("m") !== -1) {
        formatMap.m = this.minute.toString();
      }
      if (form.indexOf("ss") === form.indexOf("s")) {
        formatMap.ss = this.second.toString().padStart(2, "0");
      } else if (form.indexOf("s") !== -1) {
        formatMap.s = this.second.toString();
      }
      const formatted = Object.entries(formatMap).reduce((prev, curr) => {
        return (prev = prev.replace(curr[0], curr[1]));
      }, form);
      return formatted;
    },
  };

  return object;
};

export default {
  mock,
  uuid,
  cloneDeep,
  debounce,
  throttle,
  classNames,
  cookie,
  date,
};
