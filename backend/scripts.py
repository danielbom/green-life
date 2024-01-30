import argparse
import asyncio
import concurrent.futures
import glob
import subprocess
from typing import Any


def tip(*args):
    print(f"TIP:", *args)


def cmd_run(args, **kwargs):
    print(f"CMD: '{' '.join(args)}'")
    subprocess.run(args, **kwargs)


def format_file(file):
    cmd_run(["autopep8", "--in-place", "--aggressive", file])
    cmd_run(["isort", file])


async def format_file_glob(expr, **kwargs):
    with concurrent.futures.ThreadPoolExecutor() as executor:
        executor.map(lambda file: format_file(file), glob.glob(expr, **kwargs))


async def format_files():
    await asyncio.gather(
        format_file_glob("*.py"),
        format_file_glob("api/**/*.py", recursive=True),
        format_file_glob("tests/**/*.py", recursive=True)
    )


async def command_format(args):
    if args.glob is not None:
        await format_file_glob(args.glob, recursive=args.recursive)
    elif args.file is not None:
        await format_file(args.file)
    else:
        await format_files()


async def command_run(args):
    if args.dev:
        cmd_run(["uvicorn", "api.app:app", "--reload"])
    else:
        cmd_run(["uvicorn", "api.app:app"])


async def command_venv(_args):
    cmd_run(["python", "-m", "venv", "venv"])


async def command_venv_tip(_args):
    tip("To activate the virtual environment, run:")
    tip("linux:")
    tip("   source venv/bin/activate")
    tip("windows powershell:")
    tip("   .\\venv\\Scripts\\Activate.ps1")


async def command_install(_args):
    cmd_run(["pip", "install", "-r", "requirements.txt"])


async def command_check_types(_args):
    cmd_run(["mypy", "."])


async def command_show_commands(_args):
    class Args:
        glob = None
        file = "example.py"
        dev = True
        coverage = True
        only = None
        all = None

    global cmd_run
    cmd_run = lambda *args, **kwargs: print("    ", " ".join(args[0]))
    args = Args()

    print("venv:")
    await command_venv(args)
    print("install:")
    await command_install(args)
    print("run:")
    await command_run(args)
    print('check-types:')
    await command_check_types(args)
    print('test:')
    await command_test(args)
    print("format:")
    await command_format(args)


async def command_register_admin(args):
    import api.services.users_service as users_service
    from api.database import get_db
    from api.services.users_service import UserStore

    data = UserStore(
        name=args.name,
        email=args.email,
        password=args.password,
        cellphone=args.cellphone)
    for db in get_db():
        print('INFO: Executing register admin')
        users_service.user_store(data, db)
        print('INFO: Admin registered successfully')


async def command_setup_database_indexes(args):
    import pymongo

    from api.database import get_db
    from api.env import settings

    if settings.production and not args.force:
        print('ERROR: You are trying to setup database indexes in production mode. If you really want to do this, use --force flag')
        exit(1)

    # fmt: off
    indexes = [
        ('voluntaries', [
            dict(keys=[("people_id", pymongo.ASCENDING), ("ground_id", pymongo.ASCENDING), ("bed_label", pymongo.ASCENDING)], unique=True),
            dict(keys=[("people_id", pymongo.HASHED)]),
            dict(keys=[("ground_id", pymongo.HASHED)]),
        ]),
        ('peoples', [
            dict(keys=[("$**", pymongo.TEXT)], default_language="portuguese"),
            dict(keys=[("email", pymongo.ASCENDING)], unique=True),
        ]),
        ('users', [dict(keys=[("email", pymongo.ASCENDING)], unique=True)]),
        ('tools', [
            dict(keys=[("name", pymongo.TEXT), ("description", pymongo.TEXT)], default_language="portuguese"),
            dict(keys=[("name", pymongo.ASCENDING)], unique=True),
        ]),
        ('seeds', [
            dict(keys=[("name", pymongo.TEXT), ("description", pymongo.TEXT)], default_language="portuguese"),
            dict(keys=[("name", pymongo.ASCENDING)], unique=True),
        ]),
        ('grounds', [
            dict(keys=[("$**", pymongo.TEXT)], default_language="portuguese"),
        ]),
    ]

    for db in get_db():
        print('INFO: Executing setup database index')

        for i, (collection, index) in enumerate(indexes):
            for j, idx in enumerate(index):
                db[collection].create_index(**idx)
                print(f"INFO: {i + 1}/{len(indexes)} | {j + 1}/{len(index)} | {collection} index created")

        print('INFO: Database index setup successfully')
    # fmt: on


