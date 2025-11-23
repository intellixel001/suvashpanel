"use client";

import ClientProvider from "./ClientProvider";

export default function ClientOnlyProviders({ children }) {
  return <ClientProvider>{children}</ClientProvider>;
}
