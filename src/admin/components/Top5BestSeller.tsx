import { useEffect, useState } from "react";
import BookModel from "../../models/BookModel";
import { get5BestSellerBooks } from "../../api/BookAPI";
import { Link } from "react-router-dom";
import { Tooltip } from "@mui/material";
import SoldQuantityFormat from "../../layouts/utils/SoldQuantityFormat";

const Top5BestSeller:React.FC=()=>{
    const [top5BestSeller,setTop5BestSeller] = useState<BookModel[]>([]);
    useEffect(()=>{
        get5BestSellerBooks()
                .then(response=>{
                    setTop5BestSeller(response);
                })
                .catch(error=>{
                    console.error(error);
                })
    },[])

    return(
        <table className="table table-striped table-hover">
            <thead>
                <tr>
                    <th scope="col">ID</th>
                    <th scope="col">Ảnh</th>
                    <th scope="col">Tên sách</th>
                    <th scope="col">Đã bán</th>
                </tr>
            </thead>
            <tbody>
                {top5BestSeller.map(book=>{
                    return(
                        <tr key={book.bookId}>
                            <th scope="row">{book.bookId}</th>
                            <td>
                                <Link to={`/books/${book.bookId}`}
                                    className="d-inline text-black"
                                    >
                                    <img src={book.thumbnail}  alt='' width={30}></img>
                                    </Link>
                            </td>
                            <Tooltip title={book.bookName}arrow>
                                <td>
                                <Link
										to={`/books/${book.bookId}`} style={{textDecoration:"none"}}
										className='d-inline text-black'
									>
										{book.bookName}
									</Link>
                                </td>
                            </Tooltip>
                            <td>{SoldQuantityFormat(book.soldQuantity)}</td>
                        </tr>
                    )
                })}
            </tbody>
        </table>
    )
}

export default Top5BestSeller;