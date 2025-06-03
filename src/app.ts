
// index.ts
interface IUser {
  id: number;
  name: string;
  email: string;
  phone_number:number;
}

interface ITask {
  id: number;
  title: string;
  description: string;
  assignedTo?: number;
}

class User implements IUser {
  constructor(public id: number, public name: string, public email: string, public phone_number:number ) {}
}

class Task implements ITask {
  constructor(
    public id: number,
    public title: string,
    public description: string,
    public assignedTo?: number
  ) {}
}

class UserService {
  private users: User[] = [];
  private lastUserId: number = 0;

  createUser(name: string, email: string, phone_number: number): User {
    const newUser = new User(++this.lastUserId, name, email,phone_number);
    this.users.push(newUser);
    return newUser;
  }

  getAllUsers(): User[] {
    return this.users;
  }

  getUserById(id: number): User | undefined {
    return this.users.find(user => user.id === id);
  }

  deleteUser(id: number): void {
    const index = this.users.findIndex(user => user.id === id);
    if (index !== -1) {
      this.users.splice(index, 1);
    }
  }
}

class TaskService {
  private tasks: Task[] = [];
  private lastTaskId: number = 0;
  constructor(private userService: UserService) {}

  createTask(title: string, description: string): Task {
    const newTask = new Task(++this.lastTaskId, title, description);
    this.tasks.push(newTask);
    return newTask;
  }

  getAllTasks(): Task[] {
    return this.tasks;
  }

  assignTask(taskId: number, userId: number): boolean {
    const task = this.tasks.find(t => t.id === taskId);
    const user = this.userService.getUserById(userId);
    if (task && user) {
      task.assignedTo = userId;
      return true;
    }
    return false;
  }

  unassignTask(taskId: number): boolean {
    const task = this.tasks.find(t => t.id === taskId);
    if (!task) return false;
    task.assignedTo = undefined;
    return true;
  }

  deleteTask(id: number): void {
    const index = this.tasks.findIndex(task => task.id === id);
    if (index !== -1) {
      this.tasks.splice(index, 1);
    }
  }
}


const userService = new UserService();
const taskService = new TaskService(userService);




























// const userBtn = document.getElementById("user-btn") as HTMLButtonElement;
// const userNameInput = document.getElementById("username") as HTMLInputElement;
// const userEmailInput = document.getElementById("user-email") as HTMLInputElement;
// const userList = document.querySelector(".user-list") as HTMLDivElement;

// const taskBtn = document.getElementById("add-task") as HTMLButtonElement;
// const taskTitleInput = document.getElementById("task-title") as HTMLInputElement;
// const taskDescInput = document.getElementById("description") as HTMLTextAreaElement;
// const tasksList = document.getElementById("tasksList") as HTMLDivElement;

// const assignTaskBtn = document.getElementById("assignTaskBtn") as HTMLButtonElement;
// const assignUserIdInput = document.getElementById("assign-task") as HTMLInputElement;
// const unassignTaskBtn = document.getElementById("unassign-task") as HTMLButtonElement;

// userBtn.addEventListener("click", () => {
//   const name = userNameInput.value.trim();
//   const email = userEmailInput.value.trim();
//   if (!name || !email) return alert("Please fill in all fields.");
//   userService.createUser(name, email,phone_numer);
//   showUsers();
//   userNameInput.value = "";
//   userEmailInput.value = "";
//   userPhone_number.value="";
// });

// function showUsers() {
//   userList.innerHTML = "";
//   userService.getAllUsers().forEach(user => {
//     const div = document.createElement("div");
//     div.className = "user-item";
//     div.innerHTML = `
//     <span class="user-id">ID: ${user.id}</span>
//       <span class="user-name">${user.name}</span>
//       <span class="user-email">${user.email}</span>
//        <button class="delete-user-btn" data-id="${user.id}">Delete</button>
//        <button class="update-user-btn" data-id="${user.id}">Upadate</button>
      
//     `;
//     userList.appendChild(div);
//   });

//     document.querySelectorAll('.delete-user-btn').forEach(button => {
//     button.addEventListener('click', (e) => {
//       const userId = parseInt((e.target as HTMLElement).getAttribute('data-id') || '0');
//       userService.deleteUser(userId);
//       showUsers(); 
//     });
//   });


// }





// taskBtn.addEventListener("click", () => {
//   const title = taskTitleInput.value.trim();
//   const description = taskDescInput.value.trim();
//   if (!title || !description) return alert("Please enter title and description.");
//   taskService.createTask(title, description);
//   showTasks();
//   taskTitleInput.value = "";
//   taskDescInput.value = "";
// });

// function showTasks() {
//   tasksList.innerHTML = "";
//   taskService.getAllTasks().forEach(task => {
//     const div = document.createElement("div");
//     div.className = "task-item";
//     div.innerHTML = `
//       <span class="task-title">${task.title}</span>
//       <span class="task-desc">${task.description}</span>
//       <span class="assigned-to">Assigned To: ${task.assignedTo || "None"}</span>
//        <button class="delete-task-btn" data-id="${task.id}">Delete </button>
//        <button class="upadate-task-btn" data-id="${task.id}">Update</button>
//     `;
//     tasksList.appendChild(div);
//   });

//    document.querySelectorAll('.delete-task-btn').forEach(button => {
//     button.addEventListener('click', (e) => {
//       const taskId = parseInt((e.target as HTMLElement).getAttribute('data-id') || '0');
//       taskService.deleteTask(taskId);
//       showTasks(); 
//     });
//   });


// }

// assignTaskBtn.addEventListener("click", () => {
//   const userId = parseInt(assignUserIdInput.value);
//   const tasks = taskService.getAllTasks();
//   if (!tasks.length) return alert("No tasks available.");
//   const lastTask = tasks[tasks.length - 1];
//   if (taskService.assignTask(lastTask.id, userId)) {
//     showTasks();
//   } else {
//     alert("Failed to assign task. Check user ID.");
//   }
//   assignUserIdInput.value = "";
// });

// unassignTaskBtn.addEventListener("click", () => {
//   const tasks = taskService.getAllTasks();
//   if (!tasks.length) return alert("No tasks available.");
//   const lastTask = tasks[tasks.length - 1];
//   if (taskService.unassignTask(lastTask.id)) {
//     showTasks();
//   } else {
//     alert("Failed to unassign task.");
//   }
// });
