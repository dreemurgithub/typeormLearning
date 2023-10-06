const EntitySchema = require("typeorm").EntitySchema


module.exports = new EntitySchema({
    name: "todo",
    tableName:"todo",
    columns: {
        todo_id: {
            primary: true,
            type: "int",
            generated: true,
            transformer: {
                from: (value) => parseInt(value),
                to: (value) => parseInt(value),
              },
        },
        task: {
            type: "text"
        },
        status: {
            type: "text"
        },
        createdAt: {
            type: "timestamp",
            default: () => "CURRENT_TIMESTAMP",
          },
          updatedAt: {
            type: "timestamp",
            onUpdate: "CURRENT_TIMESTAMP",
          },
      
    },
    relations: {
        users_todo: {
            target: "users_todo",
            type: "one-to-many",
            joinTable: true,
            cascade: true,
            joinColumn: {
                name: "todo_id",
                referencedColumnName: "todo_id",
              },
        
        },
        comment : {
            target: "comment",
            type: "one-to-many",
            joinTable: true,
            cascade: true,
            joinColumn: {
                name: "todo_id",
                referencedColumnName: "todo_id",
              },
        
        }
    }
});