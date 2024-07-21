import { useNavigate, useParams } from "react-router-dom";
import RequireAdmin from "../RequireAdmin";
import { useEffect } from "react";
import fetchWithAuth from "../../layouts/utils/AuthService";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import useScrollToTop from "../../hooks/ScrollToTop";

const DeleteVoucher: React.FC = () => {
  const { voucherId } = useParams();
  const navigate = useNavigate();
  useScrollToTop();

  useEffect(() => {
    const handleDelete = async () => {
      const url: string = `http://localhost:8080/vouchers/deleteVoucherAdmin/${voucherId}`;
      try {
        const response = await fetchWithAuth(url, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
          }
        });

        const data = await response.json();
        if (response.ok) {
          toast.success(data.content);
        } else {
          toast.error(data.content || "Lỗi, không thể xóa voucher này!");
        }
      } catch (error) {
        console.error({ error });
        toast.error("Lỗi, không thể xóa voucher");
      } finally {
        navigate("/voucher/showAllVoucherAdmin");
      }
    };

    handleDelete();
  }, [navigate, voucherId]);

  return null;
}

const DeleteVoucher_Admin = RequireAdmin(DeleteVoucher);
export default DeleteVoucher_Admin;
