"""CLI to run the app."""

import os
import threading
import time
import webbrowser

import click
from django.core.management import execute_from_command_line


def open_browser() -> None:
    """Open the browser."""

    def _open_browser() -> None:
        time.sleep(1)
        webbrowser.open("http://localhost:8000")

    thread = threading.Thread(target=_open_browser, daemon=True)
    thread.start()


@click.command()
@click.option("--no-migrations", is_flag=True, help="Do not run migrations")
@click.option("--no-browser", is_flag=True, help="Do not open the browser")
def main(no_migrations: bool, no_browser: bool) -> None:
    """Run migrations, start the app, and open the browser."""
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "ptz_project.settings")
    if not no_migrations:
        execute_from_command_line(["manage.py", "migrate"])
    if not no_browser:
        open_browser()
    execute_from_command_line(["manage.py", "runserver"])
