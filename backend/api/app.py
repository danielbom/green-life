# fmt: off
from fastapi import APIRouter, FastAPI
from fastapi.middleware.cors import CORSMiddleware

import api.controllers.auth_controller
import api.controllers.bed_schedules_controller
import api.controllers.grounds_controller
import api.controllers.grounds_donate_controller
import api.controllers.peoples_controller
import api.controllers.seeds_controller
import api.controllers.tools_controller
import api.controllers.users_controller
import api.controllers.voluntaries_controller
import api.controllers.voluntaries_request_controller
import api.controllers.voluntaries_using_seeds_controller
import api.controllers.voluntaries_using_tools_controller
import api.exceptions

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
api.exceptions.configure(app)

router = APIRouter(prefix="/api")


@router.get('/', tags=['Health'])
def health_check():
    return 'Healthy!'


router.include_router(api.controllers.auth_controller.router)
router.include_router(api.controllers.bed_schedules_controller.router)
router.include_router(api.controllers.grounds_controller.router)
router.include_router(api.controllers.grounds_donate_controller.router)
router.include_router(api.controllers.peoples_controller.router)
router.include_router(api.controllers.seeds_controller.router)
router.include_router(api.controllers.tools_controller.router)
router.include_router(api.controllers.users_controller.router)
router.include_router(api.controllers.voluntaries_controller.router)
router.include_router(api.controllers.voluntaries_request_controller.router)
router.include_router(api.controllers.voluntaries_using_seeds_controller.router)
router.include_router(api.controllers.voluntaries_using_tools_controller.router)

app.include_router(router)
