# Embedded for Kids — PRD

## Problem Statement
Aplikasi web edukasi 'Embedded for Kids' berbasis React + TailwindCSS untuk mengajarkan ESP32 dan ESP-IDF kepada siswa. Skema warna oranye-putih-abu, sidebar navigasi kurikulum + Playground, area konten utama, header dengan breadcrumb, search, dan profil user.

## User Personas
- Siswa pemula (SD-SMP) yang penasaran dengan mikrokontroler.
- Siswa lanjut yang siap masuk ke FreeRTOS + Wi-Fi.
- Guru/mentor yang ingin memandu praktik langsung tanpa perlu perangkat keras.

## Architecture (frontend-only)
- React 19 + CRA + TailwindCSS + Shadcn UI komponen.
- Modularisasi: `components/*` (Sidebar, Header, Onboarding, DonationModal, ProfilePopover, CurriculumContent, PlaygroundContent, PlaygroundDetail, CodePanel, SimulationPanel, SerialPanel).
- State user disimpan di `localStorage` (kunci `embedded-for-kids-profile`).
- Syntax highlighting via `react-syntax-highlighter` (Prism/oneLight).
- Web Serial via native `navigator.serial` (opsional untuk perangkat nyata).

## Core Requirements
1. Onboarding: masukkan nama + pilih titik mulai (Beginner/Intermediate/Advanced) atau skip.
2. Sidebar responsif: mode kurikulum akademis atau ESP32 Playground; bisa collapse jadi icon rail.
3. Header: breadcrumb, live search, tombol donasi, ikon profil clickable.
4. Kurikulum: 9 level (Discovery → Project & Mission) dengan lesson interaktif.
5. Playground: 12 modul eksperimen (First Spark s/d Create Your Own).
6. Playground Detail: tutorial Do/See/Break/Understand + code C/ESP-IDF dengan syntax highlighting + panel eksekusi dual-mode (Simulasi lokal atau Perangkat Nyata via Web Serial).

## What's been implemented (Feb 2026)
- Onboarding flow + localStorage profile.
- Sidebar (expanded + icon-rail collapsed) dengan tombol donasi permanen.
- Header dengan hamburger toggle, live search (kurikulum + playground), donasi + profil popover.
- ProfilePopover: nama, level, progress, tombol reset perjalanan.
- DonationModal reopenable dari header, sidebar, atau collapsed rail.
- Kurikulum lengkap 9 level.
- Playground summary dengan Challenge & Discovery strips (ikon center).
- Playground Detail Page: tutorial tabs, code panel (react-syntax-highlighter + click-line explain), Dual Mode Simulasi / Perangkat Nyata.
- SimulationPanel: LED, tombol, potensiometer, sensor cahaya, Wi-Fi, multi-task, virtual serial monitor.
- SerialPanel: Web Serial API (Hubungkan Port, Baud selector, Kirim Perintah, Bersihkan, Serial Monitor).
- Testing iteration 5: 17/17 flow pass, tidak ada bug kritis.

## Backlog
### P1
- Sinkronisasi progres belajar dengan backend & multi-device.
- Auto-checklist tantangan Playground.
- Simpan draft kode user per modul.

### P2
- Mode dark theme opsional.
- Leaderboard mini per kelas.
- Ekspor sertifikat setelah menyelesaikan level.
- Voice-over bahasa Indonesia untuk tutorial.

## Known Mocks
- Progres user disimpan lokal (localStorage).
- QRIS placeholder statis (bukan pembayaran nyata).
- Simulasi ESP32 = animasi UI lokal (bukan emulator asli).
- Web Serial hanya bekerja di Chromium desktop dengan HTTPS.
