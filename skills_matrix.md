# Flutter Developer Skills Matrix — Подготовка к собеседованию

> **Как пользоваться:**
>
> - Каждый день мы берём 5–7 тем из разных категорий (приоритет — слабые и давно не повторённые).
> - После обсуждения я обновляю `count` (сколько раз обсуждали) и `score` (оценка 1–5).
> - `score`: 1 = не знаю, 2 = смутно помню, 3 = знаю с подсказками, 4 = уверенно знаю, 5 = могу объяснить другому.
> - `last` — дата последнего повторения.

---

## 1. Dart — язык


| #    | Тема                                                             | count | score | last | заметки |
| ---- | ---------------------------------------------------------------- | ----- | ----- | ---- | ------- |
| 1.1  | Система типов Dart (sound null safety, type inference, generics) | 0     | —     | —    |         |
| 1.2  | Классы: abstract, mixin, extension, sealed, interface            | 0     | —     | —    |         |
| 1.3  | Records и Patterns (Dart 3+)                                     | 0     | —     | —    |         |
| 1.4  | Коллекции (List, Map, Set), Iterable, spread, collection-if/for  | 0     | —     | —    |         |
| 1.5  | Замыкания, функции первого класса, typedef                       | 0     | —     | —    |         |
| 1.6  | Enum с полями и методами                                         | 0     | —     | —    |         |
| 1.7  | Работа с ошибками: Error vs Exception, try/catch/on, Zone        | 0     | —     | —    |         |
| 1.8  | Управление памятью в Dart: GC, weak references                   | 0     | —     | —    |         |
| 1.9  | Метапрограммирование: code generation, build_runner, annotations | 0     | —     | —    |         |
| 1.10 | Dart VM vs dart2js vs dart2wasm — компиляция                     | 0     | —     | —    |         |


---

## 2. Асинхронность и конкурентность


| #   | Тема                                                        | count | score | last | заметки |
| --- | ----------------------------------------------------------- | ----- | ----- | ---- | ------- |
| 2.1 | Event loop в Dart (microtask queue vs event queue)          | 0     | —     | —    |         |
| 2.2 | Future: создание, chaining, error handling, Future.wait/any | 0     | —     | —    |         |
| 2.3 | async/await: под капотом, отличия от callback               | 0     | —     | —    |         |
| 2.4 | Stream: single-subscription vs broadcast, StreamController  | 0     | —     | —    |         |
| 2.5 | Stream transformers: map, where, expand, asyncMap, debounce | 0     | —     | —    |         |
| 2.6 | Isolates: spawn, compute(), SendPort/ReceivePort            | 0     | —     | —    |         |
| 2.7 | Когда использовать Isolate vs Future vs Stream              | 0     | —     | —    |         |
| 2.8 | Completer, StreamSink, StreamSubscription — управление      | 0     | —     | —    |         |
| 2.9 | Таймауты, повторные запросы, отмена операций                | 0     | —     | —    |         |


---

## 3. Flutter — ядро фреймворка


| #    | Тема                                                                   | count | score | last | заметки |
| ---- | ---------------------------------------------------------------------- | ----- | ----- | ---- | ------- |
| 3.1  | Три дерева: Widget / Element / RenderObject                            | 0     | —     | —    |         |
| 3.2  | StatelessWidget vs StatefulWidget: жизненный цикл                      | 0     | —     | —    |         |
| 3.3  | Жизненный цикл State: initState, didChangeDependencies, dispose и т.д. | 0     | —     | —    |         |
| 3.4  | Keys: ValueKey, ObjectKey, GlobalKey — зачем нужны                     | 0     | —     | —    |         |
| 3.5  | InheritedWidget и InheritedModel                                       | 0     | —     | —    |         |
| 3.6  | BuildContext: что это, как работает                                    | 0     | —     | —    |         |
| 3.7  | Layout: Constraints → Size → Offset (протокол)                         | 0     | —     | —    |         |
| 3.8  | Flex: Row, Column, Flexible, Expanded, MainAxis/CrossAxis              | 0     | —     | —    |         |
| 3.9  | Stack, Positioned, Align, FractionallySizedBox                         | 0     | —     | —    |         |
| 3.10 | CustomPainter, Canvas, paint pipeline                                  | 0     | —     | —    |         |
| 3.11 | Slivers: CustomScrollView, SliverList, SliverAppBar                    | 0     | —     | —    |         |
| 3.12 | Overlay, OverlayEntry, CompositedTransformFollower                     | 0     | —     | —    |         |
| 3.13 | Platform channels: MethodChannel, EventChannel, BasicMessageChannel    | 0     | —     | —    |         |
| 3.14 | Жизненный цикл приложения: AppLifecycleState, WidgetsBindingObserver   | 0     | —     | —    |         |


