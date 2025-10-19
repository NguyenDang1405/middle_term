# 🚀 Hướng dẫn thiết lập Convex Cloud

## 📋 Bước 1: Thiết lập Convex Project

```bash
# Chạy lệnh này và làm theo hướng dẫn
npx convex dev
```

Khi được hỏi:
- ✅ Chọn "create a new project"
- 📝 Đặt tên project: `todo-app`
- 👥 Chọn team (hoặc tạo mới)
- 🌍 Chọn region gần nhất

## 📊 Bước 2: Import Data

### Option A: Sử dụng Convex Dashboard (Đơn giản nhất)

1. **Mở Convex Dashboard** sau khi chạy `npx convex dev`
2. **Vào tab "Data"**
3. **Click "Insert" cho table "todos"**
4. **Copy và paste data từ file `convex/seed-data.json`**

### Option B: Sử dụng Script

```bash
# Chạy script để xem data
node convex/import-seed.js

# Hoặc sử dụng Convex mutations
npx convex run todos:seedTodos
```

## 🔧 Bước 3: Kiểm tra Data

Sau khi import, bạn có thể:

1. **Xem data trong Dashboard**
2. **Chạy queries trong Dashboard**
3. **Test ứng dụng với data thực**

## 📁 Files đã tạo:

- `convex/seed-data.json` - Data mẫu để import
- `convex/seed.ts` - Convex mutations để seed data
- `convex/import-seed.js` - Script helper
- `scripts/import-data.js` - Script import tự động

## 🎯 Data mẫu bao gồm:

- ✅ 10 todos với đầy đủ thông tin
- 🏷️ Các priority: high, medium, low
- 📂 Các category: work, learning, health, personal
- ⏰ Due dates và completed status
- 📅 Timestamps thực tế

## 🚀 Sau khi setup xong:

```bash
npm run dev
```

Ứng dụng sẽ chạy với data thực từ Convex Cloud!
