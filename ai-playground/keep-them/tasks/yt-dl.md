# Youtube Downloader

需要做一个youtube downloader，先从命令行开始，主要做的事情是：
1. 根据用户输入的url, 下载视频
2. 可以指定下载的格式，比如mp4, webm等
3. 可以指定下载的质量，比如720p, 1080p等
4. 可以指定下载的范围，比如整个视频，或者指定的时间范围
5. 可以指定下载的路径，默认是当前目录
6. 下载subtitle也是必须要的，默认是下载英文的subtitle和中文的subtitle
7. 根据一个collection url，批量下载这些视屏，每一个collection就是一个目录
8. 提供可以一份subtitle和视屏文件对应的csv文件，或者json文件
9. 需要通过TUI/CLI同时，下载是否成功需要一份文件进行记录，可以是csv文件，也可以是json文件，但是需要标注是否下载成功，以及失败的原因
10. 使用golang，yt-dl库来实现下载功能