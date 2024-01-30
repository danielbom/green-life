from typing import List

import pytest
from client import client
from pydantic import BaseSettings


class Transient:
    people_ids_to_delete = List[str]
    ground_ids_to_delete = List[str]
    seed_ids_to_delete = List[str]
    bed_schedule_ids_to_delete = List[str]

    def __init__(self) -> None:
        self.people_ids_to_delete = []  # type: ignore
        self.ground_ids_to_delete = []  # type: ignore
        self.seed_ids_to_delete = []  # type: ignore
        self.bed_schedule_ids_to_delete = []  # type: ignore

    def add_people_id(self, id):
        self.people_ids_to_delete.append(id)

    def add_ground_id(self, id):
        self.ground_ids_to_delete.append(id)

    def add_seed_id(self, id):
        self.seed_ids_to_delete.append(id)

    def add_bed_schedule_id(self, id):
        self.bed_schedule_ids_to_delete.append(id)


class Settings(BaseSettings):
    test_username = "test@test.com"
    test_password = "test"


transient = Transient()

settings = Settings(_env_file=".env", _env_file_encoding="utf-8")


def create_header(do_login):
    return {"Authorization": f"Bearer {do_login}"}


@pytest.fixture
def do_login() -> str:
    body = dict(username=settings.test_username,
                password=settings.test_password)
    response = client.post("/api/auth/login", data=body)
    assert response.status_code == 200
    data = response.json()
    assert data["access_token"]
    return data["access_token"]


def test_auth_login():
    body = dict(username=settings.test_username,
                password=settings.test_password)
    response = client.post("/api/auth/login", data=body)
    assert response.status_code == 200
    data = response.json()
    assert data["access_token"]
    assert data["token_type"] == "bearer"


