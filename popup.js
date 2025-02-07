document.addEventListener('DOMContentLoaded', function() {
    const bannedInput = document.getElementById('bannedList');
    const saveButton = document.getElementById('saveButton');

    // Загрузка существующего списка забаненных курсов
    chrome.storage.local.get('banned', (result) => {
        const banned = result.banned || [];
        bannedInput.value = banned.join(', ');
    });

    // Сохранение списка после нажатия на кнопку
    saveButton.addEventListener('click', () => {
        const banned = bannedInput.value.split(',').map(item => item.trim()).filter(item => item !== "");
        chrome.storage.local.set({ banned: banned }, () => {
            console.log('Список забаненных курсов сохранён:', banned);
        });
    });
});
