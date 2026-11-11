import type { FormDefinition } from "@emdash-cms/plugin-forms";

type ContactForm = Pick<FormDefinition, "name" | "slug" | "pages" | "settings">;

/** The contact form the forms plugin is provisioned with. Editors can change it under Plugins > Forms. */
export const CONTACT_FORM = {
  name: "Contact",
  slug: "contact",
  pages: [
    {
      fields: [
        { id: "name", type: "text", name: "name", label: "Your name", placeholder: "Ada", required: false, width: "half" },
        {
          id: "email",
          type: "email",
          name: "email",
          label: "Your email",
          placeholder: "you@somewhere.com",
          required: true,
          width: "half",
        },
        {
          id: "message",
          type: "textarea",
          name: "message",
          label: "What are we building?",
          placeholder: "A few sentences about the project, the timeline, anything really.",
          required: true,
          width: "full",
          validation: { maxLength: 5000 },
        },
      ],
    },
  ],
  settings: {
    confirmationMessage: "Message sent! I'll reply over coffee.",
    notifyEmails: [],
    digestEnabled: false,
    digestHour: 9,
    retentionDays: 0,
    spamProtection: "honeypot",
    submitLabel: "Say hi",
  },
} satisfies ContactForm;