---

## 4. State Management


| #   | Тема                                                        | count | score | last | заметки |
| --- | ----------------------------------------------------------- | ----- | ----- | ---- | ------- |
| 4.1 | setState — когда достаточно, анти-паттерны                  | 0     | —     | —    |         |
| 4.2 | Provider: ChangeNotifier, Consumer, Selector, ProxyProvider | 0     | —     | —    |         |
| 4.3 | BLoC / Cubit: паттерн, bloc_concurrency, трансформации      | 0     | —     | —    |         |
| 4.4 | Riverpod: Provider types, ref, autoDispose, family          | 0     | —     | —    |         |
| 4.5 | Сравнение подходов: trade-offs, когда что выбрать           | 0     | —     | —    |         |
| 4.6 | Реактивность vs императивность в управлении состоянием      | 0     | —     | —    |         |
| 4.7 | Глобальный vs локальный state, scoping                      | 0     | —     | —    |         |


---

## 5. Архитектура


| #   | Тема                                                       | count | score | last | заметки |
| --- | ---------------------------------------------------------- | ----- | ----- | ---- | ------- |
| 5.1 | Clean Architecture: слои, boundaries, data flow            | 0     | —     | —    |         |
| 5.2 | MVVM в контексте Flutter                                   | 0     | —     | —    |         |
| 5.3 | Repository pattern                                         | 0     | —     | —    |         |
| 5.4 | UseCase / Interactor                                       | 0     | —     | —    |         |
| 5.5 | Feature-first vs Layer-first организация проекта           | 0     | —     | —    |         |
| 5.6 | Dependency Injection: get_it, injectable, ручной DI        | 0     | —     | —    |         |
| 5.7 | SOLID в контексте Flutter/Dart                             | 0     | —     | —    |         |
| 5.8 | Модульность: package-based architecture, mono-repo (Melos) | 0     | —     | —    |         |
| 5.9 | Управление техническим долгом и рефакторинг                | 0     | —     | —    |         |


---

## 6. Навигация и роутинг


| #   | Тема                                                               | count | score | last | заметки |
| --- | ------------------------------------------------------------------ | ----- | ----- | ---- | ------- |
| 6.1 | Navigator 1.0: push, pop, named routes, onGenerateRoute            | 0     | —     | —    |         |
| 6.2 | Navigator 2.0 / Router API: RouterDelegate, RouteInformationParser | 0     | —     | —    |         |
| 6.3 | GoRouter: конфигурация, guards, deep links, nested navigation      | 0     | —     | —    |         |
| 6.4 | Deep linking: настройка Android/iOS, Universal Links               | 0     | —     | —    |         |
| 6.5 | Передача данных между экранами, result от pop                      | 0     | —     | —    |         |


---

## 7. Работа с сетью и данными


