# AudLock
*Your secrets, hidden in sound waves*

**AudLock** is a secure steganography tool that hides encrypted messages within `.wav` audio files using least significant bit (LSB) encoding combined with AES encryption. It includes a Next.js frontend and a serverless Express.js backend deployed on AWS Lambda.

---

## Features

- AES-256 encryption of messages using a user-provided key
- LSB-based steganography for embedding data in `.wav` audio
- Secure message extraction with key-based decryption
- Backend served using Express.js on AWS Lambda

---

## Tech Stack

### Frontend
- Next.js (React)
- Tailwind CSS
- TypeScript

### Backend
- Express.js
- AWS Lambda (via `serverless-http`)
- Multer for file uploads
- crypto-js for AES encryption
- Custom logic for LSB encoding/decoding of audio buffers

---

## Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/audlock.git
cd audlock
