import fetchWithAuth from "../layouts/utils/AuthService";

export async function getRoleByUser(userId:number){
    const url:string = `http://localhost:8080/users/${userId}/roleList`

    const result:string[]=[];

    const response = await fetchWithAuth(url);

    if(!response.ok){
            throw new Error(`Không thể truy cập ${url}!`);
    }

    const data = await response.json();

    const responseData = data._embedded.roles;

    for(const key in responseData){
        result.push(responseData[key].roleName);
    }

    return result;

}