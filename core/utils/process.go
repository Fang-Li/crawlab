package utils

import (
	"errors"
	"github.com/apex/log"
	"github.com/shirou/gopsutil/process"
	"os/exec"
	"runtime"
	"strings"
)

func BuildCmd(cmdStr string) (cmd *exec.Cmd, err error) {
	if cmdStr == "" {
		return nil, errors.New("command string is empty")
	}
	args := strings.Split(cmdStr, " ")
	return exec.Command(args[0], args[1:]...), nil
}

func ProcessIdExists(pid int) (exists bool) {
	if runtime.GOOS == "windows" {
		return processIdExistsWindows(pid)
	} else {
		return processIdExistsLinuxMac(pid)
	}
}

func processIdExistsWindows(pid int) (exists bool) {
	exists, err := process.PidExists(int32(pid))
	if err != nil {
		log.Errorf("error checking if process exists: %v", err)
	}
	return exists
}

func processIdExistsLinuxMac(pid int) (exists bool) {
	exists, err := process.PidExists(int32(pid))
	if err != nil {
		log.Errorf("error checking if process exists: %v", err)
	}
	return exists
}

func GetProcesses() (processes []*process.Process, err error) {
	processes, err = process.Processes()
	if err != nil {
		log.Errorf("error getting processes: %v", err)
		return nil, err
	}
	return processes, nil
}

type KillProcessOptions struct {
	Force bool
}

func KillProcess(cmd *exec.Cmd, force bool) error {
	// process
	p, err := process.NewProcess(int32(cmd.Process.Pid))
	if err != nil {
		log.Errorf("failed to get process: %v", err)
		return err
	}

	// kill process
	return killProcessRecursive(p, force)
}

func killProcessRecursive(p *process.Process, force bool) (err error) {
	// children processes
	cps, err := p.Children()
	if err != nil {
		if !errors.Is(err, process.ErrorNoChildren) {
			log.Errorf("failed to get children processes: %v", err)
		} else if errors.Is(err, process.ErrorProcessNotRunning) {
			return nil
		}
		return killProcess(p, force)
	}

	// iterate children processes
	for _, cp := range cps {
		if err := killProcessRecursive(cp, force); err != nil {
			return err
		}
	}

	return killProcess(p, force)
}

func killProcess(p *process.Process, force bool) (err error) {
	if force {
		err = p.Kill()
	} else {
		err = p.Terminate()
	}
	if err != nil {
		log.Errorf("failed to kill process (force: %v): %v", force, err)
		return err
	}
	return nil
}
