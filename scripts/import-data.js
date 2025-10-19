const { ConvexHttpClient } = require("convex/browser");
const fs = require("fs");
const path = require("path");

// Đọc Convex URL từ environment
const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL;

if (!CONVEX_URL) {
  console.error("❌ NEXT_PUBLIC_CONVEX_URL is not set");
  console.log("Hãy chạy 'npx convex dev' để lấy URL và cập nhật .env.local");
  process.exit(1);
}

async function importData() {
  try {
    console.log("🚀 Đang kết nối đến Convex...");
    const client = new ConvexHttpClient(CONVEX_URL);
    
    // Đọc file seed data
    const seedDataPath = path.join(__dirname, "../convex/seed-data.json");
    const seedData = JSON.parse(fs.readFileSync(seedDataPath, "utf8"));
    
    console.log(`📊 Tìm thấy ${seedData.length} items trong seed data`);
    
    // Xóa data cũ
    console.log("🗑️  Đang xóa data cũ...");
    await client.mutation("todos:clearTodos");
    
    // Import data mới
    console.log("📥 Đang import data mới...");
    for (const item of seedData) {
      await client.mutation("todos:addTodo", {
        text: item.text,
        priority: item.priority,
        category: item.category,
      });
      
      // Cập nhật completed status và dueDate nếu có
      if (item.completed || item.dueDate) {
        // Cần lấy ID của todo vừa tạo để update
        const todos = await client.query("todos:getTodos");
        const latestTodo = todos[0]; // Vì sort desc nên item đầu tiên là mới nhất
        
        if (latestTodo) {
          await client.mutation("todos:updateTodo", {
            id: latestTodo._id,
            completed: item.completed,
            dueDate: item.dueDate,
          });
        }
      }
    }
    
    console.log("✅ Import data thành công!");
    console.log(`📈 Đã import ${seedData.length} todos`);
    
  } catch (error) {
    console.error("❌ Lỗi khi import data:", error.message);
    process.exit(1);
  }
}

importData();
