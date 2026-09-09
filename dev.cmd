@echo off
REM Node was installed mid-session, so the app's PATH is stale.
REM This wrapper can be deleted once your shell picks up Node normally.
set "PATH=%PATH%;C:\Program Files\nodejs"
npm run dev
