//Button Status
const listBtnFilter=document.querySelectorAll('[button-status]')

//Bộ lọc frondend
if(listBtnFilter.length>0){
    let url= new URL(window.location.href);

    listBtnFilter.forEach(btn=>{
        btn.addEventListener('click',(e)=>{
            const status=btn.getAttribute('button-status');
            btn.classList.add('active');
            if(url.searchParams.get('page')){
                url.searchParams.delete('page');
            }
            if(status){
                url.searchParams.set('status',status);
            }
            else{
                url.searchParams.delete('status');
                if(url.searchParams.get('keyword')){
                    url.searchParams.delete('keyword');
                }   
            }
            window.location.href=url.href;
        })
    })

    let currentStatus=url.searchParams.get('status') || "";
    let btnCurrent=document.querySelector(`[button-status="${currentStatus}"]`);
    if(btnCurrent){
        btnCurrent.classList.add('active');
    }
  
}
//End Bộ lọc

//Tìm kiếm frontend
const formSearch=document.querySelector('[form-search]');
if(formSearch){
    const url= new URL(window.location.href);
    formSearch.addEventListener('submit',(e)=>{
        e.preventDefault();
        const inputElement=document.querySelector('#search-keyword');
        console.log(inputElement.value)
        if(inputElement.value)
        {
            url.searchParams.set('keyword',inputElement.value);
        }else{
            console.log("Vào");
            url.searchParams.delete('keyword');
        }
        window.location.href=url.href;
    })
 
}
//End Tìm kiếm


//Phân trang
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

//Thay đổi trạng thái
const listBtnChangeStatus=document.querySelectorAll('[product-id]');
if(listBtnChangeStatus.length>0){
    listBtnChangeStatus.forEach(btn=>{
        btn.addEventListener('click',(e)=>{
            const link = btn.getAttribute('link');
            const id = btn.getAttribute('product-id');
            const status = btn.getAttribute('product-status');
            const productChange={
                id: id,
                status: status
            }
            fetch(link,{
                method:'PATCH',
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify(productChange)
            })
            .then(response=>response.json())
            .then(data=>{
                if(data.code===200){
                    window.location.reload();
                }
            })
        })
    })
}


//Xử lý các chọn các sản phẩm để update
const checkAll=document.querySelector('input[name=checkAll]');
const checkItems=document.querySelectorAll('input[name=checkItem]');
const statusGroup=document.querySelector('[box-actions]');

    //Xử lý nút check all
if(checkAll){
    checkAll.addEventListener('click',(e)=>{
        checkItems.forEach(item=>{
            item.checked=checkAll.checked;
        })
    })
}
    //Xử lý nút check item
if(checkItems.length>0){
    checkItems.forEach(item=>{
        item.addEventListener('click',(e)=>{
            const isCheckAll=document.querySelectorAll('input[name=checkItem]:checked');
            if(isCheckAll.length===checkItems.length)
                checkAll.checked=true;
            else
                checkAll.checked=false;
        })
    })
}
if(statusGroup){
    const buttonUpdateMany=statusGroup.querySelector('button');
    const chooseStatus=statusGroup.querySelector('select');
    if(chooseStatus&&buttonUpdateMany){
        buttonUpdateMany.addEventListener('click',(e)=>{
        const updateProducts={};
        updateProducts.status=chooseStatus.value;
        updateProducts.ids=[...checkItems].reduce((accumulate,curr)=>{
            if(curr.checked){
                let id= curr.closest('tr').querySelector('[product-id]').getAttribute('product-id');
                accumulate.push(id);
            }
            return accumulate;
        },[])
        if(updateProducts.status!==''&&updateProducts.ids.length>0){
            const link = buttonUpdateMany.getAttribute('link');
            fetch(link,{
                method:'PATCH',
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify(updateProducts)
            })
            .then(response=>response.json())
            .then(data=>{
                if(data.code===200){
                        window.location.reload();
                }
             })
         }
        })
    }
    
}