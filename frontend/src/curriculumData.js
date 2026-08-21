const levelDescriptions = {
  "Discovery": "Bangun rasa ingin tahu tentang dunia komputasi dan kenali bagaimana perangkat pintar bekerja di sekitar kita.",
  "C Programming": "Pelajari fondasi bahasa C yang menjadi bahasa utama untuk menulis firmware embedded yang terstruktur dan efisien.",
  "ESP32 & ESP-IDF": "Kenali arsitektur ESP32 dan alur kerja ESP-IDF, dari membuat project hingga menjalankannya di board.",
  "GPIO & Basic Peripheral": "Hubungkan program dengan dunia nyata melalui GPIO, sensor, aktuator, dan peripheral dasar ESP32.",
  "Embedded System Fundamentals": "Pahami cara sistem embedded merespons kejadian, mengatur waktu, dan menjaga data bersama tetap aman.",
  "FreeRTOS & RTOS": "Atur banyak pekerjaan secara bersamaan dengan task, scheduler, komunikasi antar-task, dan sinkronisasi FreeRTOS.",
  "Wi-Fi & Networking": "Hubungkan ESP32 ke jaringan dan layanan internet menggunakan konsep TCP/IP, HTTP, MQTT, dan IoT.",
  "Advanced Embedded & System Architecture": "Rancang sistem embedded yang modular, real-time, tangguh, hemat daya, dan mudah di-debug.",
  "Project & Mission": "Terapkan semua konsep melalui misi proyek nyata, dari smart LED sampai proyek IoT buatanmu sendiri.",
};

const rawCurriculum = [
  ["Discovery", ["Apa itu komputer", "Mikrokontroler", "Embedded system dalam kehidupan sehari-hari", "Komponen dasar", "Input-processing-output", "CPU-RAM-Flash", "GPIO & peripheral", "Firmware & hardware", "Mengapa menggunakan ESP32", "Pengenalan ESP32", "Gambaran umum ESP-IDF"]],
  ["C Programming", ["Struktur program C", "main() & app_main()", "Variable", "Data type", "Operator", "Percabangan (if/else, switch)", "Perulangan (for, while, do while)", "Function", "Parameter & return", "Array", "String", "Pointer & memory", "Struct", "typedef", "enum", "Bitwise operation", "Header & source file", "Scope", "Debugging dasar C"]],
  ["ESP32 & ESP-IDF", ["Arsitektur ESP32", "CPU & core", "Memory", "Flash & firmware", "GPIO overview", "Peripheral", "Struktur project ESP-IDF", "CMake dasar", "app_main()", "Component", "menuconfig", "Build", "Flash", "Serial Monitor", "Logging", "Error handling"]],
  ["GPIO & Basic Peripheral", ["GPIO input/output", "HIGH & LOW", "Pull-up/pull-down", "LED", "Button", "Button debounce", "GPIO configuration & interrupt dasar", "ADC & calibration", "Potentiometer", "PWM", "Duty cycle", "Frequency", "LED dimming", "Servo", "UART", "I2C", "SPI", "Display", "Sensor integration"]],
  ["Embedded System Fundamentals", ["Blocking vs non-blocking", "delay() & permasalahannya", "Software & Hardware timer", "Interrupt", "ISR", "Latency", "Debouncing", "Callback", "State Machine (FSM)", "Event-driven", "Polling vs interrupt", "Shared data", "Critical section", "Race condition dasar"]],
  ["FreeRTOS & RTOS", ["Apa itu RTOS", "Task", "Task lifecycle & creation", "Priority", "Scheduler", "Context switching", "vTaskDelay", "Periodic task", "Multitasking", "Dual-core", "Affinity", "Stack overflow", "Queue", "Producer-consumer", "Semaphore", "Mutex", "Critical section", "Race condition", "Deadlock", "Starvation", "Event Group", "Task notification", "Software timer", "Inter-task communication", "RTOS debugging"]],
  ["Wi-Fi & Networking", ["Jaringan komputer", "Client-server", "MAC", "IP", "DHCP", "DNS", "Router", "TCP/IP", "TCP", "UDP", "Socket", "Wi-Fi Station & AP", "Scanning", "Events", "Reconnection", "HTTP client/server", "REST API", "JSON", "WebSocket", "MQTT (publisher/subscriber)", "IoT architecture"]],
  ["Advanced Embedded & System Architecture", ["System/Task architecture", "Producer-consumer", "Event-driven", "Shared resource", "Synchronization", "Priority design", "Real-time constraints", "Timing analysis", "CPU utilization", "Memory management (stack/heap, fragmentation)", "Watchdog Timer", "Fault handling", "Error recovery", "Logging architecture", "Concurrency debugging", "Deadlock debugging", "Performance optimization", "Power management", "Modular software"]],
  ["Project & Mission", ["Smart LED", "Digital thermometer", "Smart sensor", "Mini weather station", "Digital control panel", "Smart lamp", "IoT monitoring", "Wi-Fi remote controller", "Web-controlled ESP32", "MQTT device", "Multitasking sensor", "RTOS controller", "Mini robot", "Smart home", "Smart agriculture", "Environmental monitoring", "Industrial automation simulator", "Autonomous system", "Custom IoT project", "Final project"]],
];

export const curriculumData = rawCurriculum.map(([title, lessons], index) => ({
  level: String(index),
  title,
  tag: index < 2 ? "Beginner" : index < 5 ? "Intermediate" : "Advanced",
  description: levelDescriptions[title],
  lessons: lessons.map((name, lessonIndex) => ({
    id: `${index}-${lessonIndex}`,
    name,
    description: `Dalam materi ini, kamu akan memahami ${name.toLowerCase()} melalui contoh sederhana dan latihan yang bisa diterapkan pada ESP32.`,
  })),
}));

export const initialLesson = curriculumData[0].lessons[0];