import React, { type FC } from 'react';

interface ISeparator {
  className?: string;
}

export const Separator: FC<ISeparator> = ({ className }) => {
  return <div className={'mb-5 ' + (className ?? '')} />;
};
