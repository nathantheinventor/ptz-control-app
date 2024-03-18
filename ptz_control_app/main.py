"""CLI to run the app."""
import os
import webbrowser

import click


@click.command()
@click.option('--no-migrations', is_flag=True, help='Do not run migrations')
@click.option('--no-browser', is_flag=True, help='Do not open the browser')
def main(no_migrations: bool, no_browser: bool):
    """Run migrations, start the app, and open the browser."""
    if not no_migrations:
        os.system("python manage.py migrate")
    os.system("python manage.py runserver")
    if not no_browser:
        webbrowser.open("http://localhost:8000")
