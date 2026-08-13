import type { FormSubmittedEvent } from "@netlify/functions";

// Set both of these in Netlify: Project configuration > Environment variables.
// BREVO_API_KEY  - Brevo > Settings > SMTP & API > API keys
// BREVO_LIST_ID  - numeric ID of your interest list (in the URL when you open it)
const BREVO_API_KEY = process.env.BREVO_API_KEY;
const BREVO_LIST_ID = Number(process.env.BREVO_LIST_ID);

// Only submissions carrying one of these values in the hidden `form-source`
// field get synced. Add a contact form or vendor form later and it won't
// silently end up on the mailing list.
const ALLOWED_SOURCES = ["hero", "waitlist"];

export default {
  async formSubmitted(event: FormSubmittedEvent) {
    const data = event.data;
    const source = data["form-source"];

    if (!source || !ALLOWED_SOURCES.includes(source)) {
      return; // not one of the interest-list forms
    }

    if (!BREVO_API_KEY || !Number.isFinite(BREVO_LIST_ID)) {
      console.error("Brevo sync skipped: BREVO_API_KEY or BREVO_LIST_ID not set.");
      return;
    }

    const email = data.email?.trim().toLowerCase();
    if (!email) {
      console.error(`Brevo sync skipped (${source}): no email in submission.`);
      return;
    }

    // FIRSTNAME and LASTNAME already exist in every Brevo account. The other
    // three you'll need to create under Contacts > Settings > Contact attributes,
    // or Brevo ignores them silently.
    const attributes: Record<string, string> = { SIGNUP_SOURCE: source };

    const fullName = data.name?.trim();
    if (fullName) {
      const [first, ...rest] = fullName.split(/\s+/);
      attributes.FIRSTNAME = first;
      if (rest.length) attributes.LASTNAME = rest.join(" ");
    }

    if (data.business_type) attributes.BUSINESS_TYPE = data.business_type.trim();
    if (data.note) attributes.INTEREST_NOTES = data.note.trim().slice(0, 1000);

    try {
      const response = await fetch("https://api.brevo.com/v3/contacts", {
        method: "POST",
        headers: {
          "api-key": BREVO_API_KEY,
          "content-type": "application/json",
          accept: "application/json",
        },
        body: JSON.stringify({
          email,
          attributes,
          listIds: [BREVO_LIST_ID],
          // Someone who signs up via the hero form and later fills out the full
          // form would 400 without this. With it, their attributes get enriched
          // instead — and since they're already on the list, the welcome
          // automation won't fire a second time.
          updateEnabled: true,
        }),
      });

      if (!response.ok) {
        console.error(
          `Brevo sync failed for ${email} (${source}): ${response.status} ${await response.text()}`
        );
        return;
      }

      console.log(`Brevo sync OK for ${email} (${source})`);
    } catch (error) {
      console.error(`Brevo sync threw for ${email} (${source}):`, error);
    }
  },
};
