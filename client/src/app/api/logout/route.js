import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  const cookieName = "token";

  (await cookies()).delete(cookieName);

  return NextResponse.json({ message: "Logout successful" });
}
