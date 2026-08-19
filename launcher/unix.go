//go:build !windows

package main

import "syscall"

// hiddenWindow no aplica en sistemas no-Windows.
func hiddenWindow() *syscall.SysProcAttr { return nil }

// enableConsoleColors no aplica fuera de Windows.
func enableConsoleColors() {}
