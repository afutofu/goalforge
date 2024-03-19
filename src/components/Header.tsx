import React, { type FC } from 'react';

interface IHeader {
  title: string;
  className?: string;
}

export const Header: FC<IHeader> = ({ title, className }) => {
  return (
    <div className={'min-w-full mb-5 ' + (className ?? '')}>
      <p className="mb-3">{title}</p>
      <hr className="w-full b-2"></hr>
    </div>
  );
};
