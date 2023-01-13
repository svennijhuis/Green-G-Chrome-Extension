async function getDriveInfo(token){
    let init = {
        method: 'GET',
        async: true,
        headers: {
          Authorization: 'Bearer ' + token,
          'Content-Type': 'application/json'
        }
      };

      return fetch('https://www.googleapis.com/drive/v3/about?fields=storageQuota', init)
}