const apiBaseUrl =
  ((local: Boolean) => local ?
    'http://127.0.0.1:5000/' :
    'http://hvaccloud.org:8080/')(true);

export { apiBaseUrl };