async def command_drop_database(args):
    from api.database import get_db
    from api.env import settings

    if settings.production and not args.force:
        print("ERROR: You are in production mode, use --force to drop database")
        exit(1)

    collections = [
        'bed_schedules',
        'grounds',
        'grounds_donate',
        'peoples',
        'seeds',
        'tools',
        'users',
        'voluntaries',
        'voluntaries_request',
        'voluntaries_using_seeds',
        'voluntaries_using_tools',
    ]

    for db in get_db():
        print('INFO: Executing drop database')
        for i, collection in enumerate(collections):
            # db.get_collection(collection).drop()
            db.get_collection(collection).delete_many({})
            print(f"INFO: {i + 1}/{len(collections)} | {collection} dropped")
        print('INFO: Database dropped successfully')


async def command_seed_database(args):
    import json
    import random
    import traceback
    from datetime import date
    from pathlib import Path

    import api.services.bed_schedules_service as bed_schedules_service
    import api.services.grounds_donate_service as grounds_donate_service
    import api.services.grounds_service as grounds_service
    import api.services.peoples_service as peoples_service
    import api.services.seeds_service as seeds_service
    import api.services.tools_service as tools_service
    import api.services.users_service as users_service
    import api.services.voluntaries_request_service as voluntaries_request_service
    import api.services.voluntaries_service as voluntaries_service
    import api.services.voluntaries_using_seeds_service as voluntaries_using_seeds_service
    from api.database import Database, get_db
    from api.env import settings
    from api.services.bed_schedules_service import BedScheduleStore
    from api.services.grounds_donate_service import GroundDonateStore
    from api.services.grounds_service import GroundStore
    from api.services.peoples_service import PeopleStore
    from api.services.seeds_service import SeedStore
    from api.services.tools_service import ToolStore
    from api.services.users_service import UserStore
    from api.services.voluntaries_request_service import VoluntaryRequestStore
    from api.services.voluntaries_service import VoluntaryStore
    from api.services.voluntaries_using_seeds_service import \
        VoluntaryUsingSeedStart

    if settings.production and not args.force:
        print("ERROR: You are in production mode, use --force to drop database")
        exit(1)

    def read_json(path: Path) -> Any:
        with path.open(encoding='utf-8') as f:
            return json.load(f)

    class Context:
        def __init__(self):
            self.entities = {}
            self.result = {}

        def add_entity(self, name, entity):
            if not self.entities.get(name):
                self.entities[name] = []
            self.entities[name].append(entity)

    def apply_commands(data: dict, db: Database) -> dict:
        ctx = Context()
        command_eval = '#(eval):'
        command_sample = '#(sample):'
        command_date_today = '#(date.today)'
        command_random_bool = '#(random.bool)'
        for key in data:
            if isinstance(data[key], dict):
                ctx.result[key] = apply_commands(data[key], db)
            elif isinstance(data[key], list):
                ctx.result[key] = [apply_commands(item, db)
                                   for item in data[key]]
            elif not isinstance(data[key], str):
                ctx.result[key] = data[key]
            elif data[key].startswith(command_eval):
                _, script = data[key].split(':', 1)
                ctx.result[key] = eval(script)
            elif data[key].startswith(command_sample):
                collection = data[key][len(command_sample):]
                entities = db \
                    .get_collection(collection) \
                    .aggregate([{"$sample": {"size": 1}}])
                entity = next(entities, None)
                if not entity:
                    raise Exception(f'Entity in {collection} not found')
                ctx.add_entity(collection, entity)
                ctx.result[key] = str(entity['_id'])
            elif data[key] == command_date_today:
                ctx.result[key] = date.today().isoformat()
            elif data[key] == command_random_bool:
                ctx.result[key] = random.choice([True, False])
            else:
                ctx.result[key] = data[key]
        return ctx.result

    # fmt: off
    mocks = [
        ('seeds.json', seeds_service.seed_store, SeedStore),
        ('grounds.json', grounds_service.ground_store, GroundStore),
        ('peoples.json', peoples_service.people_store, PeopleStore),
        ('voluntaries.json', voluntaries_service.voluntary_store, VoluntaryStore),
        ('voluntaries_using_seeds.json', voluntaries_using_seeds_service.voluntary_using_seed_start, VoluntaryUsingSeedStart),
        ('voluntaries_request.json', voluntaries_request_service.voluntary_request_store, VoluntaryRequestStore),
        ('users.json', users_service.user_store, UserStore),
        ('tools.json', tools_service.tool_store, ToolStore),
        ('grounds_donate.json', grounds_donate_service.grounds_donate_store, GroundDonateStore),
        ('bed_schedules.json', bed_schedules_service.bed_schedules_store, BedScheduleStore)
    ]
    # fmt: on

    for db in get_db():
        for i, (json_path, store, Model) in enumerate(mocks):
            collection = Path(json_path).stem
            values = read_json(Path('mocks') / json_path)
            count = sum([data.get('$$repeat', 1) for data in values])
            prefix = f"{i + 1}/{len(mocks)} | {collection} "
            print(f"INFO: {prefix}: Seeding with {count} entities")
            for data in values:
                if args.debug:
                    print(f"DEBUG: {prefix}: {data}")
                try:
                    if '$$repeat' in data:
                        count = data['$$repeat']
                        repeat_data = {**data}
                        del repeat_data['$$repeat']
                        for _ in range(count):
                            data = apply_commands(repeat_data, db)
                            store(Model(**data), db)
                    else:
                        data = apply_commands(data, db)
                        store(Model(**data), db)
                except Exception as e:
                    traceback.print_exc()
                    print(f"ERROR: {prefix}: Failed to seed")
                    print(f"ERROR: {data}")
                    raise e
            print(f"INFO: {prefix}: Seed completed")