| #   | Тема                                                                        | count | score | last | заметки |
| --- | --------------------------------------------------------------------------- | ----- | ----- | ---- | ------- |
| 7.1 | HTTP: пакет http / dio, interceptors, retry                                 | 0     | —     | —    |         |
| 7.2 | Сериализация JSON: json_serializable, freezed, manual                       | 0     | —     | —    |         |
| 7.3 | REST API: контракты, versioning, error handling                             | 0     | —     | —    |         |
| 7.4 | GraphQL в Flutter (graphql_flutter) — обзорно                               | 0     | —     | —    |         |
| 7.5 | WebSocket: подключение, переподключение, heartbeat                          | 0     | —     | —    |         |
| 7.6 | Авторизация: JWT, OAuth2, refresh tokens, secure storage                    | 0     | —     | —    |         |
| 7.7 | Локальное хранилище: SharedPreferences, Hive, Drift/SQLite                  | 0     | —     | —    |         |
| 7.8 | Кеширование: стратегии (cache-first, network-first, stale-while-revalidate) | 0     | —     | —    |         |
| 7.9 | Offline-first: синхронизация, конфликты, очередь запросов                   | 0     | —     | —    |         |


---

## 8. Тестирование


| #   | Тема                                                           | count | score | last | заметки |
| --- | -------------------------------------------------------------- | ----- | ----- | ---- | ------- |
| 8.1 | Unit-тесты: структура, group, setUp/tearDown, matchers         | 0     | —     | —    |         |
| 8.2 | Mocking: mockito, mocktail, когда fake vs mock vs stub         | 0     | —     | —    |         |
| 8.3 | Widget-тесты: pumpWidget, find, expect, interactions           | 0     | —     | —    |         |
| 8.4 | Golden-тесты                                                   | 0     | —     | —    |         |
| 8.5 | Integration-тесты: integration_test, patrol                    | 0     | —     | —    |         |
| 8.6 | Тестируемая архитектура: зачем DI, как изолировать зависимости | 0     | —     | —    |         |
| 8.7 | BLoC-тесты: bloc_test, expectation sequences                   | 0     | —     | —    |         |
| 8.8 | Покрытие кода: когда важно, когда нет                          | 0     | —     | —    |         |


---

## 9. Производительность и оптимизация


| #   | Тема                                                              | count | score | last | заметки |
| --- | ----------------------------------------------------------------- | ----- | ----- | ---- | ------- |
| 9.1 | Build → Layout → Paint pipeline, когда что перезапускается        | 0     | —     | —    |         |
| 9.2 | const constructors, const widgets — зачем                         | 0     | —     | —    |         |
| 9.3 | RepaintBoundary: как и когда использовать                         | 0     | —     | —    |         |
| 9.4 | ListView.builder vs ListView, ленивая загрузка                    | 0     | —     | —    |         |
| 9.5 | Оптимизация изображений: кеш, resize, precache                    | 0     | —     | —    |         |
| 9.6 | Jank, shader compilation jank, SkSL warmup                        | 0     | —     | —    |         |
| 9.7 | DevTools: Performance overlay, Timeline, Memory profiler          | 0     | —     | —    |         |
| 9.8 | Утечки памяти: причины, диагностика, предотвращение               | 0     | —     | —    |         |
| 9.9 | Размер приложения: tree shaking, deferred components, obfuscation | 0     | —     | —    |         |


---

## 10. CI/CD и релизы


| #    | Тема                                                                | count | score | last | заметки |
| ---- | ------------------------------------------------------------------- | ----- | ----- | ---- | ------- |
| 10.1 | Flavors / environments: dev, staging, prod (dart-define, flavorizr) | 0     | —     | —    |         |
| 10.2 | CI/CD: GitHub Actions / GitLab CI / Codemagic для Flutter           | 0     | —     | —    |         |
| 10.3 | Code signing: Android (keystore) и iOS (provisioning profiles)      | 0     | —     | —    |         |
| 10.4 | Публикация: App Store / Google Play процесс и требования            | 0     | —     | —    |         |
| 10.5 | OTA-обновления: Shorebird, CodePush-аналоги                         | 0     | —     | —    |         |
| 10.6 | Crashlytics, Sentry — мониторинг ошибок в продакшене                | 0     | —     | —    |         |


---

## 11. Git и командная работа


