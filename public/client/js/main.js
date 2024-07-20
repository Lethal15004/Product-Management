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