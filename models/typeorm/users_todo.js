const EntitySchema = require("typeorm").EntitySchema


module.exports = new EntitySchema({
    name: "users_todo",
    tableName: "users_todo",
    columns: {
        user_id: {
            primary: true,
            type: "int",
            generated: true
        },
        todo_id: {
            primary: true,
            type: "int",
            generated: true
        }
      
    },
    relations: {
        users: {
            target: "users",
            type: "many-to-one",
            joinTable: true,
            cascade: true,
            joinColumn: {
                name: "user_id",
                referencedColumnName: "id",
              },
        },
        todo: {
            target: "todo",
            type: "many-to-one",
            joinTable: true,
            cascade: true,
            joinColumn: {
                name: "todo_id",
                referencedColumnName: "todo_id",
              },
        },
    }
});