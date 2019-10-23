const baseSafeEval = require('notevil');

const traverseObject = (obj = {}, fn) => {
  if (!obj) {
    return;
  }

  const entries = Object.entries(obj) || [];

  entries.forEach((entry = []) => {
    const [key, value] = entry;

    if (typeof value === 'object') {
      traverseObject(value, fn);
    }

    fn && fn(key, value, obj);
  });
};

const setObjectPrototype = (obj) => {
  if (!obj) {
    return;
  }

  const basePrototype = Array.isArray(obj) ? Array.prototype : Object.prototype;

  Object.setPrototypeOf(obj, basePrototype);
};

const safeEval = (code = '') => {
  const baseValue = baseSafeEval(`
    (function() {
      return ${code};
    })();
  `);

  if (baseValue && typeof baseValue === 'object') {
    setObjectPrototype(baseValue);

    traverseObject(baseValue, (key, value, obj) => {
      const type = typeof value;

      if (type === 'undefined') {
        delete obj[key];
      } else if (type === 'object') {
        setObjectPrototype(value);
      }
    });
  }

  return baseValue;
};

module.exports = safeEval;
