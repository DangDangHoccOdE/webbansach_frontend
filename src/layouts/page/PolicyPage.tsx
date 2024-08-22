import React from "react";
import useScrollToTop from "../../hooks/ScrollToTop";

const PolicyPage: React.FC = () => {
	useScrollToTop(); // Mỗi lần vào component này thì sẽ ở trên cùng

	return (
		<div className='container my-5 bg-super-light p-4 rounded'>
			<h1>CHÍNH SÁCH ĐỔI / TRẢ / HOÀN TIỀN</h1>
			<p>
				Chúng tôi luôn trân trọng sự tin tưởng và ủng hộ của quý khách hàng
				khi trải nghiệm mua hàng tại{" "}
				<a href='#!'>
					<strong>BookStore</strong>
				</a>
				. Do đó chúng tôi luôn cố gắng hoàn thiện dịch vụ tốt nhất để phục
				vụ mọi nhu cầu mua sắm của quý khách.
			</p>
			<p>
				<a href='#!'>
					<strong>BookStore</strong>
				</a>{" "}
				chúng tôi luôn luôn cam kết tất cả các sản phẩm bán tại{" "}
				<a href='#!'>
					<strong>BookStore</strong>
				</a>{" "}
				100% là những sản phẩm chất lượng và xuất xứ nguồn gốc rõ ràng, hợp
				pháp cũng như an toàn cho người tiêu dùng. Để việc mua sắm của quý
				khách tại{" "}
				<a href='#!'>
					<strong>BookStore</strong>
				</a>{" "}
				là trải nghiệm dịch vụ thân thiện, chúng tôi hy vọng quý khách sẽ
				kiểm tra kỹ các nội dung sau trước khi nhận hàng:&nbsp;
			</p>
			<ul>
				<li>
					<p>Thông tin sản phẩm: tên sản phẩm và chất lượng sản phẩm.</p>
				</li>
				<li>
					<p>Số lượng sản phẩm.</p>
				</li>
			</ul>
			<p>
				Trong trường hợp hiếm hoi sản phẩm quý khách nhận được có khiếm
				khuyết, hư hỏng hoặc không như mô tả, BookStore cam kết bảo vệ khách
				hàng bằng chính sách đổi trả/ hoàn tiền trên tinh thần bảo vệ quyền
				lợi người tiêu dùng nhằm cam kết với quý khách về chất lượng sản
				phẩm và dịch vụ của chúng tôi.
			</p>
			<p>
				Khi quý khách hàng có hàng hóa mua tại{" "}
				<a href='#!'>
					<strong>BookStore</strong>
				</a>
				cần đổi/ trả/bảo hành/hoàn tiền, xin quý khách hàng liên hệ với
				chúng tôi qua hotline <strong>1900636467</strong> hoặc truy cập{" "}
				<a href='#!chinh-sach-doi-tra-hang'>
					<strong>BookStore.com/chinh-sach-doi-tra-hang</strong>
				</a>{" "}
				để tìm hiểu thêm về chính sách đổi/trả:
			</p>
			<strong>1. Thời gian áp dụng đổi/trả</strong> <br />
			<table
				style={{ width: "772px" }}
				cellSpacing='1'
				cellPadding='1'
				className='table table-bordered'
			>
				<tbody>
					<tr>
						<td>
							<p>&nbsp;</p>
						</td>
						<td>
							<p>
								<strong>KỂ TỪ KHI </strong>
								<strong>BookStore </strong>
								<strong>GIAO HÀNG THÀNH CÔNG</strong>
							</p>
						</td>
						<td>
							<p>
								<strong>
									SẢN PHẨM LỖI
									<br /> (do nhà cung cấp)
								</strong>
							</p>
						</td>
						<td>
							<p>
								<strong>SẢN PHẨM KHÔNG LỖI&nbsp;(*)</strong>
							</p>
						</td>
						<td>
							<p>
								<strong>SẢN PHẨM LỖI DO NGƯỜI SỬ DỤNG</strong>
							</p>
						</td>
					</tr>
					<tr>
						<td rowSpan={4}>
							<p>
								Sản phẩm Điện tử, Đồ chơi điện - điện tử, điện gia
								dụng,... (có tem phiếu bảo hành từ nhà cung cấp)
							</p>
						</td>
						<td rowSpan={2}>
							<p>7 ngày đầu tiên</p>
						</td>
						<td>
							<p>Đổi mới</p>
						</td>
						<td rowSpan={3}>
							<p>Trả hàng không thu phí</p>
						</td>
						<td rowSpan={4}>
							<p>
								Bảo hành hoặc sửa chữa có thu phí theo quy định của nhà
								cung cấp.
							</p>
						</td>
					</tr>
					<tr>
						<td>
							<p>Trả không thu phí</p>
						</td>
					</tr>
					<tr>
						<td>
							<p>8 - 30 ngày</p>
						</td>
						<td>
							<p>Bảo hành</p>
						</td>
					</tr>
					<tr>
						<td>
							<p>30 ngày trở đi</p>
						</td>
						<td>
							<p>Bảo hành</p>
						</td>
						<td>
							<p>Không hỗ trợ đổi/ trả</p>
						</td>
					</tr>
					<tr>
						<td rowSpan={3}>
							<p>Voucher/ E-voucher</p>
						</td>
						<td rowSpan={2}>
							<p>30 ngày đầu tiên</p>
						</td>
						<td>
							<p>Đổi mới</p>
						</td>
						<td rowSpan={2}>
							<p>Không hỗ trợ đổi/ trả</p>
						</td>
						<td rowSpan={2}>
							<p>Không hỗ trợ đổi/ trả</p>
						</td>
					</tr>
					<tr>
						<td>
							<p>Trả hàng không thu phí</p>
						</td>
					</tr>
					<tr>
						<td>
							<p>30 ngày trở đi</p>
						</td>
						<td colSpan={3}>
							<p>Không hỗ trợ đổi trả</p>
						</td>
					</tr>
					<tr>
						<td rowSpan={3}>
							<p>Đối với các ngành hàng còn lại</p>
						</td>
						<td rowSpan={2}>
							<p>30 ngày đầu tiên</p>
						</td>
						<td>
							<p>Đổi mới</p>
						</td>
						<td rowSpan={2}>
							<p>Trả hàng không thu phí</p>
						</td>
						<td rowSpan={3}>
							<p>Không hỗ trợ đổi/ trả</p>
						</td>
					</tr>
					<tr>
						<td>
							<p>Trả không thu phí</p>
						</td>
					</tr>
					<tr>
						<td>
							<p>30 ngày trở đi</p>
						</td>
						<td colSpan={2}>
							<p>Không hỗ trợ đổi/ trả</p>
						</td>
					</tr>
				</tbody>
			</table>
			<p>&nbsp;</p>
			<ul>
				<li>
					<p>Quý khách vui lòng thông báo về cho BookStore ngay khi:</p>
					<p>
						{" "}
						+ Kiện hàng giao tới ngoại quan bên ngoài có dấu hiệu hư hại ,
						sản phẩm bên trong trầy xước ,gãy bìa, rách, móp méo, ướt , bể
						vỡ...trong vòng 2 ngày kể từ khi nhận hàng thành công.
					</p>
					<p>
						{" "}
						+ Sản phẩm giao tới bị sai hàng , giao thiếu hàng trong vòng 2
						ngày kể từ khi nhận hàng thành công.
					</p>
				</li>
				<li>
					<p>
						Sau khi BookStore xác nhận mail tiếp nhận yêu cầu kiểm tra xử
						lý, BookStore sẽ liên hệ đến quý khách để xác nhận thông tin
						hoặc nhờ bổ sung thông tin (nếu có). Trường hợp không liên hệ
						được BookStore rất tiếc xin được phép từ chối xử lý yêu cầu.
						Thời gian BookStore liên hệ trong giờ hành chính tối đa 3 lần
						trong vòng 7 ngày sau khi nhận thông tin yêu cầu.
					</p>
				</li>
				<li>
					<p>
						Chúng tôi sẽ kiểm tra các trường hợp trên và giải quyết cho
						quý khách tối đa trong 30 ngày làm việc kể từ khi quý khách
						nhận được hàng, quá thời hạn trên rất tiếc chúng tôi không
						giải quyết khiếu nại.
					</p>
				</li>
			</ul>
			<p style={{ display: "inline!important" }}>
				<strong>2. Các trường hợp yêu cầu đổi trả</strong>
			</p>
			<ul>
				<li>
					<p>
						Lỗi kỹ thuật của sản phẩm - do nhà cung cấp (sách thiếu trang,
						sút gáy, trùng nội dung, sản phẩm điện tử, đồ chơi điện – điện
						tử không hoạt động..)
					</p>
				</li>
				<li>
					<p>
						Giao nhầm/ giao thiếu (thiếu sản phẩm đã đặt, thiếu phụ kiện,
						thiếu quà tặng kèm theo)
					</p>
				</li>
				<li>
					<p>Chất lượng hàng hóa kém, hư hại do vận chuyển.</p>
				</li>
				<li>
					<p>Hình thức sản phẩm không giống mô tả ban đầu.</p>
				</li>
				<li>
					<p>Quý khách đặt nhầm/ không còn nhu cầu (*)</p>
				</li>
			</ul>
			<p>
				(*) Đối với các Sản phẩm không bị lỗi, chỉ áp dụng khi sản phẩm đáp
				ứng đủ điều kiện sau:
			</p>
			<p>
				Quý khách&nbsp;có thể trả lại sản phẩm đã mua tại&nbsp;
				<strong>BookStore</strong> trong vòng 30 ngày kể từ khi nhận hàng với
				đa số sản phẩm khi thỏa mãn các điều kiện sau:
			</p>
			<ul>
				<li>
					<p>
						Sản phẩm không có dấu hiệu đã qua sử dụng, còn nguyên tem, mác
						hay niêm phong của nhà sản xuất.
					</p>
				</li>
				<li>
					<p>
						Sản phẩm còn đầy đủ phụ kiện hoặc phiếu bảo hành cùng quà tặng
						kèm theo (nếu có).
					</p>
				</li>
				<li>
					<p>
						Nếu là sản phẩm điện – điện tử thì chưa bị kích hoạt, chưa có
						sao ghi dữ liệu vào thiết bị.
					</p>
				</li>
			</ul>
			<strong>3. Điều kiện đổi trả</strong>
			<br />
			<p>
				<strong>BookStore</strong> hỗ trợ đổi/ trả sản phẩm cho quý khách nếu:
			</p>
			<ul>
				<li>
					<p>Sản phẩm còn nguyên bao bì như hiện trạng ban đầu.</p>
				</li>
				<li>
					<p>
						Sản phầm còn đầy đủ phụ kiện, quà tặng khuyến mãi kèm theo.
					</p>
				</li>
				<li>
					<p>Hóa đơn GTGT (nếu có).</p>
				</li>
				<li>
					<p>Cung cấp đầy đủ thông tin đối chứng theo yêu cầu (điều 4).</p>
				</li>
			</ul>
			<strong>4. Quy trình đổi trả</strong>
			<ul>
				<li>
					<p>
						Quý khách vui lòng thông tin đơn hàng cần hỗ trợ đổi trả theo
						Hotline 1900636467 hoặc email về địa chỉ:{" "}
						<strong>cskh@BookStore.com.vn</strong> với tiêu đề{" "}
						<strong>“Đổi Trả Đơn Hàng " Mã đơn hàng".</strong>
					</p>
				</li>
				<li>
					<p>
						Quý khách cần cung cấp đính kèm thêm các bằng chứng để đối
						chiếu/ khiếu nại sau:
					</p>
				</li>
			</ul>
			<p style={{ paddingLeft: "60px" }}>
				+ Video clip quay rõ các mặt của kiện hàng trước khi khui để thể
				hiện tình trạng của kiện hàng.
			</p>
			<p style={{ paddingLeft: "60px" }}>
				+ Video clip mở kiện hàng từ lúc bắt đầu khui ngoại quan đến kiểm
				tra sản phẩm bên trong thùng hàng.
			</p>
			<p style={{ paddingLeft: "60px" }}>
				+ Video quay rõ nét , không mờ , nhoè, thể hiện đầy đủ thông tin mã
				đơn hàng và quay cận cảnh lỗi của sản phẩm.
			</p>
			<p style={{ paddingLeft: "60px" }}>
				+ Hình chụp tem kiện hàng có thể hiện mã đơn hàng.
			</p>
			<p style={{ paddingLeft: "60px" }}>
				+ Hình chụp tình trạng ngoại quan (băng keo, seal, hình dạng thùng
				hàng, bao bì), đặc biệt các vị trí nghi ngờ có tác động đến sản phẩm
				(móp méo, ướt, rách...)
			</p>
			<p style={{ paddingLeft: "60px" }}>
				+ Hình chụp tình trạng sản phẩm bên trong, nêu rõ lỗi kỹ thuật nếu
				có.
			</p>
			<ul>
				<li>
					Để đảm bảo quyền lợi khách hàng và để <strong>BookStore</strong> có
					cơ sở làm việc với các bộ phận liên quan, tất cả yêu cầu đổi/
					trả/ bảo hành quý khách cần cung cấp hình ảnh/ clip sản phẩm lỗi.
					Quá thời gian đổi/ trả sản phẩm nếu chưa nhận được đủ hình ảnh/
					clip từ quý khách, <strong>BookStore</strong> xin phép từ chối hỗ
					trợ.
				</li>
			</ul>
			<table
				style={{ width: "756px" }}
				cellSpacing='0'
				cellPadding='7'
				className='table table-bordered'
			>
				<tbody>
					<tr>
						<td>
							<p>
								<strong>STT</strong>
							</p>
						</td>
						<td>
							<p>
								<strong>Nội dung</strong>
							</p>
						</td>
						<td>
							<p>
								<strong>Cách thức giải quyết</strong>
							</p>
						</td>
					</tr>
					<tr>
						<td>
							<p>1</p>
						</td>
						<td>
							<p>
								Lỗi kỹ thuật của sản phẩm - do nhà cung cấp (sách thiếu
								trang, sút gáy, trùng nội dung, sản phẩm điện tử không
								hoạt động..)
							</p>
						</td>
						<td>
							<p>BookStore có sản phẩm→ đổi mới cùng sản phẩm</p>
							<p>
								BookStore hết hàng→ Hoàn tiền hoặc quý khách có thể chọn
								mặt hàng khác tại website{" "}
								<span style={{ textDecoration: "underline" }}>
									<a href='#!'>www.BookStore</a>
								</span>
								.
							</p>
							<p>Đổi/trả không thu phí</p>
						</td>
					</tr>
					<tr>
						<td>
							<p>2</p>
						</td>
						<td>
							<p>Sản phẩm hỏng do quý khách</p>
						</td>
						<td>
							<p>Không hỗ trợ đổi/ trả</p>
						</td>
					</tr>
					<tr>
						<td>
							<p>3</p>
						</td>
						<td>
							<p>
								Lý do đổi/trả sản phẩm như: khách đặt nhầm hoặc không
								còn nhu cầu.
							</p>
						</td>
						<td>
							<p>&nbsp;</p>
							<p>
								Hỗ trợ thu hồi và hoàn tiền 100% giá trị sản phẩm cho
								quý khách hàng.
							</p>
							<p>
								**Lưu ý: BookStore rất tiếc sẽ không hỗ trợ hoàn lại chi
								phí vận chuyển trong đơn hàng cho trường hợp này.
							</p>
							<p>Đổi /trả không thu phí</p>
						</td>
					</tr>
					<tr>
						<td>
							<p>4</p>
						</td>
						<td>
							<p>
								Giao nhầm/ giao thiếu (thiếu sản phẩm đã đặt, thiếu phụ
								kiện, thiếu quà tặng kèm theo)
							</p>
						</td>
						<td>
							<p>Giao nhầm → Đổi lại đúng sản phẩm đã đặt.</p>
							<p>
								Giao thiếu → Giao bù thêm số lượng còn thiếu theo đơn
								hàng.
							</p>
							<p>Đổi /trả không thu phí</p>
						</td>
					</tr>
					<tr>
						<td>
							<p>5</p>
						</td>
						<td>
							<p>Chất lượng hàng hóa kém do vận chuyển</p>
						</td>
						<td>
							<p>
								Khi quý khách hàng nhận gói hàng bị móp méo, ướt, chúng
								tôi khuyến cáo khách hàng nên kiểm tra thực tế hàng hóa
								bên trong ngay thời điểm nhận hàng, vui lòng phản ảnh
								hiện trang hàng hóa lên bill nhận hàng từ phía nhân viên
								giao nhận và liên lạc với chúng tôi về hotline
								1900-636467 trong vòng 48 giờ để được hỗ trợ giải quyết
								cụ thể.
							</p>
							<p>Đổi /trả không thu phí</p>
						</td>
					</tr>
					<tr>
						<td>
							<p>6</p>
						</td>
						<td>
							<p>Hình thức sản phẩm không giống mô tả ban đầu</p>
						</td>
						<td>
							<p>
								Hãy liên hệ với chúng tôi qua số hotline 1900636467,
								chúng tôi sẵn sàng lắng nghe và giải quyết cho bạn (cụ
								thể theo từng trường hợp).
							</p>
							<p>Đổi /trả không thu phí</p>
						</td>
					</tr>
				</tbody>
			</table>
			<p>&nbsp;</p>
		</div>
	);
};
export default PolicyPage;