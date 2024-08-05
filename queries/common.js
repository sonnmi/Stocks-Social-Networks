import { client } from "../datasource.js";

export const commonQueryExecute = (function () {
  "use strict";
  let module = {};

  module.getAllData = (table) => {
    client.query(`SELECT * FROM ${table}`, (err, res) => {
      console.log(res.rows);
      return res.rows;
    });
  };

  module.dropTable = (table) => {
    client.query(`DROP TABLE ${table} CASCADE`, (err, res) => {
      if (!err) console.log("Drop TABLE", table);
    });
  };

  module.deleteAllRows = (table) => {
    return `DELETE FROM ${table};`;
  };

  module.getAttributesOfTable = (table) => {};

  module.getAttributes = () => {
    client.query(
      `SELECT table_name
                        FROM information_schema.tables
                        WHERE table_schema = 'public'`,
      (err, res) => {
        if (err) console.log(err);
        res.rows
          .map((table) => table.table_name)
          .map((table) => {
            client.query(
              `SELECT column_name
                                                FROM information_schema.columns
                                                WHERE table_name = $1
                                                AND table_schema = 'public'`,
              [table],
              (err, res) => {
                if (err) console.log(err);
                console.log(table);
                console.log(res.rows.map((t) => t.column_name));
              },
            );
          });
      },
    );
  };

  module.getAllTableNames = () => {
    client.query(
      `SELECT table_name
                        FROM information_schema.tables
                        WHERE table_schema = 'public'`,
      (err, res) => {
        if (err) console.log(err);
        return res.rows.map((table) => table.table_name);
      },
    );
  };

  module.createTable = (table, query) => {
    try {
      console.log("creating", table);
      if ((!table) in ["StockHistory"]) {
        module.dropTable(table);
      }
      client.query(query);
      module.getAllData(table);
    } catch (err) {
      console.log("Error executing creation of table", err, table);
    }
  };

  return module;
})();