async def command_test(args):
    from api.env import settings

    if settings.production:
        print("ERROR: You are in production mode and can't run tests")
        exit(1)

    cmd = ["pytest", "-vv"]
    if args.coverage:
        cmd.extend(["--cov", "api"])
    if args.only is not None:
        cmd.extend(["-k", args.only])
    if args.all is not None:
        cmd.extend(["-m", args.all])
    cmd_run(cmd)


def parse_args():
    def command(func):
        name = func.__name__.replace("command_", "").replace("_", "-")
        sb = subparsers.add_parser(name)
        sb.usage = func.__doc__
        sb.set_defaults(func=func)
        return sb

    parser = argparse.ArgumentParser()
    subparsers = parser.add_subparsers(dest="command")

    sb = command(command_format)
    sb.add_argument("--file", type=str, default=None)
    sb.add_argument("--glob", type=str, default=None)
    sb.add_argument(
        "--recursive", default=False, action="store_true")

    sb = command(command_run)
    sb.add_argument("--dev", default=False, action="store_true")

    sb = command(command_venv)

    sb = command(command_install)

    sb = command(command_show_commands)

    sb = command(command_check_types)

    sb = command(command_register_admin)
    sb.add_argument("--name", type=str, required=True)
    sb.add_argument("--email", type=str, required=True)
    sb.add_argument("--password", type=str, required=True)
    sb.add_argument("--cellphone", type=str, required=True)

    sb = command(command_setup_database_indexes)
    sb.add_argument("--force", default=False, action="store_true")

    sb = command(command_drop_database)
    sb.add_argument("--force", default=False, action="store_true")

    sb = command(command_seed_database)
    sb.add_argument("--debug", default=False, action="store_true")
    sb.add_argument("--force", default=False, action="store_true")

    sb = command(command_test)
    sb.add_argument("--coverage", default=False, action="store_true")
    sb.add_argument("--only", default=None, type=str)
    sb.add_argument("--all", default=None, type=str)

    return parser


async def main():
    parser = parse_args()
    args = parser.parse_args()
    if args.command:
        await args.func(args)
    else:
        parser.print_help()


if __name__ == "__main__":
    asyncio.run(main())
