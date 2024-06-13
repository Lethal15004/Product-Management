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
