import React, { type FC } from 'react';

interface IHeader {
  children: string;
  className?: string;
}

export const Header: FC<IHeader> = ({ children, className }) => {
  return (
    <div className={'min-w-full mb-5 ' + (className ?? '')}>
      <p className="mb-3">{children}</p>
      <hr className="w-full b-2"></hr>
    </div>
  );
};
