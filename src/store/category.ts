import { type ICategory } from '@/types';
import { create } from 'zustand';
// import { persist } from 'zustand/middleware';

interface ICategoryStore {
  // Initial categories
  categories: ICategory[];

  // Setting category
  setCategories: (category: ICategory[]) => void;

  // Adding category
  addCategory: (category: ICategory) => void;

  // Editing category
  editCategory: (activityLogID: string, editedCategory: ICategory) => void;

  // Deleting category
  deleteCategory: (activityLogID: string) => void;
}

export const useCategoryStore = create<ICategoryStore>((set, get) => ({
  // Initial categories
  categories: [],

  // Set category
  setCategories: (categories: ICategory[]) => {
    set({ categories });
  },

  // Add category
  addCategory: (category: ICategory) => {
    const currentactivityLog = get().categories;
    set({ categories: [...currentactivityLog, category] });

    // Make your API call to add the category
    // api.addTask(category)
    //   .catch(error => {
    //     // Handle error and rollback the state update if needed
    //     set({ Category: currentactivityLog });
    //   });
  },
  // Edit category
  editCategory: (activityLogID: string, editedCategory: ICategory) => {
    const currentactivityLog = get().categories;
    set({
      categories: currentactivityLog.map((category) => {
        if (category.id === activityLogID) {
          return editedCategory;
        }
        return category;
      }),
    });
  },

  // Delete category
  deleteCategory: (activityLogID: string) => {
    const currentactivityLog = get().categories;
    set({
      categories: currentactivityLog.filter(
        (category) => category.id !== activityLogID,
      ),
    });

    // Make your API call to add the category
    // api.deleteTask(category).catch((error) => {
    //   // Handle error and rollback the state update if needed
    //   set({ Category: currentactivityLog });
    // });
  },
}));
