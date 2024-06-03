# 确保脚本抛出遇到的错误
set -e

# 生成静态文件
npm run prod

# 进入生成的文件夹
cd dist

git init
git add -A
git commit -m 'deploy'

# 如果发布到 https://<USERNAME>.github.io/<REPO>
git push -f https://github.com/wocwin/wocwin-admin.git master:gh-pages

# git remote add origin https://github.com/wocwin/myVuePress.git
# git push origin --delete gh-pages
# git push origin master:gh-pages

cd -
