package main

import (
	"archive/zip"
	"bytes"
	"encoding/binary"
	"fmt"
	"io"
	"net/http"
	"os"
	"os/exec"
	"path/filepath"
	"runtime"
	"strings"
	"time"
)

// ── Archivos del Gradle Wrapper embebidos en el binario ────────────────────────
// Están en la subcarpeta embed/ relativa a este archivo .go.
// Se copian ahí durante el build del proyecto (ver launcher/build.ps1).

// ── ANSI colors ───────────────────────────────────────────────────────────────
const (
	reset  = "\033[0m"
	cyan   = "\033[96m"
	yellow = "\033[93m"
	green  = "\033[92m"
	red    = "\033[91m"
	gray   = "\033[90m"
	bold   = "\033[1m"
)

// magic es la firma de 8 bytes que marca el inicio del ZIP adjunto al final del exe.
// Estructura del final del binario: [...exe bytes...][zip data][magic 8 bytes][zip size 8 bytes little-endian]
var magic = []byte("LZFG_ZIP")

func banner() {
	fmt.Println()
	fmt.Println(yellow + bold + "  ╔══════════════════════════════════════════╗" + reset)
	fmt.Println(yellow + bold + "  ║          L A Z Y   F O R G E            ║" + reset)
	fmt.Println(yellow + bold + "  ║       Compilador automático de mods      ║" + reset)
	fmt.Println(yellow + bold + "  ╚══════════════════════════════════════════╝" + reset)
	fmt.Println()
}

func step(n, total int, msg string) {
	fmt.Printf(cyan+"  [%d/%d] %s"+reset+"\n", n, total, msg)
}

func ok(msg string)   { fmt.Println(green + "  ✔  " + msg + reset) }
func warn(msg string) { fmt.Println(yellow + "  ⚠  " + msg + reset) }
func fail(msg string) { fmt.Println(red + "  ✘  " + msg + reset) }
func info(msg string) { fmt.Println(gray + "     " + msg + reset) }

// ── Self-reading: extrae el ZIP adjunto al final del propio exe ────────────────

// readAppendedZip localiza y retorna los bytes del ZIP adjunto al binario.
// Retorna nil si no encuentra la firma (exe base sin datos adjuntos).
func readAppendedZip() ([]byte, error) {
	exePath, err := os.Executable()
	if err != nil {
		return nil, err
	}

	data, err := os.ReadFile(exePath)
	if err != nil {
		return nil, err
	}

	// Buscar la firma en los últimos 16 bytes: [magic 8 bytes][zip size 8 bytes]
	if len(data) < 16 {
		return nil, nil
	}

	tail := data[len(data)-16:]
	if !bytes.Equal(tail[:8], magic) {
		return nil, nil // sin datos adjuntos
	}

	zipSize := int64(binary.LittleEndian.Uint64(tail[8:]))
	if zipSize <= 0 || zipSize > int64(len(data)-16) {
		return nil, fmt.Errorf("tamaño de ZIP adjunto inválido: %d", zipSize)
	}

	zipStart := int64(len(data)) - 16 - zipSize
	return data[zipStart : zipStart+zipSize], nil
}

// extractZipBytes extrae un ZIP (dado como []byte) a destDir.
func extractZipBytes(zipData []byte, destDir string) error {
	r, err := zip.NewReader(bytes.NewReader(zipData), int64(len(zipData)))
	if err != nil {
		return err
	}

	for _, f := range r.File {
		target := filepath.Join(destDir, f.Name)

		// Protección path traversal
		if !strings.HasPrefix(
			filepath.Clean(target)+string(os.PathSeparator),
			filepath.Clean(destDir)+string(os.PathSeparator),
		) {
			continue
		}

		if f.FileInfo().IsDir() {
			os.MkdirAll(target, 0755)
			continue
		}

		os.MkdirAll(filepath.Dir(target), 0755)
		rc, err := f.Open()
		if err != nil {
			return err
		}
		out, err := os.Create(target)
		if err != nil {
			rc.Close()
			return err
		}
		io.Copy(out, rc)
		out.Close()
		rc.Close()

		// Preservar permisos de ejecución (gradlew en Linux/Mac)
		out.Chmod(f.Mode())
	}
	return nil
}

