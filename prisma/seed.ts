// prisma/seed.ts

import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

// "Habit Tracker" অ্যাপ্লিকেশনের জন্য অর্থপূর্ণ Habit টাইটেল, ট্যাগ এবং রঙ
const habitTemplates = [
  {
    title: "Code for 1 hour every day",
    tags: ["#coding", "#consistency"],
    color: "#ef4444",
  },
  {
    title: "Read a chapter of a technical book",
    tags: ["#learning", "#reading", "#career"],
    color: "#f97316",
  },
  {
    title: "Complete one LeetCode problem",
    tags: ["#dsa", "#interviewprep"],
    color: "#eab308",
  },
  {
    title: "Work on my side project",
    tags: ["#project", "#buildinpublic"],
    color: "#84cc16",
  },
  {
    title: "Write a tech blog post weekly",
    tags: ["#writing", "#content"],
    frequency: "weekly",
    color: "#22c55e",
  },
  {
    title: "Contribute to an open-source project",
    tags: ["#opensource", "#community"],
    color: "#14b8a6",
  },
  {
    title: "Exercise for 30 minutes",
    tags: ["#health", "#wellness"],
    color: "#3b82f6",
  },
  {
    title: "Review PRs for my team",
    tags: ["#work", "#teamwork"],
    color: "#8b5cf6",
  },
];

async function main() {
  console.log("🌱 Starting to seed the database...");

  // --- ডেটা পরিষ্কার করা (সঠিক ক্রমে) ---
  console.log("🧹 Clearing old data...");
  await prisma.kudo.deleteMany();
  await prisma.habitLog.deleteMany();
  await prisma.habit.deleteMany();
  await prisma.account.deleteMany();
  await prisma.session.deleteMany();
  await prisma.user.deleteMany();
  console.log("✅ Old data cleared successfully.");

  // --- ব্যবহারকারী তৈরি করা ---
  console.log("👤 Creating users...");
  const users = await Promise.all(
    Array.from({ length: 10 }).map(() =>
      prisma.user.create({
        data: {
          name: faker.person.fullName(),
          username: faker.internet
            .username()
            .toLowerCase()
            .replace(/[\W_]+/g, ""),
          email: faker.internet.email().toLowerCase(),
          image: faker.image.avatar(),
          emailVerified: faker.date.past(),
        },
      })
    )
  );
  console.log(`✅ Created ${users.length} users.`);

  // --- Habits তৈরি করা ---
  console.log("🤝 Creating meaningful habits...");
  const habits = [];
  for (const user of users) {
    // প্রত্যেক ব্যবহারকারীকে ২ থেকে ৩টি র‍্যান্ডম অভ্যাস দেওয়া হবে
    const userHabitTemplates = faker.helpers
      .shuffle(habitTemplates)
      .slice(0, faker.number.int({ min: 2, max: 3 }));
    for (const template of userHabitTemplates) {
      const habit = await prisma.habit.create({
        data: {
          authorId: user.id,
          title: template.title,
          description: faker.lorem.sentence(),
          isPublic: faker.datatype.boolean(0.7), // ৭০% অভ্যাস পাবলিক হবে
          tags: template.tags,
          color: template.color,
          frequency: template.frequency ?? "daily",
        },
      });
      habits.push(habit);
    }
  }
  console.log(`✅ Created ${habits.length} habits.`);

  // --- Habit Logs তৈরি করা ---
  console.log("📝 Creating realistic habit logs...");
  const habitLogs = [];
  // একটি দিনের ব্যবধান তৈরি করার জন্য
  const now = new Date();
  const aMonthAgo = new Date();
  aMonthAgo.setDate(now.getDate() - 30);

  for (const habit of habits) {
    // প্রতিটি অভ্যাসের জন্য গত ৩০ দিনে কিছু র‍্যান্ডম লগ তৈরি করা হচ্ছে
    for (let i = 0; i < 30; i++) {
      // ৮০% সম্ভাবনা যে অভ্যাসটি কোনো একটি দিনে সম্পন্ন করা হয়েছে
      if (Math.random() < 0.8) {
        const logDate = new Date(aMonthAgo);
        logDate.setDate(logDate.getDate() + i);
        // দিনের শুরুতেই তারিখটি সেট করা হচ্ছে
        logDate.setHours(0, 0, 0, 0);

        // ডুপ্লিকেট লগ তৈরি প্রতিরোধ করার জন্য চেক
        const existingLog = await prisma.habitLog.findFirst({
          where: {
            habitId: habit.id,
            authorId: habit.authorId,
            date: logDate,
          },
        });

        if (!existingLog) {
          const log = await prisma.habitLog.create({
            data: {
              habitId: habit.id,
              authorId: habit.authorId,
              date: logDate,
              isCompleted: true,
              notes: faker.datatype.boolean(0.15)
                ? faker.lorem.sentence()
                : null,
            },
          });
          habitLogs.push(log);
        }
      }
    }
  }
  console.log(`✅ Created ${habitLogs.length} habit logs.`);

  // --- Kudos তৈরি করা ---
  console.log("💖 Giving some kudos...");
  let kudoCount = 0;
  if (habits.length > 0) {
    for (const habit of habits) {
      // ০ থেকে ৫ জন ব্যবহারকারী র‍্যান্ডমভাবে Kudo দেবে
      const kudoGivers = faker.helpers
        .shuffle(users)
        .slice(0, faker.number.int({ min: 0, max: 5 }));

      for (const user of kudoGivers) {
        if (user.id !== habit.authorId) {
          await prisma.kudo.create({
            data: {
              habitId: habit.id, // Kudo এখন Habit-এর সাথে সম্পর্কিত
              userId: user.id,
            },
          });
          kudoCount++;
        }
      }
    }
  }
  console.log(`✅ Gave ${kudoCount} kudos.`);

  console.log("🎉 Seeding finished successfully!");
}

main()
  .catch((e) => {
    console.error("❌ An error occurred while seeding the database:");
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
