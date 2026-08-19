import React, { type FormEvent, useState } from 'react';
import { Link } from 'wouter';
import { CheckCircle2, Mail, MessageSquare, Phone, Send, Sparkles, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { SEO } from '../components/SEO';
import { useTranslation } from '../hooks/useTranslation';

type ContactFormData = {
  name: string;
  email: string;
  phone: string;
  message: string;
  website: string;
};

type FieldName = keyof Pick<ContactFormData, 'name' | 'email' | 'phone' | 'message'>;

const initialForm: ContactFormData = {
  name: '',
  email: '',
  phone: '',
  message: '',
  website: '',
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const } },
};

const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');

export default function Contact() {
  const { t, lang } = useTranslation();
  const [form, setForm] = useState<ContactFormData>(initialForm);
  const [errors, setErrors] = useState<Partial<Record<FieldName, string>>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const updateField = (field: keyof ContactFormData, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    if (field !== 'website' && errors[field as FieldName]) {
      setErrors((current) => ({ ...current, [field]: undefined }));
    }
    setSubmitError(null);
  };

  const validate = () => {
    const nextErrors: Partial<Record<FieldName, string>> = {};
    if (form.name.trim().length < 2) nextErrors.name = t('contact.form.errorName');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) nextErrors.email = t('contact.form.errorEmail');
    if (form.phone.trim().length < 6 || !/^[0-9+().\s-]+$/.test(form.phone.trim())) {
      nextErrors.phone = t('contact.form.errorPhone');
    }
    if (form.message.trim().length < 10) nextErrors.message = t('contact.form.errorMessage');
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await fetch(`${BASE}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const payload = await response.json().catch(() => null) as { ok?: boolean; error?: string } | null;

      if (!response.ok || !payload?.ok) {
        throw new Error(payload?.error ?? t('contact.form.errorGeneric'));
      }

      setIsSent(true);
      setForm(initialForm);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : t('contact.form.errorGeneric'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      <SEO
        title={t('meta.contact.title')}
        description={t('meta.contact.description')}
        canonical="https://nextsphere.it/contatti"
        lang={lang}
      />

      <section className="relative overflow-hidden bg-[#0D0D0D] pt-36 pb-24 md:pb-32">
        <div
          className="pointer-events-none absolute -top-40 left-1/2 h-[620px] w-[620px] -translate-x-1/2 rounded-full blur-[130px]"
          style={{ background: 'radial-gradient(circle, rgba(222,182,125,0.24) 0%, transparent 70%)' }}
        />
        <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
          <motion.div initial="hidden" animate="visible" variants={fadeUp}>
            <span className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
              <Sparkles size={15} />
              {t('contact.badge')}
            </span>
            <h1 className="mb-6 text-5xl font-bold leading-tight text-white md:text-6xl">{t('contact.title')}</h1>
            <p className="mx-auto max-w-2xl text-lg leading-relaxed text-gray-400">{t('contact.subtitle')}</p>
          </motion.div>
        </div>
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-b from-transparent to-white" />
      </section>

      <section className="bg-white py-16 md:py-24">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 lg:grid-cols-[0.82fr_1.18fr] lg:gap-20">
          <motion.aside
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={fadeUp}
            className="lg:pt-8"
          >
            <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <MessageSquare size={26} strokeWidth={1.5} />
            </div>
            <h2 className="mb-4 text-3xl font-bold leading-tight text-gray-900">{t('contact.responseTitle')}</h2>
            <p className="mb-10 leading-relaxed text-gray-600">{t('contact.responseText')}</p>

            <div className="rounded-2xl border border-gray-100 bg-gray-50 p-6">
              <p className="mb-2 text-sm font-semibold text-gray-900">{t('contact.emailLabel')}</p>
              <p className="mb-4 text-sm leading-relaxed text-gray-600">
                {t('contact.emailText')}
              </p>
              <a
                href="mailto:info@nextsphere.it"
                className="inline-flex items-center gap-2 font-semibold text-primary transition-colors hover:text-primary/80"
              >
                <Mail size={18} />
                info@nextsphere.it
              </a>
            </div>
          </motion.aside>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={fadeUp}
            className="rounded-[2rem] border border-gray-100 bg-white p-7 shadow-xl shadow-gray-200/60 md:p-10"
          >
            {isSent ? (
              <div className="flex min-h-[510px] flex-col items-center justify-center text-center">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/15 text-primary">
                  <CheckCircle2 size={34} strokeWidth={1.5} />
                </div>
                <h2 className="mb-3 text-3xl font-bold text-gray-900">{t('contact.form.successTitle')}</h2>
                <p className="mb-8 max-w-sm leading-relaxed text-gray-600">{t('contact.form.successText')}</p>
                <button
                  type="button"
                  onClick={() => setIsSent(false)}
                  className="rounded-xl border border-primary/50 px-5 py-3 font-semibold text-primary transition-colors hover:bg-primary/10"
                >
                  {t('contact.form.sendAnother')}
                </button>
              </div>
            ) : (
              <>
                <h2 className="mb-2 text-2xl font-bold text-gray-900">{t('contact.form.title')}</h2>
                <p className="mb-8 text-sm leading-relaxed text-gray-600">{t('contact.form.subtitle')}</p>

                <form onSubmit={handleSubmit} noValidate>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <FormField
                      id="contact-name"
                      label={t('contact.form.name')}
                      value={form.name}
                      placeholder={t('contact.form.namePlaceholder')}
                      error={errors.name}
                      icon={User}
                      onChange={(value) => updateField('name', value)}
                    />
                    <FormField
                      id="contact-email"
                      label={t('contact.form.email')}
                      value={form.email}
                      placeholder={t('contact.form.emailPlaceholder')}
                      error={errors.email}
                      icon={Mail}
                      type="email"
                      onChange={(value) => updateField('email', value)}
                    />
                  </div>

                  <div className="mt-5">
                    <FormField
                      id="contact-phone"
                      label={t('contact.form.phone')}
                      value={form.phone}
                      placeholder={t('contact.form.phonePlaceholder')}
                      error={errors.phone}
                      icon={Phone}
                      type="tel"
                      onChange={(value) => updateField('phone', value)}
                    />
                  </div>

                  <div className="mt-5">
                    <label htmlFor="contact-message" className="mb-2 block text-sm font-semibold text-gray-800">
                      {t('contact.form.message')}
                    </label>
                    <textarea
                      id="contact-message"
                      value={form.message}
                      onChange={(event) => updateField('message', event.target.value)}
                      placeholder={t('contact.form.messagePlaceholder')}
                      rows={6}
                      className={`w-full resize-y rounded-xl border bg-white px-4 py-3 text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-primary focus:ring-4 focus:ring-primary/10 ${
                        errors.message ? 'border-red-400' : 'border-gray-200'
                      }`}
                      aria-invalid={Boolean(errors.message)}
                      aria-describedby={errors.message ? 'contact-message-error' : undefined}
                    />
                    {errors.message && <p id="contact-message-error" className="mt-2 text-sm text-red-600">{errors.message}</p>}
                  </div>

                  <div className="absolute -left-[10000px]" aria-hidden="true">
                    <label htmlFor="contact-website">Website</label>
                    <input
                      id="contact-website"
                      name="website"
                      value={form.website}
                      onChange={(event) => updateField('website', event.target.value)}
                      tabIndex={-1}
                      autoComplete="off"
                    />
                  </div>

                  {submitError && (
                    <p className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
                      {submitError}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-4 text-base font-semibold text-primary-foreground shadow-[0_0_32px_rgba(222,182,125,0.24)] transition-all hover:bg-primary/90 hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-70"
                    data-testid="btn-contact-submit"
                  >
                    <Send size={18} />
                    {isSubmitting ? t('contact.form.submitting') : t('contact.form.submit')}
                  </button>

                  <p className="mt-5 text-center text-xs leading-relaxed text-gray-500">
                    {t('contact.form.privacyPrefix')}{' '}
                    <Link href="/privacy-policy" className="font-medium text-primary underline underline-offset-2 hover:text-primary/80">
                      {t('contact.form.privacyLink')}
                    </Link>.
                  </p>
                </form>
              </>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  );
}

function FormField({
  id,
  label,
  value,
  placeholder,
  error,
  icon: Icon,
  type = 'text',
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  placeholder: string;
  error?: string;
  icon: React.ElementType;
  type?: 'text' | 'email' | 'tel';
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-semibold text-gray-800">{label}</label>
      <div className="relative">
        <Icon size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          id={id}
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className={`w-full rounded-xl border bg-white py-3 pl-11 pr-4 text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-primary focus:ring-4 focus:ring-primary/10 ${
            error ? 'border-red-400' : 'border-gray-200'
          }`}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
        />
      </div>
      {error && <p id={`${id}-error`} className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}