// ── Java ──────────────────────────────────────────────────────────────────────

func checkJava21() bool {
	cmd := exec.Command("java", "-version")
	out, err := cmd.CombinedOutput()
	if err != nil {
		return false
	}
	s := string(out)
	return strings.Contains(s, `version "21`) || strings.Contains(s, `"21.`)
}

func downloadFile(url, destPath string) error {
	client := &http.Client{
		Timeout: 15 * time.Minute,
		CheckRedirect: func(req *http.Request, via []*http.Request) error { return nil },
	}
	req, _ := http.NewRequest("GET", url, nil)
	req.Header.Set("User-Agent", "Mozilla/5.0 LazyForge/1.0")

	resp, err := client.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return fmt.Errorf("HTTP %d", resp.StatusCode)
	}

	f, err := os.Create(destPath)
	if err != nil {
		return err
	}
	defer f.Close()

	total := resp.ContentLength
	var downloaded int64
	buf := make([]byte, 32*1024)
	lastPct := -1

	for {
		n, err := resp.Body.Read(buf)
		if n > 0 {
			f.Write(buf[:n])
			downloaded += int64(n)
			if total > 0 {
				pct := int(downloaded * 100 / total)
				if pct != lastPct && pct%5 == 0 {
					fmt.Printf(gray+"     Descargando... %d%%\r"+reset, pct)
					lastPct = pct
				}
			}
		}
		if err == io.EOF {
			break
		}
		if err != nil {
			return err
		}
	}
	fmt.Println()
	return nil
}

func extractZipFile(src, destDir string) (string, error) {
	data, err := os.ReadFile(src)
	if err != nil {
		return "", err
	}

	r, err := zip.NewReader(bytes.NewReader(data), int64(len(data)))
	if err != nil {
		return "", err
	}

	firstDir := ""
	for _, f := range r.File {
		target := filepath.Join(destDir, f.Name)
		if !strings.HasPrefix(
			filepath.Clean(target)+string(os.PathSeparator),
			filepath.Clean(destDir)+string(os.PathSeparator),
		) {
			continue
		}
		if f.FileInfo().IsDir() {
			os.MkdirAll(target, 0755)
			if firstDir == "" {
				firstDir = target
			}
			continue
		}
		os.MkdirAll(filepath.Dir(target), 0755)
		rc, _ := f.Open()
		out, _ := os.Create(target)
		io.Copy(out, rc)
		out.Close()
		rc.Close()
	}
	return firstDir, nil
}

// ── Main ──────────────────────────────────────────────────────────────────────

