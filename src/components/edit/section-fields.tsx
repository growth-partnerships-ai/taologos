"use client";

import { useState } from "react";
import type {
  CertificateItem,
  ClientLogo,
  GalleryImage,
  PageSection,
  SiteContent,
  StatItem,
  TeamMember,
  TestimonialItem,
} from "@/lib/content/types";
import {
  RemoveButton,
  useEditActions,
} from "@/components/edit/edit-actions";
import { ImageUploadField } from "@/components/edit/image-upload-field";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block text-sm">
      <span className="text-muted">{label}</span>
      <div className="mt-2">{children}</div>
    </label>
  );
}

const inputClass =
  "w-full border border-line bg-background px-3 py-2 text-sm text-cream outline-none focus:border-accent";

type Props = {
  section: PageSection;
  content: SiteContent;
  onChange: (section: PageSection) => void;
  onChangeContacts?: (contacts: SiteContent["contacts"]) => void;
  onToggleEnabled: () => void;
  onDelete?: () => void;
  canDelete: boolean;
};

export function SectionFields({
  section,
  content,
  onChange,
  onChangeContacts,
  onToggleEnabled,
  onDelete,
  canDelete,
}: Props) {
  function patchData(partial: Record<string, unknown>) {
    onChange({
      ...section,
      data: { ...section.data, ...partial },
    } as PageSection);
  }

  return (
    <div className="space-y-4">
      <label className="flex items-center gap-2 text-sm text-cream">
        <input
          type="checkbox"
          checked={section.enabled}
          onChange={onToggleEnabled}
        />
        Show on website
      </label>

      {section.type === "hero" ? (
        <>
          <Field label="Eyebrow">
            <input
              className={inputClass}
              value={section.data.eyebrow}
              onChange={(e) => patchData({ eyebrow: e.target.value })}
            />
          </Field>
          <Field label="Headline">
            <input
              className={inputClass}
              value={section.data.headline}
              onChange={(e) => patchData({ headline: e.target.value })}
            />
          </Field>
          <Field label="Supporting">
            <textarea
              className={inputClass}
              rows={3}
              value={section.data.supporting}
              onChange={(e) => patchData({ supporting: e.target.value })}
            />
          </Field>
          <ImageUploadField
            label="Hero image"
            value={section.data.image}
            onChange={(url) => patchData({ image: url })}
          />
          <Field label="Primary button label">
            <input
              className={inputClass}
              value={section.data.primaryCtaLabel}
              onChange={(e) => patchData({ primaryCtaLabel: e.target.value })}
            />
          </Field>
          <Field label="Primary button link">
            <input
              className={inputClass}
              value={section.data.primaryCtaHref}
              onChange={(e) => patchData({ primaryCtaHref: e.target.value })}
            />
          </Field>
          <Field label="Secondary button label">
            <input
              className={inputClass}
              value={section.data.secondaryCtaLabel}
              onChange={(e) => patchData({ secondaryCtaLabel: e.target.value })}
            />
          </Field>
          <Field label="Secondary button link">
            <input
              className={inputClass}
              value={section.data.secondaryCtaHref}
              onChange={(e) => patchData({ secondaryCtaHref: e.target.value })}
            />
          </Field>
        </>
      ) : null}

      {section.type === "whoWeAre" ? (
        <>
          <Field label="Eyebrow">
            <input
              className={inputClass}
              value={section.data.eyebrow}
              onChange={(e) => patchData({ eyebrow: e.target.value })}
            />
          </Field>
          <Field label="Title">
            <input
              className={inputClass}
              value={section.data.title}
              onChange={(e) => patchData({ title: e.target.value })}
            />
          </Field>
          <Field label="Body">
            <textarea
              className={inputClass}
              rows={6}
              value={section.data.body}
              onChange={(e) => patchData({ body: e.target.value })}
            />
          </Field>
          <div>
            <div className="mb-2 flex items-center justify-between">
              <p className="text-sm text-muted">Credentials</p>
              <button
                type="button"
                className="edit-btn text-xs text-accent"
                onClick={() =>
                  patchData({
                    credentials: [...section.data.credentials, "New credential"],
                  })
                }
              >
                Add
              </button>
            </div>
            <ul className="space-y-2">
              {section.data.credentials.map((item, index) => {
                const previous = section.data.credentials;
                return (
                <li key={index} className="flex gap-2">
                  <input
                    className={inputClass}
                    value={item}
                    onChange={(e) => {
                      const next = [...section.data.credentials];
                      next[index] = e.target.value;
                      patchData({ credentials: next });
                    }}
                  />
                  <RemoveButton
                    title="Remove this credential?"
                    description="This removes it from Who we are. You can undo for a few seconds after."
                    toastMessage="Credential removed."
                    onRemove={() =>
                      patchData({
                        credentials: previous.filter((_, i) => i !== index),
                      })
                    }
                    onUndo={() => patchData({ credentials: previous })}
                  />
                  <button
                    type="button"
                    className="edit-btn text-xs text-muted"
                    disabled={index === 0}
                    onClick={() => {
                      if (index === 0) return;
                      const next = [...section.data.credentials];
                      [next[index - 1], next[index]] = [
                        next[index],
                        next[index - 1],
                      ];
                      patchData({ credentials: next });
                    }}
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    className="edit-btn text-xs text-muted"
                    disabled={index === section.data.credentials.length - 1}
                    onClick={() => {
                      if (index >= section.data.credentials.length - 1) return;
                      const next = [...section.data.credentials];
                      [next[index + 1], next[index]] = [
                        next[index],
                        next[index + 1],
                      ];
                      patchData({ credentials: next });
                    }}
                  >
                    ↓
                  </button>
                </li>
                );
              })}
            </ul>
          </div>
        </>
      ) : null}

      {section.type === "missionVision" ? (
        <>
          <Field label="Mission title">
            <input
              className={inputClass}
              value={section.data.missionTitle}
              onChange={(e) => patchData({ missionTitle: e.target.value })}
            />
          </Field>
          <Field label="Mission body">
            <textarea
              className={inputClass}
              rows={4}
              value={section.data.missionBody}
              onChange={(e) => patchData({ missionBody: e.target.value })}
            />
          </Field>
          <Field label="Vision title">
            <input
              className={inputClass}
              value={section.data.visionTitle}
              onChange={(e) => patchData({ visionTitle: e.target.value })}
            />
          </Field>
          <Field label="Vision body">
            <textarea
              className={inputClass}
              rows={4}
              value={section.data.visionBody}
              onChange={(e) => patchData({ visionBody: e.target.value })}
            />
          </Field>
        </>
      ) : null}

      {section.type === "values" || section.type === "services" ? (
        <>
          <Field label="Eyebrow">
            <input
              className={inputClass}
              value={section.data.eyebrow}
              onChange={(e) => patchData({ eyebrow: e.target.value })}
            />
          </Field>
          <Field label="Title">
            <input
              className={inputClass}
              value={section.data.title}
              onChange={(e) => patchData({ title: e.target.value })}
            />
          </Field>
          {"intro" in section.data ? (
            <Field label="Intro">
              <textarea
                className={inputClass}
                rows={2}
                value={section.data.intro}
                onChange={(e) => patchData({ intro: e.target.value })}
              />
            </Field>
          ) : null}
          {section.type === "services" ? (
            <ImageUploadField
              label="Background image"
              value={section.data.image}
              onChange={(url) => patchData({ image: url })}
            />
          ) : null}
          <ListEditor
            label={section.type === "values" ? "Values" : "Services"}
            items={section.data.items}
            onChange={(items) => patchData({ items })}
          />
        </>
      ) : null}

      {section.type === "contact" ? (
        <>
          <Field label="Eyebrow">
            <input
              className={inputClass}
              value={section.data.eyebrow}
              onChange={(e) => patchData({ eyebrow: e.target.value })}
            />
          </Field>
          <Field label="Title">
            <input
              className={inputClass}
              value={section.data.title}
              onChange={(e) => patchData({ title: e.target.value })}
            />
          </Field>
          <Field label="Intro">
            <textarea
              className={inputClass}
              rows={3}
              value={section.data.intro}
              onChange={(e) => patchData({ intro: e.target.value })}
            />
          </Field>
          <Field label="Form — Name">
            <input
              className={inputClass}
              value={section.data.formNameLabel}
              onChange={(e) => patchData({ formNameLabel: e.target.value })}
            />
          </Field>
          <Field label="Form — Phone">
            <input
              className={inputClass}
              value={section.data.formPhoneLabel}
              onChange={(e) => patchData({ formPhoneLabel: e.target.value })}
            />
          </Field>
          <Field label="Form — Email">
            <input
              className={inputClass}
              value={section.data.formEmailLabel}
              onChange={(e) => patchData({ formEmailLabel: e.target.value })}
            />
          </Field>
          <Field label="Form — Message">
            <input
              className={inputClass}
              value={section.data.formMessageLabel}
              onChange={(e) => patchData({ formMessageLabel: e.target.value })}
            />
          </Field>
          <Field label="Submit button">
            <input
              className={inputClass}
              value={section.data.formSubmitLabel}
              onChange={(e) => patchData({ formSubmitLabel: e.target.value })}
            />
          </Field>
          <div>
            <div className="mb-2 flex items-center justify-between">
              <p className="text-sm text-muted">Contact methods</p>
              <button
                type="button"
                className="edit-btn text-xs text-accent"
                onClick={() =>
                  onChangeContacts?.([
                    ...content.contacts,
                    {
                      id: `c-${Date.now()}`,
                      label: "Label",
                      value: "Value",
                      kind: "other",
                    },
                  ])
                }
              >
                Add
              </button>
            </div>
            <ul className="space-y-3">
              {content.contacts.map((entry, index) => (
                <li key={entry.id} className="space-y-2 border border-line p-3">
                  <input
                    className={inputClass}
                    placeholder="Label (key)"
                    value={entry.label}
                    onChange={(e) => {
                      const next = content.contacts.map((c, i) =>
                        i === index ? { ...c, label: e.target.value } : c,
                      );
                      onChangeContacts?.(next);
                    }}
                  />
                  <input
                    className={inputClass}
                    placeholder="Value"
                    value={entry.value}
                    onChange={(e) => {
                      const next = content.contacts.map((c, i) =>
                        i === index ? { ...c, value: e.target.value } : c,
                      );
                      onChangeContacts?.(next);
                    }}
                  />
                  <input
                    className={inputClass}
                    placeholder="Link (tel: / mailto:)"
                    value={entry.href || ""}
                    onChange={(e) => {
                      const next = content.contacts.map((c, i) =>
                        i === index ? { ...c, href: e.target.value } : c,
                      );
                      onChangeContacts?.(next);
                    }}
                  />
                  <div className="flex gap-2">
                    <RemoveButton
                      title="Remove this contact method?"
                      description="This removes it from the Contact section. You can undo for a few seconds after."
                      toastMessage="Contact method removed."
                      onRemove={() =>
                        onChangeContacts?.(
                          content.contacts.filter((_, i) => i !== index),
                        )
                      }
                      onUndo={() => onChangeContacts?.(content.contacts)}
                    />
                    <button
                      type="button"
                      className="edit-btn text-xs text-muted"
                      disabled={index === 0}
                      onClick={() => {
                        if (index === 0) return;
                        const next = [...content.contacts];
                        [next[index - 1], next[index]] = [
                          next[index],
                          next[index - 1],
                        ];
                        onChangeContacts?.(next);
                      }}
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      className="edit-btn text-xs text-muted"
                      disabled={index === content.contacts.length - 1}
                      onClick={() => {
                        if (index >= content.contacts.length - 1) return;
                        const next = [...content.contacts];
                        [next[index + 1], next[index]] = [
                          next[index],
                          next[index + 1],
                        ];
                        onChangeContacts?.(next);
                      }}
                    >
                      ↓
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </>
      ) : null}

      {section.type === "projects" ? (
        <ProjectsEditor section={section} onChange={onChange} />
      ) : null}

      {section.type === "simpleText" ? (
        <>
          <Field label="Eyebrow">
            <input
              className={inputClass}
              value={section.data.eyebrow}
              onChange={(e) => patchData({ eyebrow: e.target.value })}
            />
          </Field>
          <Field label="Title">
            <input
              className={inputClass}
              value={section.data.title}
              onChange={(e) => patchData({ title: e.target.value })}
            />
          </Field>
          <Field label="Body">
            <textarea
              className={inputClass}
              rows={6}
              value={section.data.body}
              onChange={(e) => patchData({ body: e.target.value })}
            />
          </Field>
        </>
      ) : null}

      {section.type === "imageText" ? (
        <>
          <Field label="Eyebrow">
            <input
              className={inputClass}
              value={section.data.eyebrow}
              onChange={(e) => patchData({ eyebrow: e.target.value })}
            />
          </Field>
          <Field label="Title">
            <input
              className={inputClass}
              value={section.data.title}
              onChange={(e) => patchData({ title: e.target.value })}
            />
          </Field>
          <Field label="Body">
            <textarea
              className={inputClass}
              rows={5}
              value={section.data.body}
              onChange={(e) => patchData({ body: e.target.value })}
            />
          </Field>
          <ImageUploadField
            label="Image"
            value={section.data.image}
            onChange={(url) => patchData({ image: url })}
          />
          <Field label="Image position">
            <select
              className={inputClass}
              value={section.data.imagePosition}
              onChange={(e) =>
                patchData({
                  imagePosition: e.target.value === "right" ? "right" : "left",
                })
              }
            >
              <option value="left">Image left</option>
              <option value="right">Image right</option>
            </select>
          </Field>
        </>
      ) : null}

      {section.type === "stats" ? (
        <>
          <Field label="Eyebrow">
            <input
              className={inputClass}
              value={section.data.eyebrow}
              onChange={(e) => patchData({ eyebrow: e.target.value })}
            />
          </Field>
          <Field label="Title">
            <input
              className={inputClass}
              value={section.data.title}
              onChange={(e) => patchData({ title: e.target.value })}
            />
          </Field>
          <StatsEditor
            items={section.data.items}
            onChange={(items) => patchData({ items })}
          />
        </>
      ) : null}

      {section.type === "gallery" ? (
        <>
          <Field label="Eyebrow">
            <input
              className={inputClass}
              value={section.data.eyebrow}
              onChange={(e) => patchData({ eyebrow: e.target.value })}
            />
          </Field>
          <Field label="Title">
            <input
              className={inputClass}
              value={section.data.title}
              onChange={(e) => patchData({ title: e.target.value })}
            />
          </Field>
          <label className="flex items-center gap-2 text-sm text-cream">
            <input
              type="checkbox"
              checked={section.data.autoplay}
              onChange={(e) => patchData({ autoplay: e.target.checked })}
            />
            Auto-play
          </label>
          <GalleryImagesEditor
            images={section.data.images}
            onChange={(images) => patchData({ images })}
          />
        </>
      ) : null}

      {section.type === "clientsMarquee" ? (
        <>
          <Field label="Eyebrow">
            <input
              className={inputClass}
              value={section.data.eyebrow}
              onChange={(e) => patchData({ eyebrow: e.target.value })}
            />
          </Field>
          <Field label="Title">
            <input
              className={inputClass}
              value={section.data.title}
              onChange={(e) => patchData({ title: e.target.value })}
            />
          </Field>
          <Field label="Direction">
            <select
              className={inputClass}
              value={section.data.direction}
              onChange={(e) =>
                patchData({
                  direction: e.target.value === "ltr" ? "ltr" : "rtl",
                })
              }
            >
              <option value="rtl">Right to left</option>
              <option value="ltr">Left to right</option>
            </select>
          </Field>
          <LogosEditor
            logos={section.data.logos}
            onChange={(logos) => patchData({ logos })}
          />
        </>
      ) : null}

      {section.type === "testimonials" ? (
        <>
          <Field label="Eyebrow">
            <input
              className={inputClass}
              value={section.data.eyebrow}
              onChange={(e) => patchData({ eyebrow: e.target.value })}
            />
          </Field>
          <Field label="Title">
            <input
              className={inputClass}
              value={section.data.title}
              onChange={(e) => patchData({ title: e.target.value })}
            />
          </Field>
          <Field label="Intro">
            <textarea
              className={inputClass}
              rows={2}
              value={section.data.intro}
              onChange={(e) => patchData({ intro: e.target.value })}
            />
          </Field>
          <TestimonialsEditor
            items={section.data.items}
            onChange={(items) => patchData({ items })}
          />
        </>
      ) : null}

      {section.type === "recognition" || section.type === "team" ? (
        <p className="text-sm text-muted">
          Edit items below. More detailed project/certificate tools continue to
          expand here.
        </p>
      ) : null}

      {section.type === "recognition" ? (
        <>
          <Field label="Eyebrow">
            <input
              className={inputClass}
              value={section.data.eyebrow}
              onChange={(e) => patchData({ eyebrow: e.target.value })}
            />
          </Field>
          <Field label="Title">
            <input
              className={inputClass}
              value={section.data.title}
              onChange={(e) => patchData({ title: e.target.value })}
            />
          </Field>
          <Field label="Intro">
            <textarea
              className={inputClass}
              rows={2}
              value={section.data.intro}
              onChange={(e) => patchData({ intro: e.target.value })}
            />
          </Field>
          <RecognitionEditor
            items={section.data.items}
            presentedToLabel={section.data.presentedToLabel}
            onPresentedToLabel={(presentedToLabel) =>
              patchData({ presentedToLabel })
            }
            onChange={(items) => patchData({ items })}
          />
        </>
      ) : null}

      {section.type === "team" ? (
        <>
          <Field label="Eyebrow">
            <input
              className={inputClass}
              value={section.data.eyebrow}
              onChange={(e) => patchData({ eyebrow: e.target.value })}
            />
          </Field>
          <Field label="Title">
            <input
              className={inputClass}
              value={section.data.title}
              onChange={(e) => patchData({ title: e.target.value })}
            />
          </Field>
          <Field label="Intro">
            <textarea
              className={inputClass}
              rows={2}
              value={section.data.intro}
              onChange={(e) => patchData({ intro: e.target.value })}
            />
          </Field>
          <TeamEditor
            members={section.data.members}
            onChange={(members) => patchData({ members })}
          />
        </>
      ) : null}

      {canDelete && onDelete ? (
        <button
          type="button"
          className="edit-btn-danger-solid mt-6 w-full rounded-sm px-3 py-3 text-sm font-semibold"
          onClick={onDelete}
        >
          Remove the whole section
        </button>
      ) : null}
    </div>
  );
}

function ListEditor({
  label,
  items,
  onChange,
}: {
  label: string;
  items: Array<{ id: string; title: string; description: string }>;
  onChange: (
    items: Array<{ id: string; title: string; description: string }>,
  ) => void;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <p className="text-sm text-muted">{label}</p>
        <button
          type="button"
          className="edit-btn text-xs text-accent"
          onClick={() =>
            onChange([
              ...items,
              {
                id: `item-${Date.now()}`,
                title: "New item",
                description: "Description",
              },
            ])
          }
        >
          Add
        </button>
      </div>
      <ul className="space-y-3">
        {items.map((item, index) => {
          const previous = items;
          return (
          <li key={item.id} className="space-y-2 border border-line p-3">
            <input
              className={inputClass}
              value={item.title}
              onChange={(e) => {
                const next = items.map((row, i) =>
                  i === index ? { ...row, title: e.target.value } : row,
                );
                onChange(next);
              }}
            />
            <textarea
              className={inputClass}
              rows={2}
              value={item.description}
              onChange={(e) => {
                const next = items.map((row, i) =>
                  i === index ? { ...row, description: e.target.value } : row,
                );
                onChange(next);
              }}
            />
            <div className="flex gap-2">
              <RemoveButton
                title="Remove this item?"
                description="This removes it from the list. You can undo for a few seconds after."
                toastMessage="Item removed."
                onRemove={() =>
                  onChange(previous.filter((_, i) => i !== index))
                }
                onUndo={() => onChange(previous)}
              />
              <button
                type="button"
                className="edit-btn text-xs text-muted"
                disabled={index === 0}
                onClick={() => {
                  if (index === 0) return;
                  const next = [...items];
                  [next[index - 1], next[index]] = [next[index], next[index - 1]];
                  onChange(next);
                }}
              >
                ↑
              </button>
              <button
                type="button"
                className="edit-btn text-xs text-muted"
                disabled={index === items.length - 1}
                onClick={() => {
                  if (index >= items.length - 1) return;
                  const next = [...items];
                  [next[index + 1], next[index]] = [next[index], next[index + 1]];
                  onChange(next);
                }}
              >
                ↓
              </button>
            </div>
          </li>
          );
        })}
      </ul>
    </div>
  );
}

function ProjectsEditor({
  section,
  onChange,
}: {
  section: Extract<PageSection, { type: "projects" }>;
  onChange: (section: PageSection) => void;
}) {
  const data = section.data;
  const { removeWithUndo } = useEditActions();
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    null,
  );
  const selected = data.items.find((p) => p.id === selectedProjectId);

  function patch(partial: Partial<typeof data>) {
    onChange({ ...section, data: { ...data, ...partial } });
  }

  return (
    <div className="space-y-4">
      <Field label="Title">
        <input
          className={inputClass}
          value={data.title}
          onChange={(e) => patch({ title: e.target.value })}
        />
      </Field>
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted">Categories</p>
        <button
          type="button"
          className="edit-btn text-xs text-accent"
          onClick={() => {
            const id = `cat-${Date.now()}`;
            patch({
              groups: [
                ...data.groups,
                { id, label: "New category", blurb: "" },
              ],
            });
          }}
        >
          Add category
        </button>
      </div>
      <ul className="space-y-2">
        {data.groups.map((group, index) => (
          <li key={group.id} className="border border-line p-2">
            <button
              type="button"
              className="edit-btn w-full text-left text-sm font-semibold text-cream"
              onClick={() => setSelectedProjectId(null)}
            >
              {group.label}
            </button>
            <input
              className={`${inputClass} mt-2`}
              value={group.label}
              onChange={(e) => {
                const groups = data.groups.map((g, i) =>
                  i === index ? { ...g, label: e.target.value } : g,
                );
                patch({ groups });
              }}
            />
            <textarea
              className={`${inputClass} mt-2`}
              rows={2}
              placeholder="Blurb (optional)"
              value={group.blurb}
              onChange={(e) => {
                const groups = data.groups.map((g, i) =>
                  i === index ? { ...g, blurb: e.target.value } : g,
                );
                patch({ groups });
              }}
            />
            <div className="mt-2 flex flex-wrap gap-2">
              <button
                type="button"
                className="edit-btn text-xs text-accent"
                onClick={() => {
                  const id = `p-${Date.now()}`;
                  patch({
                    items: [
                      ...data.items,
                      {
                        id,
                        number: String(data.items.length + 1).padStart(2, "0"),
                        title: "New project",
                        client: "",
                        typology: "",
                        location: "",
                        scope: "",
                        group: group.id,
                        image: "/images/project-01.jpg",
                      },
                    ],
                    projectIds: [...data.projectIds, id],
                  });
                  setSelectedProjectId(id);
                }}
              >
                Add project
              </button>
              <button
                type="button"
                className="edit-btn text-xs text-muted"
                disabled={index === 0}
                onClick={() => {
                  if (index === 0) return;
                  const groups = [...data.groups];
                  [groups[index - 1], groups[index]] = [
                    groups[index],
                    groups[index - 1],
                  ];
                  patch({ groups });
                }}
              >
                ↑
              </button>
              <button
                type="button"
                className="edit-btn text-xs text-muted"
                disabled={index === data.groups.length - 1}
                onClick={() => {
                  if (index >= data.groups.length - 1) return;
                  const groups = [...data.groups];
                  [groups[index + 1], groups[index]] = [
                    groups[index],
                    groups[index + 1],
                  ];
                  patch({ groups });
                }}
              >
                ↓
              </button>
              <button
                type="button"
                className="edit-btn edit-btn-danger text-xs text-red-300"
                onClick={() => {
                  const inGroup = data.items.filter((p) => p.group === group.id);
                  const previousGroups = data.groups;
                  const previousItems = data.items;
                  const previousProjectIds = data.projectIds;
                  if (inGroup.length) {
                    const projectList = inGroup
                      .map((p) => `• ${p.title}`)
                      .join("\n");
                    void removeWithUndo({
                      title: "Remove this category and its projects?",
                      description: `The following projects will be removed:\n\n${projectList}\n\nYou can undo for a few seconds after.`,
                      toastMessage: "Category and projects removed.",
                      apply: () => {
                        patch({
                          groups: previousGroups.filter(
                            (g) => g.id !== group.id,
                          ),
                          items: previousItems.filter(
                            (p) => p.group !== group.id,
                          ),
                          projectIds: previousProjectIds.filter(
                            (id) => !inGroup.some((p) => p.id === id),
                          ),
                        });
                      },
                      undo: () => {
                        patch({
                          groups: previousGroups,
                          items: previousItems,
                          projectIds: previousProjectIds,
                        });
                      },
                    });
                  } else {
                    void removeWithUndo({
                      title: "Remove this category?",
                      description:
                        "This removes the empty category. You can undo for a few seconds after.",
                      toastMessage: "Category removed.",
                      apply: () => {
                        patch({
                          groups: previousGroups.filter(
                            (g) => g.id !== group.id,
                          ),
                        });
                      },
                      undo: () => {
                        patch({ groups: previousGroups });
                      },
                    });
                  }
                }}
              >
                Remove category
              </button>
            </div>
            <ul className="mt-2 space-y-1 pl-3">
              {data.items
                .filter((p) => p.group === group.id)
                .map((project) => (
                  <li key={project.id}>
                    <button
                      type="button"
                      className={`edit-btn text-left text-sm ${
                        selectedProjectId === project.id
                          ? "text-accent"
                          : "text-muted"
                      }`}
                      onClick={() => setSelectedProjectId(project.id)}
                    >
                      └ {project.title}
                    </button>
                  </li>
                ))}
            </ul>
          </li>
        ))}
      </ul>

      <button
        type="button"
        className="edit-btn text-xs text-accent"
        onClick={() => {
          const id = `p-${Date.now()}`;
          const other =
            data.groups.find((g) => g.id === "other-projects") ||
            data.groups.find((g) => /other/i.test(g.label));
          let groups = data.groups;
          let groupId = other?.id;
          if (!groupId) {
            groupId = "other-projects";
            groups = [
              ...groups,
              { id: groupId, label: "Other projects", blurb: "" },
            ];
          }
          patch({
            groups,
            items: [
              ...data.items,
              {
                id,
                number: String(data.items.length + 1).padStart(2, "0"),
                title: "New project",
                client: "",
                typology: "",
                location: "",
                scope: "",
                group: groupId,
                image: "/images/project-01.jpg",
              },
            ],
            projectIds: [...data.projectIds, id],
          });
          setSelectedProjectId(id);
        }}
      >
        Add project (global)
      </button>

      {selected ? (
        <div className="space-y-2 border border-accent/40 p-3">
          <p className="text-xs uppercase tracking-wide text-accent">
            Editing project
          </p>
          <input
            className={inputClass}
            value={selected.title}
            onChange={(e) =>
              patch({
                items: data.items.map((p) =>
                  p.id === selected.id ? { ...p, title: e.target.value } : p,
                ),
              })
            }
          />
          <input
            className={inputClass}
            placeholder="Client"
            value={selected.client}
            onChange={(e) =>
              patch({
                items: data.items.map((p) =>
                  p.id === selected.id ? { ...p, client: e.target.value } : p,
                ),
              })
            }
          />
          <input
            className={inputClass}
            placeholder="Location"
            value={selected.location}
            onChange={(e) =>
              patch({
                items: data.items.map((p) =>
                  p.id === selected.id ? { ...p, location: e.target.value } : p,
                ),
              })
            }
          />
          <input
            className={inputClass}
            placeholder="Type"
            value={selected.typology}
            onChange={(e) =>
              patch({
                items: data.items.map((p) =>
                  p.id === selected.id ? { ...p, typology: e.target.value } : p,
                ),
              })
            }
          />
          <textarea
            className={inputClass}
            rows={2}
            placeholder="Scope"
            value={selected.scope}
            onChange={(e) =>
              patch({
                items: data.items.map((p) =>
                  p.id === selected.id ? { ...p, scope: e.target.value } : p,
                ),
              })
            }
          />
          <ImageUploadField
            label="Main photo"
            value={selected.image}
            onChange={(url) =>
              patch({
                items: data.items.map((p) =>
                  p.id === selected.id ? { ...p, image: url } : p,
                ),
              })
            }
          />
          <textarea
            className={inputClass}
            rows={2}
            placeholder="Testimonial quote"
            value={selected.testimonial?.quote || ""}
            onChange={(e) =>
              patch({
                items: data.items.map((p) =>
                  p.id === selected.id
                    ? {
                        ...p,
                        testimonial: {
                          quote: e.target.value,
                          attribution: p.testimonial?.attribution || "",
                        },
                      }
                    : p,
                ),
              })
            }
          />
          <input
            className={inputClass}
            placeholder="Testimonial attribution"
            value={selected.testimonial?.attribution || ""}
            onChange={(e) =>
              patch({
                items: data.items.map((p) =>
                  p.id === selected.id
                    ? {
                        ...p,
                        testimonial: {
                          quote: p.testimonial?.quote || "",
                          attribution: e.target.value,
                        },
                      }
                    : p,
                ),
              })
            }
          />
          <button
            type="button"
            className="edit-btn edit-btn-danger text-xs text-red-300"
            onClick={() => {
              const previousItems = data.items;
              const previousProjectIds = data.projectIds;
              const removedId = selected.id;
              void removeWithUndo({
                title: "Remove this project?",
                description:
                  "This removes the project from the portfolio. You can undo for a few seconds after.",
                toastMessage: "Project removed.",
                apply: () => {
                  patch({
                    items: previousItems.filter((p) => p.id !== removedId),
                    projectIds: previousProjectIds.filter(
                      (id) => id !== removedId,
                    ),
                  });
                  setSelectedProjectId(null);
                },
                undo: () => {
                  patch({
                    items: previousItems,
                    projectIds: previousProjectIds,
                  });
                  setSelectedProjectId(removedId);
                },
              });
            }}
          >
            Remove project
          </button>
        </div>
      ) : null}
    </div>
  );
}

function StatsEditor({
  items,
  onChange,
}: {
  items: StatItem[];
  onChange: (items: StatItem[]) => void;
}) {
  return (
    <div>
      <div className="mb-2 flex justify-between">
        <p className="text-sm text-muted">Stats</p>
        <button
          type="button"
          className="edit-btn text-xs text-accent"
          onClick={() =>
            onChange([
              ...items,
              {
                id: `stat-${Date.now()}`,
                number: "0+",
                label: "Label",
                detail: "",
              },
            ])
          }
        >
          Add
        </button>
      </div>
      <ul className="space-y-2">
        {items.map((item, index) => {
          const previous = items;
          return (
          <li key={item.id} className="space-y-2 border border-line p-2">
            <input
              className={inputClass}
              value={item.number}
              onChange={(e) =>
                onChange(
                  items.map((row, i) =>
                    i === index ? { ...row, number: e.target.value } : row,
                  ),
                )
              }
            />
            <input
              className={inputClass}
              value={item.label}
              onChange={(e) =>
                onChange(
                  items.map((row, i) =>
                    i === index ? { ...row, label: e.target.value } : row,
                  ),
                )
              }
            />
            <input
              className={inputClass}
              placeholder="Detail (optional)"
              value={item.detail || ""}
              onChange={(e) =>
                onChange(
                  items.map((row, i) =>
                    i === index ? { ...row, detail: e.target.value } : row,
                  ),
                )
              }
            />
            <RemoveButton
              title="Remove this stat?"
              description="This removes it from the stats section. You can undo for a few seconds after."
              toastMessage="Stat removed."
              onRemove={() =>
                onChange(previous.filter((_, i) => i !== index))
              }
              onUndo={() => onChange(previous)}
            />
          </li>
          );
        })}
      </ul>
    </div>
  );
}

function GalleryImagesEditor({
  images,
  onChange,
}: {
  images: GalleryImage[];
  onChange: (images: GalleryImage[]) => void;
}) {
  return (
    <div>
      <div className="mb-2 flex justify-between">
        <p className="text-sm text-muted">Images</p>
        <ImageUploadField
          label="Add image"
          value=""
          onChange={(url) =>
            onChange([
              ...images,
              { id: `img-${Date.now()}`, src: url, alt: "" },
            ])
          }
        />
      </div>
      <ul className="space-y-2">
        {images.map((img, index) => {
          const previous = images;
          return (
          <li key={img.id} className="flex items-center gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={img.src} alt="" className="h-12 w-16 object-cover" />
            <RemoveButton
              title="Remove this image?"
              description="This removes it from the gallery. You can undo for a few seconds after."
              toastMessage="Image removed."
              onRemove={() =>
                onChange(previous.filter((_, i) => i !== index))
              }
              onUndo={() => onChange(previous)}
            />
            <button
              type="button"
              className="edit-btn text-xs text-muted"
              disabled={index === 0}
              onClick={() => {
                if (index === 0) return;
                const next = [...images];
                [next[index - 1], next[index]] = [next[index], next[index - 1]];
                onChange(next);
              }}
            >
              ↑
            </button>
            <button
              type="button"
              className="edit-btn text-xs text-muted"
              disabled={index === images.length - 1}
              onClick={() => {
                if (index >= images.length - 1) return;
                const next = [...images];
                [next[index + 1], next[index]] = [next[index], next[index + 1]];
                onChange(next);
              }}
            >
              ↓
            </button>
          </li>
          );
        })}
      </ul>
    </div>
  );
}

function LogosEditor({
  logos,
  onChange,
}: {
  logos: ClientLogo[];
  onChange: (logos: ClientLogo[]) => void;
}) {
  return (
    <div>
      <ImageUploadField
        label="Add logo"
        value=""
        onChange={(url) =>
          onChange([...logos, { id: `logo-${Date.now()}`, image: url }])
        }
      />
      <ul className="mt-2 space-y-2">
        {logos.map((logo, index) => {
          const previous = logos;
          return (
          <li key={logo.id} className="flex items-center gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={logo.image} alt="" className="h-10 w-auto object-contain" />
            <RemoveButton
              title="Remove this logo?"
              description="This removes it from the client marquee. You can undo for a few seconds after."
              toastMessage="Logo removed."
              onRemove={() =>
                onChange(previous.filter((_, i) => i !== index))
              }
              onUndo={() => onChange(previous)}
            />
          </li>
          );
        })}
      </ul>
    </div>
  );
}

function TestimonialsEditor({
  items,
  onChange,
}: {
  items: TestimonialItem[];
  onChange: (items: TestimonialItem[]) => void;
}) {
  return (
    <div>
      <button
        type="button"
        className="edit-btn mb-2 text-xs text-accent"
        onClick={() =>
          onChange([
            ...items,
            {
              id: `t-${Date.now()}`,
              quote: "New quote",
              name: "Name",
              role: "",
              company: "",
            },
          ])
        }
      >
        Add testimonial
      </button>
      <ul className="space-y-3">
        {items.map((item, index) => {
          const previous = items;
          return (
          <li key={item.id} className="space-y-2 border border-line p-2">
            <textarea
              className={inputClass}
              rows={2}
              value={item.quote}
              onChange={(e) =>
                onChange(
                  items.map((row, i) =>
                    i === index ? { ...row, quote: e.target.value } : row,
                  ),
                )
              }
            />
            <input
              className={inputClass}
              value={item.name}
              onChange={(e) =>
                onChange(
                  items.map((row, i) =>
                    i === index ? { ...row, name: e.target.value } : row,
                  ),
                )
              }
            />
            <input
              className={inputClass}
              placeholder="Role"
              value={item.role || ""}
              onChange={(e) =>
                onChange(
                  items.map((row, i) =>
                    i === index ? { ...row, role: e.target.value } : row,
                  ),
                )
              }
            />
            <input
              className={inputClass}
              placeholder="Company"
              value={item.company || ""}
              onChange={(e) =>
                onChange(
                  items.map((row, i) =>
                    i === index ? { ...row, company: e.target.value } : row,
                  ),
                )
              }
            />
            <ImageUploadField
              label="Photo (optional)"
              value={item.photo || ""}
              onChange={(url) =>
                onChange(
                  items.map((row, i) =>
                    i === index ? { ...row, photo: url } : row,
                  ),
                )
              }
            />
            <RemoveButton
              title="Remove this testimonial?"
              description="This removes it from the testimonials section. You can undo for a few seconds after."
              toastMessage="Testimonial removed."
              onRemove={() =>
                onChange(previous.filter((_, i) => i !== index))
              }
              onUndo={() => onChange(previous)}
            />
          </li>
          );
        })}
      </ul>
    </div>
  );
}

function RecognitionEditor({
  items,
  presentedToLabel,
  onPresentedToLabel,
  onChange,
}: {
  items: CertificateItem[];
  presentedToLabel: string;
  onPresentedToLabel: (value: string) => void;
  onChange: (items: CertificateItem[]) => void;
}) {
  const [selectedId, setSelectedId] = useState<string | null>(
    items[0]?.id || null,
  );
  const selected = items.find((i) => i.id === selectedId);

  return (
    <div className="space-y-3">
      <Field label="Presented to label">
        <input
          className={inputClass}
          value={presentedToLabel}
          onChange={(e) => onPresentedToLabel(e.target.value)}
        />
      </Field>
      <button
        type="button"
        className="edit-btn text-xs text-accent"
        onClick={() => {
          const id = `cert-${Date.now()}`;
          onChange([
            ...items,
            {
              id,
              title: "New certificate",
              issuer: "",
              recipient: "",
              summary: "",
              highlights: [],
              image: "/images/certificate-isspl-un-congo.jpg",
            },
          ]);
          setSelectedId(id);
        }}
      >
        Add certificate
      </button>
      <ul className="space-y-1">
        {items.map((item) => (
          <li key={item.id}>
            <button
              type="button"
              className={`edit-btn text-sm ${
                selectedId === item.id ? "text-accent" : "text-muted"
              }`}
              onClick={() => setSelectedId(item.id)}
            >
              {item.title}
            </button>
          </li>
        ))}
      </ul>
      {selected
        ? (() => {
            const previous = items;
            const removedId = selected.id;
            return (
              <div className="space-y-2 border border-line p-2">
                <input
                  className={inputClass}
                  value={selected.title}
                  onChange={(e) =>
                    onChange(
                      items.map((row) =>
                        row.id === selected.id
                          ? { ...row, title: e.target.value }
                          : row,
                      ),
                    )
                  }
                />
                <input
                  className={inputClass}
                  placeholder="Issuer"
                  value={selected.issuer}
                  onChange={(e) =>
                    onChange(
                      items.map((row) =>
                        row.id === selected.id
                          ? { ...row, issuer: e.target.value }
                          : row,
                      ),
                    )
                  }
                />
                <input
                  className={inputClass}
                  placeholder="Recipient"
                  value={selected.recipient}
                  onChange={(e) =>
                    onChange(
                      items.map((row) =>
                        row.id === selected.id
                          ? { ...row, recipient: e.target.value }
                          : row,
                      ),
                    )
                  }
                />
                <ImageUploadField
                  label="Certificate image"
                  value={selected.image}
                  onChange={(url) =>
                    onChange(
                      items.map((row) =>
                        row.id === selected.id ? { ...row, image: url } : row,
                      ),
                    )
                  }
                />
                <RemoveButton
                  title="Remove this certificate?"
                  description="This removes it from recognition. You can undo for a few seconds after."
                  toastMessage="Certificate removed."
                  onRemove={() => {
                    onChange(previous.filter((row) => row.id !== removedId));
                    setSelectedId(null);
                  }}
                  onUndo={() => {
                    onChange(previous);
                    setSelectedId(removedId);
                  }}
                />
              </div>
            );
          })()
        : null}
    </div>
  );
}

function TeamEditor({
  members,
  onChange,
}: {
  members: TeamMember[];
  onChange: (members: TeamMember[]) => void;
}) {
  return (
    <div>
      <button
        type="button"
        className="edit-btn mb-2 text-xs text-accent"
        onClick={() =>
          onChange([
            ...members,
            {
              id: `m-${Date.now()}`,
              name: "New member",
              role: "Role",
              bio: "",
            },
          ])
        }
      >
        Add member
      </button>
      <ul className="space-y-2">
        {members.map((member, index) => {
          const previous = members;
          return (
          <li key={member.id} className="space-y-2 border border-line p-2">
            <input
              className={inputClass}
              value={member.name}
              onChange={(e) =>
                onChange(
                  members.map((row, i) =>
                    i === index ? { ...row, name: e.target.value } : row,
                  ),
                )
              }
            />
            <input
              className={inputClass}
              value={member.role}
              onChange={(e) =>
                onChange(
                  members.map((row, i) =>
                    i === index ? { ...row, role: e.target.value } : row,
                  ),
                )
              }
            />
            <ImageUploadField
              label="Photo"
              value={member.photo || ""}
              onChange={(url) =>
                onChange(
                  members.map((row, i) =>
                    i === index ? { ...row, photo: url } : row,
                  ),
                )
              }
            />
            <RemoveButton
              title="Remove this team member?"
              description="This removes them from the team section. You can undo for a few seconds after."
              toastMessage="Team member removed."
              onRemove={() =>
                onChange(previous.filter((_, i) => i !== index))
              }
              onUndo={() => onChange(previous)}
            />
          </li>
          );
        })}
      </ul>
    </div>
  );
}
