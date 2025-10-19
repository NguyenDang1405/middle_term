# 🚀 Hướng dẫn Deploy Cloud Todo App

## 📋 Tổng quan

Hướng dẫn chi tiết để deploy ứng dụng Cloud Todo App lên:
1. **Vercel** (Cloud Platform)
2. **OpenStack** (Private Cloud)

## 🎯 Yêu cầu hệ thống

- Node.js 18+
- npm hoặc yarn
- Git
- Docker (cho OpenStack)
- Tài khoản Vercel
- Tài khoản Convex

---

## 🌐 Phần 1: Deploy lên Vercel

### Bước 1: Chuẩn bị môi trường

#### 1.1 Cài đặt Vercel CLI
```bash
npm install -g vercel
```

#### 1.2 Đăng nhập Vercel
```bash
vercel login
```

### Bước 2: Cấu hình Convex Database

#### 2.1 Tạo project Convex
```bash
# Trong thư mục project
npx convex dev
```

#### 2.2 Lấy thông tin kết nối
- Mở [Convex Dashboard](https://dashboard.convex.dev)
- Copy deployment URL và URL public
- Tạo file `.env.local`:

```bash
# .env.local
CONVEX_DEPLOYMENT=your-deployment-url-here
NEXT_PUBLIC_CONVEX_URL=your-convex-url-here
```

### Bước 3: Deploy lên Vercel

#### 3.1 Deploy lần đầu
```bash
# Trong thư mục project
vercel
```

#### 3.2 Cấu hình Environment Variables
1. Vào [Vercel Dashboard](https://vercel.com/dashboard)
2. Chọn project của bạn
3. Vào Settings > Environment Variables
4. Thêm các biến:
   - `CONVEX_DEPLOYMENT`: your-deployment-url
   - `NEXT_PUBLIC_CONVEX_URL`: your-convex-url

#### 3.3 Deploy production
```bash
vercel --prod
```

### Bước 4: Kiểm tra deployment
- Truy cập URL được cung cấp bởi Vercel
- Kiểm tra tính năng thêm/xóa todo
- Kiểm tra thống kê real-time

---

## 🏗️ Phần 2: Deploy lên OpenStack

### Bước 1: Chuẩn bị OpenStack Instance

#### 1.1 Tạo Instance
```bash
# Tạo instance Ubuntu 20.04 LTS
# Cấu hình: 2 vCPU, 4GB RAM, 20GB disk
# Mở ports: 22 (SSH), 80 (HTTP), 443 (HTTPS)
```

#### 1.2 Kết nối SSH
```bash
ssh -i your-key.pem ubuntu@your-openstack-ip
```

### Bước 2: Cài đặt Docker

#### 2.1 Cập nhật hệ thống
```bash
sudo apt update && sudo apt upgrade -y
```

#### 2.2 Cài đặt Docker
```bash
# Cài đặt Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Thêm user vào docker group
sudo usermod -aG docker ubuntu

# Cài đặt Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

#### 2.3 Khởi động lại session
```bash
exit
ssh -i your-key.pem ubuntu@your-openstack-ip
```

### Bước 3: Upload và cấu hình ứng dụng

#### 3.1 Upload code
```bash
# Từ máy local
scp -r -i your-key.pem . ubuntu@your-openstack-ip:/home/ubuntu/cloud-todo-app
```

#### 3.2 SSH vào instance
```bash
ssh -i your-key.pem ubuntu@your-openstack-ip
cd /home/ubuntu/cloud-todo-app
```

#### 3.3 Cấu hình environment
```bash
# Tạo file .env
cat > .env << EOF
CONVEX_DEPLOYMENT=your-deployment-url
NEXT_PUBLIC_CONVEX_URL=your-convex-url
EOF
```

### Bước 4: Build và chạy ứng dụng

#### 4.1 Build Docker image
```bash
docker-compose build
```

#### 4.2 Chạy ứng dụng
```bash
docker-compose up -d
```

#### 4.3 Kiểm tra logs
```bash
docker-compose logs -f
```

### Bước 5: Cấu hình Nginx (Tùy chọn)

#### 5.1 Cài đặt Nginx
```bash
sudo apt install nginx -y
```

#### 5.2 Cấu hình Nginx
```bash
sudo nano /etc/nginx/sites-available/cloud-todo-app
```

Nội dung file:
```nginx
server {
    listen 80;
    server_name your-domain.com your-openstack-ip;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

#### 5.3 Kích hoạt site
```bash
sudo ln -s /etc/nginx/sites-available/cloud-todo-app /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Bước 6: Cấu hình SSL (Tùy chọn)

#### 6.1 Cài đặt Certbot
```bash
sudo apt install certbot python3-certbot-nginx -y
```

#### 6.2 Lấy SSL certificate
```bash
sudo certbot --nginx -d your-domain.com
```

---

## 🔧 Troubleshooting

### Lỗi thường gặp

#### 1. Convex connection failed
```bash
# Kiểm tra environment variables
echo $CONVEX_DEPLOYMENT
echo $NEXT_PUBLIC_CONVEX_URL

# Kiểm tra Convex dashboard
# Đảm bảo deployment đang chạy
```

#### 2. Docker build failed
```bash
# Kiểm tra Dockerfile
docker build -t cloud-todo-app .

# Kiểm tra logs
docker-compose logs app
```

#### 3. Port conflicts
```bash
# Kiểm tra ports đang sử dụng
sudo netstat -tulpn | grep :3000
sudo netstat -tulpn | grep :80

# Kill process nếu cần
sudo kill -9 <PID>
```

#### 4. Nginx configuration
```bash
# Test nginx config
sudo nginx -t

# Restart nginx
sudo systemctl restart nginx

# Check nginx status
sudo systemctl status nginx
```

### Monitoring và Logs

#### Kiểm tra ứng dụng
```bash
# Kiểm tra containers
docker-compose ps

# Kiểm tra logs
docker-compose logs -f app

# Kiểm tra resource usage
docker stats
```

#### Health check
```bash
# Kiểm tra health endpoint
curl http://localhost:3000/api/health

# Kiểm tra từ bên ngoài
curl http://your-openstack-ip
```

---

## 📊 Performance Optimization

### Vercel Optimization
1. **Image Optimization**: Sử dụng Next.js Image component
2. **Code Splitting**: Tự động với Next.js
3. **CDN**: Tự động với Vercel Edge Network

### OpenStack Optimization
1. **Docker Multi-stage Build**: Giảm image size
2. **Nginx Caching**: Cache static assets
3. **Gzip Compression**: Nén response
4. **Resource Limits**: Cấu hình Docker limits

### Database Optimization
1. **Convex Indexing**: Tối ưu queries
2. **Real-time Updates**: Chỉ subscribe cần thiết
3. **Pagination**: Phân trang cho large datasets

---

## 🔒 Security Best Practices

### Vercel Security
1. **Environment Variables**: Không commit secrets
2. **HTTPS**: Tự động với Vercel
3. **CORS**: Cấu hình phù hợp

### OpenStack Security
1. **Firewall**: Chỉ mở ports cần thiết
2. **SSH Keys**: Sử dụng key-based auth
3. **Updates**: Cập nhật hệ thống thường xuyên
4. **SSL**: Sử dụng Let's Encrypt

---

## 📈 Monitoring và Analytics

### Vercel Analytics
- Built-in analytics trong Vercel dashboard
- Performance metrics
- Error tracking

### OpenStack Monitoring
```bash
# Cài đặt monitoring tools
sudo apt install htop iotop nethogs -y

# Monitor resources
htop
iotop
nethogs
```

---

## 🎯 Kết luận

Sau khi hoàn thành các bước trên, bạn sẽ có:

1. **Vercel Deployment**: 
   - URL: https://your-app.vercel.app
   - Auto-scaling
   - Global CDN
   - Zero-config deployment

2. **OpenStack Deployment**:
   - URL: http://your-openstack-ip
   - Full control
   - Custom configuration
   - Cost-effective

### Next Steps
1. Thiết lập CI/CD pipeline
2. Cấu hình monitoring
3. Backup strategy
4. Security hardening
5. Performance optimization

---

**Lưu ý**: Đây là hướng dẫn cho môi trường development/demo. Trong production, hãy thêm các biện pháp bảo mật và monitoring phù hợp.
