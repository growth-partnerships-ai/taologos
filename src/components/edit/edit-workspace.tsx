"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Contact } from "@/components/sections/contact";
import { ClientsMarquee } from "@/components/sections/clients-marquee";
import { Gallery } from "@/components/sections/gallery";
import { Hero } from "@/components/sections/hero";
import { ImageText } from "@/components/sections/image-text";
import { MissionVision } from "@/components/sections/mission-vision";
import { Projects } from "@/components/sections/projects";
import { Recognition } from "@/components/sections/recognition";
import { Services } from "@/components/sections/services";
import { SimpleText } from "@/components/sections/simple-text";
import { SiteFooter } from "@/components/sections/footer";
import { Stats } from "@/components/sections/stats";
import { Team } from "@/components/sections/team";
import { Testimonials } from "@/components/sections/testimonials";
import { Values } from "@/components/sections/values";
import { WhoWeAre } from "@/components/sections/who-we-are";
import { SiteHeader } from "@/components/site-header";
import { EditDesktopWarning } from "@/components/edit/desktop-warning";
import { EditSidePanel } from "@/components/edit/side-panel";
import { SectionInserter } from "@/components/edit/section-inserter";
import { SectionFields } from "@/components/edit/section-fields";
import { TemplatePopover } from "@/components/edit/template-popover";
import { UnsavedChangesDialog } from "@/components/edit/unsaved-dialog";
import { UsersPanel } from "@/components/edit/users-panel";
import { createSectionDefaults } from "@/lib/content/section-defaults";
import { SECTION_TEMPLATES, type SectionType } from "@/lib/content/sections";
import type { PageSection, SiteContent } from "@/lib/content/types";

type EditUser = {
  email: string;
  role: string;
  mustChangePassword: boolean;
};

type Selection =
  | { kind: "section"; key: string }
  | { kind: "header" }
  | { kind: "footer" }
  | null;

