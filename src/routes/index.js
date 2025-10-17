const userRouter = require('./userRouter')
const mesController = require('./messageRouter')
const chatRouter = require('./chatRouter')
const message1Router = require('./message1Router')
const routes = (app) => {
    app.use('/api', userRouter)
    app.use('/api/mess', mesController)
    app.use('/api/chat', chatRouter)
    app.use('/api/mess1', message1Router)
}
module.exports =routes