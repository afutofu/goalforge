import React, { type FC } from 'react';

interface IHeader {
  children: string;
  className?: string;
  textClassName?: string;
}

export const Header: FC<IHeader> = ({ children, className, textClassName }) => {
  return (
    <div className={'min-w-full mb-5 ' + (className ?? '')}>
      <p className={'mb-3 font-bold ' + (textClassName ?? '')}>{children}</p>
      <hr className="w-full b-2"></hr>
    </div>
  );
};
