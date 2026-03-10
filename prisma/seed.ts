import { PrismaClient } from '@prisma/client'
import bcryptjs from 'bcryptjs';

const prisma = new PrismaClient()

async function main() {
  console.log('Clearing database...')
  
  // Clear the database tables to prevent stacking
  // The order is important: delete dependent records (like User votes) first if there were constraints 
  // currently user has no strict foreign key cascading issues if we delete but it's safe to run in transaction
  await prisma.user.deleteMany()
  await prisma.candidate.deleteMany()

  console.log('Database cleared.')

  console.log('Seeding candidates...')
  const candidate1 = await prisma.candidate.create({
    data: {
      candidateNumber: 1,
      name: "Danish W.",
      major: "Information Technology",
      vision: "To make PECC the leading student organization in technology and innovation.",
      mission: "1. Foster a strong community.\n2. Organize workshops and competitions.\n3. Build global connections.",
      imageUrl: "https://i.pravatar.cc/300?img=11",
    }
  })

  const candidate2 = await prisma.candidate.create({
    data: {
      candidateNumber: 2,
      name: "Lirise A.",
      major: "Electrical Engineering",
      vision: "Empowering every member to speak with confidence and creativity.",
      mission: "1. Enhance public speaking skills.\n2. Encourage creative expression.\n3. Create inclusive events.",
      imageUrl: null, // Using fallback
    }
  })

  const candidate3 = await prisma.candidate.create({
    data: {
      candidateNumber: 3,
      name: "Kevin W.",
      major: "Mechanical Engineering",
      vision: "Building a robust and global network for all engineering students.",
      mission: "1. Establish industry partnerships.\n2. Facilitate international exchange.\n3. Mentorship programs.",
      imageUrl: "https://i.pravatar.cc/300?img=12",
    }
  })

  console.log('Seeding users and admin...')
  
  const hashedPassword = await bcryptjs.hash("password123", 10);

  // Insert Admin
  await prisma.user.create({
    data: {
      nim: "ADMIN-001",
      name: "Super Admin",
      email: "admin@pecc.com",
      password: hashedPassword, 
      plainPassword: "password123",
      role: "ADMIN",
    }
  })

  // Insert Voters
  // Some who have voted and some who haven't
  await prisma.user.create({
    data: {
      nim: "4.33.24.0.01",
      name: "User Voted 1",
      email: "user1@pecc.com",
      password: hashedPassword,
      plainPassword: "password123",
      role: "OFFICER",
      hasVoted: true,
      votedForId: candidate1.id
    }
  })

  await prisma.user.create({
    data: {
      nim: "4.33.24.0.02",
      name: "User Not Voted 1",
      email: "user2@pecc.com",
      password: hashedPassword,
      plainPassword: "password123",
      role: "POI",
      hasVoted: false,
    }
  })

  await prisma.user.create({
    data: {
      nim: "4.33.24.0.03",
      name: "User Voted 2",
      email: "user3@pecc.com",
      password: hashedPassword,
      plainPassword: "password123",
      role: "POI",
      hasVoted: true,
      votedForId: candidate2.id
    }
  })

  console.log('Seeding complete!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
