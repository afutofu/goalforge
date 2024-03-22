import React, { type ReactNode, type FC } from 'react';

interface IHeader {
  children: string | ReactNode;
  className?: string;
  titleClassName?: string;
  lineClassName?: string;
}

export const Header: FC<IHeader> = ({
  children,
  className = '',
  titleClassName = '',
  lineClassName = '',
}) => {
  return (
    <div className={'min-w-full mb-5 ' + className}>
      <div className={'mb-3 font-bold text-lg ' + titleClassName}>
        {children}
      </div>
      <hr className={'w-full ' + lineClassName}></hr>
    </div>
  );
};
