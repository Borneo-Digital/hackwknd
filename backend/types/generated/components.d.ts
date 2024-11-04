import type { Schema, Struct } from '@strapi/strapi';

export interface QusetionFaq extends Struct.ComponentSchema {
  collectionName: 'components_qusetion_faqs';
  info: {
    displayName: 'FAQ';
  };
  attributes: {
    Answer: Schema.Attribute.String;
    Question: Schema.Attribute.String;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'qusetion.faq': QusetionFaq;
    }
  }
}
