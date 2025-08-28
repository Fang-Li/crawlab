package cmd

import (
	"fmt"
	"time"

	"github.com/crawlab-team/crawlab/core/apps"
	"github.com/crawlab-team/crawlab/core/utils"
	"github.com/spf13/cobra"
)

func init() {
	rootCmd.AddCommand(serverCmd)
}

var serverCmd = &cobra.Command{
	Use:     "server",
	Aliases: []string{"s"},
	Short:   "Start Crawlab server",
	Long:    `Start Crawlab node server that can serve as API, task scheduler, task runner, etc.`,
	Run: func(cmd *cobra.Command, args []string) {
		// print logo if not pro
		if !utils.IsPro() {
			utils.PrintLogoWithWelcomeInfo()
		}
		fmt.Println("暂停启动用来接入dlv调试")
		time.Sleep(time.Minute)
		fmt.Println("开始启动server啦")
		// app
		svr := apps.GetServer()

		// start
		apps.Start(svr)
	},
}