export function EditWorkspace({
  user,
  onSignOut,
}: {
  user: EditUser;
  onSignOut: () => void;
}) {
  const [content, setContent] = useState<SiteContent | null>(null);
  const [savedJson, setSavedJson] = useState("");
  const [selection, setSelection] = useState<Selection>(null);
  const [insertAt, setInsertAt] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveFlash, setSaveFlash] = useState(false);
  const [toast, setToast] = useState("");
  const [unsavedOpen, setUnsavedOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);
  const [usersOpen, setUsersOpen] = useState(false);

  const dirty = useMemo(
    () => (content ? JSON.stringify(content) !== savedJson : false),
    [content, savedJson],
  );

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/edit/content");
    const data = (await res.json()) as { content?: SiteContent; error?: string };
    if (data.content) {
      setContent(data.content);
      setSavedJson(JSON.stringify(data.content));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!dirty) return;
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [dirty]);

  async function saveAll() {
    if (!content) return;
    setSaving(true);
    try {
      const res = await fetch("/api/edit/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      const data = (await res.json()) as { error?: string; message?: string };
      if (!res.ok) {
        setToast(data.error || "Save failed");
        return;
      }
      setSavedJson(JSON.stringify(content));
      setSaveFlash(true);
      setToast(data.message || "Saved");
      window.setTimeout(() => setSaveFlash(false), 1600);
    } finally {
      setSaving(false);
    }
  }

  function discardChanges() {
    if (!savedJson) return;
    try {
      setContent(JSON.parse(savedJson) as SiteContent);
      setToast("Changes discarded");
      window.setTimeout(() => setToast(""), 1600);
    } catch {
      setToast("Could not discard changes");
    }
  }

  function requestLeave(action: () => void) {
    if (!dirty) {
      action();
      return;
    }
    setPendingAction(() => action);
    setUnsavedOpen(true);
  }

  function updateSection(next: PageSection) {
    if (!content) return;
    setContent({
      ...content,
      sections: content.sections.map((s) => (s.key === next.key ? next : s)),
    });
  }

  function insertSection(type: SectionType, index: number) {
    if (!content) return;
    if (
      type === "hero" &&
      content.sections.some((s) => s.type === "hero")
    ) {
      setToast("Only one Hero section is allowed.");
      return;
    }
    const created = createSectionDefaults(type);
    const sections = [...content.sections];
    sections.splice(index, 0, created);
    setContent({ ...content, sections });
    setInsertAt(null);
    setSelection({ kind: "section", key: created.key });
  }

  const selectedSection =
    content && selection?.kind === "section"
      ? content.sections.find((s) => s.key === selection.key)
      : undefined;

  if (loading || !content) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-muted">Loading editor…</p>
      </main>
    );
  }

  const existingTypes = content.sections.map((s) => s.type);
  const panelOpen =
    selection?.kind === "section" ||
    selection?.kind === "header" ||
    selection?.kind === "footer";

  const panelTitle =
    selection?.kind === "header"
      ? "Header"
      : selection?.kind === "footer"
        ? "Footer"
        : selectedSection
          ? SECTION_TEMPLATES.find((t) => t.type === selectedSection.type)
              ?.name || selectedSection.type
          : "Edit";

  return (
    <div className="min-h-screen bg-background">
      <EditDesktopWarning />
      <header className="sticky top-0 z-50 border-b border-line bg-background/95 px-4 py-3 backdrop-blur md:px-6">
        <div className="mx-auto flex max-w-[1600px] flex-wrap items-center justify-between gap-3">
          <div>
            <p className="eyebrow">Editing website</p>
            <p className="mt-1 text-xs text-muted">
              {user.email} · {user.role}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {user.role === "superadmin" ? (
              <button
                type="button"
                className="rounded-sm border border-line px-3 py-2 text-xs font-semibold text-cream"
                onClick={() => setUsersOpen(true)}
              >
                Users
              </button>
            ) : null}
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="rounded-sm border border-line px-3 py-2 text-xs font-semibold text-cream"
            >
              Preview
            </a>
            {dirty ? (
              <button
                type="button"
                disabled={saving}
                className="rounded-sm border border-line px-3 py-2 text-xs font-semibold text-cream disabled:opacity-50"
                onClick={discardChanges}
              >
                Discard changes
              </button>
            ) : null}
            <button
              type="button"
              disabled={saving || !dirty}
              className="rounded-sm bg-accent px-3 py-2 text-xs font-semibold text-background disabled:opacity-50"
              onClick={() => void saveAll()}
            >
              {saving ? "Saving…" : saveFlash ? "Saved" : "Save all"}
            </button>
            <button
              type="button"
              className="rounded-sm border border-line px-3 py-2 text-xs font-semibold text-cream"
              onClick={() =>
                requestLeave(async () => {
                  await fetch("/api/edit/logout", { method: "POST" });
                  onSignOut();
                })
              }
            >
              Sign out
            </button>
          </div>
        </div>
        {toast ? (
          <p className="mx-auto mt-2 max-w-[1600px] text-xs text-accent">{toast}</p>
        ) : null}
      </header>

      <div
        className={`mx-auto max-w-[1600px] ${panelOpen ? "md:pr-[400px]" : ""}`}
      >
        <div
          className={`relative border border-transparent transition ${
            selection?.kind === "header" ? "ring-2 ring-accent" : ""
          }`}
          onClick={() => setSelection({ kind: "header" })}
        >
          <SiteHeader
            brandName={content.brand.name}
            brandSubtitle={content.brand.subtitle}
            logo={content.brand.logo}
            nav={content.nav}
            a11y={content.a11y}
            embedded
          />
        </div>

        <main>
          {content.sections.map((section, index) => (
            <div key={section.key}>
              <div
                className={`relative ${
                  selection?.kind === "section" &&
                  selection.key === section.key
                    ? "ring-2 ring-accent"
                    : "hover:ring-1 hover:ring-accent/50"
                } ${section.enabled ? "" : "opacity-50"}`}
                onClick={() => setSelection({ kind: "section", key: section.key })}
              >
                <div className="pointer-events-none absolute right-3 top-3 z-20 flex gap-2">
                  <span className="rounded-sm bg-background/90 px-2 py-1 text-[10px] uppercase tracking-wide text-accent">
                    {SECTION_TEMPLATES.find((t) => t.type === section.type)
                      ?.name || section.type}
                  </span>
                  <button
                    type="button"
                    className="pointer-events-auto rounded-sm border border-line bg-background/90 px-2 py-1 text-[10px] text-cream"
                    onClick={(e) => {
                      e.stopPropagation();
                      updateSection({ ...section, enabled: !section.enabled });
                    }}
                  >
                    {section.enabled ? "Hide" : "Show"}
                  </button>
                </div>
                <div className="pointer-events-none">
                  {renderPreview(section, content)}
                </div>
              </div>

              {index < content.sections.length - 1 ? (
                <div className="relative">
                  <SectionInserter
                    active={insertAt === index + 1}
                    onClick={() =>
                      setInsertAt((value) =>
                        value === index + 1 ? null : index + 1,
                      )
                    }
                  />
                  {insertAt === index + 1 ? (
                    <TemplatePopover
                      open
                      existingTypes={existingTypes}
                      onClose={() => setInsertAt(null)}
                      onPick={(type) => insertSection(type, index + 1)}
                    />
                  ) : null}
                </div>
              ) : null}
            </div>
          ))}
        </main>

        <div
          className={`relative ${
            selection?.kind === "footer" ? "ring-2 ring-accent" : ""
          }`}
          onClick={() => setSelection({ kind: "footer" })}
        >
          <SiteFooter
            note={content.footer.note}
            tagline={content.brand.tagline}
          />
        </div>
      </div>

      <EditSidePanel
        open={panelOpen}
        title={panelTitle}
        onClose={() => setSelection(null)}
        footer={
          <button
            type="button"
            disabled={saving || !dirty}
            className="w-full rounded-sm bg-accent px-3 py-2 text-sm font-semibold text-background disabled:opacity-50"
            onClick={() => void saveAll()}
          >
            {saving ? "Saving…" : saveFlash ? "Saved" : "Save section"}
          </button>
        }
      >
        {selection?.kind === "header" ? (
          <HeaderFields
            content={content}
            onChange={setContent}
          />
        ) : null}
        {selection?.kind === "footer" ? (
          <div className="space-y-3">
            <label className="block text-sm">
              <span className="text-muted">Footer note</span>
              <input
                className="mt-2 w-full border border-line bg-background px-3 py-2 text-sm"
                value={content.footer.note}
                onChange={(e) =>
                  setContent({
                    ...content,
                    footer: { note: e.target.value },
                  })
                }
              />
            </label>
            <label className="block text-sm">
              <span className="text-muted">Tagline (also used in footer)</span>
              <input
                className="mt-2 w-full border border-line bg-background px-3 py-2 text-sm"
                value={content.brand.tagline}
                onChange={(e) =>
                  setContent({
                    ...content,
                    brand: { ...content.brand, tagline: e.target.value },
                  })
                }
              />
            </label>
          </div>
        ) : null}
        {selectedSection ? (
          <SectionFields
            section={selectedSection}
            content={content}
            onChange={updateSection}
            onChangeContacts={(contacts) =>
              setContent({ ...content, contacts })
            }
            onToggleEnabled={() =>
              updateSection({
                ...selectedSection,
                enabled: !selectedSection.enabled,
              })
            }
            canDelete={selectedSection.type !== "hero"}
            onDelete={
              selectedSection.type === "hero"
                ? undefined
                : () => {
                    if (
                      !window.confirm(
                        "Remove this section from the page?",
                      )
                    ) {
                      return;
                    }
                    setContent({
                      ...content,
                      sections: content.sections.filter(
                        (s) => s.key !== selectedSection.key,
                      ),
                    });
                    setSelection(null);
                  }
            }
          />
        ) : null}
      </EditSidePanel>

      <UnsavedChangesDialog
        open={unsavedOpen}
        onCancel={() => {
          setUnsavedOpen(false);
          setPendingAction(null);
        }}
        onDiscard={() => {
          setUnsavedOpen(false);
          const action = pendingAction;
          setPendingAction(null);
          action?.();
        }}
        onSave={async () => {
          await saveAll();
          setUnsavedOpen(false);
          const action = pendingAction;
          setPendingAction(null);
          action?.();
        }}
      />

      {usersOpen && user.role === "superadmin" ? (
        <UsersPanel onClose={() => setUsersOpen(false)} />
      ) : null}
    </div>
  );
}

