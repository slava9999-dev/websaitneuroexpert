# 🎯 Требования для Google Studio / Flutter

> **Для разработки в:** Android Studio / Google IDX / Flutter  
> **Альтернатива React Native из основного ТЗ**  
> **Дата:** 2025-01-10

---

## 📱 Выбор: Flutter Framework

### Почему Flutter для NeuroExpert?

**Преимущества Flutter:**
✅ **Единая кодовая база** для iOS и Android  
✅ **Быстрая разработка** с Hot Reload  
✅ **Нативная производительность**  
✅ **Красивые анимации** из коробки  
✅ **Material Design** и Cupertino widgets  
✅ **Поддержка Google** и огромное сообщество  
✅ **Dart язык** — простой в освоении  

**Сравнение с React Native:**
- Flutter быстрее на 20-30%
- Меньше проблем с производительностью
- Лучше для сложных анимаций
- Но требует изучения нового языка (Dart)

---

## 🛠 Технологический стек Flutter

### Core Framework
```yaml
dependencies:
  flutter: sdk: flutter
  cupertino_icons: ^1.0.6
  
  # State Management
  provider: ^6.1.1
  riverpod: ^2.4.9
  # ИЛИ
  bloc: ^8.1.3
  flutter_bloc: ^8.1.3
  
  # Navigation
  go_router: ^13.0.0
  
  # HTTP & API
  dio: ^5.4.0
  retrofit: ^4.0.3
  json_annotation: ^4.8.1
  
  # Local Storage
  shared_preferences: ^2.2.2
  hive: ^2.2.3
  hive_flutter: ^1.1.0
  
  # UI Components
  flutter_svg: ^2.0.9
  cached_network_image: ^3.3.1
  shimmer: ^3.0.0
  lottie: ^3.0.0
  
  # Forms & Validation
  flutter_form_builder: ^9.1.1
  form_builder_validators: ^9.1.0
  
  # Push Notifications
  firebase_core: ^2.24.2
  firebase_messaging: ^14.7.9
  firebase_analytics: ^10.8.0
  
  # Analytics & Monitoring
  sentry_flutter: ^7.14.0
  
  # Utilities
  intl: ^0.19.0
  equatable: ^2.0.5
  freezed_annotation: ^2.4.1
  
dev_dependencies:
  flutter_test: sdk: flutter
  build_runner: ^2.4.7
  json_serializable: ^6.7.1
  freezed: ^2.4.6
  flutter_launcher_icons: ^0.13.1
  flutter_native_splash: ^2.3.8
  mockito: ^5.4.4
```

---

## 📐 Архитектура приложения

### Clean Architecture + BLoC/Riverpod

```
lib/
├── main.dart
├── app/
│   ├── app.dart
│   ├── routes.dart
│   └── theme.dart
├── core/
│   ├── constants/
│   │   ├── app_constants.dart
│   │   ├── api_constants.dart
│   │   └── assets.dart
│   ├── utils/
│   │   ├── validators.dart
│   │   ├── formatters.dart
│   │   └── extensions.dart
│   ├── errors/
│   │   ├── failures.dart
│   │   └── exceptions.dart
│   └── network/
│       ├── dio_client.dart
│       └── api_interceptor.dart
├── features/
│   ├── onboarding/
│   │   ├── presentation/
│   │   │   ├── pages/
│   │   │   ├── widgets/
│   │   │   └── bloc/
│   │   ├── domain/
│   │   │   ├── entities/
│   │   │   └── repositories/
│   │   └── data/
│   │       ├── models/
│   │       ├── datasources/
│   │       └── repositories/
│   ├── home/
│   ├── chat/
│   ├── services/
│   ├── contact/
│   ├── portfolio/
│   └── profile/
└── shared/
    ├── widgets/
    │   ├── buttons/
    │   ├── inputs/
    │   ├── cards/
    │   └── loaders/
    └── models/
```

---

## 🎨 Дизайн-система для Flutter

### Theme Configuration

