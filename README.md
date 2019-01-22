# bdl-dataset-builder [<img src="https://github.com/chevalvert.png?size=100" align="right">](http://chevalvert.fr/)
> Build and validate [_**Bassins de lumière**_](https://github.com/chevalvert/bassins-de-lumiere) datasets

<br>

## Installation
```sh
npm install --global chevalvert/bdl-dataset-builder
```

## Usage
###### Validate an existing dataset
```
bdl-dataset-validate

Usage:
  bdl-dataset-validate <dataset>
  bdl-dataset-validate --help
  bdl-dataset-validate --version

Options:
  -h, --help       Show this screen.
  -v, --version    Print the current version.
```

###### Build a dataset from sources
```
bdl-dataset-build

Usage:
  bdl-dataset-build <dataset>
  bdl-dataset-build --help
  bdl-dataset-build --version

Options:
  -h, --help                  Show this screen.
  -v, --version               Print the current version.

  --flipCoordinates           Flip features coordinates array when building
                              GeoJson.
  --extractStreetview         Create a panoramas/ folder containing a scrapped
                              streetview image per feature coordinates.
  --extractStreetviewZoom     Set the streetview zoom level from 1 to 4
                              (default is 2).
```

## Dataset architecture
See [`example.dataset/`](example.dataset).

## License
[MIT.](https://tldrlegal.com/license/mit-license)
