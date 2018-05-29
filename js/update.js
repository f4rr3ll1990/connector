const { NsisCompatUpdater } = require('nsis-compat-updater');
function checkForUpdates() {
    var updater = new NsisCompatUpdater('http://techniktools.ru/versions.nsis.json', nw.App.manifest.version, 'x86');
    var checking = true;
    updater.checkForUpdates()
    .then((version) => {
        checking = false;
        if(version) {
            var confirm_update = confirm(`Новая версия ${ version.version } доступна, загрузить??`)
                if(confirm_update) {
                    var downloading = true;
                    var progress = 0;
                    const handleDownloadProgress = (state) => {
                        progress = state.percentage;
                    };
                    updater.onDownloadProgress.subscribe(handleDownloadProgress);
                    return updater.downloadUpdate(version.version)
                    .then((path) => {
                        updater.onDownloadProgress.unsubscribe(handleDownloadProgress);
                        downloading = false;
                        progress = 0;
                        var confirm_install = confirm(`Загрузка ${ version.version } завершена, установить?`)
                       
                            if(confirm_install) {
                                return updater.quitAndInstall(path);
                            }
                            else {
                                alert(`Установка отменена.`);
                            }
                        
                    })
                    .catch((err) => {
                        updater.onDownloadProgress.unsubscribe(handleDownloadProgress);
                        downloading = false;
                        progress = 0;
                        alert(err);
                    });
                }
                else {
                    alert(`Загрузка отменена.`);
                }
            
        }
        else {
            alert(`Обновлений нет, текущая версия ${ nw.App.manifest.version }.`);
        }
    })
    .catch((err) => {
        checking = false;
        alert(err.toString());
    });
}