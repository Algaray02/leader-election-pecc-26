import { NextResponse } from "next/server";

export function successResponse(data: any, meta?: any) {
  return NextResponse.json({
    success: true,
    data,
    ...(meta && { meta }),
  });
}

export function createdResponse(data: any) {
  return NextResponse.json(
    {
      success: true,
      data,
    },
    { status: 201 }
  );
}

export function errorResponse(message: string, status: number = 400) {
  return NextResponse.json(
    {
      success: false,
      error: { message },
    },
    { status }
  );
}

export function validationErrorResponse(error: any) {
  return NextResponse.json(
    {
      success: false,
      error: {
        message: "Validasi gagal.",
        details: error.errors || error,
      },
    },
    { status: 422 }
  );
}

export function conflictResponse(message: string) {
  return errorResponse(message, 409);
}

export function serverErrorResponse(message: string = "Terjadi kesalahan pada server") {
  return errorResponse(message, 500);
}

export function notFoundResponse(resource: string = "Resource") {
  return errorResponse(`${resource} tidak ditemukan`, 404);
}

export function unauthorizedResponse(message: string = "Anda tidak memiliki akses ke resource ini") {
  return errorResponse(message, 401);
}

export function forbiddenResponse(message: string = "Anda tidak memiliki izin untuk mengakses resource ini") {
  return errorResponse(message, 403);
}

export function rateLimitResponse(retryAfter?: number) {
  const response = NextResponse.json(
    {
      success: false,
      error: { message: "Terlalu banyak permintaan. Silakan coba lagi nanti." },
    },
    { status: 429 }
  );
  if (retryAfter) {
    response.headers.set("Retry-After", String(retryAfter));
  }
  return response;
}

export function badRequestResponse(message: string) {
  return errorResponse(message, 400);
}