| #    | Тема                                                     | count | score | last | заметки |
| ---- | -------------------------------------------------------- | ----- | ----- | ---- | ------- |
| 11.1 | Git flow: feature-ветки, rebase vs merge, squash         | 0     | —     | —    |         |
| 11.2 | Разрешение конфликтов, cherry-pick, bisect               | 0     | —     | —    |         |
| 11.3 | Code review: на что обращать внимание, как давать фидбек | 0     | —     | —    |         |
| 11.4 | Атомарные коммиты, conventional commits                  | 0     | —     | —    |         |


---

## 12. Платформы: Android / iOS


| #    | Тема                                                     | count | score | last | заметки |
| ---- | -------------------------------------------------------- | ----- | ----- | ---- | ------- |
| 12.1 | Permissions: запрос, обработка отказа, rationale         | 0     | —     | —    |         |
| 12.2 | Background execution: ограничения iOS vs Android         | 0     | —     | —    |         |
| 12.3 | Push-уведомления: FCM, APNs, flutter_local_notifications | 0     | —     | —    |         |
| 12.4 | Platform channels: вызов нативного кода                  | 0     | —     | —    |         |
| 12.5 | Различия Material vs Cupertino, адаптивные виджеты       | 0     | —     | —    |         |
| 12.6 | App lifecycle: различия платформ, suspend/resume         | 0     | —     | —    |         |


---

## 13. UI/UX


| #    | Тема                                                       | count | score | last | заметки |
| ---- | ---------------------------------------------------------- | ----- | ----- | ---- | ------- |
| 13.1 | Адаптивная вёрстка: MediaQuery, LayoutBuilder, breakpoints | 0     | —     | —    |         |
| 13.2 | Темизация: ThemeData, dark/light mode, dynamic color       | 0     | —     | —    |         |
| 13.3 | Анимации: implicit, explicit, AnimationController, Tween   | 0     | —     | —    |         |
| 13.4 | Hero, PageRouteBuilder, кастомные transitions              | 0     | —     | —    |         |
| 13.5 | Accessibility: Semantics, screen readers, contrast         | 0     | —     | —    |         |
| 13.6 | Интернационализация: intl, arb, локализация                | 0     | —     | —    |         |
| 13.7 | Работа по макетам из Figma: подходы и инструменты          | 0     | —     | —    |         |


---

## 14. Soft skills (Senior-уровень)


| #    | Тема                                                          | count | score | last | заметки |
| ---- | ------------------------------------------------------------- | ----- | ----- | ---- | ------- |
| 14.1 | Аргументация архитектурных решений (trade-offs, риски)        | 0     | —     | —    |         |
| 14.2 | Оценка задач: декомпозиция, story points, риски               | 0     | —     | —    |         |
| 14.3 | Менторинг: как обучать и давать обратную связь                | 0     | —     | —    |         |
| 14.4 | Взаимодействие с backend/дизайном/продуктом                   | 0     | —     | —    |         |
| 14.5 | Технические презентации и ADR (Architecture Decision Records) | 0     | —     | —    |         |


---

## Сводка прогресса


| Категория             | Тем     | Обсуждено (count>0) | Средний score | Слабые (score<3) |
| --------------------- | ------- | ------------------- | ------------- | ---------------- |
| 1. Dart               | 10      | 0                   | —             | —                |
| 2. Асинхронность      | 9       | 0                   | —             | —                |
| 3. Flutter ядро       | 14      | 0                   | —             | —                |
| 4. State Management   | 7       | 0                   | —             | —                |
| 5. Архитектура        | 9       | 0                   | —             | —                |
| 6. Навигация          | 5       | 0                   | —             | —                |
| 7. Сеть и данные      | 9       | 0                   | —             | —                |
| 8. Тестирование       | 8       | 0                   | —             | —                |
| 9. Производительность | 9       | 0                   | —             | —                |
| 10. CI/CD             | 6       | 0                   | —             | —                |
| 11. Git               | 4       | 0                   | —             | —                |
| 12. Платформы         | 6       | 0                   | —             | —                |
| 13. UI/UX             | 7       | 0                   | —             | —                |
| 14. Soft skills       | 5       | 0                   | —             | —                |
| **ИТОГО**             | **108** | **0**               | **—**         | **—**            |


