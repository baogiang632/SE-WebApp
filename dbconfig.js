const config = {
  
  server: 'localhost', 
  user: 'nhuqy',
  password: '1234',
  database: 'QLSACH',
  port: 1433,
  driver: 'msnodesqlv8',
  options: {
    trustedConnection: true,
    encrypt: true,
    enableArithAbort: true,
    trustServerCertificate: true,

  },
};

module.exports = config;