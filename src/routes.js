function routes (app) {
  app.get('/', (request, response) => {
    response.send('Hello World');
  });

}

module.exports = {
  routes
};
