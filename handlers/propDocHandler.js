const doctrine = require('doctrine');

const forEach = (obj = {}) => (cb) => {
  if (typeof obj !== 'object') {
    return;
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
