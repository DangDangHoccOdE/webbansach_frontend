
import { refreshAccessToken } from "../../api/RefreshToken";
import { isTokenExpired } from "./JwtService";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";

export const CheckAndRefreshToken = async() => {
    const { setLoggedIn } = useAuth();
    const navigate = useNavigate();

            const accessToken = localStorage.getItem("accessToken");
            const refreshToken = localStorage.getItem("refreshToken");

            if (accessToken && isTokenExpired(accessToken) && refreshToken) {
                try {
                    console.log("Đã hết accessToken");
                    const response = await refreshAccessToken(refreshToken);
                    const { accessTokenJwt, refreshTokenJwt } = response;
                    localStorage.setItem("accessToken", accessTokenJwt);
                    localStorage.setItem("refreshToken", refreshTokenJwt);
                    setLoggedIn(true);
                } catch (error) {
                    console.log("Không thể fetch được api", error);
                    setLoggedIn(false);
                    navigate("/");
                }
            }
    };



export default CheckAndRefreshToken;
