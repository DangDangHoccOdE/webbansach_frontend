export const refreshAccessToken = async (refreshToken: string) => {
    try {
        const url = "http://localhost:8080/user/refreshToken";
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-Refresh-Token":`Refresh-Token ${refreshToken}`,
            },
        });
        console.log("Authorization",`Bearer ${refreshToken}`)

        const text = await response.text();

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = JSON.parse(text);
        return data;
    } catch (error) {
        console.log("Lỗi refreshToken:", error);
        throw error;
    }
};
