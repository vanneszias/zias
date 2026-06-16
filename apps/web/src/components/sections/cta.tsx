// biome-ignore-all lint/suspicious/noExplicitAny: TanStack Form render props require any
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { PillButton } from "@zias/ui/components/pill-button";
import { Section, SectionInner } from "@zias/ui/components/section";
import confetti from "canvas-confetti";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { trpc } from "@/utils/trpc";

export function CTASection() {
  const { mutateAsync, isPending } = useMutation(
    trpc.contact.submit.mutationOptions(),
  );
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const launchFestiveConfetti = () => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const defaults = {
      startVelocity: 38,
      spread: 90,
      ticks: 220,
      gravity: 0.95,
      zIndex: 1200,
      colors: ["#ffffff", "#ffd7c8", "#ffeaa1", "#ff7f50", "#ff4f1f"],
    };

    confetti({
      ...defaults,
      particleCount: 160,
      scalar: 1.1,
      origin: { x: 0.2, y: 0.75 },
    });
    confetti({
      ...defaults,
      particleCount: 160,
      scalar: 1.1,
      origin: { x: 0.8, y: 0.75 },
    });
    setTimeout(() => {
      confetti({
        ...defaults,
        particleCount: 220,
        scalar: 1.25,
        origin: { x: 0.5, y: 0.62 },
      });
    }, 180);
  };

  const form = useForm({
    defaultValues: { name: "", email: "", message: "" },
    validators: {
      onSubmit: ({
        value,
      }: {
        value: { name: string; email: string; message: string };
      }) => {
        if (!value.email.includes("@")) return "Valid email required";
        if (!value.message.trim()) return "Message required";
        return undefined;
      },
    },
    onSubmit: async ({ value }) => {
      setSubmitError(null);
      setSubmitSuccess(false);
      try {
        await mutateAsync(value);
        setSubmitSuccess(true);
        toast.success("Message sent! I'll reply over coffee.");
        launchFestiveConfetti();
        form.reset();
      } catch {
        setSubmitError(
          "Could not send your message right now. Please try again.",
        );
        toast.error("Something went wrong. Please try again.");
      }
    },
  });

  return (
    <Section
      id="contact"
      variant="orange"
      className="min-h-svh lg:min-h-[min(100svh,760px)]"
      aria-labelledby="contact-heading"
    >
      <SectionInner className="flex min-h-svh flex-col justify-center py-24 sm:py-32 lg:min-h-[min(100svh,760px)]">
        <div className="flex flex-col gap-16 lg:flex-row lg:gap-24">
          {/* Left — headline */}
          <div className="lg:w-1/2">
            <motion.h2
              id="contact-heading"
              className="font-display font-extrabold text-hero leading-tight"
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              Let&apos;s build something{" "}
              <span
                className="font-[family-name:var(--font-hand)] text-[1.1em]"
                style={{ display: "inline-block", rotate: "-2deg" }}
              >
                good.
              </span>
            </motion.h2>
            <motion.p
              className="mt-6 text-section-orange-subtext text-subtext"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              One inbox. One person. <br className="hidden md:block" />
              Usually replies within a day.
            </motion.p>
          </div>

          {/* Right — form */}
          <motion.div
            className="lg:w-1/2"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          >
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSubmitSuccess(false);
                setSubmitError(null);
                form.handleSubmit();
              }}
              className="rounded-2xl border border-white/20 bg-white/12 p-8 shadow-[inset_0_1px_0_rgba(255,255,255,0.16)] backdrop-blur-sm"
            >
              {submitError ? (
                <div
                  role="alert"
                  className="mb-5 flex items-start gap-2 rounded-lg border border-white/30 bg-black/20 px-3 py-2 text-sm text-white"
                >
                  <AlertCircle size={16} className="mt-0.5 shrink-0" />
                  <span>{submitError}</span>
                </div>
              ) : null}

              {submitSuccess ? (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-5 flex items-start gap-2 rounded-lg border border-white/35 bg-white/15 px-3 py-2 text-sm text-white"
                  aria-live="polite"
                >
                  <CheckCircle2 size={16} className="mt-0.5 shrink-0" />
                  <span>
                    Message sent. Thanks! I will get back to you soon.
                  </span>
                </motion.div>
              ) : null}

              <div className="mb-5 grid gap-5 sm:grid-cols-2">
                <ContactField
                  label="Name"
                  name="name"
                  placeholder="Your name"
                  form={form}
                />
                <ContactField
                  label="Email *"
                  name="email"
                  placeholder="you@somewhere.com"
                  form={form}
                  type="email"
                />
              </div>

              <ContactTextarea
                label="What's on your mind? *"
                name="message"
                placeholder="A few sentences about the project, timeline, anything really."
                form={form}
              />

              <div className="mt-6 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
                <form.Subscribe selector={(s) => s.canSubmit}>
                  {(canSubmit) => (
                    <PillButton
                      size="sm"
                      type="submit"
                      disabled={!canSubmit || isPending}
                      className="min-w-[170px] justify-center disabled:opacity-70"
                    >
                      {isPending ? "Sending…" : "Say Hi!"}
                    </PillButton>
                  )}
                </form.Subscribe>
                <p className="max-w-[32ch] font-body text-section-orange-subtext text-sm">
                  Or email{" "}
                  <a
                    href="mailto:hi@zias.be"
                    className="underline transition-colors hover:text-white"
                  >
                    hi@zias.be
                  </a>{" "}
                  directly.
                </p>
              </div>

              <form.Subscribe
                selector={(s) => ({
                  canSubmit: s.canSubmit,
                  isSubmitting: s.isSubmitting,
                  errors: s.errorMap.onSubmit,
                })}
              >
                {(state) => (
                  <p
                    className="mt-4 min-h-5 text-white/75 text-xs"
                    aria-live="polite"
                  >
                    {isPending || state.isSubmitting
                      ? "Sending your message..."
                      : !state.canSubmit && state.errors
                        ? String(state.errors)
                        : ""}
                  </p>
                )}
              </form.Subscribe>
            </form>
          </motion.div>
        </div>
      </SectionInner>
    </Section>
  );
}

