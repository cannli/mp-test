
const { mysql } = require('../qcloud')

module.exports = async (ctx) => {
    const {page, openid} = ctx.request.query
    const size = 10
    // 连表查询 查询所有数据
    const mysqlSelect = mysql('books')
                  .select('books.*', 'cSessionInfo.user_info')
                  .join('cSessionInfo', 'books.openid', 'cSessionInfo.open_id')
                  .orderBy('books.id', 'desc')
    let books
    if (openid) {
        // 根据opid过滤 根据id查询出一条数据
        books = await mysqlSelect.where('books.openid', openid)
    } else {
        // 全部图书 分页 没有id 查询size10条数据
        books = await mysqlSelect.limit(size).offset(Number(page) * size)
    }
    // .orderBy('id','desc')
    ctx.state.data = {
        list: books.map(v => {
            const info = JSON.parse(v.user_info)
            return Object.assign({}, v, {
                user_info: {
                    nickName: info.nickName
                }
            })
        })
    }
}
