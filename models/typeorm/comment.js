const EntitySchema = require("typeorm").EntitySchema


module.exports = new EntitySchema({
  name: "comment",
  tableName: "comment",
  columns: {
    commentid: {
      primary: true,
      type: "int",
      generated: true,
      transformer: {
        from: (value) => parseInt(value),
        to: (value) => parseInt(value),
      },
    },
    title: {
      type: "text",
    },
    body: {
      type: "text",
    },
    todo_id: {
      type: "varchar",
    },
    author : {
        type: "int"
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
//   relations: {
//     users: {
//       target: "users",
//       type: "many-to-one",
//       joinTable: true,
//       cascade: true,
//       joinColumn: {
//         name: "author",
//         referencedColumnName: "id",
//       },

//     },
//     todo: {
//       target: "todo",
//       type: "many-to-one",
//       joinTable: true,
//       cascade: true,
//       joinColumn: {
//         name: "todo_id",
//         referencedColumnName: "todo_id",
//       },

//     },
//   },
});
