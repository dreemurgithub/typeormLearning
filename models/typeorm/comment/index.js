const {commentRepository,todoRepository,userRepository,users_todoRepository} = require("../../../config/typeorm");

const addCommentOrm = async ({ title, body, todo_id, userId }) => {
    const newComment = { title, body, todo_id, author: userId };
    console.log(newComment);
    await commentRepository.save(newComment);
    return newComment;
  };
  
  const readCommentUserOrm = async (userId) => {
    const allComment = await commentRepository.find({
      where: { author: userId },
    });
    return allComment;
  };
  const readCommentTodoOrm = async (todo_id) => {
    const allComment = await commentRepository.find({ where: { todo_id } });
    return allComment;
  };
  
  const updateCommentOrm = async ({ title, body, commentid, userId }) => {
    await commentRepository
      .createQueryBuilder("comment")
      .update({ title, body, commentid, author: userId })
      .set({ title, body })
      .where("commentid = :commentid", { commentid })
      .execute();
    const newComment = await commentRepository.find({ where: { commentid } });
    return newComment;
  };
  
  const deleteCommentOrm = async (commentid) => {
    try {
      await commentRepository.delete({ commentid });
      return { message: "Delete successfully" };
    } catch (err) {
      console.log(err);
      return { message: "Bad request" };
    }
  };
  

  module.exports = {addCommentOrm, readCommentTodoOrm, readCommentUserOrm, updateCommentOrm, deleteCommentOrm}