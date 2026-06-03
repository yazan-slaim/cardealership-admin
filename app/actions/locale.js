"use server";

import { cookies } from "next/headers";

export async function setLocale(locale) {
  cookies().set("NEXT_LOCALE", locale, { path: "/" });
}
