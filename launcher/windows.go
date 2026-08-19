//go:build windows

package main

import (
	"os/exec"
	"syscall"
)

// hiddenWindow devuelve SysProcAttr para lanzar un proceso oculto en Windows.
func hiddenWindow() *syscall.SysProcAttr {
	return &syscall.SysProcAttr{HideWindow: true}
}

// enableConsoleColors activa colores ANSI VT100 en la consola de Windows.
func enableConsoleColors() {
	cmd := exec.Command("cmd", "/c", "")
	cmd.SysProcAttr = &syscall.SysProcAttr{HideWindow: true}
	cmd.Run()
}