/* ──────────── form field helpers ──────────── */

function ContactField({
  label,
  name,
  placeholder,
  type = "text",
  form,
}: {
  label: string;
  name: "name" | "email";
  placeholder: string;
  type?: string;
  form: any;
}) {
  const id = `contact-${name}`;
  const errorId = `${id}-error`;
  const required = name === "email";
  return (
    <form.Field name={name}>
      {(field: any) => (
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor={id}
            className="font-semibold text-label text-section-orange-subtext uppercase tracking-widest"
          >
            {label}
          </label>
          <input
            id={id}
            type={type}
            value={field.state.value}
            onBlur={field.handleBlur}
            onChange={(e) => field.handleChange(e.target.value)}
            placeholder={placeholder}
            aria-required={required}
            aria-describedby={field.state.meta.errors[0] ? errorId : undefined}
            className="rounded-lg border border-white/20 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/40"
          />
          {field.state.meta.errors[0] && (
            <span id={errorId} role="alert" className="text-white/70 text-xs">
              {String(field.state.meta.errors[0])}
            </span>
          )}
        </div>
      )}
    </form.Field>
  );
}

function ContactTextarea({
  label,
  name,
  placeholder,
  form,
}: {
  label: string;
  name: "message";
  placeholder: string;
  form: any;
}) {
  const id = `contact-${name}`;
  const errorId = `${id}-error`;
  return (
    <form.Field name={name}>
      {(field: any) => (
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor={id}
            className="font-semibold text-label text-section-orange-subtext uppercase tracking-widest"
          >
            {label}
          </label>
          <textarea
            id={id}
            rows={5}
            value={field.state.value}
            onBlur={field.handleBlur}
            onChange={(e) => field.handleChange(e.target.value)}
            placeholder={placeholder}
            aria-required
            aria-describedby={field.state.meta.errors[0] ? errorId : undefined}
            className="resize-none rounded-lg border border-white/20 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/40"
          />
          {field.state.meta.errors[0] && (
            <span id={errorId} role="alert" className="text-white/70 text-xs">
              {String(field.state.meta.errors[0])}
            </span>
          )}
        </div>
      )}
    </form.Field>
  );
}
