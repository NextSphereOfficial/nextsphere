import type { TranslationKey } from '../i18n/translations';

export type LegalDocument = {
  slug: string;
  titleKey: TranslationKey;
  descriptionKey: TranslationKey;
  pdfPath: string;
  downloadFileName: string;
  pageImageBasePath: string;
  pageCount: number;
};

export const legalDocuments: LegalDocument[] = [
  {
    slug: 'conditions-general',
    titleKey: 'legal.documents.conditionsGeneral.title',
    descriptionKey: 'legal.documents.conditionsGeneral.description',
    pdfPath: '/legal/Condizioni_Generali_1788290748971.pdf',
    downloadFileName: 'Condizioni_Generali.pdf',
    pageImageBasePath: '/legal/pages/conditions-general',
    pageCount: 19,
  },
  {
    slug: 'allegato-privacy',
    titleKey: 'legal.documents.privacyAttachment.title',
    descriptionKey: 'legal.documents.privacyAttachment.description',
    pdfPath: '/legal/Allegato_Privacy_DPA_1788290748970.pdf',
    downloadFileName: 'Allegato_Privacy_DPA.pdf',
    pageImageBasePath: '/legal/pages/allegato-privacy',
    pageCount: 16,
  },
  {
    slug: 'privacy-strutture',
    titleKey: 'legal.documents.accommodationPrivacy.title',
    descriptionKey: 'legal.documents.accommodationPrivacy.description',
    pdfPath: '/legal/Privacy_Policy_Strutture_1788290748972.pdf',
    downloadFileName: 'Privacy_Policy_Strutture.pdf',
    pageImageBasePath: '/legal/pages/privacy-strutture',
    pageCount: 5,
  },
  {
    slug: 'termini-lumo',
    titleKey: 'legal.documents.lumoTerms.title',
    descriptionKey: 'legal.documents.lumoTerms.description',
    pdfPath: '/legal/Termini_Utilizzo_Lumo_1788290748972.pdf',
    downloadFileName: 'Termini_Utilizzo_Lumo.pdf',
    pageImageBasePath: '/legal/pages/termini-lumo',
    pageCount: 3,
  },
  {
    slug: 'informativa-ai',
    titleKey: 'legal.documents.aiInformation.title',
    descriptionKey: 'legal.documents.aiInformation.description',
    pdfPath: '/legal/Informativa_AI_1788290748971.pdf',
    downloadFileName: 'Informativa_AI.pdf',
    pageImageBasePath: '/legal/pages/informativa-ai',
    pageCount: 5,
  },
];

export function getLegalDocument(slug: string) {
  return legalDocuments.find((document) => document.slug === slug);
}