import React from 'react';

import { InlineCode } from '~/components/base/code';
import { LI, UL } from '~/components/base/list';
import { H2, H3Code } from '~/components/plugins/Headings';
import { APISubSectionProps } from '~/components/plugins/api/APISectionUtils';

const renderEnum = ({ name, children, comment }: any): JSX.Element => (
  <div key={`enum-definition-${name}`}>
    <H3Code>
      <InlineCode>{name}</InlineCode>
    </H3Code>
    <UL>
      {children.map((enumValue: any) => (
        <LI key={enumValue.name}>
          <InlineCode>
            {name}.{enumValue.name}
          </InlineCode>
          {comment ? ` - ${comment.shortText}` : null}
        </LI>
      ))}
    </UL>
  </div>
);

const APISectionEnums: React.FC<APISubSectionProps> = ({ data }) =>
  data && data.length ? (
    <>
      <H2 key="enums-header">Enums</H2>
      {data.map(renderEnum)}
    </>
  ) : null;

export default APISectionEnums;
