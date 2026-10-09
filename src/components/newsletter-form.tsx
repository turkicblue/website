"use client";

import { useState } from "react";
import { btnLight } from "./ui";

/** The sign-up form. There is no mailing service yet, so it says plainly that nothing was sent. */
export function NewsletterForm({ label, button, notConnected }: { label: string; button: string; notConnected: string }) {
  const [note, setNote] = useState("");
  return (
    <form
      className="flex flex-wrap items-end gap-2.5"
      onSubmit={(e) => {
        e.preventDefault();
        setNote(notConnected);
      }}
    >
      <label htmlFor="newsletter-email" className="flex flex-[1_1_240px] flex-col gap-1.5 text-sm text-mist">
        {label}
        <input
          id="newsletter-email"
          type="email"
          autoComplete="email"
          required
          placeholder="you@example.org"
          className="min-h-[46px] rounded border border-[#3a5260] bg-[#10232e] px-3.5 text-base text-white"
        />
      </label>
      <button type="submit" className={btnLight}>{button}</button>
      <p role="status" className="min-h-[1.3em] basis-full text-sm text-turquoise">{note}</p>
    </form>
  );
}
