@echo off
rem LangFlash native-TTS helper (needed for Farsi voice on Windows browsers)
cd /d "%~dp0"
python tts_server.py %*
