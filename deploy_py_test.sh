# 如果失败,copy $new_sha 手动 paste 到 renderer/utils/index.ts
old_sha=($(shasum -a 256 ~/.pytron-epic7/game.py))
cp ../epic7-master/game.py ~/.pytron-epic7/game.py
new_sha=($(shasum -a 256 ~/.pytron-epic7/game.py))
echo "$old_sha/$new_sha"
sed -i '' "s/$old_sha/$new_sha/g" renderer/utils/index.ts
