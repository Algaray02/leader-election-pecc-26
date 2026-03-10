import prisma from "@/lib/prisma";

export async function getDashboardStats() {
  const [totalParticipants, totalCandidates, votedCount] = await Promise.all([
    prisma.user.count({ where: { role: { in: ["OFFICER", "POI"] } } }),
    prisma.candidate.count(),
    prisma.user.count({ where: { role: { in: ["OFFICER", "POI"] }, hasVoted: true } }),
  ]);

  const remainingVotes = totalParticipants - votedCount;
  const participationRate = totalParticipants > 0 
    ? Math.round((votedCount / totalParticipants) * 100) 
    : 0;

  // Get vote counts per candidate for the chart
  const candidates = await prisma.candidate.findMany({
    select: {
      id: true,
      name: true,
      candidateNumber: true,
      imageUrl: true,
      _count: {
        select: { votes: true }
      }
    },
    orderBy: { candidateNumber: 'asc' }
  });

  const voteDistribution = candidates.map(c => ({
    id: c.id,
    name: c.name,
    number: c.candidateNumber,
    imageUrl: c.imageUrl,
    votes: c._count.votes,
    percentage: votedCount > 0 ? Math.round((c._count.votes / votedCount) * 100) : 0
  }));

  return {
    data: {
      totalParticipants,
      totalCandidates,
      votedCount,
      remainingVotes,
      participationRate,
      voteDistribution
    }
  };
}

export async function getLiveVotes({ page = 1, limit = 10, search = "", sortBy = "updatedAt", sortOrder = "desc" }: { page?: number, limit?: number, search?: string, sortBy?: string, sortOrder?: string }) {
  const skip = (page - 1) * limit;

  const where: any = { role: { in: ["OFFICER", "POI"] } };
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { nim: { contains: search, mode: "insensitive" } },
    ];
  }

  let orderBy: any = {};
  if (sortBy === 'time' || sortBy === 'updatedAt') {
    orderBy = { updatedAt: sortOrder };
  } else if (sortBy === 'name') {
    orderBy = { name: sortOrder };
  } else if (sortBy === 'id') {
    orderBy = { id: sortOrder };
  } else if (sortBy === 'status') {
    orderBy = { hasVoted: sortOrder };
  } else if (sortBy === 'votedFor') {
    orderBy = { votedFor: { candidateNumber: sortOrder } };
  } else {
    orderBy = { updatedAt: "desc" };
  }

  const [votes, total] = await Promise.all([
    prisma.user.findMany({
      where,
      skip,
      take: limit,
      orderBy,
      select: {
        id: true,
        nim: true,
        name: true,
        hasVoted: true,
        updatedAt: true,
        votedFor: {
          select: {
            candidateNumber: true,
            name: true
          }
        }
      },
    }),
    prisma.user.count({ where }),
  ]);

  return {
    data: votes,
    meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
  };
}
