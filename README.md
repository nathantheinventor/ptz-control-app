# PTZ Camera Control App

This app is designed to provide a user interface to control PTZOptics cameras over the network by providing an easy
interface to switch between presets for multiple cameras. The app also provides consistent control over various
parameters of the camera such as color, exposure, and focus.

## Installation

This app can be installed simply with `pipx` or `pip`:

```bash
pipx install ptz-control-app  # TODO: actually set this up

# To run the app:
ptz-control-app
```

## Architecture

This app is designed as a server application with a Django backend and a React frontend. The backend uses a SQLite
database to store camera presets and settings. When run, the `ptz-control-app` command (a CLI made with `click`) runs
migrations (unless `--no-migrations` is specified), starts the Django server, and opens the browser to the app
(unless `--no-browser` is specified).

## Background

This app was created to support the use of PTZOptics cameras at [Suber Road Baptist Church](https://suberroad.org). The
previous controller we were using was somewhat cumbersome in certain circumstances, and we regularly had problems with
the camera settings automatically adjusting to unreasonable values (like aperture being completely closed or color
varying widely between multiple cameras). This app primarily provides an easy mechanism to switch between presets, keeps
camera settings consistent week after week, and provides a simple interface to adjust settings while making fine
adjustments easy.

## Development

The frontend is linked to the backend by running `npm run build` in the `frontend` directory and copying the js and css
files to `static/ptz_app`. The `npm run watch` command will watch for changes and automatically rebuild the frontend and
copy the files to the appropriate directory. This enables convenient development of frontend and backend together, but
it does not feature live reloading, so when developing the frontend, it is often more convenient to run the frontend
with `npm run dev`, which runs only the frontend and provides live reloading. Note that the contents of `App.tsx` are
evaluated in this case, so whatever page that imports will get shown.
