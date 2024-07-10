import { useEffect } from "react";
import fetchWithAuth from "../../layouts/utils/AuthService";

interface WishListAddAndChangeName {
  url: string;
  userId: number;
  newWishListName: string;
  setErrorNewWishList: (value: string) => void;
  setNewWishListName: (value: string) => void;
  setIsError: (value: boolean) => void;
  setIsUpdate: (prevState: boolean |((value:boolean)=>boolean)) => void;
}

const AddAndChangeNameWishList: React.FC<WishListAddAndChangeName> = ({
  url,
  userId,
  newWishListName,
  setErrorNewWishList,
  setNewWishListName,
  setIsError,
  setIsUpdate,
}) => {
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchWithAuth(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          body: JSON.stringify({
            userId,
            newWishListName,
          }),
        });

        const data = await response.json();
        if (response.ok) {
          setErrorNewWishList(data.content);
          setIsError(false);
          setIsUpdate((prevState: boolean) => !prevState);
        } else {
          setErrorNewWishList(data.content || "Lỗi tạo danh sách yêu thích");
          setIsError(true);
        }
      } catch (error) {
        setErrorNewWishList("Lỗi tạo danh sách yêu thích!");
        setIsError(true);
        console.error(error);
      }

      setNewWishListName("");
    };

    fetchData();
  }, [url, userId, newWishListName, setErrorNewWishList, setNewWishListName, setIsError, setIsUpdate]);

  return null;
};

export default AddAndChangeNameWishList;