```dart
// lib/app/theme.dart

import 'package:flutter/material.dart';

class AppTheme {
  // Colors (из веб-платформы)
  static const Color primary = Color(0xFF6366F1);
  static const Color secondary = Color(0xFF8B5CF6);
  static const Color accent = Color(0xFFEC4899);
  static const Color success = Color(0xFF10B981);
  static const Color warning = Color(0xFFF59E0B);
  static const Color error = Color(0xFFEF4444);
  static const Color background = Color(0xFFF9FAFB);
  static const Color surface = Color(0xFFFFFFFF);
  static const Color textPrimary = Color(0xFF111827);
  static const Color textSecondary = Color(0xFF6B7280);
  
  static ThemeData lightTheme = ThemeData(
    useMaterial3: true,
    colorScheme: ColorScheme.fromSeed(
      seedColor: primary,
      primary: primary,
      secondary: secondary,
      error: error,
      background: background,
      surface: surface,
    ),
    
    textTheme: const TextTheme(
      displayLarge: TextStyle(
        fontSize: 32,
        fontWeight: FontWeight.bold,
        color: textPrimary,
      ),
      displayMedium: TextStyle(
        fontSize: 24,
        fontWeight: FontWeight.bold,
        color: textPrimary,
      ),
      titleLarge: TextStyle(
        fontSize: 20,
        fontWeight: FontWeight.w600,
        color: textPrimary,
      ),
      bodyLarge: TextStyle(
        fontSize: 16,
        color: textPrimary,
      ),
      bodyMedium: TextStyle(
        fontSize: 14,
        color: textSecondary,
      ),
    ),
    
    elevatedButtonTheme: ElevatedButtonThemeData(
      style: ElevatedButton.styleFrom(
        backgroundColor: primary,
        foregroundColor: Colors.white,
        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(12),
        ),
        elevation: 0,
      ),
    ),
    
    inputDecorationTheme: InputDecorationTheme(
      filled: true,
      fillColor: Colors.grey[100],
      border: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: BorderSide.none,
      ),
      focusedBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: const BorderSide(color: primary, width: 2),
      ),
    ),
  );
  
  static ThemeData darkTheme = ThemeData(
    useMaterial3: true,
    brightness: Brightness.dark,
    colorScheme: ColorScheme.fromSeed(
      seedColor: primary,
      brightness: Brightness.dark,
    ),
  );
}
```

---

## 🔌 API Integration (Dio + Retrofit)

### API Client Setup

```dart
// lib/core/network/dio_client.dart

import 'package:dio/dio.dart';
import 'package:flutter/foundation.dart';

class DioClient {
  static const String _baseUrl = kReleaseMode
      ? 'https://neuroexpert.vercel.app/api'
      : 'http://localhost:8000/api';
      
  late final Dio _dio;
  
  DioClient() {
    _dio = Dio(
      BaseOptions(
        baseUrl: _baseUrl,
        connectTimeout: const Duration(seconds: 30),
        receiveTimeout: const Duration(seconds: 30),
        headers: {
          'Content-Type': 'application/json',
        },
      ),
    );
    
    _dio.interceptors.addAll([
      LogInterceptor(
        requestBody: true,
        responseBody: true,
        logPrint: (obj) => debugPrint(obj.toString()),
      ),
      AuthInterceptor(),
      ErrorInterceptor(),
    ]);
  }
  
  Dio get dio => _dio;
}

// lib/core/network/api_service.dart
import 'package:retrofit/retrofit.dart';
import 'package:dio/dio.dart';

part 'api_service.g.dart';

@RestApi()
abstract class ApiService {
  factory ApiService(Dio dio, {String baseUrl}) = _ApiService;
  
  // Chat API
  @POST('/chat')
  Future<ChatResponse> sendChatMessage(@Body() ChatRequest request);
  
  // Contact Form
  @POST('/contact')
  Future<ContactResponse> submitContactForm(@Body() ContactRequest request);
  
  // Services
  @GET('/services')
  Future<List<Service>> getServices();
  
  @GET('/services/{id}')
  Future<Service> getServiceById(@Path('id') String id);
  
  // Portfolio
  @GET('/portfolio')
  Future<List<Project>> getPortfolio();
  
  // Health Check
  @GET('/health')
  Future<HealthResponse> healthCheck();
}
```

---

## 📱 Ключевые экраны (Flutter Implementation)

### 1. Onboarding Screen

