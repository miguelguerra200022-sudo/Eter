"use client";

import { JazzReactProvider } from "jazz-tools/react";
import { useAccount } from "jazz-tools/react";
import { EterAccount } from "@/core/jazz/schema";
import { ReactNode } from "react";

export function JazzProvider({ children }: { children: ReactNode }) {
    // For development/demo, we use useDemoAuth (Guest mode).
    // In production, we'll switch to PasskeyAuth.
    return (
        <JazzReactProvider
            guestMode
            sync={{ peer: "wss://cloud.jazz.tools/?key=eter-app-beta" }}
            AccountSchema={EterAccount}
        >
            {children}
        </JazzReactProvider>
    );
}

// Export a helper to know if we are ready
// Aliasing useAccount to useJazz for backward compatibility with existing components
export { useAccount as useJazz };
