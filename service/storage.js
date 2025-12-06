import AsyncStorage from "@react-native-async-storage/async-storage";

export const Storage = {

  // --- USERS O‘QISH ---
  async getUsers() {
    const data = await AsyncStorage.getItem("users");
    return data ? JSON.parse(data) : [];
  },

  // --- USERS YANGILASH ---
  async saveUsers(users) {
    await AsyncStorage.setItem("users", JSON.stringify(users));
  },

  // --- USER QO‘SHISH ---
  async addUser(username, password) {
    const users = await this.getUsers();

    if (users.length >= 3) {
      return { error: "Max 3 user bo‘lishi mumkin" };
    }

    // agar kullanıcı oldin bor bo‘lsa
    const exists = users.find(u => u.username === username);
    if (exists) return { error: "Bu username oldin yaratilgan" };

    const newUser = {
      username,
      password,
      userinfo: {},
      usertasks: []
    };

    users.push(newUser);
    await this.saveUsers(users);
    return { success: true };
  },

  // --- LOGIN ---
  async login(username, password) {
    const users = await this.getUsers();
    return users.find(u => u.username === username && u.password === password);
  },

  // --- USER MA'LUMOTLARINI SAQLASH ---
  async updateUserInfo(username, info) {
    const users = await this.getUsers();
    const user = users.find(u => u.username === username);
    if (!user) return;

    user.userinfo = info;
    await this.saveUsers(users);
  },

  // --- USER TASK QO‘SHISH ---
  async addTask(username, task) {
    const users = await this.getUsers();
    const user = users.find(u => u.username === username);
    if (!user) return;

    user.usertasks.push(task);
    await this.saveUsers(users);
  },

  // --- USER TASK O‘CHIRISH ---
  async removeTask(username, id) {
    const users = await this.getUsers();
    const user = users.find(u => u.username === username);
    if (!user) return;

    user.usertasks = user.usertasks.filter(t => t.id !== id);
    await this.saveUsers(users);
  }
};
