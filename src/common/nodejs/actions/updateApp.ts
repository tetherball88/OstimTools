import fs from 'fs'
import { MessageBoxOptions, app, autoUpdater, dialog } from "electron"
import { mkdir } from "fs/promises"
import { Readable } from 'stream'
import { finished } from 'stream/promises'

import { logger, remove } from "../utils";
import semver from "semver";

type GitHubReleaseAsset = {
    name: string
    url: string
    browser_download_url: string
}

type GitHubRelease = {
    name: string
    assets: GitHubReleaseAsset[]
}

export const downloadUpdatesDir = `${app.getPath('temp')}\\ostimTmpDownloads`
const currentAppVersion = app.getVersion()

const downloadFile = async (url: string, fileName: string) => {
    const res = await fetch(url);
    await mkdir(downloadUpdatesDir, { recursive: true });
    const fileStream = fs.createWriteStream(`${downloadUpdatesDir}/${fileName}`, { flags: 'w' });

    if(!res.body) {
        return
    }

    await finished(Readable.fromWeb(res.body as any).pipe(fileStream));
}

export const readGithubReleases = async () => {
    const res = await fetch(`https://api.github.com/repos/tetherball88/OstimTools/releases?per_page=100`, {
        headers: { Accept: "application/vnd.github.preview" }
    })

    if (res.status === 403) {
        logger.error("Rate Limited!");
        return;
    }

    if (res.status >= 400) {
        return;
    }


    logger.log(currentAppVersion)

    const releases = await res.json() as GitHubRelease[];

    logger.log(`Found ${releases.length} overall versions`);

    const latestReleases = releases.filter(release => {
        return semver.gt(release.name, currentAppVersion)
    });

    logger.log(`Found ${latestReleases.length} new versions`);

    for(const release of latestReleases) {
        for(const asset of release.assets) {
            if (asset.name.endsWith('delta.nupkg')) {
                logger.log(`Started downloading file ${asset.name}`);
                await downloadFile(asset.browser_download_url, asset.name)
                logger.log(`Finished downloading file ${asset.name}`);
            }
        }
    }

    if(latestReleases.length) {
        const latestReleaseFile = latestReleases[0].assets.find(({ name }) => name === 'RELEASES')

        if(latestReleaseFile) {
            await downloadFile(latestReleaseFile.browser_download_url, latestReleaseFile.name)
        } else {
            throw new Error('Couldn\'t find RELEASES file in latest release.')
        }
        
    }
}

const checkNewVersions = async (autoCheck = true) => {
    const latestRelease = await fetch(`https://api.github.com/repos/tetherball88/OstimTools/releases/latest`, {
        headers: { Accept: "application/vnd.github.preview" }
    })
    const latestReleaseJson = await latestRelease.json() as GitHubRelease

    logger.log(`Latest versions is ${latestReleaseJson.name}`)

    const hasNewVersions = semver.gt(latestReleaseJson.name, currentAppVersion)

    if(!hasNewVersions && autoCheck) {
        logger.log('I checked new updates and didn\'t find any. You are good.')
        return false
    }

    const returnValue = await dialog.showMessageBox({
        type: 'info',
        buttons: hasNewVersions ? ['Now', 'Later'] : ['Ok'],
        title: 'Application Update',
        message: hasNewVersions ? `Your app version ${currentAppVersion} is behind latest version ${latestReleaseJson.name}. Do you want to download them and update?` : 'No new versions were found. You are good'
    })

    return returnValue.response === 0 && hasNewVersions
}

export const updateApp = async (autoCheck = true, sart: () => void) => {
    const hasNewUpdates = await checkNewVersions(autoCheck)

    if(!hasNewUpdates) {
        return
    }

    try {
        autoUpdater.setFeedURL({ url: downloadUpdatesDir });
        logger.log('Started updating');

        sart();

        await readGithubReleases()
        autoUpdater.checkForUpdates();
    } catch(e) {
        logger.error(`Couldn't get updates...`)
        logger.error(e.message)
    }
}

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
autoUpdater.on('update-downloaded', async (event, releaseNotes, releaseName) => {
    await remove(downloadUpdatesDir)
    const dialogOpts: MessageBoxOptions = {
      type: 'info',
      buttons: ['Restart', 'Later'],
      title: 'Application Update',
      message: process.platform === 'win32' ? releaseNotes : releaseName,
      detail:
        'A new version/s has been downloaded. Restart the application to apply the updates.'
    }
  
    dialog.showMessageBox(dialogOpts).then((returnValue) => {
      if (returnValue.response === 0) autoUpdater.quitAndInstall()
    })
})

autoUpdater.on('error', (message) => {
    logger.error('There was a problem updating the application')
    logger.error(message.toString())
})