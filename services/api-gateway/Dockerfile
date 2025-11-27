FROM nginx:1.25-alpine

# Xóa config mặc định
RUN rm /etc/nginx/conf.d/default.conf

# Copy file config Nginx của dự án
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy toàn bộ FE (đang nằm ở /fe)
COPY fe /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
