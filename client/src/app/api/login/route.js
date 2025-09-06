import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(request) {
  try {
    const body = await request.json();
    const expressApiUrl = process.env.NEXT_PUBLIC_EXPRESS_API_URL;

    const expressResponse = await axios.post(`${expressApiUrl}/login`, body, {
      withCredentials: true,
    });

    const setCookieHeader = expressResponse.headers["set-cookie"];

    const nextResponse = NextResponse.json(expressResponse.data, {
      status: expressResponse.status,
    });

    if (setCookieHeader) {
      // Setting the 'Set-Cookie' header on the Next.js response.
      nextResponse.headers.set("Set-Cookie", setCookieHeader);
    }

    return nextResponse;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return NextResponse.json(error.response.data, {
        status: error.response.status,
      });
    }
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
