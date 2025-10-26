# services/api-gateway/Dockerfile
# Dùng image Nginx (bản nhẹ)
FROM nginx:1.25-alpine

# Xóa file config mặc định của Nginx
RUN rm /etc/nginx/conf.d/default.conf

# Copy file config tùy chỉnh của chúng ta vào
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Mở port 80 (cổng chuẩn của Nginx)
EXPOSE 80

# Lệnh để chạy Nginx
CMD ["nginx", "-g", "daemon off;"]