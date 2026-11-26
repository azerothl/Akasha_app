#!/usr/bin/env bash
# Akasha one-liner bootstrap (Linux / macOS)
# Downloads the full zip from azerothl/Akasha_app releases, extracts, runs setup.
# Invoke: curl -sSL https://raw.githubusercontent.com/azerothl/Akasha_app/main/scripts/get-akasha.sh | bash

set -e

REPO="azerothl/Akasha_app"
BASE_URL="https://github.com/${REPO}/releases/latest/download"

# Detect OS and arch
OS=""
ARCH=""
case "$(uname -s)" in
    Linux)  OS="linux" ;;
    Darwin) OS="macos" ;;
    *)      echo "Unsupported OS: $(uname -s)" >&2; exit 1 ;;
esac
case "$(uname -m)" in
    x86_64|amd64) ARCH="x86_64" ;;
    aarch64|arm64) ARCH="aarch64" ;;
    *)      echo "Unsupported arch: $(uname -m)" >&2; exit 1 ;;
esac

if [[ "$OS" == "linux" ]]; then
    if [[ "$ARCH" != "x86_64" ]]; then
        echo "No prebuilt Akasha package is available for Linux $ARCH." >&2
        exit 1
    fi
    SUFFIX="linux-x86_64"
elif [[ "$OS" == "macos" && "$ARCH" == "aarch64" ]]; then
    SUFFIX="macos-aarch64"
else
    SUFFIX="macos-x86_64"
fi

ZIP_URL="${BASE_URL}/akasha-full-${SUFFIX}.zip"
TMPDIR="$(mktemp -d)"
trap 'rm -rf "$TMPDIR"' EXIT

echo "=== Akasha installation (one-liner) ==="
echo "This script will download Akasha from ${REPO} and run the installer."
echo "URL: $ZIP_URL"
# stdin may be the installer source when Bash is reading from a pipe.
if { : </dev/tty; } 2>/dev/null; then
    exec 3</dev/tty
    if ! read -r -p "Continue? [Y/n] " r <&3 || [[ "$r" =~ ^[nN] ]]; then
        echo "Aborted."
        exit 0
    fi
else
    exec 3</dev/null
fi

echo "Downloading..."
if command -v curl &>/dev/null; then
    curl -fsSL -o "$TMPDIR/akasha-full.zip" "$ZIP_URL"
else
    wget -q -O "$TMPDIR/akasha-full.zip" "$ZIP_URL"
fi
if [[ ! -s "$TMPDIR/akasha-full.zip" ]]; then
    echo "Download failed or empty." >&2
    exit 1
fi

echo "Extracting..."
(cd "$TMPDIR" && unzip -q -o akasha-full.zip)
EXTRACTED_ROOT="$TMPDIR"
if [[ ! -f "$TMPDIR/akasha" ]]; then
    SUB="$(find "$TMPDIR" -maxdepth 1 -type d ! -path "$TMPDIR" | head -1)"
    [[ -n "$SUB" ]] && EXTRACTED_ROOT="$SUB"
fi
SETUP_SCRIPT="$EXTRACTED_ROOT/scripts/setup.sh"
if [[ ! -f "$SETUP_SCRIPT" ]]; then
    echo "setup.sh not found in the downloaded package." >&2
    exit 1
fi
chmod +x "$SETUP_SCRIPT"
if [[ -f "$EXTRACTED_ROOT/scripts/install.sh" ]]; then
    chmod +x "$EXTRACTED_ROOT/scripts/install.sh"
fi

echo "Running installer..."
(cd "$EXTRACTED_ROOT" && ./scripts/setup.sh --auto-start <&3)

AKASHA_CMD=""
for d in /usr/local/bin "$HOME/.local/bin"; do
    if [[ -x "$d/akasha" ]]; then
        AKASHA_CMD="$d/akasha"
        export PATH="$d:$PATH"
        break
    fi
done
if [[ -n "$AKASHA_CMD" ]] &&
    read -r -p "Lancer l'assistant de configuration maintenant ? [Y/n] " r <&3 &&
    [[ ! "$r" =~ ^[nN] ]]; then
    "$AKASHA_CMD" init <&3 || true
    echo "You can also run: akasha tui   (terminal UI)"
fi

echo "Installation complete."
