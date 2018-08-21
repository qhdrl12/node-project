npm install --global --production windows-build-tools
npm install --global node-gyp

setx PYTHON "%USERPROFILE%\.windows-build-tools\python27\python.exe"

npm install iconv