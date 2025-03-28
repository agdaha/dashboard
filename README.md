# Дашборд администратора сервера интегратора

### Цель проекта

Целью данного проекта является предоставление инструмента мониторинга сервисов и потоков данных на сервере интеграторе БДСП (далее СИБДСП).

### Краткое описание

На СИБДСП запущены несколько сервисов получения обменных файлов от различных источников и последующей обработки этих файлов. Все действия сервисов фиксируются в логах системы systemd ОС Linux. Именно эти логи являются основным источником информации для дашборда.

Для тестирования дашборда реализованы (работает только на ОС Linux с systemd):

1. Фиктивный серсвис пишущий в лог, бинарный файл mock_logger размещен в папке /bin. Запуск осуществляется командой `bin/mock_logger | systemd-cat -t mock_logger`
2. Бэкенд с реализованными АPI REST и через Websocket. Запускается командой `bin/api_ws`, по умолчанию запускается на порту 8585. Для изменения адресации использовать опцию `addr`, пример `bin/api_ws --addr "127.0.0.1:8888"`

##### Для дашборда использованы:

1. библиотека компонентов PrimeVue
2. vue-router
3. pinia
4. терминал x-term
5. Получение данных черех axios и websocket

Сам дашборд запускается: ` npm run dev`

Скринкаст с возможностями приложения:

https://disk.yandex.ru/i/maPPsV1fyK03gg
