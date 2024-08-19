//Chức năng gửi yêu cầu kết bạn trong trang Danh sách người dùng
const listBtnAddFriend=document.querySelectorAll('[btn-add-friend]');
if(listBtnAddFriend){
    listBtnAddFriend.forEach(btn=>{
        btn.addEventListener('click',async (e)=>{
            btn.closest('.box-user').classList.add('add');
            const userId=btn.getAttribute('btn-add-friend');
            socket.emit('CLIENT_ADD_FRIEND',userId);
        })
    })
}

//Chức năng hủy yêu cầu kết bạn trong trang Lời mời đã gửi
const listBtnCancelAddFriend=document.querySelectorAll('[btn-cancel-friend]');
if(listBtnCancelAddFriend){
    listBtnCancelAddFriend.forEach(btn=>{
        btn.addEventListener('click',async (e)=>{
            btn.closest('.box-user').classList.remove('add');
            const userId=btn.getAttribute('btn-cancel-friend');
            socket.emit('CLIENT_CANCEL_ADD_FRIEND',userId);
        })
    })
}

//Chức năng từ chối yêu cầu kết bạn trong trang Lời mời đã nhận
const listBtnRefuseFriend=document.querySelectorAll('[btn-refuse-friend]');
if(listBtnRefuseFriend){
    listBtnRefuseFriend.forEach(btn=>{
        btn.addEventListener('click',async (e)=>{
            btn.closest('.box-user').classList.add('refuse');
            const userId=btn.getAttribute('btn-refuse-friend');
            socket.emit('CLIENT_REFUSE_FRIEND',userId);
        })
    })
}


const listBtnAcceptFriend=document.querySelectorAll('[btn-accept-friend]');
if(listBtnAcceptFriend){
    listBtnAcceptFriend.forEach(btn=>{
        btn.addEventListener('click',async (e)=>{
            btn.closest('.box-user').classList.add('accepted');
            const userId=btn.getAttribute('btn-accept-friend');
            socket.emit('CLIENT_ACCEPT_FRIEND',userId);
        })
    })
}