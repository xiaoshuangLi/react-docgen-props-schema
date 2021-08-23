const doctrine = require('doctrine');

const { booleanKeys, numberKeys } = require('../utils');

const forEach = (obj = {}) => (cb) => {
  if (typeof obj !== 'object') {
    return;
  }

  const { name, value } = obj;

  if (name === 'shape') {
    obj = value;
  }

  const fn = (value = {}) => {
    const { type, value: deepValue = type } = value;

    cb && cb(value);
    deepValue && forEach(deepValue)(cb);
  };

  if (obj instanceof Map) {
    // eslint-disable-next-line
    for (const [key, value = {}] of obj.entries()) {
      fn(value);
    }
  } else {
    Object.values(obj).forEach(fn);
  }
};

const missions = [
  // params
  (doc = {}) => {
    const { tags = [] } = doc;
    const params = tags
      .filter((item = {}) => item.title === 'param' && item.name)
      .map((item = {}) => item.name);

    return params.length ? { params } : {};
  },
  // alias
  (doc = {}) => {
    const { tags = [] } = doc;
    const curr = tags.find(
      (item = {}) => item.title === 'alias' && item.name,
    ) || {};

    const { name } = curr;

    return name ? { alias: name } : {};
  },
  // pattern
  (doc = {}) => {
    const { tags = [] } = doc;
    const curr = tags.find(
      (item = {}) => item.title === 'pattern' && item.description,
    ) || {};

    const { description } = curr;

    return description ? { pattern: description } : {};
  },
  /**
   * @key
   *
   * { [key]: true }
   */
  (doc = {}) => {
    const { tags = [] } = doc;

    return booleanKeys.reduce((res = {}, key) => {
      const tag = tags.find(
        (item = {}) => item.title === key,
      );

      if (tag) {
        res[key] = true;
      }

      return res;
    }, {});
  },
  /**
   * @key 10
   *
   * { [key]: 10 }
   */
  (doc = {}) => {
    const { tags = [] } = doc;

    return numberKeys.reduce((res = {}, key) => {
      const tag = tags.find(
        (item = {}) => item.title === key && item.description,
      );

      if (!tag) {
        return res;
      }

      const { description } = tag;

      const num = Number(description);
      const useful = !Number.isNaN(num);

      if (useful) {
        res[key] = num;
      }

      return res;
    }, {});
  },
  // return
  (doc = {}) => {
    const { tags = [] } = doc;
    const curr = tags.find(
      (item = {}) => item.title === 'return' && item.description,
    ) || {};

    const { description } = curr;

    return description
      ? { return: { type: description } }
      : {};
  },
];

const parseDescription = (value = {}) => {
  const description = value instanceof Map ? value.get('description') : value.description;

  if (!description) {
    return;
  }

  const doc = doctrine.parse(description) || {};
  const { description: newDescription } = doc;

  missions.forEach((fn = {}) => {
    const res = fn && fn(doc);

    if (value instanceof Map) {
      value.set('description', newDescription);

      Object.keys(res).forEach((key) => {
        value.set(key, res[key]);
      });
    } else {
      Object.assign(value, res, {
        description: newDescription,
      });
    }
  });
};

function handler(documentation = {}) {
  const { _props = {}, _data = {} } = documentation;

  parseDescription(_data);
  forEach(_props)(parseDescription);
}

module.exports = handler;
