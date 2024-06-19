import { api } from '@/api/api';
import { categoryEndpoint } from '@/api/endpoints';
import { Button } from '@/components/Button';
import { Header } from '@/components/Header';
import { Modal } from '@/components/Modal';
import { CategoryItem } from '@/components/CategoryItem';
import { useAuthStore } from '@/store/auth';
import { useCategoryStore } from '@/store/category';
import { type ICategory } from '@/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
// import { ICategory } from '@/types';
import React, { type FC } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';

interface ICategoryModal {
  onClose: () => void;
}

interface ICategoryForm {
  name: string;
  color: string;
}

export const CategoryModal: FC<ICategoryModal> = ({ onClose }) => {
  const { categories, setCategories, addCategory, editCategory } =
    useCategoryStore();

  const { isAuth } = useAuthStore();

  const { register, handleSubmit, watch, reset } = useForm<ICategoryForm>({
    defaultValues: {
      name: '',
      color: '#000000',
    },
  });

  const watchName = watch('name', '');

  const queryClient = useQueryClient();

  // Add category
  const { mutate: mutateAddCategory } = useMutation({
    mutationFn: async (newCategory) => {
      return await api.post(`${categoryEndpoint.addCategory}`, newCategory);
    },
    onMutate: async (newTask: ICategory) => {
      await queryClient.cancelQueries({ queryKey: ['categories'] });

      // Snapshot the previous value
      const previousTasks: ICategory[] | undefined = queryClient.getQueryData([
        'categories',
      ]);

      // Optimistically delete the category from Zustand state
      addCategory(newTask);

      return { previousTasks };
    },
    onError: (_error, _newTask, context) => {
      // Rollback the optimistic update
      if (context?.previousTasks != null) {
        setCategories(context.previousTasks);
      }
    },
    onSuccess: (data, category) => {
      if (data == null) return;
      const categoryFromResponse: ICategory = data.data;

      // When success, replace the category in Zustand state with the response data (id is different from backend)
      editCategory(category.id, categoryFromResponse);

      void queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });

  const onSubmit: SubmitHandler<ICategoryForm> = (data) => {
    if (data.name.length === 0) return;
    if (data.color.length === 0) return;

    const { name, color } = data;

    const newTask: ICategory = {
      id: uuidv4(),
      name,
      color,
      createdAt: dayjs().toDate(),
    };

    if (isAuth) {
      mutateAddCategory(newTask);
    } else {
      addCategory(newTask);
    }

    reset();
  };

  // console.log(watchName);

  return (
    <Modal onClose={onClose}>
      <div
        className="bg-white z-10 flex flex-col p-8 py-6 shadow-xl rounded-lg w-1/4 text-black"
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
              <CategoryItem key={category.id} category={category} />
              // <div
              //   key={category.id}
              //   className="flex justify-between items-center"
              // >
              //   <div>{category.name}</div>
              //   <div
              //     className="w-[15px] h-[15px] border-[1px] border-black"
              //     style={{ background: category.color }}
              //   ></div>
              // </div>
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
              Close
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};
