import React from 'react';
import ReactMarkdown from 'react-markdown';

import { InlineCode } from '~/components/base/code';
import { LI, UL } from '~/components/base/list';
import { B } from '~/components/base/paragraph';
import { H2, H3Code, H4 } from '~/components/plugins/Headings';
import {
  APISubSectionProps,
  inlineRenderers,
  renderers,
  resolveTypeName,
} from '~/components/plugins/api/APISectionUtils';

const renderParam = ({comment, name, type}: any) => (
  <LI key={`param-${name}`}>
    <B>
      {name} (<InlineCode>{resolveTypeName(type)}</InlineCode>)
    </B>
    {comment?.text ? (
      <>
        {' - '}
        <ReactMarkdown renderers={inlineRenderers}>{comment?.text}</ReactMarkdown>
      </>
    ) : null}
  </LI>
);

const renderMethod = ({ signatures }: any, apiName?: string): JSX.Element =>
  signatures.map((signature: any) => {
    const { name, parameters, comment, type } = signature;
    return (
      <div key={`method-signature-${name}-${parameters?.length || 0}`}>
        <H3Code>
          <InlineCode>
            {apiName ? `${apiName}.` : ''}
            {name}()
          </InlineCode>
        </H3Code>
        {parameters ? <H4>Arguments</H4> : null}
        {parameters ? <UL>{parameters?.map(renderParam)}</UL> : null}
        {comment?.shortText ? (
          <ReactMarkdown renderers={renderers}>{comment.shortText}</ReactMarkdown>
        ) : null}
        {comment?.returns ? <H4>Returns</H4> : null}
        {comment?.returns ? (
          <UL>
            <LI returnType>
              <InlineCode>{resolveTypeName(type)}</InlineCode>
            </LI>
          </UL>
        ) : null}
        {comment?.returns ? (
          <ReactMarkdown renderers={renderers}>{comment.returns}</ReactMarkdown>
        ) : null}
        <hr />
      </div>
    );
  });

const APISectionMethods: React.FC<APISubSectionProps> = ({ data, apiName }) =>
  data && data.length ? (
    <>
      <H2 key="methods-header">Methods</H2>
      {data.map(method => renderMethod(method, apiName))}
    </>
  ) : null;

export default APISectionMethods;
