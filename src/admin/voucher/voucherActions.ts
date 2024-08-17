import { toast } from "react-toastify";
import { confirm } from "material-ui-confirm";
import fetchWithAuth from "../../layouts/utils/AuthService";

export const deleteVoucher = async (voucherId: number) => {
  try {
    await confirm({
      title: 'Voucher',
      description: `Xóa voucher đã chọn?`,
      confirmationText: ['Đồng ý'],
      cancellationText: ['Hủy'],
    });

    await toast.promise(
      fetchWithAuth(`http://localhost:8080/vouchers/deleteVoucherAdmin/${voucherId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
        }
      }),
      {
        pending: "Đang trong quá trình xử lý...",
        success: "Đã xóa voucher thành công",
        error: "Không thể xóa voucher!"
      }
    );

    return true; // Trả về true nếu xóa thành công
  } catch (error) {
    console.error(error);
    return false; // Trả về false nếu có lỗi hoặc người dùng hủy
  }
};

export const deleteSelectedVouchers = async (selectedVouchers: number[]) => {
  try {
    await confirm({
      title: 'Voucher',
      description: `Xóa những voucher đã chọn?`,
      confirmationText: ['Đồng ý'],
      cancellationText: ['Hủy'],
    });

    await toast.promise(
      fetchWithAuth(`http://localhost:8080/vouchers/deleteVouchersSelected`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
        },
        body: JSON.stringify(selectedVouchers)
      }),
      {
        pending: "Đang trong quá trình xử lý...",
        success: "Đã xóa voucher thành công",
        error: "Không thể xóa voucher!"
      }
    );

    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

export const giftVouchersToUsers = async (selectedVouchers: number[]) => {
  try {
    await confirm({
      title: 'Voucher',
      description: `Tặng những voucher cho tất cả user đã chọn?`,
      confirmationText: ['Đồng ý'],
      cancellationText: ['Hủy'],
    });

    await toast.promise(
      fetchWithAuth(`http://localhost:8080/vouchers/giftVouchersToUsers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
        },
        body: JSON.stringify(selectedVouchers)
      }),
      {
        pending: "Đang trong quá trình xử lý...",
        success: "Đã tặng voucher thành công",
        error: "Không thể tặng voucher!"
      }
    );

    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

export const addVouchersToVoucherAvailable = async (selectedVouchers: number[]) => {
  try {
    await confirm({
      title: 'Voucher',
      description: `Thêm voucher vào voucher có sẵn?`,
      confirmationText: ['Đồng ý'],
      cancellationText: ['Hủy'],
    });

    await toast.promise(
      fetchWithAuth(`http://localhost:8080/vouchers/addVouchersToVoucherAvailable`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
        },
        body: JSON.stringify(selectedVouchers)
      }),
      {
        pending: "Đang trong quá trình xử lý...",
        success: "Đã thêm voucher vào voucher có sẵn thành công",
        error: "Không thể thêm voucher vào voucher có sẵn!"
      }
    );

    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};