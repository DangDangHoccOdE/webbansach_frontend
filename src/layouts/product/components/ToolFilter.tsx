import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TextField } from "@mui/material";
import { ChangeEvent, useEffect, useState } from "react";
import CategoryModel from "../../../models/CategoryModel";
import { getAllCategory } from "../../../api/CategoryAPI";
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';

interface ToolFilterProps{
    setKeySearch:any;
    setIdCate:any;
    setFilter:any;
    keyBookFind:string;
    idCate:number;
    filter:number;
}

const ToolFilter:React.FC<ToolFilterProps>= (props)=>{
    const [keySearchTemp,setKeySearchTemp] = useState(props.keyBookFind);

    const onSetKeySearch = (e:ChangeEvent<HTMLInputElement>)=>{
        setKeySearchTemp(e.target.value);   
        console.log(e.target.value)
        if(e.target.value.trim() === ""){
            props.setKeySearch(e.target.value);
        }
    }

    // Khi Nhấn nút search
    const submitSearch=()=>{
        console.log("Search",keySearchTemp)
        props.setKeySearch();
    }

    // Khi nhấn enter thì sẽ submit
    const handleKeyUp =(event:any)=>{
        if(event.key === "Enter"){
            submitSearch();
        }
    }

    // Thay đổi giá trị thể loại
 	const handleChangeCate = (event: SelectChangeEvent) => {
        props.setIdCate(event.target.value);
    }

    // Thay đổi giá trị bộ lọc
    const handleChangeFilter = (event:SelectChangeEvent)=>{
        props.setFilter(event.target.value);
    }

    const [categoryList,setCategoryList] = useState<CategoryModel[]>([]);
    useEffect(()=>{
        getAllCategory()
            .then((response)=>{
                setCategoryList(response)
            }).catch(error=>{
                console.error(error);
            })
    },[])

   
	return (
		<div className='d-flex align-items-center justify-content-between'>
			<div className='row' style={{ flex: 1 }}>
				<div className='col-lg-6 col-md-12 col-sm-12'>
					<div className='d-flex align-items-center justify-content-lg-start justify-content-md-center justify-content-sm-center'>
						{/* Genre */}
						<FormControl sx={{ m: 1, minWidth: 120 }} size='small'>
							<InputLabel id='demo-simple-select-helper-label'>
								Thể loại sách
							</InputLabel>
							<Select
								labelId='demo-simple-select-helper-label'
								id='demo-simple-select-helper'
								value={props.idCate ? props.idCate + "" : ""}
								label='Thể loại sách'
								autoWidth
								onChange={handleChangeCate}
								sx={{ minWidth: "150px" }}
							>
								<MenuItem value=''>
									<em>None</em>
								</MenuItem>
								{categoryList?.map((category, index) => {
									return (
										<MenuItem value={category.categoryId} key={index}>
											{category.categoryName}
										</MenuItem>
									);
								})}
							</Select>
						</FormControl>

						{/* Filter */}
						<FormControl sx={{ m: 1, minWidth: 120 }} size='small'>
							<InputLabel id='demo-simple-select-helper-label'>
								Sắp xếp theo
							</InputLabel>
							<Select
								labelId='demo-simple-select-helper-label'
								id='demo-simple-select-helper'
								value={props.filter ? props.filter + "" : ""}
								label='Sắp xếp theo'
								autoWidth
								onChange={handleChangeFilter}
								sx={{ minWidth: "150px" }}
							>
								<MenuItem value=''>
									<em>None</em>
								</MenuItem>
								<MenuItem value={1}>Tên sách A - Z</MenuItem>
								<MenuItem value={2}>Tên sách Z - A</MenuItem>
								<MenuItem value={3}>
									<span className='d-inline-flex align-items-center'>
										Giá tăng dần
										<TrendingUpIcon style={{color:"green"}}/>
									</span>
								</MenuItem>
								<MenuItem value={4}>
									<span className='d-inline-flex align-items-center'>
										Giá giảm dần
                                        <TrendingDownIcon style={{color:"red"}}/>

									</span>
								</MenuItem>
								<MenuItem value={5}>Sách bán chạy nhất</MenuItem>
							</Select>
						</FormControl>
					</div>
				</div>

				{/* Search */}
				<div className='col-lg-6 col-md-12 col-sm-12'>
					<div className='d-inline-flex align-items-center justify-content-lg-end w-100 justify-content-md-center'>
						<div className='d-inline-flex align-items-center justify-content-between mx-5'>
							<TextField
								size='small'
								id='outlined-search'
								label='Tìm kiếm theo tên sách'
								type='search'
								value={keySearchTemp}
								onChange={onSetKeySearch}
								onKeyUp={handleKeyUp}
							/>
							<button
								style={{ height: "40px" }}
								type='button'
								className='btn btn-primary ms-2'
								onClick={() => props.setKeySearch(keySearchTemp)}
							>
								<i className='fas fa-search'></i>
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
export default ToolFilter;