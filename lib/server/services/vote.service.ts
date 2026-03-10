import prisma from "@/lib/prisma";

export async function submitVote(participantId: string, candidateId: string) {
  // Check if participant already voted
  const participant = await prisma.user.findUnique({
    where: { id: participantId }
  });

  if (!participant) {
    throw new Error("Participant not found");
  }

  if (participant.hasVoted) {
    throw new Error("You have already cast your vote");
  }

  // Use a transaction to ensure both operations succeed or fail together
  return prisma.$transaction(async (tx) => {
    // 1. Mark participant as voted and record their choice
    await tx.user.update({
      where: { id: participantId },
      data: {
        hasVoted: true,
        votedForId: candidateId,
      }
    });

    return { success: true };
  });
}
