# NIELIT Buxer - Backend

This is a minimal Express + MongoDB backend to accept registrations from the frontend.

Setup
1. Copy `.env.example` to `.env` and set `MONGO_URI`.
2. Install dependencies and run server:

```powershell
cd server
npm install
# start (or use npm run dev with nodemon)
npm run dev
```

API
- `POST /api/register` - multipart/form-data fields and files:
  - fields: `name`, `fatherName`, `motherName`, `mobile`, `whatsapp`, `email`, `aadhar`, `highestQualification`, `pincode`, `state`, `district`, `postOffice`, `address`, `dateOfBirth`, `gender`, `category`
  - files: `photo` (image, max 500KB), `marksheet` (pdf, max 2MB), `idProof` (pdf, max 2MB), `casteCertificate` (pdf, max 2MB, conditional)

The server stores uploaded files to `server/uploads` and stores relative paths in MongoDB.
