import React, { type FC } from 'react';

interface IKebabMenu extends React.ComponentPropsWithoutRef<'div'> {
  className?: string;
}

const Dots = () => {
  return (
    <div className="p-[3px] rounded-full bg-secondary group-hover/kebab:bg-primary"></div>
  );
};

export const KebabMenu: FC<IKebabMenu> = ({ className, ...props }) => {
  return (
    <div
      className={
        'group/kebab flex flex-col justify-between items-center bg-primary-light ml-auto h-7 w-7 p-1 rounded-lg cursor-pointer transition ' +
        (className ?? '')
      }
      {...props}
    >
      <Dots />
      <Dots />
      <Dots />
    </div>
  );
};
