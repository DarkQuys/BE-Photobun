const mesService =require('../sevices/mesService')
const getMess = async (req, res) => {
    try {
        const data = req.params.room
        const response  = await mesService.getMess(data)
        return res.status(200).json(response)
    }catch(e){
        return req.status(404).json({
            message : e
        })
    }   

}
const addMess = async (req, res) => {
    try {
        const data = req.params.room
        const response  = await mesService.addMess(req.body)
        return res.status(200).json(response)
    }catch(e){
        return req.status(404).json({
            message : e
        })
    }   

}

module.exports = {
    getMess,
    addMess
}