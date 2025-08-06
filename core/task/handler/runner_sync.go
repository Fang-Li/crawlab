package handler

import (
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"os"
	"path/filepath"
	"strings"
	"sync"

	"github.com/crawlab-team/crawlab/core/entity"
	"github.com/crawlab-team/crawlab/core/utils"
)

// syncFiles synchronizes files between master and worker nodes:
// 1. Gets file list from master
// 2. Compares with local files
// 3. Downloads new/modified files
// 4. Deletes files that no longer exist on master
func (r *Runner) syncFiles() (err error) {
	r.Infof("starting file synchronization for spider: %s", r.s.Id.Hex())

	workingDir := ""
	if !r.s.GitId.IsZero() {
		workingDir = r.s.GitRootPath
		r.Debugf("using git root path: %s", workingDir)
	}

	// get file list from master
	r.Infof("fetching file list from master node")
	params := url.Values{
		"path": []string{workingDir},
	}
	resp, err := r.performHttpRequest("GET", "/scan", params)
	if err != nil {
		r.Errorf("error getting file list from master: %v", err)
		return err
	}
	defer resp.Body.Close()
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		r.Errorf("error reading response body: %v", err)
		return err
	}
	var response struct {
		Data entity.FsFileInfoMap `json:"data"`
	}
	err = json.Unmarshal(body, &response)
	if err != nil {
		r.Errorf("error unmarshaling JSON for URL: %s", resp.Request.URL.String())
		r.Errorf("error details: %v", err)
		return err
	}

	// create a map for master files
	masterFilesMap := make(entity.FsFileInfoMap)
	for _, file := range response.Data {
		masterFilesMap[file.Path] = file
	}

	// create working directory if not exists
	if _, err := os.Stat(r.cwd); os.IsNotExist(err) {
		if err := os.MkdirAll(r.cwd, os.ModePerm); err != nil {
			r.Errorf("error creating worker directory: %v", err)
			return err
		}
	}

	// get file list from worker
	workerFiles, err := utils.ScanDirectory(r.cwd)
	if err != nil {
		r.Errorf("error scanning worker directory: %v", err)
		return err
	}

	// delete files that are deleted on master node
	for path, workerFile := range workerFiles {
		if _, exists := masterFilesMap[path]; !exists {
			r.Infof("deleting file: %s", path)
			err := os.Remove(workerFile.FullPath)
			if err != nil {
				r.Errorf("error deleting file: %v", err)
			}
		}
	}

	// set up wait group and error channel
	var wg sync.WaitGroup
	pool := make(chan struct{}, 10)

	// download files that are new or modified on master node
	for path, masterFile := range masterFilesMap {
		workerFile, exists := workerFiles[path]
		if !exists || masterFile.Hash != workerFile.Hash {
			wg.Add(1)

			// acquire token
			pool <- struct{}{}

			// start goroutine to synchronize file or directory
			go func(path string, masterFile *entity.FsFileInfo) {
				defer wg.Done()

				if masterFile.IsDir {
					r.Infof("directory needs to be synchronized: %s", path)
					_err := os.MkdirAll(filepath.Join(r.cwd, path), masterFile.Mode)
					if _err != nil {
						r.Errorf("error creating directory: %v", _err)
						err = errors.Join(err, _err)
					}
				} else {
					r.Infof("file needs to be synchronized: %s", path)
					_err := r.downloadFile(path, filepath.Join(r.cwd, path), masterFile)
					if _err != nil {
						r.Errorf("error downloading file: %v", _err)
						err = errors.Join(err, _err)
					}
				}

				// release token
				<-pool

			}(path, &masterFile)
		}
	}

	// wait for all files and directories to be synchronized
	wg.Wait()

	r.Infof("file synchronization completed successfully")
	return err
}

func (r *Runner) performHttpRequest(method, path string, params url.Values) (*http.Response, error) {
	// Normalize path
	path = strings.TrimPrefix(path, "/")

	// Construct master URL
	var id string
	if r.s.GitId.IsZero() {
		id = r.s.Id.Hex()
	} else {
		id = r.s.GitId.Hex()
	}
	requestUrl := fmt.Sprintf("%s/sync/%s/%s?%s", utils.GetApiEndpoint(), id, path, params.Encode())

	// Create and execute request
	req, err := http.NewRequest(method, requestUrl, nil)
	if err != nil {
		return nil, fmt.Errorf("error creating request: %v", err)
	}

	for k, v := range r.getHttpRequestHeaders() {
		req.Header.Set(k, v)
	}

	return http.DefaultClient.Do(req)
}

// downloadFile downloads a file from the master node and saves it to the local file system
func (r *Runner) downloadFile(path string, filePath string, fileInfo *entity.FsFileInfo) error {
	r.Debugf("downloading file: %s -> %s", path, filePath)
	params := url.Values{
		"path": []string{path},
	}
	resp, err := r.performHttpRequest("GET", "/download", params)
	if err != nil {
		r.Errorf("error getting file response: %v", err)
		return err
	}
	if resp.StatusCode != http.StatusOK {
		r.Errorf("error downloading file: %s", resp.Status)
		return errors.New(resp.Status)
	}
	defer resp.Body.Close()

	// create directory if not exists
	dirPath := filepath.Dir(filePath)
	utils.Exists(dirPath)
	err = os.MkdirAll(dirPath, os.ModePerm)
	if err != nil {
		r.Errorf("error creating directory: %v", err)
		return err
	}

	// create local file
	out, err := os.OpenFile(filePath, os.O_RDWR|os.O_CREATE|os.O_TRUNC, fileInfo.Mode)
	if err != nil {
		r.Errorf("error creating file: %v", err)
		return err
	}
	defer out.Close()

	// copy file content to local file
	_, err = io.Copy(out, resp.Body)
	if err != nil {
		r.Errorf("error copying file: %v", err)
		return err
	}

	r.Debugf("successfully downloaded file: %s (size: %d bytes)", path, fileInfo.FileSize)
	return nil
}

// getHttpRequestHeaders returns the headers for HTTP requests to the master node
func (r *Runner) getHttpRequestHeaders() (headers map[string]string) {
	headers = make(map[string]string)
	headers["Authorization"] = utils.GetAuthKey()
	return headers
}