def test_auth_me(do_login):
    headers = create_header(do_login)
    response = client.get("/api/auth/me", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert data["id"]
    assert data["name"]
    assert data["email"]
    assert data["cellphone"]


def test_people_store(do_login):
    global transient
    headers = create_header(do_login)
    body = dict(
        name="Teste",
        email="test@test.com",
        address="Rua teste",
        birth_date="1990-01-01",
        cellphone="999999999",
    )
    response = client.post("/api/peoples", json=body, headers=headers)
    assert response.status_code == 201
    data = response.json()
    assert data["id"]
    transient.add_people_id(data["id"])
    assert data["name"] == body["name"]
    assert data["email"] == body["email"]
    assert data["address"] == body["address"]
    assert data["birth_date"] == body["birth_date"]
    assert data["cellphone"] == body["cellphone"]


def test_people_update(do_login):
    global transient
    headers = create_header(do_login)
    body = dict(
        name="Teste X",
        email="test@testx.com",
        address="Rua teste X",
    )
    people_id = transient.people_ids_to_delete[0]
    response = client.put(
        f"/api/peoples/{people_id}",
        json=body,
        headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == people_id
    assert data["name"] == body["name"]
    assert data["email"] == body["email"]
    assert data["address"] == body["address"]
    assert data["birth_date"] == "1990-01-01"
    assert data["cellphone"] == "999999999"


def test_people_show(do_login):
    global transient
    headers = create_header(do_login)
    people_id = transient.people_ids_to_delete[0]
    response = client.get(f"/api/peoples/{people_id}", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == people_id
    assert data["name"] == "Teste X"
    assert data["email"] == "test@testx.com"
    assert data["address"] == "Rua teste X"
    assert data["birth_date"] == "1990-01-01"
    assert data["cellphone"] == "999999999"


def test_people_index(do_login):
    global transient
    headers = create_header(do_login)
    response = client.get("/api/peoples", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert len(data) > 0


def test_ground_store(do_login):
    global transient
    owner_id = transient.people_ids_to_delete[0]
    headers = create_header(do_login)
    body = dict(
        width=1000,
        length=500,
        address="Rua teste",
        description="Teste",
        beds_count=10,
        owner_id=owner_id
    )
    response = client.post("/api/grounds", json=body, headers=headers)
    assert response.status_code == 201
    data = response.json()
    assert data["id"]
    transient.add_ground_id(data["id"])
    assert data["address"] == body["address"]
    assert data["width"] == body["width"]
    assert data["length"] == body["length"]
    assert len(data["beds"]) == body["beds_count"]


def test_ground_update(do_login):
    global transient
    headers = create_header(do_login)
    body = dict(
        width=1001,
        length=501,
        address="Rua teste X",
    )
    ground_id = transient.ground_ids_to_delete[0]
    response = client.put(
        f"/api/grounds/{ground_id}",
        json=body,
        headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == ground_id
    assert data["address"] == body["address"]
    assert data["width"] == body["width"]
    assert data["length"] == body["length"]
    assert len(data["beds"]) == 10


def test_ground_show(do_login):
    global transient
    headers = create_header(do_login)
    ground_id = transient.ground_ids_to_delete[0]
    response = client.get(f"/api/grounds/{ground_id}", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == ground_id
    assert data["address"] == "Rua teste X"
    assert data["width"] == 1001
    assert data["length"] == 501
    assert len(data["beds"]) == 10


def test_ground_index(do_login):
    global transient
    headers = create_header(do_login)
    response = client.get("/api/grounds", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert len(data) > 0


def test_seed_store(do_login):
    global transient
    headers = create_header(do_login)
    body = dict(
        name="Test",
        description="Test Roxo",
        amount=10,
        seed_type="vegetable",
    )
    response = client.post("/api/seeds", json=body, headers=headers)
    assert response.status_code == 201
    data = response.json()
    assert data["id"]
    transient.add_seed_id(data["id"])
    assert data["name"] == body["name"]
    assert data["description"] == body["description"]
    assert data["amount"] == body["amount"]
    assert data["seed_type"] == body["seed_type"]


def test_seed_update(do_login):
    global transient
    headers = create_header(do_login)
    body = dict(
        name="Test X",
        description="Test Roxo X",
        amount=11,
    )
    seed_id = transient.seed_ids_to_delete[0]
    response = client.put(
        f"/api/seeds/{seed_id}",
        json=body,
        headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == seed_id
    assert data["name"] == body["name"]
    assert data["description"] == body["description"]
    assert data["amount"] == body["amount"]
    assert data["seed_type"] == "vegetable"


def test_seed_show(do_login):
    global transient
    headers = create_header(do_login)
    seed_id = transient.seed_ids_to_delete[0]
    response = client.get(f"/api/seeds/{seed_id}", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == seed_id
    assert data["name"] == "Test X"
    assert data["description"] == "Test Roxo X"
    assert data["amount"] == 11
    assert data["seed_type"] == "vegetable"


def test_seed_index(do_login):
    global transient
    headers = create_header(do_login)
    response = client.get("/api/seeds", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert len(data) > 0


def test_bed_schedules_store(do_login):
    global transient
    headers = create_header(do_login)
    ground_id = transient.ground_ids_to_delete[0]
    seed_id = transient.seed_ids_to_delete[0]
    body = dict(
        ground_id=ground_id,
        bed_label="F0",
        schedules=[
            dict(
                title="Teste",
                seed_id=seed_id,
                start_at="2021-01-01",
                end_at="2021-01-02")]
    )
    response = client.post("/api/bed-schedules", json=body, headers=headers)
    assert response.status_code == 201
    data = response.json()
    assert data["id"]
    transient.add_bed_schedule_id(data["id"])
    assert data["ground_id"] == body["ground_id"]
    assert data["bed_label"] == body["bed_label"]
    assert len(data["schedules"]) == 1


def test_bed_schedules_update(do_login):
    global transient
    headers = create_header(do_login)
    bed_schedule_id = transient.bed_schedule_ids_to_delete[0]
    seed_id = transient.seed_ids_to_delete[0]
    body = dict(
        schedules=[
            dict(
                title="Teste X",
                seed_id=seed_id,
                start_at="2021-01-01",
                end_at="2021-01-02")
        ]
    )
    response = client.put(
        f"/api/bed-schedules/{bed_schedule_id}",
        json=body,
        headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == bed_schedule_id
    assert len(data["schedules"]) == 1
    assert data["schedules"][0]["title"] == body["schedules"][0]["title"]


def test_bed_schedules_show(do_login):
    global transient
    headers = create_header(do_login)
    bed_schedule_id = transient.bed_schedule_ids_to_delete[0]
    response = client.get(
        f"/api/bed-schedules/{bed_schedule_id}",
        headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == bed_schedule_id
    assert data["bed_label"] == "F0"
    assert len(data["schedules"]) == 1


def test_delete_all(do_login):
    global transient
    headers = create_header(do_login)
    errors = []
    for bed_schedule_id in set(transient.bed_schedule_ids_to_delete):
        try:
            print(f"Deleting bed schedule {bed_schedule_id}")
            response = client.delete(
                f"/api/bed-schedules/{bed_schedule_id}",
                headers=headers)
            assert response.status_code == 204
        except AssertionError as e:
            errors.append(e)

    for ground_id in set(transient.ground_ids_to_delete):
        try:
            print(f"Deleting ground {ground_id}")
            response = client.delete(
                f"/api/grounds/{ground_id}", headers=headers)
            assert response.status_code == 204
        except AssertionError as e:
            errors.append(e)

    for seed_id in set(transient.seed_ids_to_delete):
        try:
            print(f"Deleting seed {seed_id}")
            response = client.delete(f"/api/seeds/{seed_id}", headers=headers)
            assert response.status_code == 204
        except AssertionError as e:
            errors.append(e)

    for people_id in set(transient.people_ids_to_delete):
        try:
            print(f"Deleting people {people_id}")
            response = client.delete(
                f"/api/peoples/{people_id}", headers=headers)
            assert response.status_code == 204
        except AssertionError as e:
            errors.append(e)

    transient.bed_schedule_ids_to_delete = []
    transient.ground_ids_to_delete = []
    transient.seed_ids_to_delete = []
    transient.people_ids_to_delete = []

    if errors:
        raise AssertionError(errors)
