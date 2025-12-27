module.exports = {
  ci: {
    collect: {
      staticDistDir: 'dist',
      numberOfRuns: 3,
      url: ['http://127.0.0.1:8080']
    },
    upload: {
      target: 'temporary-public-storage'
    }
  }
};