func main() {
	if runtime.GOOS == "windows" {
		enableConsoleColors()
	}

	banner()

	// ── Leer ZIP adjunto al propio exe ───────────────────────────────────────
	step(0, 3, "Preparando archivos del mod...")

	zipData, err := readAppendedZip()
	if err != nil || zipData == nil {
		fail("No se encontraron datos del mod en este ejecutable.")
		info("Este .exe necesita ser generado desde la web de Lazy Forge.")
		pause()
		os.Exit(1)
	}

	// Extraer en carpeta temporal junto al exe
	exePath, _ := os.Executable()
	workDir := filepath.Join(filepath.Dir(exePath), ".lazyforge_build")
	os.RemoveAll(workDir) // limpia si quedó de un intento anterior
	os.MkdirAll(workDir, 0755)

	if err := extractZipBytes(zipData, workDir); err != nil {
		fail("Error extrayendo archivos del mod: " + err.Error())
		pause()
		os.Exit(1)
	}
	ok("Archivos del mod extraídos.")
	fmt.Println()

	// ── PASO 1: Verificar / descargar Java 21 ────────────────────────────────
	step(1, 3, "Verificando entorno Java...")

	javaHome := ""
	if checkJava21() {
		ok("Java 21 ya está instalado y listo.")
	} else {
		warn("Java 21 no detectado en el sistema.")
		info("Descargando Java 21 portable desde Adoptium (~200 MB, solo una vez)...")

		jdkDir := filepath.Join(workDir, "temp_jdk")
		os.MkdirAll(jdkDir, 0755)
		zipPath := filepath.Join(jdkDir, "jdk21.zip")
		jdkURL := "https://api.adoptium.net/v3/binary/latest/21/ga/windows/x64/jdk/hotspot/normal/eclipse?project=jdk"

		if err := downloadFile(jdkURL, zipPath); err != nil {
			fail("No se pudo descargar Java: " + err.Error())
			pause()
			os.Exit(1)
		}
		ok("Descarga completada.")

		info("Extrayendo Java portable...")
		firstDir, err := extractZipFile(zipPath, jdkDir)
		if err != nil {
			fail("Error extrayendo Java: " + err.Error())
			pause()
			os.Exit(1)
		}
		os.Remove(zipPath)

		if firstDir == "" {
			fail("No se encontró la carpeta del JDK.")
			pause()
			os.Exit(1)
		}
		javaHome = firstDir
		ok("Java portable listo.")
	}

	fmt.Println()

	// ── PASO 2: Compilar con Gradle ───────────────────────────────────────────
	step(2, 3, "Compilando mod con Gradle...")

	gradlew := filepath.Join(workDir, "gradlew.bat")
	if _, err := os.Stat(gradlew); os.IsNotExist(err) {
		fail("No se encontró gradlew.bat en los archivos del mod.")
		pause()
		os.Exit(1)
	}

	cmd := exec.Command(gradlew, "build")
	cmd.Dir = workDir
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr

	env := os.Environ()
	if javaHome != "" {
		javaBin := filepath.Join(javaHome, "bin")
		for i, e := range env {
			if strings.HasPrefix(strings.ToUpper(e), "PATH=") {
				env[i] = "PATH=" + javaBin + string(os.PathListSeparator) + e[5:]
			}
		}
		env = append(env, "JAVA_HOME="+javaHome)
	}
	cmd.Env = env

	if err := cmd.Run(); err != nil {
		fmt.Println()
		fail("La compilación falló. Revisá la salida de Gradle arriba.")
		info("La carpeta temporal NO se eliminará para que puedas revisar los errores.")
		pause()
		os.Exit(1)
	}

	// ── PASO 3: Mover .jar y limpiar ──────────────────────────────────────────
	step(3, 3, "Moviendo .jar y limpiando archivos...")

	outputDir := filepath.Dir(exePath)
	libsDir := filepath.Join(workDir, "build", "libs")
	entries, err := os.ReadDir(libsDir)
	if err != nil {
		fail("No se encontró build/libs. ¿Falló el build?")
		pause()
		os.Exit(1)
	}

	found := false
	for _, e := range entries {
		name := e.Name()
		if strings.HasSuffix(name, ".jar") &&
			!strings.HasSuffix(name, "-sources.jar") &&
			!strings.HasSuffix(name, "-dev.jar") {
			data, _ := os.ReadFile(filepath.Join(libsDir, name))
			os.WriteFile(filepath.Join(outputDir, name), data, 0644)
			ok("Mod listo: " + name)
			found = true
		}
	}

	if !found {
		fail("No se encontró ningún .jar en build/libs.")
		pause()
		os.Exit(1)
	}

	// Limpiar carpeta de trabajo
	os.RemoveAll(workDir)

	fmt.Println()
	fmt.Println(green + bold + "  ╔══════════════════════════════════════════╗" + reset)
	fmt.Println(green + bold + "  ║   ✔  ¡Mod compilado exitosamente!        ║" + reset)
	fmt.Println(green + bold + "  ║      ¡Que te diviertas jugando!          ║" + reset)
	fmt.Println(green + bold + "  ╚══════════════════════════════════════════╝" + reset)
	fmt.Println()

	pause()

	// Auto-eliminar
	selfDelete(exePath)
}

func pause() {
	fmt.Print(gray + "\n  Presioná Enter para cerrar..." + reset)
	buf := make([]byte, 1)
	os.Stdin.Read(buf)
}

func selfDelete(exePath string) {
	if runtime.GOOS != "windows" {
		os.Remove(exePath)
		return
	}
	script := fmt.Sprintf(`timeout /t 2 /nobreak >nul & del /f /q "%s"`, exePath)
	cmd := exec.Command("cmd", "/c", script)
	cmd.SysProcAttr = hiddenWindow()
	cmd.Start()
}
