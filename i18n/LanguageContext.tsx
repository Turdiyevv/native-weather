import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type Language = "uz" | "ru" | "en";

const LANGUAGE_KEY = "appLanguage";

const translations: Record<Language, Record<string, string>> = {
  uz: {
    all: "Barchasi", language: "Til", notificationTask: "Vazifa eslatmasi", notificationHabit: "Odat vaqti", timeUp: "Vaqt bo‘ldi", notificationSaved: "Bildirishnoma saqlandi!", notificationError: "Bildirishnoma xatosi", welcome: "Xush kelibsiz!", loginSubtitle: "Boshqaruv markazingizga kiring",
    accounts: "Hisoblar", username: "Username", password: "Password", noSpaces: "Bo'sh joylarsiz kiriting !",
    login: "Kirish", passwordLogin: "Parol orqali kirish", register: "(Registratsiya)", securityCode: "Xavfsizlik kodi",
    enterCode: "Kodni kiriting", usernameLogin: "Username orqali kirish", profileEdit: "Tahrirlash", logout: "Chiqish",
    profileInfo: "Profil ma’lumotlari", users: "Foydalanuvchilar", settings: "Sozlamalar", quickCode: "Oson kirish kodi",
    about: "Biz haqimizda", deleteCode: "Kodni o‘chirish", delete: "O‘chirish", edit: "Tahrirlash", save: "Saqlash",
    changeImage: "Rasmni o‘zgartirish", personalInfo: "Shaxsiy ma’lumotlar", firstName: "Ism", lastName: "Familiya",
    phone: "Telefon raqam", job: "Faoliyat turi", note: "Izoh", name: "Name", tasks: "Vazifalar", habits: "Odatlar",
    business: "Biznes", chat: "Chat", earnings: "Daromad", no: "Yo‘q", yes: "Ha", selectLanguage: "Tilni tanlang",
    light: "Kunduzgi", dark: "Tungi", blue: "Ko‘k", orange: "Mandarin", exportTasks: "Vazifalarni yuklab olish", deleteAccount: "Hisobni butunlay o‘chirish", total: "Jami summa", entries: "ta yozuv", noData: "Hozircha ma’lumot yo‘q", dataWillAppear: "Yangi yozuvlar shu yerda ko‘rinadi.", allIncome: "Barcha kirimlar", allExpenses: "Barcha chiqimlar", income: "Kirim", expense: "Chiqim", earningsModule: "Daromad moduli", comingSoon: "Ishga tushirilish uchun qayta ishlanmoqda", chatDescription: "Bu yerda keyinchalik online media chat yaratiladi.", aboutDescription: "Bu ilova sizning kundalik vazifalaringizni boshqarish va eslatmalarni kuzatishda yordam beradi.", leaveMessage: "Bog‘lanmoqchi bo‘lsangiz xabar qoldiring!", viaTelegram: "Telegram orqali", habitAdd: "Odat qo‘shish", habitName: "Odat nomi", duration: "Necha kun davom etadi", notificationTime: "Bildirishnoma vaqti", cancel: "Bekor qilish", current: "Hozirgi", completed: "Bajarilgan", archive: "Arxiv", add: "Qo‘shish", deleteHabit: "O‘chirish", done: "Bajarildi", skipped: "Qoldirildi", pending: "Kutilmoqda", view: "Ko‘rish", expired: "Muddati tugagan.", chooseFile: "Fayl tanlash", required: "Bu maydon to‘ldirilishi shart!", minLength: "kamida belgi bo‘lishi kerak", detail: "Detal", details: "Batafsil", category: "Kategoriya", finished: "Bajarilgan", unfinished: "Bajarilmagan", noTasks: "Bu yerda kun tartibingiz bo‘yicha vazifalarni yozishingiz mumkin.", deletedTasks: "O‘chirilgan vazifalar yo‘q.", setAlarm: "Qo‘ng‘iroqni o‘rnatish", removeAlarm: "Qo‘ng‘iroqni o‘chirish", markDone: "Bajarildi", restore: "Qaytarish", archiveTask: "Arxivlash", taskFieldsRequired: "Vazifa nomi va izoh bo‘sh bo‘lishi mumkin emas", savedSuccessfully: "Muvaffaqiyatli saqlandi!", taskArchivedSuccess: "Vazifa arxivlandi!", habitNameRequired: "Odat nomini kiriting!", habitDurationInvalid: "Davomiylik noto‘g‘ri!", genericError: "Xatolik yuz berdi", requiredCredentials: "Username va parolni kiriting!", minimumSixCharacters: "Kamida 6 ta belgi bo‘lishi kerak!", userNotFound: "Foydalanuvchi topilmadi. Yangi foydalanuvchi yaratib bo‘lmaydi!", loginSuccess: "Muvaffaqiyatli kirish!", newUserCreated: "Yangi foydalanuvchi yaratildi!", profileLoadError: "Profilni yuklab bo‘lmadi", imageDeleted: "Rasm o‘chirildi", profileSaved: "Ma’lumotlar saqlandi!", profileSaveError: "Saqlashda xatolik", userActivated: "foydalanuvchi aktiv qilindi", accountDeleted: "Hisob muvaffaqiyatli o‘chirildi!", quickCodeMissing: "Tezkor kod mavjud emas!", quickCodeDeleted: "Tezkor kod o‘chirildi!", alarmRemoved: "Eslatma o‘chirildi", taskCompleted: "Bajarildi ✓", taskRestored: "Qaytarildi", taskArchived: "Arxivlandi", taskNotFound: "Foydalanuvchi topilmadi!", taskPermanentlyDeleted: "Vazifa butunlay o‘chirildi", taskEditUnavailable: "Tahrirlashni imkoni yo‘q!", archiveConfirm: "Element arxivga tushiriladi. Ishonchingiz komilmi?", deleteConfirm: "Hisobni butunlay o‘chirmoqchimisiz?", logoutConfirm: "Ishonchingiz komilmi?", galleryPermission: "Rasm galereyasiga ruxsat berish kerak", exitAppConfirm: "Ilovadan chiqmoqchimisiz?",
  },
  ru: {
    all: "Все", language: "Язык", notificationTask: "Напоминание о задаче", notificationHabit: "Время привычки", timeUp: "Время пришло", notificationSaved: "Напоминание сохранено!", notificationError: "Ошибка напоминания", welcome: "Добро пожаловать!", loginSubtitle: "Войдите в центр управления", accounts: "Аккаунты",
    username: "Имя пользователя", password: "Пароль", noSpaces: "Введите без пробелов", login: "Войти",
    passwordLogin: "Войти по паролю", register: "(Регистрация)", securityCode: "Код безопасности", enterCode: "Введите код",
    usernameLogin: "Войти по имени пользователя", profileEdit: "Редактировать", logout: "Выйти", profileInfo: "Данные профиля",
    users: "Пользователи", settings: "Настройки", quickCode: "Быстрый код входа", about: "О приложении",
    deleteCode: "Удалить код", delete: "Удалить", edit: "Редактировать", save: "Сохранить", changeImage: "Изменить фото",
    personalInfo: "Личные данные", firstName: "Имя", lastName: "Фамилия", phone: "Номер телефона", job: "Род деятельности",
    note: "Описание", name: "Имя", tasks: "Задачи", habits: "Привычки", business: "Бизнес", chat: "Чат", earnings: "Доход",
    no: "Нет", yes: "Да", selectLanguage: "Выберите язык", light: "Дневная", dark: "Тёмная", blue: "Синяя", orange: "Мандарин", exportTasks: "Скачать задачи", deleteAccount: "Удалить аккаунт", total: "Итого", entries: "записей", noData: "Данных пока нет", dataWillAppear: "Новые записи появятся здесь.", allIncome: "Все доходы", allExpenses: "Все расходы", income: "Доход", expense: "Расход", earningsModule: "Модуль доходов", comingSoon: "Раздел находится в разработке", chatDescription: "Здесь появится онлайн-чат.", aboutDescription: "Приложение помогает управлять ежедневными задачами и отслеживать напоминания.", leaveMessage: "Оставьте сообщение, если хотите связаться!", viaTelegram: "Через Telegram", habitAdd: "Добавить привычку", habitName: "Название привычки", duration: "Продолжительность", notificationTime: "Время уведомления", cancel: "Отмена", current: "Текущие", completed: "Выполненные", archive: "Архив", add: "Добавить", deleteHabit: "Удалить", done: "Выполнено", skipped: "Пропущено", pending: "Ожидает", view: "Просмотр", expired: "Срок истёк.", chooseFile: "Выбрать файл", required: "Заполните это поле", minLength: "минимум символов", detail: "Детали", details: "Подробности", category: "Категория", finished: "Выполнено", unfinished: "Не выполнено", noTasks: "Здесь появятся ваши задачи на день.", deletedTasks: "Удалённых задач нет.", setAlarm: "Установить напоминание", removeAlarm: "Удалить напоминание", markDone: "Выполнено", restore: "Вернуть", archiveTask: "Архивировать", taskFieldsRequired: "Название и описание задачи не могут быть пустыми", savedSuccessfully: "Успешно сохранено!", taskArchivedSuccess: "Задача архивирована!", habitNameRequired: "Введите название привычки!", habitDurationInvalid: "Неверная продолжительность!", genericError: "Произошла ошибка", requiredCredentials: "Введите имя пользователя и пароль!", minimumSixCharacters: "Минимум 6 символов!", userNotFound: "Пользователь не найден. Нельзя создать нового пользователя!", loginSuccess: "Вход выполнен успешно!", newUserCreated: "Новый пользователь создан!", profileLoadError: "Не удалось загрузить профиль", imageDeleted: "Фото удалено", profileSaved: "Данные сохранены!", profileSaveError: "Ошибка сохранения", userActivated: "пользователь активирован", accountDeleted: "Аккаунт успешно удалён!", quickCodeMissing: "Быстрый код отсутствует!", quickCodeDeleted: "Быстрый код удалён!", alarmRemoved: "Напоминание удалено", taskCompleted: "Выполнено ✓", taskRestored: "Возвращено", taskArchived: "Архивировано", taskNotFound: "Пользователь не найден!", taskPermanentlyDeleted: "Задача удалена навсегда", taskEditUnavailable: "Редактирование недоступно!", archiveConfirm: "Элемент будет перемещён в архив. Вы уверены?", deleteConfirm: "Удалить аккаунт навсегда?", logoutConfirm: "Вы уверены?", galleryPermission: "Нужно разрешить доступ к галерее", exitAppConfirm: "Выйти из приложения?",
  },
  en: {
    all: "All", language: "Language", notificationTask: "Task reminder", notificationHabit: "Habit time", timeUp: "Time is up", notificationSaved: "Reminder saved!", notificationError: "Reminder error", welcome: "Welcome!", loginSubtitle: "Sign in to your control center", accounts: "Accounts",
    username: "Username", password: "Password", noSpaces: "Enter without spaces", login: "Sign in",
    passwordLogin: "Sign in with password", register: "(Registration)", securityCode: "Security code", enterCode: "Enter the code",
    usernameLogin: "Sign in with username", profileEdit: "Edit profile", logout: "Log out", profileInfo: "Profile information",
    users: "Users", settings: "Settings", quickCode: "Quick access code", about: "About", deleteCode: "Delete code",
    delete: "Delete", edit: "Edit", save: "Save", changeImage: "Change photo", personalInfo: "Personal information",
    firstName: "First name", lastName: "Last name", phone: "Phone number", job: "Occupation", note: "Description",
    name: "Name", tasks: "Tasks", habits: "Habits", business: "Business", chat: "Chat", earnings: "Earnings", no: "No", yes: "Yes",
    selectLanguage: "Select language", light: "Light", dark: "Dark", blue: "Blue", orange: "Orange", exportTasks: "Export tasks", deleteAccount: "Delete account", total: "Total", entries: "entries", noData: "No data yet", dataWillAppear: "New entries will appear here.", allIncome: "All income", allExpenses: "All expenses", income: "Income", expense: "Expenses", earningsModule: "Earnings module", comingSoon: "This section is under development", chatDescription: "An online chat will be available here.", aboutDescription: "This app helps you manage daily tasks and track reminders.", leaveMessage: "Leave a message if you want to contact us!", viaTelegram: "Via Telegram", habitAdd: "Add habit", habitName: "Habit name", duration: "Duration in days", notificationTime: "Notification time", cancel: "Cancel", current: "Current", completed: "Completed", archive: "Archive", add: "Add", deleteHabit: "Delete", done: "Done", skipped: "Skipped", pending: "Pending", view: "View", expired: "Expired.", chooseFile: "Choose file", required: "This field is required", minLength: "minimum characters", detail: "Details", details: "Details", category: "Category", finished: "Completed", unfinished: "Not completed", noTasks: "Your daily tasks will appear here.", deletedTasks: "No deleted tasks.", setAlarm: "Set reminder", removeAlarm: "Remove reminder", markDone: "Done", restore: "Restore", archiveTask: "Archive", taskFieldsRequired: "Task title and description cannot be empty", savedSuccessfully: "Saved successfully!", taskArchivedSuccess: "Task archived!", habitNameRequired: "Enter a habit name!", habitDurationInvalid: "Invalid duration!", genericError: "Something went wrong", requiredCredentials: "Enter a username and password!", minimumSixCharacters: "Minimum 6 characters!", userNotFound: "User not found. A new user cannot be created!", loginSuccess: "Signed in successfully!", newUserCreated: "New user created!", profileLoadError: "Could not load profile", imageDeleted: "Photo deleted", profileSaved: "Information saved!", profileSaveError: "Save failed", userActivated: "user activated", accountDeleted: "Account deleted successfully!", quickCodeMissing: "Quick code does not exist!", quickCodeDeleted: "Quick code deleted!", alarmRemoved: "Reminder removed", taskCompleted: "Completed ✓", taskRestored: "Restored", taskArchived: "Archived", taskNotFound: "User not found!", taskPermanentlyDeleted: "Task permanently deleted", taskEditUnavailable: "Editing is unavailable!", archiveConfirm: "This item will be archived. Are you sure?", deleteConfirm: "Delete the account permanently?", logoutConfirm: "Are you sure?", galleryPermission: "Gallery permission is required", exitAppConfirm: "Exit the app?",
  },
};

