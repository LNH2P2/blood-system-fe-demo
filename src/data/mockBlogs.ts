import { Blog, BlogStatus } from '@/types/blog'

export const mockBlogs: Blog[] = [
  {
    _id: '1',
    title: 'Tầm quan trọng của việc hiến máu trong cộng đồng',
    image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    summary:
      'Hiến máu là một hành động cao đẹp, không chỉ cứu sống người khác mà còn mang lại nhiều lợi ích cho sức khỏe của người hiến. Bài viết này sẽ giúp bạn hiểu rõ hơn về vai trò quan trọng của việc hiến máu.',
    content: `Hiến máu là một trong những hành động cao đẹp nhất mà con người có thể thực hiện để giúp đỡ đồng loại. Mỗi lần hiến máu, bạn có thể cứu sống đến 3 người.

## Lợi ích của việc hiến máu

### Đối với người nhận
- Cứu sống trong các trường hợp cấp cứu
- Hỗ trợ điều trị bệnh ung thư
- Giúp đỡ phụ nữ sinh con gặp biến chứng
- Hỗ trợ phẫu thuật lớn

### Đối với người hiến
- Kiểm tra sức khỏe định kỳ miễn phí
- Kích thích cơ thể sản xuất máu mới
- Giảm nguy cơ mắc bệnh tim mạch
- Mang lại cảm giác hạnh phúc khi giúp đỡ người khác

## Quy trình hiến máu an toàn

Việc hiến máu tại các cơ sở y tế được thực hiện theo quy trình nghiêm ngặt:

1. **Đăng ký và kiểm tra sức khỏe**: Đo huyết áp, kiểm tra hemoglobin
2. **Tư vấn y tế**: Bác sĩ sẽ tư vấn và đánh giá tình trạng sức khỏe
3. **Hiến máu**: Quá trình hiến máu kéo dài 8-10 phút
4. **Nghỉ ngơi và ăn nhẹ**: Được cung cấp đồ ăn và nước uống
5. **Theo dõi sau hiến máu**: Nhận hướng dẫn chăm sóc sau hiến máu

## Điều kiện hiến máu

- Tuổi từ 18-60 (lần đầu), 18-65 (đã hiến trước đó)
- Cân nặng tối thiểu 45kg
- Sức khỏe tốt, không mắc bệnh truyền nhiễm
- Không sử dụng thuốc kháng sinh trong 7 ngày trước hiến máu

Hãy tham gia hiến máu để góp phần xây dựng một cộng đồng yêu thương và tương trợ lẫn nhau!`,
    status: BlogStatus.PUBLISHED,
    viewCount: 1250,
    createdAt: '2024-01-15T08:30:00.000Z',
    updatedAt: '2024-01-16T10:15:00.000Z'
  },
  {
    _id: '2',
    title: 'Hướng dẫn chuẩn bị trước khi hiến máu',
    image:
      'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    summary:
      'Để việc hiến máu diễn ra thuận lợi và an toàn, việc chuẩn bị trước khi hiến máu rất quan trọng. Bài viết này sẽ hướng dẫn chi tiết các bước chuẩn bị cần thiết.',
    content: `Việc chuẩn bị kỹ càng trước khi hiến máu sẽ giúp quá trình hiến máu diễn ra thuận lợi và đảm bảo an toàn cho cả người hiến và người nhận.

## Chuẩn bị về thể chất

### 1-2 ngày trước khi hiến máu:
- Ngủ đủ giấc, nghỉ ngơi hợp lý
- Ăn uống đầy đủ, tăng cường thực phẩm giàu sắt
- Uống nhiều nước, duy trì cơ thể đủ nước
- Tránh uống rượu bia và các chất kích thích

### Ngày hiến máu:
- Ăn sáng đầy đủ trước khi đến hiến máu
- Mặc quần áo thoải mái, tay áo rộng
- Mang theo giấy tờ tùy thân
- Không nên đến khi đói hoặc mệt mỏi

## Thực phẩm nên ăn trước khi hiến máu

### Thực phẩm giàu sắt:
- Thịt đỏ: thịt bò, thịt lợn
- Gan, tim, lòng động vật
- Các loại hải sản: cua, tôm, nghêu
- Rau xanh đậm màu: rau bina, cải xoăn

### Thực phẩm giàu vitamin C:
- Cam, chanh, bưởi
- Ổi, kiwi, dâu tây
- Cà chua, ớt chuông
- Rau củ tươi

## Những điều cần tránh

- Không uống rượu bia 24 giờ trước hiến máu
- Tránh ăn thức ăn nhiều dầu mỡ
- Không hút thuốc trước khi hiến máu
- Tránh tập thể dục nặng

Việc chuẩn bị tốt sẽ giúp bạn có trải nghiệm hiến máu tốt nhất!`,
    status: BlogStatus.PUBLISHED,
    viewCount: 892,
    createdAt: '2024-01-20T14:20:00.000Z',
    updatedAt: '2024-01-20T14:20:00.000Z'
  },
  {
    _id: '3',
    title: 'Các nhóm máu và tính tương thích trong truyền máu',
    image:
      'https://images.unsplash.com/photo-1582719471384-894fbb16e074?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    summary:
      'Hiểu về các nhóm máu và tính tương thích là kiến thức quan trọng trong y học. Bài viết này sẽ giải thích chi tiết về hệ thống nhóm máu ABO và Rh.',
    content: `Hệ thống nhóm máu là một trong những khám phá quan trọng nhất trong lịch sử y học, giúp việc truyền máu trở nên an toàn và hiệu quả.

## Hệ thống nhóm máu ABO

### Nhóm máu A:
- Có kháng nguyên A trên bề mặt hồng cầu
- Có kháng thể anti-B trong huyết tương
- Có thể nhận máu từ nhóm A và O
- Có thể cho máu cho nhóm A và AB

### Nhóm máu B:
- Có kháng nguyên B trên bề mặt hồng cầu
- Có kháng thể anti-A trong huyết tương
- Có thể nhận máu từ nhóm B và O
- Có thể cho máu cho nhóm B và AB

### Nhóm máu AB:
- Có cả kháng nguyên A và B
- Không có kháng thể anti-A và anti-B
- Có thể nhận máu từ tất cả các nhóm (người nhận chung)
- Chỉ có thể cho máu cho nhóm AB

### Nhóm máu O:
- Không có kháng nguyên A và B
- Có cả kháng thể anti-A và anti-B
- Chỉ có thể nhận máu từ nhóm O
- Có thể cho máu cho tất cả các nhóm (người cho chung)

## Hệ thống Rh

### Rh dương (+):
- Có kháng nguyên D trên hồng cầu
- Chiếm khoảng 85% dân số

### Rh âm (-):
- Không có kháng nguyên D
- Chiếm khoảng 15% dân số
- Cần đặc biệt chú ý khi mang thai

## Tầm quan trọng trong hiến máu

Việc xác định chính xác nhóm máu giúp:
- Đảm bảo an toàn cho người nhận
- Tránh phản ứng bất lợi
- Tối ưu hóa việc sử dụng máu hiến
- Lập kế hoạch dự trữ máu hiệu quả

Mỗi nhóm máu đều có vai trò quan trọng trong việc cứu sống con người!`,
    status: BlogStatus.DRAFT,
    viewCount: 0,
    createdAt: '2024-01-25T09:45:00.000Z',
    updatedAt: '2024-01-25T11:30:00.000Z'
  },
  {
    _id: '4',
    title: 'Câu chuyện cảm động từ những người được cứu sống nhờ máu hiến',
    image: 'https://images.unsplash.com/photo-1551601651-2a8555f1a136?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    summary:
      'Những câu chuyện thật về cuộc sống được cứu nhờ máu hiến sẽ truyền cảm hứng và nhận thức về tầm quan trọng của việc hiến máu tình nguyện.',
    content: `Đằng sau mỗi túi máu là một câu chuyện, một hy vọng, và đôi khi là một phép màu. Dưới đây là những câu chuyện thật về những người đã được cứu sống nhờ máu hiến.

## Câu chuyện của bé Minh Anh

Bé Minh Anh, 5 tuổi, bị tai nạn giao thông nghiêm trọng và mất nhiều máu. Trong tình huống nguy kịch, bé đã được truyền 3 đơn vị máu từ những người hiến máu tình nguyện.

"Con tôi đã được cứu sống nhờ sự tử tế của những người hiến máu. Tôi không thể diễn tả được lòng biết ơn của mình." - Chị Lan, mẹ của bé Minh Anh.

## Anh Tuấn và cuộc phẫu thuật tim

Anh Tuấn, 35 tuổi, cần phẫu thuật tim cấp cứu. Ca phẫu thuật kéo dài 6 giờ và cần 8 đơn vị máu các loại.

"Tôi biết rằng mình còn sống hôm nay là nhờ những người đã hiến máu. Tôi quyết định sẽ hiến máu thường xuyên để đền đáp lại cộng đồng." - Anh Tuấn chia sẻ.

## Chị Hoa và ca sinh con khó khăn

Chị Hoa gặp biến chứng nặng khi sinh con, cần truyền máu khẩn cấp để cứu sống cả mẹ và con.

"Máu hiến đã cho tôi cơ hội được nhìn thấy con mình lớn lên. Đó là món quà vô giá nhất mà ai đó có thể trao tặng." - Chị Hoa.

## Ông Nam và hành trình chống ung thư

Ông Nam, 60 tuổi, trong quá trình điều trị ung thư máu đã cần truyền máu định kỳ trong suốt 2 năm.

"Mỗi lần truyền máu là một lần tôi cảm nhận được sự sống chảy trong người. Tôi biết ơn những người hiến máu đã cho tôi thêm thời gian bên gia đình." - Ông Nam.

## Thông điệp

Những câu chuyện này cho thấy:
- Máu hiến có thể cứu sống bất kỳ ai, ở bất kỳ độ tuổi nào
- Mỗi lần hiến máu đều có ý nghĩa to lớn
- Việc hiến máu tạo ra chuỗi tử tế lan tỏa trong cộng đồng
- Không ai biết được khi nào mình sẽ cần đến máu hiến

Hãy tham gia hiến máu để trở thành người hùng thầm lặng trong câu chuyện của ai đó!`,
    status: BlogStatus.PUBLISHED,
    viewCount: 2103,
    createdAt: '2024-01-18T16:00:00.000Z',
    updatedAt: '2024-01-19T08:45:00.000Z'
  },
  {
    _id: '5',
    title: 'Những mitos và sự thật về hiến máu',
    image:
      'https://images.unsplash.com/photo-1584516150909-c43483ee8c3a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    summary:
      'Nhiều người vẫn còn những hiểu lầm về việc hiến máu. Bài viết này sẽ làm rõ những mitos phổ biến và đưa ra sự thật khoa học.',
    content: `Nhiều người vẫn còn những hiểu lầm về việc hiến máu, điều này làm họ ngần ngại tham gia. Hãy cùng tìm hiểu sự thật để loại bỏ những quan niệm sai lầm này.

## Mitos 1: "Hiến máu sẽ làm suy yếu cơ thể"

**Sự thật**: Cơ thể sẽ bù đắp lượng máu đã hiến trong vòng 24-48 giờ. Hồng cầu được tái tạo hoàn toàn sau 4-6 tuần.

## Mitos 2: "Hiến máu có thể lây nhiễm bệnh"

**Sự thật**: Tất cả dụng cụ hiến máu đều vô trùng, sử dụng một lần. Không có khả năng lây nhiễm từ việc hiến máu.

## Mitos 3: "Người gầy không thể hiến máu"

**Sự thật**: Chỉ cần cân nặng từ 45kg trở lên và sức khỏe tốt là có thể hiến máu.

## Mitos 4: "Hiến máu sẽ làm tăng cân"

**Sự thật**: Hiến máu không ảnh hưởng đến cân nặng. Việc ăn uống sau hiến máu chỉ để bù năng lượng.

## Mitos 5: "Người có huyết áp thấp không được hiến máu"

**Sự thật**: Người có huyết áp trong giới hạn bình thường (100-180 mmHg) vẫn có thể hiến máu.

## Những sự thật quan trọng

### Hiến máu an toàn:
- Quy trình được kiểm soát nghiêm ngặt
- Đội ngũ y tế chuyên nghiệp
- Thiết bị hiện đại, vô trùng

### Lợi ích cho sức khỏe:
- Kích thích sản xuất máu mới
- Kiểm tra sức khỏe miễn phí
- Giảm nguy cơ bệnh tim mạch

### Ai có thể hiến máu:
- Tuổi từ 18-60 (lần đầu)
- Cân nặng tối thiểu 45kg
- Sức khỏe tốt
- Không mắc bệnh truyền nhiễm

## Kết luận

Việc hiến máu là hành động an toàn, có ích và cao đẹp. Đừng để những hiểu lầm ngăn cản bạn tham gia cứu sống người khác!`,
    status: BlogStatus.ARCHIVED,
    viewCount: 756,
    createdAt: '2024-01-10T12:00:00.000Z',
    updatedAt: '2024-01-22T14:30:00.000Z'
  },
  {
    _id: '6',
    title: 'Chăm sóc sức khỏe sau khi hiến máu',
    image:
      'https://images.unsplash.com/photo-1506126613408-eca07ce68773?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    summary:
      'Hướng dẫn chi tiết về cách chăm sóc bản thân sau khi hiến máu để đảm bảo phục hồi nhanh chóng và an toàn.',
    content: `Sau khi hiến máu, việc chăm sóc bản thân đúng cách sẽ giúp cơ thể phục hồi nhanh chóng và chuẩn bị cho lần hiến máu tiếp theo.

## Ngay sau khi hiến máu (0-2 giờ)

### Nghỉ ngơi tại chỗ:
- Ngồi thư giãn 10-15 phút
- Uống nước hoặc đồ uống có đường
- Ăn bánh quy hoặc đồ ăn nhẹ
- Không vội vã đứng dậy

### Chăm sóc vết kim:
- Giữ băng keo trong 4-6 giờ
- Tránh làm ướt vùng kim châm
- Không nâng vật nặng bằng tay đã hiến máu

## Trong ngày hiến máu

### Dinh dưỡng:
- Uống nhiều nước (2-3 lít)
- Ăn thức ăn giàu sắt
- Tránh rượu bia và caffeine
- Ăn đầy đủ các bữa

### Hoạt động:
- Tránh tập thể dục nặng
- Không làm việc quá sức
- Tránh tắm nước nóng
- Nghỉ ngơi sớm

## 24-48 giờ đầu

### Chế độ ăn uống:
- Tăng cường thực phẩm giàu sắt
- Ăn nhiều rau xanh
- Bổ sung vitamin C
- Duy trì đủ nước

### Dấu hiệu cần chú ý:
- Chóng mặt kéo dài
- Buồn nôn
- Vết kim sưng tấy
- Cảm giác mệt mỏi quá mức

## Thực phẩm nên ăn

### Giàu sắt:
- Thịt đỏ, gan
- Hải sản
- Đậu, lạc
- Rau bina, cải xoăn

### Giàu vitamin C:
- Cam, chanh
- Ổi, kiwi
- Cà chua
- Ớt chuông

### Protein:
- Trứng
- Sữa và chế phẩm từ sữa
- Thịt nạc
- Đậu phụ

## Khi nào có thể hiến máu lại?

- Nam giới: sau 12 tuần
- Nữ giới: sau 16 tuần
- Đảm bảo sức khỏe ổn định
- Hemoglobin đạt mức chuẩn

## Liên hệ y tế khi:

- Chóng mặt không hết sau 24 giờ
- Vết kim bị nhiễm trùng
- Sốt cao
- Mệt mỏi kéo dài

Chăm sóc tốt sau hiến máu sẽ giúp bạn sẵn sàng cho những lần hiến máu tiếp theo!`,
    status: BlogStatus.DRAFT,
    viewCount: 0,
    createdAt: '2024-01-26T10:30:00.000Z',
    updatedAt: '2024-01-26T15:45:00.000Z'
  },
  {
    _id: '7',
    title: 'Vai trò của ngân hàng máu trong hệ thống y tế',
    image: 'https://images.unsplash.com/photo-1551190822-a9333d879b1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    summary:
      'Tìm hiểu về hoạt động của ngân hàng máu, quy trình bảo quản và phân phối máu đến các bệnh viện trên toàn quốc.',
    content: `Ngân hàng máu đóng vai trò then chốt trong hệ thống y tế, đảm bảo cung cấp máu an toàn và kịp thời cho các bệnh viện.

## Chức năng của ngân hàng máu

### Thu thập máu:
- Tổ chức các chiến dịch hiến máu
- Vận hành xe hiến máu lưu động
- Thiết lập điểm hiến máu cố định
- Phối hợp với các tổ chức, trường học

### Xét nghiệm và kiểm tra:
- Xét nghiệm nhóm máu ABO, Rh
- Sàng lọc các bệnh truyền nhiễm
- Kiểm tra chất lượng máu
- Đảm bảo an toàn tuyệt đối

### Bảo quản máu:
- Tách máu thành các thành phần
- Bảo quản ở nhiệt độ phù hợp
- Theo dõi hạn sử dụng
- Kiểm soát chất lượng liên tục

## Quy trình xử lý máu

### Bước 1: Thu thập
- Hiến máu từ người tình nguyện
- Ghi nhận thông tin người hiến
- Bảo quản tạm thời trong túi chuyên dụng

### Bước 2: Vận chuyển
- Sử dụng phương tiện chuyên dụng
- Duy trì chuỗi lạnh
- Giao đến ngân hàng máu trong 6 giờ

### Bước 3: Xét nghiệm
- Xét nghiệm nhóm máu
- Sàng lọc HIV, Hepatitis B&C, Syphilis
- Kiểm tra hemoglobin, bạch cầu

### Bước 4: Tách máu
- Hồng cầu lắng đọng
- Huyết tương tươi đông lạnh
- Tiểu cầu
- Protein đặc biệt

### Bước 5: Bảo quản
- Hồng cầu: 2-6°C, 35-42 ngày
- Huyết tương: -30°C, 12 tháng
- Tiểu cầu: 20-24°C, 5 ngày

## Phân phối và cấp phát

### Hệ thống thông tin:
- Database quản lý tồn kho
- Theo dõi nhu cầu từ bệnh viện
- Cảnh báo thiếu hụt
- Phối hợp liên vùng

### Nguyên tắc cấp phát:
- Ưu tiên cấp cứu
- Đảm bảo tương thích
- Kiểm soát chất lượng
- Theo dõi sau cấp phát

## Thách thức và giải pháp

### Thiếu hụt máu:
- Tăng cường tuyên truyền
- Mở rộng mạng lưới hiến máu
- Khuyến khích hiến máu định kỳ
- Phối hợp với doanh nghiệp

### Bảo quản chất lượng:
- Nâng cấp thiết bị
- Đào tạo nhân viên
- Áp dụng công nghệ mới
- Kiểm soát nghiêm ngặt

## Tương lai ngân hàng máu

### Công nghệ mới:
- Hệ thống thông tin tích hợp
- Thiết bị bảo quản tiên tiến
- Xét nghiệm tự động
- Truy xuất nguồn gốc

### Mở rộng dịch vụ:
- Điều trị bằng tế bào gốc
- Liệu pháp gen
- Y học tái tạo
- Máu nhân tạo

Ngân hàng máu là cầu nối quan trọng giữa người hiến máu và người cần máu, đảm bảo sự sống được cứu giúp kịp thời!`,
    status: BlogStatus.PUBLISHED,
    viewCount: 1456,
    createdAt: '2024-01-22T13:15:00.000Z',
    updatedAt: '2024-01-23T09:20:00.000Z'
  }
]
