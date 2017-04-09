'use strict';

export const getJSON = (url) => {
  if (window.getJSON) {
    return window.getJSON(url);
  }

  return window.fetch(url)
    .then((response) => response.json());
};

export const deleteResource = (url) => {
  if (window.deleteResource) {
    return window.deleteResource(url);
  }

  return window.fetch(url, { method: 'DELETE' });
};

export const createResource = (url, data = {}) => {
  if (window.createResource) {
    return window.createResource(url, data);
  }

  return window.fetch(url, { method: 'POST', body: data });
};

export const editResource = (url, data = {}) => {
  if (window.editResource) {
    return window.editResource(url, data);
  }

  return window.fetch(url, { method: 'PUT', body: data });
};

export const getFileContent = (url) => {
  if (window.getFileContent) {
    return window.getFileContent(url);
  }

  return window.fetch(url)
    .then((response) => response.text());
};

export const saveTestData = (meta, questions) => {
  let lines = [
    new Buffer(JSON.stringify(meta)).toString('base64')
  ];

  lines = lines.concat(questions.map((q) => `${q.id} ${new Buffer(JSON.stringify(q)).toString('base64')}`));

  return editResource('/data/test.dat4', lines.join('\n'))
};

export const getTestData = () => {
  return getFileContent('/data/test.dat4')
    .then((content) =>
      content
        .split('\n').filter(Boolean)
        .map((line) => line.split(/\s+/).filter(Boolean).pop())
        .map((content) => new Buffer(content, 'base64').toString('utf8'))
        .map((content) => {
          try {
            content = JSON.parse(content);
          } catch (er) {
            content = null;
          }

          return content;
        })
        .filter(Boolean)
    )
    .then((content) => {
      const meta = content.unshift();
      const questions = content;

      return {
        meta,
        questions
      }
    });
};
