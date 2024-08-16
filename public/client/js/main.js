var socket=io();
//Button pagination
const listButtonPagination=document.querySelectorAll('[button-pagination]');
if(listButtonPagination.length>0){
    const url=new URL(window.location.href);
    listButtonPagination.forEach(btn=>{
        btn.addEventListener('click',(e)=>{
            let page=btn.getAttribute('button-pagination');
            if(page!=='1'){
                url.searchParams.set('page',page);
            }else{
                url.searchParams.delete('page');
            }
            window.location.href=url.href;
        })
    })
}

//Alert 
const alertSuccess=document.querySelector('[show-alert]');
if(alertSuccess){
    const time= Number(alertSuccess.getAttribute('show-alert'))||3000;
    setTimeout(()=>{
        alertSuccess.classList.add('hidden');
    },time)
}

// Cập nhật số lượng sản phẩm trong giỏ hàng
const tableProductsCart=document.querySelector('.table-bordered');
if(tableProductsCart){
    const buttonChangeQuantity=tableProductsCart.querySelectorAll('input[name="quantity"]');
    if(buttonChangeQuantity.length>0){
        buttonChangeQuantity.forEach(btn=>{
            const idProduct=btn.getAttribute('item-id');
            btn.addEventListener('blur',(e)=>{
                window.location.href=`/cart/update/${idProduct}/${btn.value}`;
            })
        })
    }
}


