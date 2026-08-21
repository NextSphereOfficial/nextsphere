import type { TranslationKey } from '../i18n/translations';

export type LegalDocument = {
  slug: string;
  titleKey: TranslationKey;
  descriptionKey: TranslationKey;
};

export const legalDocuments: LegalDocument[] = [
  {
    slug: 'conditions-general',
    titleKey: 'legal.documents.conditionsGeneral.title',
    descriptionKey: 'legal.documents.conditionsGeneral.description',
  },
  {
    slug: 'allegato-privacy',
    titleKey: 'legal.documents.privacyAttachment.title',
    descriptionKey: 'legal.documents.privacyAttachment.description',
  },
  {
    slug: 'privacy-site',
    titleKey: 'legal.documents.websitePrivacy.title',
    descriptionKey: 'legal.documents.websitePrivacy.description',
  },
  {
    slug: 'privacy-strutture',
    titleKey: 'legal.documents.accommodationPrivacy.title',
    descriptionKey: 'legal.documents.accommodationPrivacy.description',
  },
  {
    slug: 'privacy-ospiti',
    titleKey: 'legal.documents.guestPrivacy.title',
    descriptionKey: 'legal.documents.guestPrivacy.description',
  },
  {
    slug: 'termini-lumo',
    titleKey: 'legal.documents.lumoTerms.title',
    descriptionKey: 'legal.documents.lumoTerms.description',
  },
  {
    slug: 'informativa-ai',
    titleKey: 'legal.documents.aiInformation.title',
    descriptionKey: 'legal.documents.aiInformation.description',
  },
  {
    slug: 'cookie',
    titleKey: 'legal.documents.cookiePolicy.title',
    descriptionKey: 'legal.documents.cookiePolicy.description',
  },
];

export function getLegalDocument(slug: string) {
  return legalDocuments.find((document) => document.slug === slug);
}