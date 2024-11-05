import type { Schema, Struct } from '@strapi/strapi';

export interface DynamicZoneForm extends Struct.ComponentSchema {
  collectionName: 'components_dynamic_zone_forms';
  info: {
    description: '';
    displayName: 'form';
  };
  attributes: {
    form: Schema.Attribute.Component<'input.form', false>;
    Heading: Schema.Attribute.String;
  };
}

export interface DynamicZoneInputs extends Struct.ComponentSchema {
  collectionName: 'components_dynamic_zone_inputs';
  info: {
    description: '';
    displayName: 'inputs';
  };
  attributes: {
    email: Schema.Attribute.Email & Schema.Attribute.Unique;
    name: Schema.Attribute.String & Schema.Attribute.Unique;
    phone: Schema.Attribute.Integer &
      Schema.Attribute.Unique &
      Schema.Attribute.DefaultTo<60>;
  };
}

export interface FaqFaq extends Struct.ComponentSchema {
  collectionName: 'components_question_faqs';
  info: {
    displayName: 'FAQ';
  };
  attributes: {
    Answer: Schema.Attribute.String;
    Question: Schema.Attribute.String;
  };
}

export interface InputForm extends Struct.ComponentSchema {
  collectionName: 'components_input_forms';
  info: {
    description: '';
    displayName: 'form';
  };
  attributes: {
    inputs: Schema.Attribute.Component<'dynamic-zone.inputs', true>;
  };
}

export interface InterestInterest extends Struct.ComponentSchema {
  collectionName: 'components_interest_interests';
  info: {
    displayName: 'Interest';
  };
  attributes: {};
}

export interface RegisterRegister extends Struct.ComponentSchema {
  collectionName: 'components_register_registers';
  info: {
    displayName: 'Register';
    icon: 'book';
  };
  attributes: {
    Interest: Schema.Attribute.Component<'interest.interest', false>;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'dynamic-zone.form': DynamicZoneForm;
      'dynamic-zone.inputs': DynamicZoneInputs;
      'faq.faq': FaqFaq;
      'input.form': InputForm;
      'interest.interest': InterestInterest;
      'register.register': RegisterRegister;
    }
  }
}
