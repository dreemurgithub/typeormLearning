const URL_LIST = {
    homepage: '/',
    typeOrmUser: '/orm/user',
    typeOrmTodo: '/orm/todo',
    typeOrmComment:'/orm/comment',
    login:'/login',
    logout: '/logout',
    register: '/register'
}
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


module.exports = {URL_LIST, emailRegex}