"use client";

import { NextStudio } from "next-sanity/studio";
import config from "../../../../sanity.config";
import { hasSanityConfig } from "@/lib/sanity/env";

export default function StudioPage() {
  if (!hasSanityConfig()) {
    return (
      <main
        style={{
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          padding: "2rem",
          background: "#070b12",
          color: "#f4f1ea",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div style={{ maxWidth: 520 }}>
          <p style={{ color: "#f07818", letterSpacing: "0.16em", textTransform: "uppercase", fontSize: 12 }}>
            Sanity Studio
          </p>
          <h1 style={{ fontSize: 32, marginTop: 12 }}>Connect a Sanity project</h1>
          <p style={{ marginTop: 16, lineHeight: 1.6, color: "#9aa3b2" }}>
            Create a project at{" "}
            <a href="https://www.sanity.io/manage" style={{ color: "#f07818" }}>
              sanity.io/manage
            </a>
            , then set{" "}
            <code style={{ color: "#efe8dc" }}>NEXT_PUBLIC_SANITY_PROJECT_ID</code>{" "}
            (and optionally{" "}
            <code style={{ color: "#efe8dc" }}>NEXT_PUBLIC_SANITY_DATASET</code>) in{" "}
            <code style={{ color: "#efe8dc" }}>.env.local</code> or your host env
            vars. Invite two admins from the Sanity project members screen.
          </p>
          <p style={{ marginTop: 16, color: "#9aa3b2" }}>
            The public site already works with seeded content without Sanity.
          </p>
        </div>
      </main>
    );
  }

  return <NextStudio config={config} />;
}
