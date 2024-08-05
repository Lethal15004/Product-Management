module.exports.pageChat=async(req,res)=>{
    //Socket io
    _io.on('connection', (socket) => {
    })
    //End socket io
    res.render('client/pages/chat/index.pug',{
        title:'Chat',
    })
}