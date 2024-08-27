import React, { useEffect, useState } from "react";
import BookProps from "./components/BookProps";
import { Skeleton } from "@mui/material";
import BookModel from "../../models/BookModel";
import { getNewBook } from "../../api/BookAPI";

interface NewBookListProps {}

const NewBookList: React.FC<NewBookListProps> = (props) => {
	const [bookList, setBookList] = useState<BookModel[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [erroring, setErroring] = useState(null);

	useEffect(() => {
		getNewBook()
			.then((response) => {
				setBookList(response.resultBooks);
				setLoading(false);
			})
			.catch((error) => {
				setLoading(false);
				setErroring(error.message);
			});
	}, []);

	if (loading) {
		return (
			<div className='container-book container mb-5 py-5 px-5 bg-light'>
				<div className='row'>
					<div className='col-md-6 col-lg-3 mt-3'>
						<Skeleton
							className='my-3'
							variant='rectangular'
							height={400}
						/>
					</div>
					<div className='col-md-6 col-lg-3 mt-3'>
						<Skeleton
							className='my-3'
							variant='rectangular'
							height={400}
						/>
					</div>
					<div className='col-md-6 col-lg-3 mt-3'>
						<Skeleton
							className='my-3'
							variant='rectangular'
							height={400}
						/>
					</div>
					<div className='col-md-6 col-lg-3 mt-3'>
						<Skeleton
							className='my-3'
							variant='rectangular'
							height={400}
						/>
					</div>
				</div>
			</div>
		);
	}

	if (erroring) {
		return (
			<div>
				<h1>Gặp lỗi: {erroring}</h1>
			</div>
		);
	}
	return (
		<div className='container-book container mb-5 pb-5 px-5 bg-light'>
			<h2 className='mt-4 px-3 py-3 mb-0'>SÁCH MỚI</h2>
			<hr className='mt-0' />
			<div className='row'>
				{bookList.map((book) => (
                        <div key={book.bookId} className="col-md-3 mb-4">
                        <BookProps book={book} />
                        </div>				
                ))}
			</div>
		</div>
	);
};

export default NewBookList;