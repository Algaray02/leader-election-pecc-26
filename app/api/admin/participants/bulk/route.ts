import { bulkCreateParticipants } from "@/lib/server/services/participant.service";
import { successResponse, serverErrorResponse, errorResponse } from "@/lib/server/utils/response";

export async function POST(request: Request) {
  try {
    const users = await request.json();
    if (!Array.isArray(users)) {
      return errorResponse("Data harus berupa list (array).", 400);
    }
    
    if (users.length > 500) {
       return errorResponse("Batas maksimum 500 user per upload.", 400);
    }

    const result = await bulkCreateParticipants(users);
    return successResponse({ count: result.count, message: `${result.count} partisipan berhasil diunggah.` });
  } catch (error: any) {
    console.error("Error bulk creating participants:", error);
    return serverErrorResponse("Gagal memproses unggah massal partisiapn. Pastikan format Excel Anda benar.");
  }
}