```dart
// lib/features/onboarding/presentation/pages/onboarding_page.dart

import 'package:flutter/material.dart';
import 'package:smooth_page_indicator/smooth_page_indicator.dart';

class OnboardingPage extends StatefulWidget {
  const OnboardingPage({Key? key}) : super(key: key);

  @override
  State<OnboardingPage> createState() => _OnboardingPageState();
}

class _OnboardingPageState extends State<OnboardingPage> {
  final PageController _pageController = PageController();
  int _currentPage = 0;

  final List<OnboardingData> _pages = [
    OnboardingData(
      title: 'AI-консультант 24/7',
      description: 'Получите мгновенный ответ на любой вопрос о наших услугах',
      image: 'assets/images/onboarding_1.svg',
    ),
    OnboardingData(
      title: 'Быстрая заявка',
      description: 'Оформите заказ за 2 минуты прямо из приложения',
      image: 'assets/images/onboarding_2.svg',
    ),
    OnboardingData(
      title: 'Отслеживайте проекты',
      description: 'Контролируйте статус и общайтесь с командой',
      image: 'assets/images/onboarding_3.svg',
    ),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Column(
          children: [
            // Skip Button
            Align(
              alignment: Alignment.topRight,
              child: TextButton(
                onPressed: _skipOnboarding,
                child: const Text('Пропустить'),
              ),
            ),
            
            // Page View
            Expanded(
              child: PageView.builder(
                controller: _pageController,
                onPageChanged: (index) {
                  setState(() => _currentPage = index);
                },
                itemCount: _pages.length,
                itemBuilder: (context, index) {
                  return OnboardingCard(data: _pages[index]);
                },
              ),
            ),
            
            // Page Indicator
            SmoothPageIndicator(
              controller: _pageController,
              count: _pages.length,
              effect: const WormEffect(
                dotHeight: 8,
                dotWidth: 8,
                activeDotColor: AppTheme.primary,
              ),
            ),
            
            const SizedBox(height: 24),
            
            // Next/Get Started Button
            Padding(
              padding: const EdgeInsets.all(24),
              child: SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: _currentPage == _pages.length - 1
                      ? _completeOnboarding
                      : _nextPage,
                  child: Text(
                    _currentPage == _pages.length - 1
                        ? 'Начать'
                        : 'Далее',
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  void _nextPage() {
    _pageController.nextPage(
      duration: const Duration(milliseconds: 300),
      curve: Curves.easeInOut,
    );
  }

  void _skipOnboarding() {
    // Navigate to home and mark onboarding as completed
    Navigator.of(context).pushReplacementNamed('/home');
  }

  void _completeOnboarding() {
    // Save onboarding completion status and navigate
    _skipOnboarding();
  }
}
```

### 2. AI Chat Screen

