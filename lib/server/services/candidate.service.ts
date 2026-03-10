import prisma from "@/lib/prisma";

export async function listCandidates() {
  const candidates = await prisma.candidate.findMany({
    orderBy: { candidateNumber: 'asc' },
  });
  return { data: candidates };
}

export async function getCandidateById(id: string) {
  const candidate = await prisma.candidate.findUnique({
    where: { id },
  });
  if (!candidate) throw new Error("Candidate not found");
  return candidate;
}

export async function createCandidate(data: any) {
  return prisma.candidate.create({
    data: {
      name: data.name,
      candidateNumber: data.candidateNumber,
      major: data.major,
      vision: data.vision,
      mission: data.mission,
      imageUrl: data.imageUrl,
    },
  });
}

export async function updateCandidate(id: string, data: any) {
  return prisma.candidate.update({
    where: { id },
    data,
  });
}

export async function deleteCandidate(id: string) {
  return prisma.candidate.delete({
    where: { id },
  });
}
