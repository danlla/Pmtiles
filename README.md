# Работа с pmtiles и Yandex Cloud

## Создание .pmtiles
Для создания можно воспользоваться [приложением](https://github.com/protomaps/go-pmtiles)

Скачиваем для нужной ОС, потом выполняем
```
pmtiles convert INPUT.mbtiles OUTPUT.pmtiles
```

## Загрузка pmtiles в Yandex Object Storage
Для начала нужно создать бакет: [инструкция](https://cloud.yandex.ru/docs/storage/quickstart?from=int-console-help-center-or-nav)

Закинуть pmtiles можно несколькими способами:
1. Просто загрузить через консоль управления
2. Закинуть с помощью [go-pmtiles](https://github.com/protomaps/go-pmtiles)
```
# requires environment variables AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY credentials
pmtiles upload INPUT.pmtiles s3://BUCKET_NAME REMOTE.pmtiles
```
3. Можно воспользоваться [утилитой](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html)

## Загрузка тайлов расположенных в иерархии папок
Использовать mbtiles не получится, т.к. sql запросы не будут работать. Так что тайлы можно расположить в бакете в виде иерархии папок.

### Создание иерархии папок
Один из инструментов для создания иерархии папок с тайлами [tippecanoe](https://github.com/mapbox/tippecanoe)
```
tippecanoe -zg -e OUTPUT INPUT.geojson
```

Также можно использовать библиотеку для C# [NetTopologySuite.IO.VectorTiles](https://github.com/NetTopologySuite/NetTopologySuite.IO.VectorTiles)
```cs
var tileTree = new VectorTileTree()
...
tileTree.Write(output);
```
### Загрузка на Yandex Object Storage
Для загрузки на Yandex Object Storage можно использовать [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html).
Подробная инструкция [здесь](https://cloud.yandex.ru/docs/storage/tools/aws-cli)

1. Нужно создать [сервисный аккаунт](https://cloud.yandex.ru/docs/iam/operations/sa/create)

2. Назначит [роль сервисному аккаунту](https://cloud.yandex.ru/docs/iam/operations/sa/assign-role-for-sa)

3. Создать [статический ключ доступа](https://cloud.yandex.ru/docs/iam/operations/sa/create-access-key)

Процесс загрузки в бакет:

1. Выполнить 
```aws configure```
И внести данные, полученные при создании статического ключа
2. Выполнить
```
aws --endpoint-url=https://storage.yandexcloud.net \
s3 cp --recursive INPUT/ s3://bucket-name/
```
Где INPUT - папка, содержащая в себе иерархию тайлов, bucket-name - название бакета

## Использование pmtiles на js
Для отображения данных из pmtiles можно использовать [MapLibre](https://github.com/maplibre/maplibre-gl-js)

В js файле для создания протокола, нужно прописать:
```js
let protocol = new pmtiles.Protocol();
maplibregl.addProtocol("pmtiles", protocol.tile);
```

В style.json:
```json
"sources": {
  "source-name": {
    "url": "pmtiles://https://storage.yandexcloud.net/bucket-name/bd-name.pmtiles",
    "type": "vector"
  }
}
```

# Выводы
Визуально работа с pmtiles и с тайлами, которые раскиданы по папкам, не отличается. Иногда видно, что pmtiles работает побыстрее.

Удобнее работать с pmtiles. Так как не нужно создавать папки с тайлами. Работа с одним файлом легче и удобнее.

Время конвертирования из mbtiles в pmtiles достаточно маленькое. Например, для создания pmtiles из бд mbtiles размером 210 Мб ушло порядка 5 секунд.
