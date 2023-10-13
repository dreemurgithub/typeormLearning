const EntitySchema = require("typeorm").EntitySchema

const usersTodoSchema = new EntitySchema({
    name: "Users_todo",
    tableName: "users_todo",
    columns: {
        id : {
            primary: true,
            type: "int",
            generated: true,
            transformer: {
                from: (value) => parseInt(value),
                to: (value) => parseInt(value),
              },
        
        },
        user_id: {
            type: "int",
        },
        todo_id: {
            type: "int",
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
})

module.exports = usersTodoSchema;