const EntitySchema = require("typeorm").EntitySchema;

const UsersSchema = new EntitySchema({
    name: "Users",
    tableName: "users",
    columns: {
      id: {
        primary: true,
        type: "int",
        generated: true,
        transformer: {
          from: (value) => parseInt(value),
          to: (value) => parseInt(value),
        },
      },
      username: {
        type: "varchar",
        transformer: {
            from: (value) => value || '',
            to: (value) => value || '',
          },
      },
      email: {
        type: "varchar",
      },
      password: {
        type: "varchar",
      },
      created_at: {
        type: "timestamp",
        default: () => 'CURRENT_TIMESTAMP',  

      },
      updated_at: {
        type: "timestamp",
        default: () => 'CURRENT_TIMESTAMP',
        onUpdate: () => 'CURRENT_TIMESTAMP',
      },
    },
    // relations: {
    //     users_todo: {
    //         target: "users_todo",
    //         type: "one-to-many",
    //         joinTable: true,
    //         cascade: true,
    //         joinColumn: {
    //             name: "id",
    //             referencedColumnName: "user_id",
    //           },
    //     },
    //     comment : {
    //         target: "comment",
    //         type: "one-to-many",
    //         joinTable: true,
    //         cascade: true,
    //         joinColumn: {
    //             name: "id",
    //             referencedColumnName: "author",
    //           },
    //     }
    // }
  });

  module.exports = UsersSchema