import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

const BCRYPT_SALT_ROUNDS = 10;

const PARTICIPANT_SELECT = {
  id: true,
  nim: true,
  name: true,
  email: true,
  phone: true,
  plainPassword: true,
  role: true,
  hasVoted: true,
  votedForId: true,
  createdAt: true,
};

export async function listParticipants({ page = 1, limit = 10, search = "", sortBy = "createdAt", sortOrder = "desc", role, hasVoted }: { page?: number, limit?: number, search?: string, sortBy?: string, sortOrder?: string, role?: string, hasVoted?: boolean }) {
  const skip = (page - 1) * limit;

  const where: any = {};
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { nim: { contains: search, mode: "insensitive" } },
    ];
  }
  if (role) {
    where.role = role;
  }
  if (hasVoted !== undefined) {
    where.hasVoted = hasVoted;
  }

  let orderBy: any = {};
  if (sortBy === 'name') {
    orderBy = { name: sortOrder };
  } else if (sortBy === 'nim') {
    orderBy = { nim: sortOrder };
  } else if (sortBy === 'id') {
    orderBy = { id: sortOrder };
  } else if (sortBy === 'role') {
    orderBy = { role: sortOrder };
  } else if (sortBy === 'hasVoted') {
    orderBy = { hasVoted: sortOrder };
  } else {
    orderBy = { createdAt: "desc" };
  }

  const [participants, total] = await Promise.all([
    prisma.user.findMany({
      where,
      skip,
      take: limit,
      orderBy,
      select: PARTICIPANT_SELECT,
    }),
    prisma.user.count({ where }),
  ]);

  return {
    data: participants,
    meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
  };
}

export async function createParticipant(data: any) {
  const password = data.password || Math.random().toString(36).slice(-8);
  const hashedPassword = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);

  return prisma.user.create({
    data: {
      nim: data.nim,
      name: data.name,
      email: data.email,
      phone: data.phone,
      password: hashedPassword,
      plainPassword: password,
      role: data.role || "POI",
    },
    select: PARTICIPANT_SELECT,
  });
}

export async function updateParticipant(id: string, data: any) {
  const { password, ...updateData } = data;

  if (password) {
    updateData.password = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
    updateData.plainPassword = password;
  }

  return prisma.user.update({
    where: { id },
    data: updateData,
    select: PARTICIPANT_SELECT,
  });
}

export async function deleteParticipant(id: string) {
  return prisma.user.delete({
    where: { id },
  });
}

export async function bulkCreateParticipants(participants: any[]) {
  const hashedParticipants = await Promise.all(
    participants.map(async (p: any) => {
      const password = p.password || Math.random().toString(36).slice(-8);
      const hashedPassword = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
      return {
        nim: p.nim ? String(p.nim) : undefined,
        name: p.name,
        email: p.email,
        phone: p.phone ? String(p.phone) : undefined,
        password: hashedPassword,
        plainPassword: password,
        role: p.role || "POI",
      };
    })
  );

  return prisma.user.createMany({
    data: hashedParticipants,
    skipDuplicates: true, // Prevents failure if an existing unique field is inserted
  });
}