function HeaderFields({
  content,
  onChange,
}: {
  content: SiteContent;
  onChange: (content: SiteContent) => void;
}) {
  return (
    <div className="space-y-3">
      <label className="block text-sm">
        <span className="text-muted">Brand name</span>
        <input
          className="mt-2 w-full border border-line bg-background px-3 py-2 text-sm"
          value={content.brand.name}
          onChange={(e) =>
            onChange({
              ...content,
              brand: { ...content.brand, name: e.target.value },
            })
          }
        />
      </label>
      <label className="block text-sm">
        <span className="text-muted">Subtitle</span>
        <input
          className="mt-2 w-full border border-line bg-background px-3 py-2 text-sm"
          value={content.brand.subtitle}
          onChange={(e) =>
            onChange({
              ...content,
              brand: { ...content.brand, subtitle: e.target.value },
            })
          }
        />
      </label>
      <label className="block text-sm">
        <span className="text-muted">Menu open label</span>
        <input
          className="mt-2 w-full border border-line bg-background px-3 py-2 text-sm"
          value={content.nav.menuOpenLabel}
          onChange={(e) =>
            onChange({
              ...content,
              nav: { ...content.nav, menuOpenLabel: e.target.value },
            })
          }
        />
      </label>
      <label className="block text-sm">
        <span className="text-muted">Menu close label</span>
        <input
          className="mt-2 w-full border border-line bg-background px-3 py-2 text-sm"
          value={content.nav.menuCloseLabel}
          onChange={(e) =>
            onChange({
              ...content,
              nav: { ...content.nav, menuCloseLabel: e.target.value },
            })
          }
        />
      </label>
      <div>
        <div className="mb-2 flex justify-between">
          <p className="text-sm text-muted">Nav links</p>
          <button
            type="button"
            className="text-xs text-accent"
            onClick={() =>
              onChange({
                ...content,
                nav: {
                  ...content.nav,
                  links: [
                    ...content.nav.links,
                    {
                      id: `nav-${Date.now()}`,
                      label: "Link",
                      href: "#",
                    },
                  ],
                },
              })
            }
          >
            Add
          </button>
        </div>
        <ul className="space-y-2">
          {content.nav.links.map((link, index) => (
            <li key={link.id} className="space-y-2 border border-line p-2">
              <input
                className="w-full border border-line bg-background px-2 py-1 text-sm"
                value={link.label}
                onChange={(e) => {
                  const links = content.nav.links.map((row, i) =>
                    i === index ? { ...row, label: e.target.value } : row,
                  );
                  onChange({ ...content, nav: { ...content.nav, links } });
                }}
              />
              <input
                className="w-full border border-line bg-background px-2 py-1 text-sm"
                value={link.href}
                onChange={(e) => {
                  const links = content.nav.links.map((row, i) =>
                    i === index ? { ...row, href: e.target.value } : row,
                  );
                  onChange({ ...content, nav: { ...content.nav, links } });
                }}
              />
              <button
                type="button"
                className="text-xs text-red-300"
                onClick={() =>
                  onChange({
                    ...content,
                    nav: {
                      ...content.nav,
                      links: content.nav.links.filter((_, i) => i !== index),
                    },
                  })
                }
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function renderPreview(section: PageSection, content: SiteContent) {
  if (!section.enabled) {
    return (
      <div className="section-pad text-center text-sm text-muted">
        Hidden section — turn on “Show on website” to display
      </div>
    );
  }
  switch (section.type) {
    case "hero":
      return (
        <Hero
          content={section.data}
          tagline={content.brand.tagline}
          brandName={content.brand.name}
          brandSubtitle={content.brand.subtitle}
        />
      );
    case "whoWeAre":
      return <WhoWeAre content={section.data} />;
    case "missionVision":
      return (
        <MissionVision
          mission={{
            title: section.data.missionTitle,
            body: section.data.missionBody,
          }}
          vision={{
            title: section.data.visionTitle,
            body: section.data.visionBody,
          }}
        />
      );
    case "values":
      return <Values content={section.data} />;
    case "services":
      return <Services content={section.data} />;
    case "projects":
      return <Projects content={section.data} />;
    case "recognition":
      return <Recognition content={section.data} />;
    case "team":
      return <Team content={section.data} />;
    case "contact":
      return <Contact content={section.data} contacts={content.contacts} />;
    case "gallery":
      return <Gallery content={section.data} />;
    case "clientsMarquee":
      return <ClientsMarquee content={section.data} />;
    case "testimonials":
      return <Testimonials content={section.data} />;
    case "stats":
      return <Stats content={section.data} />;
    case "simpleText":
      return <SimpleText content={section.data} />;
    case "imageText":
      return <ImageText content={section.data} />;
    default:
      return null;
  }
}
