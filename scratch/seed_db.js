const mongoose = require("mongoose");

const uri = "mongodb+srv://mohiteyash940_db_user:Yash06042026@cluster0.psjkfim.mongodb.net/devtech_workspace?retryWrites=true&w=majority";

console.log("Creating separate 'devtech_workspace' database in MongoDB Atlas...");

mongoose
  .connect(uri)
  .then(async () => {
    console.log("Connected to MongoDB Atlas!");
    const db = mongoose.connection.db;

    // Create collections and seed initial data in devtech_workspace
    const usersCollection = db.collection("users");
    await usersCollection.updateOne(
      { email: "mohiteyash940@gmail.com" },
      {
        $set: {
          name: "Mohite Yash",
          email: "mohiteyash940@gmail.com",
          role: "Devtech Software Intern",
          batch: "DEV-2026-FS04",
          domain: "Full Stack Web Development",
          college: "COEP Pune",
          mentor: "Rahul Sharma",
          createdAt: new Date(),
        },
      },
      { upsert: true }
    );

    const tasksCollection = db.collection("tasks");
    await tasksCollection.updateOne(
      { title: "DevTech Initial Setup & Database Connection Verification" },
      {
        $set: {
          title: "DevTech Initial Setup & Database Connection Verification",
          description: "Verify real-time synchronization between Admin Portal and MongoDB Atlas cloud.",
          assignedToEmail: "mohiteyash940@gmail.com",
          assignedToName: "Mohite Yash",
          status: "in progress",
          priority: "HIGH Priority",
          dueDate: "2026-10-15",
          createdAt: new Date(),
        },
      },
      { upsert: true }
    );

    const collections = await db.listCollections().toArray();
    console.log("🎉 SUCCESS! Separate database 'devtech_workspace' created in Atlas with collections:", collections.map(c => c.name));
    process.exit(0);
  })
  .catch((err) => {
    console.error("❌ Error seeding database:", err.message);
    process.exit(1);
  });