```dart
// lib/features/chat/presentation/pages/chat_page.dart

import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

class ChatPage extends StatefulWidget {
  const ChatPage({Key? key}) : super(key: key);

  @override
  State<ChatPage> createState() => _ChatPageState();
}

class _ChatPageState extends State<ChatPage> {
  final TextEditingController _messageController = TextEditingController();
  final ScrollController _scrollController = ScrollController();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('AI-Консультант'),
        actions: [
          IconButton(
            icon: const Icon(Icons.delete_outline),
            onPressed: _showClearHistoryDialog,
          ),
        ],
      ),
      body: Column(
        children: [
          // Quick Replies (FAQ Chips)
          _buildQuickReplies(),
          
          // Messages List
          Expanded(
            child: BlocBuilder<ChatBloc, ChatState>(
              builder: (context, state) {
                if (state is ChatLoading) {
                  return const Center(child: CircularProgressIndicator());
                }
                
                if (state is ChatLoaded) {
                  return ListView.builder(
                    controller: _scrollController,
                    padding: const EdgeInsets.all(16),
                    itemCount: state.messages.length,
                    itemBuilder: (context, index) {
                      final message = state.messages[index];
                      return ChatBubble(
                        message: message,
                        isUser: message.role == 'user',
                      );
                    },
                  );
                }
                
                if (state is ChatError) {
                  return Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        const Icon(Icons.error_outline, size: 64),
                        const SizedBox(height: 16),
                        Text(state.message),
                        const SizedBox(height: 16),
                        ElevatedButton(
                          onPressed: () {
                            context.read<ChatBloc>().add(LoadChatHistory());
                          },
                          child: const Text('Повторить'),
                        ),
                      ],
                    ),
                  );
                }
                
                return const SizedBox.shrink();
              },
            ),
          ),
          
          // Typing Indicator
          BlocBuilder<ChatBloc, ChatState>(
            builder: (context, state) {
              if (state is ChatSending) {
                return const Padding(
                  padding: EdgeInsets.all(16),
                  child: Row(
                    children: [
                      CircularProgressIndicator(),
                      SizedBox(width: 16),
                      Text('AI печатает...'),
                    ],
                  ),
                );
              }
              return const SizedBox.shrink();
            },
          ),
          
          // Message Input
          _buildMessageInput(),
        ],
      ),
    );
  }

  Widget _buildQuickReplies() {
    final quickReplies = [
      'Расскажите о услугах',
      'Сколько стоит AI-ассистент?',
      'Как заказать аудит?',
    ];
    
    return Container(
      height: 60,
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: ListView.builder(
        scrollDirection: Axis.horizontal,
        itemCount: quickReplies.length,
        itemBuilder: (context, index) {
          return Padding(
            padding: const EdgeInsets.only(right: 8),
            child: ActionChip(
              label: Text(quickReplies[index]),
              onPressed: () => _sendMessage(quickReplies[index]),
            ),
          );
        },
      ),
    );
  }

  Widget _buildMessageInput() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 10,
            offset: const Offset(0, -2),
          ),
        ],
      ),
      child: Row(
        children: [
          Expanded(
            child: TextField(
              controller: _messageController,
              decoration: const InputDecoration(
                hintText: 'Введите сообщение...',
                border: InputBorder.none,
              ),
              maxLines: null,
              textCapitalization: TextCapitalization.sentences,
            ),
          ),
          const SizedBox(width: 8),
          IconButton.filled(
            icon: const Icon(Icons.send),
            onPressed: () => _sendMessage(_messageController.text),
          ),
        ],
      ),
    );
  }

  void _sendMessage(String text) {
    if (text.trim().isEmpty) return;
    
    context.read<ChatBloc>().add(SendChatMessage(text));
    _messageController.clear();
    
    // Scroll to bottom
    Future.delayed(const Duration(milliseconds: 300), () {
      _scrollController.animateTo(
        _scrollController.position.maxScrollExtent,
        duration: const Duration(milliseconds: 300),
        curve: Curves.easeOut,
      );
    });
  }

  void _showClearHistoryDialog() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Очистить историю?'),
        content: const Text(
          'Вся история чата будет удалена. Это действие нельзя отменить.',
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Отмена'),
          ),
          TextButton(
            onPressed: () {
              context.read<ChatBloc>().add(ClearChatHistory());
              Navigator.pop(context);
            },
            child: const Text('Очистить'),
          ),
        ],
      ),
    );
  }

  @override
  void dispose() {
    _messageController.dispose();
    _scrollController.dispose();
    super.dispose();
  }
}
```

---

## 🧪 Тестирование Flutter

### Unit Tests

```dart
// test/features/chat/domain/usecases/send_message_test.dart

import 'package:flutter_test/flutter_test.dart';
import 'package:mockito/mockito.dart';

void main() {
  group('SendMessageUseCase', () {
    late SendMessageUseCase useCase;
    late MockChatRepository mockRepository;

    setUp(() {
      mockRepository = MockChatRepository();
      useCase = SendMessageUseCase(mockRepository);
    });

    test('should send message successfully', () async {
      // Arrange
      final message = ChatMessage(
        text: 'Hello',
        role: 'user',
        timestamp: DateTime.now(),
      );
      when(mockRepository.sendMessage(any))
          .thenAnswer((_) async => Right(mockResponse));

      // Act
      final result = await useCase(message);

      // Assert
      expect(result.isRight(), true);
      verify(mockRepository.sendMessage(message));
      verifyNoMoreInteractions(mockRepository);
    });
  });
}
```

### Widget Tests

```dart
// test/features/chat/presentation/widgets/chat_bubble_test.dart

import 'package:flutter/material.dart';
import 'package:flutter_test.dart';

void main() {
  testWidgets('ChatBubble displays user message correctly',
      (WidgetTester tester) async {
    // Arrange
    const message = ChatMessage(text: 'Hello', role: 'user');

    // Act
    await tester.pumpWidget(
      MaterialApp(
        home: Scaffold(
          body: ChatBubble(message: message, isUser: true),
        ),
      ),
    );

    // Assert
    expect(find.text('Hello'), findsOneWidget);
    expect(find.byType(ChatBubble), findsOneWidget);
  });
}
```

---

## 🚀 Deployment для Flutter

### Build Commands

```bash
# Android (APK)
flutter build apk --release

# Android (App Bundle для Play Store)
flutter build appbundle --release

# iOS
flutter build ios --release

# Запуск на эмуляторе
flutter run

# Запуск на конкретном устройстве
flutter run -d <device_id>

# Проверка устройств
flutter devices
```

