/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
interface PaginationInterface{
    currentPage:number;
    totalPages:number;
    pagination: any
}

export const Pagination:React.FC<PaginationInterface>=(props)=>{
    const pageList=[];

    if(props.currentPage===1){
        pageList.push(props.currentPage);
        if(props.totalPages >= props.currentPage+1){
            pageList.push(props.currentPage+1);
        }
         if(props.totalPages >= props.currentPage+2){
            pageList.push(props.currentPage+2);
        }

     } else if(props.currentPage > 1){
            if(props.currentPage>=3){
                pageList.push(props.currentPage-2);
            }
            if(props.currentPage>=2){
                    pageList.push(props.currentPage-1);
            }

        pageList.push(props.currentPage);

        if(props.totalPages>=props.currentPage+1){
            pageList.push(props.currentPage+1);
        }

        if(props.totalPages>=props.currentPage+2){
            pageList.push(props.currentPage+2);
        }

    }

    return(
        <nav aria-label="...">
         <ul className="pagination">
           <li className="page-item">
                <button className="page-link" onClick={()=>props.pagination(1)}>Trang Đầu</button>
            </li>
            {
                pageList.map(page=>(
                    <li key={page} onClick={()=>props.pagination(page)} className="page-item">
                         <button className={"page-link "+(props.currentPage===page?"active":"")}>{page}</button>
                     </li>
                ))
            }
            <li className="page-item" onClick={()=>props.pagination(props.totalPages)}>
                <button className="page-link" >Trang Cuối</button>
            </li>
        </ul>
        </nav>
    )
}