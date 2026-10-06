const mongoose = require("mongoose");

const uri = "mongodb+srv://mohiteyash940_db_user:Yash06042026@cluster0.psjkfim.mongodb.net/devtech_db?retryWrites=true&w=majority";

console.log("Connecting to devtech_db in MongoDB Atlas...");
mongoose
  .connect(uri)
  .then(async () => {
    console.log("🎉 SUCCESSFULLY CONNECTED TO devtech_db!");
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    console.log("Collections in devtech_db:", collections.map(c => c.name));
    process.exit(0);
  })
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err.message);
    process.exit(1);
  });
