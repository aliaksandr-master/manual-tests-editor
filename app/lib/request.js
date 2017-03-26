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
