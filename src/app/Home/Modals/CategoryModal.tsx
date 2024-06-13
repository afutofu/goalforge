import { Button } from '@/components/Button';
import { Header } from '@/components/Header';
import { Modal } from '@/components/Modal';
import { useCategoryStore } from '@/store/category';
// import { ICategory } from '@/types';
import React, { type FC } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';

interface ICategoryModal {
  onClose: () => void;
}

interface ICategoryForm {
  name: string;
  color: string;
}

export const CategoryModal: FC<ICategoryModal> = ({ onClose }) => {
  const { categories } = useCategoryStore();

  const { register, handleSubmit, watch } = useForm<ICategoryForm>({
    defaultValues: {
      name: '',
      color: '#000000',
    },
  });

  const watchName = watch('name', '');

  const onSubmit: SubmitHandler<ICategoryForm> = (data) => {
    // const timerCategory = {
    //   pomodoroLength: dayjs()
    //     .set('minute', data.pomodoroLength)
    //     .set('second', 0)
    //     .toDate(),
    //   shortBreakLength: dayjs()
    //     .set('minute', data.shortBreakLength)
    //     .set('second', 0)
    //     .toDate(),
    //   longBreakLength: dayjs()
    //     .set('minute', data.longBreakLength)
    //     .set('second', 0)
    //     .toDate(),
    // };

    // const newCategory: ICategory = {
    //   ...preferences,
    //   ...timerCategory,
    // };

    // setCategory(newCategory);
    onClose();
  };

  console.log(watchName);

  return (
    <Modal onClose={onClose}>
      <div
        className="bg-white z-10 flex flex-col p-8 py-6 shadow-xl rounded-lg w-1/5 text-black"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <Header titleClassName="!text-primary" lineClassName="border-primary">
          Categories
        </Header>
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Display list of categories */}
          <div className="flex flex-col">
            {categories.map((category) => (
              <div
                key={category.id}
                className="flex justify-between items-center"
              >
                <div>{category.name}</div>
                <div
                  className="w-[15px] h-[15px] border-[1px] border-black"
                  style={{ background: category.color }}
                ></div>
              </div>
            ))}
            <div className="w-full flex mt-3 align-center">
              <input
                {...register('name', { required: true })}
                placeholder="New category..."
                className="outline-none w-full"
              />
              <input type="color" {...register('color')} />
            </div>
            {watchName.length !== 0 && (
              <Button className="mt-3" type="submit">
                Add
              </Button>
            )}
          </div>
          <hr className="border-primary mt-5 mb-5" />
          <div className="flex justify-end items-center w-full">
            <button
              className="mr-4 hover:underline"
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};
