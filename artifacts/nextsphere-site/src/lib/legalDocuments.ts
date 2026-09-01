import type { TranslationKey } from '../i18n/translations';

export type LegalDocument = {
  slug: string;
  titleKey: TranslationKey;
  descriptionKey: TranslationKey;
  pdfPath: string;
  downloadFileName: string;
};

export const legalDocuments: LegalDocument[] = [
  {
    slug: 'conditions-general',
    titleKey: 'legal.documents.conditionsGeneral.title',
    descriptionKey: 'legal.documents.conditionsGeneral.description',
    pdfPath: '/legal/conditions-general.pdf',
    downloadFileName: 'Condizioni_Generali.pdf',
  },
  {
    slug: 'allegato-privacy',
    titleKey: 'legal.documents.privacyAttachment.title',
    descriptionKey: 'legal.documents.privacyAttachment.description',
    pdfPath: '/legal/allegato-privacy.pdf',
    downloadFileName: 'Allegato_Privacy_DPA.pdf',
  },
  {
    slug: 'privacy-strutture',
    titleKey: 'legal.documents.accommodationPrivacy.title',
    descriptionKey: 'legal.documents.accommodationPrivacy.description',
    pdfPath: '/legal/privacy-strutture.pdf',
    downloadFileName: 'Privacy_Policy_Strutture.pdf',
  },
  {
    slug: 'termini-lumo',
    titleKey: 'legal.documents.lumoTerms.title',
    descriptionKey: 'legal.documents.lumoTerms.description',
    pdfPath: '/legal/termini-lumo.pdf',
    downloadFileName: 'Termini_Utilizzo_Lumo.pdf',
  },
  {
    slug: 'informativa-ai',
    titleKey: 'legal.documents.aiInformation.title',
    descriptionKey: 'legal.documents.aiInformation.description',
    pdfPath: '/legal/informativa-ai.pdf',
    downloadFileName: 'Informativa_AI.pdf',
  },
];

export function getLegalDocument(slug: string) {
  return legalDocuments.find((document) => document.slug === slug);
}