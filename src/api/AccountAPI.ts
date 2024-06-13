/* eslint-disable import/no-anonymous-default-export */
interface checkEmailProps{
    setErrorEmail:(email:string)=>void
}
export async function checkEmail(email:string,{setErrorEmail}:checkEmailProps):Promise<boolean> {
      const url = `http://localhost:8080/users/search/existsByEmail?email=${email}`;
        const regexEmail = /^((?!\.)[\w-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/gim;
        try{
            const response = await fetch(url);

            const data =await response.text();
            if(data==="true"){
                setErrorEmail("Tên email đã tồn tại!");
                return true;
            }else if(!regexEmail.test(email)){
                setErrorEmail("Định dạng email không hợp lệ!");
                return true;
            }

            return false;
        }catch(error){
            console.error("Lỗi khi kiểm tra tên email",error);
            return false;
        }
}

interface checkUserNameProps{
    setErrorUserName:(userName:string)=>void
}

export async function checkUserName(userName:string,{setErrorUserName}:checkUserNameProps):Promise<boolean>{
    const url = `http://localhost:8080/users/search/existsByUserName?userName=${userName}`;

    try{
        const response = await fetch(url);

        const data =await response.text();

        if(data==="true"){
            setErrorUserName("Tên đăng nhập đã tồn tại!");
            return true;
        }
        return false;
    }catch(error){
        console.error("Lỗi khi kiểm tra tên đăng nhập",error);
        return false;
    }
}

export default {checkEmail,checkUserName};
