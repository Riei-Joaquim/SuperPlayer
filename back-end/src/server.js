const app = require("./app");
let port = process.env.PORT;
if (!port || port === "") 
  port = 3333;
app.listen(port);