### GitHub Actions CI/CD

```yaml
# .github/workflows/flutter-ci.yml

name: Flutter CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - uses: subosito/flutter-action@v2
        with:
          flutter-version: '3.16.0'
          
      - name: Install dependencies
        run: flutter pub get
        
      - name: Analyze
        run: flutter analyze
        
      - name: Run tests
        run: flutter test --coverage
        
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          file: coverage/lcov.info

  build-android:
    needs: test
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      - uses: subosito/flutter-action@v2
      - run: flutter pub get
      - run: flutter build apk --release
      - uses: actions/upload-artifact@v3
        with:
          name: android-apk
          path: build/app/outputs/flutter-apk/

  build-ios:
    needs: test
    runs-on: macos-latest
    
    steps:
      - uses: actions/checkout@v3
      - uses: subosito/flutter-action@v2
      - run: flutter pub get
      - run: flutter build ios --release --no-codesign
```

---

## 📊 Аналитика и Мониторинг

### Firebase Setup

```dart
// lib/core/services/analytics_service.dart

import 'package:firebase_analytics/firebase_analytics.dart';

class AnalyticsService {
  static final FirebaseAnalytics _analytics = FirebaseAnalytics.instance;
  
  // Screen tracking
  static Future<void> logScreenView(String screenName) async {
    await _analytics.logScreenView(screenName: screenName);
  }
  
  // Events
  static Future<void> logChatMessageSent(int messageLength) async {
    await _analytics.logEvent(
      name: 'chat_message_sent',
      parameters: {'message_length': messageLength},
    );
  }
  
  static Future<void> logServiceViewed(String serviceId) async {
    await _analytics.logEvent(
      name: 'service_viewed',
      parameters: {'service_id': serviceId},
    );
  }
  
  static Future<void> logContactFormSubmitted(String service) async {
    await _analytics.logEvent(
      name: 'contact_form_submitted',
      parameters: {'service': service},
    );
  }
}
```

### Sentry Integration

```dart
// lib/main.dart

import 'package:sentry_flutter/sentry_flutter.dart';

Future<void> main() async {
  await SentryFlutter.init(
    (options) {
      options.dsn = 'YOUR_SENTRY_DSN';
      options.environment = kReleaseMode ? 'production' : 'development';
      options.tracesSampleRate = 1.0;
    },
    appRunner: () => runApp(const MyApp()),
  );
}
```

---

## ✅ Чеклист перед запуском

### Pre-Launch Checklist

- [ ] **Функциональность**
  - [ ] Все экраны работают
  - [ ] AI-чат отвечает корректно
  - [ ] Формы валидируются
  - [ ] Push-уведомления приходят
  
- [ ] **Производительность**
  - [ ] FPS ≥ 60
  - [ ] Время запуска < 2 сек
  - [ ] Нет утечек памяти
  
- [ ] **Дизайн**
  - [ ] Соответствует макетам Figma
  - [ ] Адаптивность на разных экранах
  - [ ] Темная тема (если есть)
  
- [ ] **Тестирование**
  - [ ] Unit tests pass
  - [ ] Widget tests pass
  - [ ] E2E тесты пройдены
  - [ ] Ручное тестирование
  
- [ ] **Безопасность**
  - [ ] API keys в .env
  - [ ] SSL pinning
  - [ ] Нет hardcoded secrets
  
- [ ] **Магазины приложений**
  - [ ] Иконки всех размеров
  - [ ] Скриншоты (iOS: 5-10, Android: 2-8)
  - [ ] Описание и ключевые слова
  - [ ] Политика конфиденциальности

---

## 🎓 Ресурсы для изучения

### Официальная документация
- [Flutter docs](https://docs.flutter.dev)
- [Dart language tour](https://dart.dev/guides/language/language-tour)
- [Flutter cookbook](https://docs.flutter.dev/cookbook)

### Рекомендуемые курсы
- Angela Yu - Complete Flutter Development Bootcamp
- Maximilian Schwarzmüller - Flutter & Dart Guide
- Flutter in Focus (YouTube)

### Полезные пакеты
- [pub.dev](https://pub.dev) - все Flutter пакеты
- [FlutterGems](https://fluttergems.dev) - кураторский список пакетов

---

**Итоговый выбор:** Flutter рекомендуется для NeuroExpert из-за лучшей производительности и красивых нативных анимаций, особенно для AI-чата и сложных UI взаимодействий.
