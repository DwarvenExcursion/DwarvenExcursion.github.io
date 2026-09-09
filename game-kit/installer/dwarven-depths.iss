; ============================================================
;  Dwarven Depths - Windows installer
;  Built with Inno Setup 6.  https://jrsoftware.org/isdl.php
;
;  Build locally:
;      iscc /DAppVersion=0.4.2 dwarven-depths.iss
;
;  The release workflow passes the version in the same way, so this
;  file never has a version number hard-coded into it.
;
;  This script is written so the SAME installer does first-time installs
;  and in-place upgrades. That is what lets the game update itself: it
;  downloads this exe and runs it with /SILENT.
; ============================================================

#ifndef AppVersion
  #define AppVersion "0.0.0"
#endif

#define AppName    "Dwarven Depths"
#define Publisher  "Dwarven Engineering"
#define AppURL     "https://dwarvenengineering.com/dwarven-depths"
#define ExeName    "DwarvenDepths.exe"

; Where the Godot export lands. Adjust if your export preset differs.
#define SourceDir  "..\..\GameExports\windows"

[Setup]
; This GUID identifies the application to Windows. It MUST stay the same
; forever - changing it makes every future installer look like a
; different program and upgrades stop replacing the old install.
AppId={{8C3F1A64-2D7E-4B95-9E21-6F0A5D3C8B47}

AppName={#AppName}
AppVersion={#AppVersion}
AppVerName={#AppName} {#AppVersion}
AppPublisher={#Publisher}
AppPublisherURL={#AppURL}
AppSupportURL={#AppURL}
AppUpdatesURL={#AppURL}

; Per-user install: no UAC prompt, which matters a great deal when the
; game is launching the installer itself. An elevation dialog the player
; did not ask for is how an auto-updater gets mistaken for malware.
PrivilegesRequired=lowest
DefaultDirName={autopf}\{#AppName}
DefaultGroupName={#AppName}
DisableProgramGroupPage=yes
DisableDirPage=auto

OutputDir=..\..\dist
OutputBaseFilename=DwarvenDepths-{#AppVersion}-setup
SetupIconFile=..\..\icon.ico
UninstallDisplayIcon={app}\{#ExeName}
UninstallDisplayName={#AppName}

Compression=lzma2/max
SolidCompression=yes
WizardStyle=modern
ArchitecturesInstallIn64BitMode=x64compatible

; Let the installer shut the running game down instead of failing on a
; locked file. The updater passes /CLOSEAPPLICATIONS to use this.
CloseApplications=yes
RestartApplications=no

[Languages]
Name: "english"; MessagesFile: "compiler:Default.isl"

[Tasks]
Name: "desktopicon"; Description: "Create a desktop shortcut"; GroupDescription: "Shortcuts:"

[Files]
Source: "{#SourceDir}\{#ExeName}"; DestDir: "{app}"; Flags: ignoreversion
; Godot exports the .pck alongside the exe unless you embed it. Harmless
; if absent thanks to skipifsourcedoesntexist.
Source: "{#SourceDir}\*.pck";     DestDir: "{app}"; Flags: ignoreversion skipifsourcedoesntexist
Source: "{#SourceDir}\*.dll";     DestDir: "{app}"; Flags: ignoreversion skipifsourcedoesntexist

[Icons]
Name: "{group}\{#AppName}";        Filename: "{app}\{#ExeName}"
Name: "{group}\Uninstall {#AppName}"; Filename: "{uninstallexe}"
Name: "{autodesktop}\{#AppName}";  Filename: "{app}\{#ExeName}"; Tasks: desktopicon

[Run]
; On a normal install, offer to launch. On a silent upgrade the game
; relaunches itself, so skip it - `runasoriginaluser` keeps the game out
; of any elevated context.
Filename: "{app}\{#ExeName}"; Description: "Launch {#AppName}"; \
  Flags: nowait postinstall skipifsilent runasoriginaluser

[UninstallDelete]
; The downloaded installers the updater leaves behind in the user data
; folder. Godot's user:// on Windows maps to %APPDATA%\Godot\app_userdata.
Type: filesandordirs; Name: "{userappdata}\Godot\app_userdata\{#AppName}\update"
