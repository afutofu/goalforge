export const taskEndpoint = {
  getAll: '/api/v1/tasks?period=0',
  getDay: '/api/v1/tasks?period=1',
  getWeek: '/api/v1/tasks?period=2',
  getMonth: '/api/v1/tasks?period=3',
  getYear: '/api/v1/tasks?period=4',

  addTask: '/api/v1/tasks',

  editTask: '/api/v1/tasks/:taskID',

  deleteTask: '/api/v1/tasks/:taskID',
};

export const categoryEndpoint = {
  getAll: '/api/v1/categories',

  addCategory: '/api/v1/categories',

  editCategory: '/api/v1/categories/:categoryID',

  deleteCategory: '/api/v1/categories/:categoryID',
};

export const goalEndpoint = {
  getAll: '/api/v1/goals',

  addGoal: '/api/v1/goals',

  editGoal: '/api/v1/goals/:goalID',

  deleteGoal: '/api/v1/goals/:goalID',
};

export const activityLogEndpoint = {
  getDay: '/api/v1/activity-logs',

  addLog: '/api/v1/activity-logs',

  editActivityLog: '/api/v1/activity-logs/:activityLogID',

  deleteActivityLog: '/api/v1/activity-logs/:activityLogID',
};

export const authEndpoint = {
  oauthSignin: '/api/v1/auth/oauth-signin',
  login_google: '/api/v1/auth/google',
  fetch_user: '/api/v1/auth/fetch-user',
  logout: '/api/v1/auth/logout',
};
