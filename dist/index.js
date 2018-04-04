(function startup() {
      require('./app.js').listen(process.env.PORT || 3000);
    })()