const alertTranslations: Record<Language, Record<string, string>> = {
  uz: {
    wrongPassword: "Parol noto‘g‘ri!",
    taskDeleteConfirm: "Siz bu vazifani butunlay o‘chirmoqchimisiz?",
  },
  ru: {
    wrongPassword: "Неверный пароль!",
    taskDeleteConfirm: "Удалить эту задачу навсегда?",
  },
  en: {
    wrongPassword: "Incorrect password!",
    taskDeleteConfirm: "Delete this task permanently?",
  },
};

interface LanguageContextValue {
  language: Language;
  setLanguage: (language: Language) => Promise<void>;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setCurrentLanguage] = useState<Language>("uz");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(LANGUAGE_KEY).then((saved) => {
      if (saved === "uz" || saved === "ru" || saved === "en") setCurrentLanguage(saved);
      setReady(true);
    });
  }, []);

  const setLanguage = async (nextLanguage: Language) => {
    setCurrentLanguage(nextLanguage);
    await AsyncStorage.setItem(LANGUAGE_KEY, nextLanguage);
  };

  if (!ready) return null;
  return (
    <LanguageContext.Provider value={{ language, setLanguage, t: (key) => translations[language][key] ?? alertTranslations[language][key] ?? key }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used inside LanguageProvider");
  return context;
}
