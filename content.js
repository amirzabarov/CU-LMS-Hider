const DEBUG = false; // Включение/выключение дебага

// Функция для скрытия забаненных курсов (основной блок)
function hideBannedCourses(banned, nodesToCheck) {
    if (DEBUG) console.log("Начало работы hideBannedCourses");
    
    // Если переданы конкретные узлы, проверяем только их, иначе ищем по всему документу
    const titles = nodesToCheck ? nodesToCheck.flatMap(node => Array.from(node.querySelectorAll('.course-card__title.three-lines-text.font-text-s-bold'))) : document.querySelectorAll('.course-card__title.three-lines-text.font-text-s-bold');
    
    if (DEBUG) console.log(`Найдено курсов: ${titles.length}`);
    
    titles.forEach(title => {
        const courseTitle = title.textContent.trim();
        if (banned.includes(courseTitle)) {
            if (DEBUG) console.log(`Блокируем курс: ${courseTitle}`);
            // Находим ближайший <li> элемент и удаляем его
            const listItem = title.closest('li');
            if (listItem) {
                listItem.remove();
            }
        }
    });
}

// Функция для скрытия забаненных курсов (боковая панель)
function hideBannedCoursesSidebar(banned, nodesToCheck) {
    if (DEBUG) console.log("Начало работы hideBannedCoursesSidebar");
    
    // Если переданы конкретные узлы, проверяем только их, иначе ищем по всему документу
    const courseElements = nodesToCheck ? nodesToCheck.flatMap(node => Array.from(node.querySelectorAll('.cu-navtab__main-element-text'))) : document.querySelectorAll('.cu-navtab__main-element-text');
    
    if (DEBUG) console.log(`Найдено курсов в боковой панели: ${courseElements.length}`);
    
    courseElements.forEach(course => {
        const courseTitle = course.textContent.trim();
        if (banned.includes(courseTitle)) {
            if (DEBUG) console.log(`Блокируем курс в боковой панели: ${courseTitle}`);
            const listItem = course.closest('li');
            if (listItem) {
                listItem.remove();
            }
        }
    });
}

// Создаём MutationObserver для отслеживания изменений в DOM
const observer = new MutationObserver((mutations) => {
    if (DEBUG) console.log("MutationObserver: найдено изменение в DOM");
    
    mutations.forEach((mutation) => {
        // Фильтруем мутации: обрабатываем только те, в которых есть добавленные узлы с нужными классами
        const relevantNodes = Array.from(mutation.addedNodes).filter(node => 
            node.nodeType === 1 && (node.querySelector('.course-card__title.three-lines-text.font-text-s-bold') || node.querySelector('.cu-navtab__main-element-text'))
        );
        
        if (relevantNodes.length > 0) {
            if (DEBUG) console.log("Обнаружены новые узлы с курсами, проверяем их");
            // Получаем список забаненных курсов из локального хранилища Chrome
            chrome.storage.local.get('banned', (result) => {
                const banned = result.banned || [];
                hideBannedCourses(banned, relevantNodes);
                hideBannedCoursesSidebar(banned, relevantNodes);
            });
        }
    });
});

// Начинаем наблюдение за изменениями в body
observer.observe(document.body, { childList: true, subtree: true });

if (DEBUG) console.log("Расширение запущено и отслеживает изменения");
